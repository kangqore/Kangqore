#!/usr/bin/env python3
"""
Krisnam 0.1.1 — Fine-Tune Script (Apple Silicon / MLX)
=======================================================
Fine-tunes Llama-3.2-3B-Instruct on Kangqore's REASON phase training data
to produce a local reasoning model that replaces Claude API calls in REASON phase.

Runs on Apple M-series chips via MLX (mlx_lm LoRA fine-tuning).
For NVIDIA GPU (cloud), use --cloud to print the Colab/Unsloth recipe.

Architecture after fine-tune:
  REASON phase → Krisnam 0.1.1  (local, ~50ms latency, no API cost)
  SPEAK  phase → Claude claude-opus-4-8  (unchanged)
  GOVERN phase → Claude claude-opus-4-8  (unchanged)

Quick start:
  # Export training data:
  curl -s "http://localhost:5050/api/admin/waanda-training/export?incremental=false" > /dev/null

  # Run fine-tune (uses ~/.kimmp-venv by default):
  ~/.kimmp-venv/bin/python scripts/finetune_krisnam.py

  # Dry run (verify data + print command, skip training):
  ~/.kimmp-venv/bin/python scripts/finetune_krisnam.py --dry-run

  # After training, deploy to Ollama:
  ~/.kimmp-venv/bin/python scripts/finetune_krisnam.py --create-ollama-model
"""

import argparse
import json
import os
import random
import subprocess
import sys
from pathlib import Path

HOME = Path.home()

# ── CLI ───────────────────────────────────────────────────────────────────────

parser = argparse.ArgumentParser(description='Fine-tune Krisnam 0.1.1 (Apple Silicon / MLX)')
parser.add_argument('--data-dir',       type=str, default=str(HOME / 'models' / 'Krisnam' / 'training-exports'),
                    help='WAANDA export directory (matches WAANDA_EXPORT_DIR in .env)')
parser.add_argument('--mlx-model',      type=str, default=str(HOME / 'models' / 'Krisnam' / 'v0_1_0'),
                    help='MLX base model path (the Krisnam 0.1.0 base)')
parser.add_argument('--output-dir',     type=str, default=str(HOME / 'models' / 'Krisnam' / 'finetune'),
                    help='Output directory for adapter + fused model')
parser.add_argument('--iters',          type=int, default=1000,  help='Training iterations (100 for smoke test, 1000+ for real run)')
parser.add_argument('--batch-size',     type=int, default=4,     help='Batch size')
parser.add_argument('--lora-layers',    type=int, default=16,    help='Number of LoRA layers to train')
parser.add_argument('--learning-rate',  type=float, default=1e-4, help='Learning rate')
parser.add_argument('--val-pct',        type=float, default=0.1,  help='Validation split fraction')
parser.add_argument('--dry-run',        action='store_true', help='Prepare data and print command, then exit')
parser.add_argument('--cloud',          action='store_true', help='Print Google Colab / Unsloth recipe and exit')
parser.add_argument('--create-ollama-model', action='store_true', help='Convert trained model to Ollama after training')
parser.add_argument('--ollama-model-name', type=str, default='krisnam:v2', help='Ollama model name to create')
args = parser.parse_args()

# ── Cloud recipe (Colab / Unsloth) ───────────────────────────────────────────

if args.cloud:
    print("""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Krisnam 0.1.1 — Google Colab / Unsloth Fine-Tune Recipe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Export training data from your local backend:
   curl http://localhost:5050/api/admin/waanda-training/export
   Get the alpaca_*.jsonl from ~/models/Krisnam/training-exports/

2. Upload alpaca_*.jsonl to Colab as /content/alpaca_krisnam.jsonl

3. In Colab (GPU runtime — T4 free, A100 ~$0.50/hr):

   %%bash
   pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
   pip install --no-deps trl peft accelerate bitsandbytes

4. Fine-tune:

   from unsloth import FastLanguageModel
   from datasets import Dataset
   from trl import SFTTrainer
   from transformers import TrainingArguments
   import json

   with open('/content/alpaca_krisnam.jsonl') as f:
       rows = [json.loads(l) for l in f if l.strip()]

   TEMPLATE = '''Below is an instruction. Write a response.

### Instruction:
{instruction}

### Input:
{input}

### Response:
{output}'''

   model, tokenizer = FastLanguageModel.from_pretrained(
       'unsloth/Llama-3.2-3B-Instruct', max_seq_length=2048,
       dtype=None, load_in_4bit=True)
   model = FastLanguageModel.get_peft_model(model, r=16, lora_alpha=16,
       lora_dropout=0, target_modules=['q_proj','k_proj','v_proj','o_proj',
       'gate_proj','up_proj','down_proj'])

   ds = Dataset.from_list([{'text': TEMPLATE.format(**r) + tokenizer.eos_token} for r in rows])
   split = ds.train_test_split(test_size=0.1, seed=42)

   trainer = SFTTrainer(model=model, tokenizer=tokenizer,
       train_dataset=split['train'], eval_dataset=split['test'],
       dataset_text_field='text', max_seq_length=2048,
       args=TrainingArguments(per_device_train_batch_size=2,
           gradient_accumulation_steps=4, warmup_steps=5,
           num_train_epochs=3, learning_rate=2e-4, fp16=True,
           logging_steps=1, optim='adamw_8bit', output_dir='./krisnam-out',
           report_to='none'))
   trainer.train()

5. Export GGUF for Ollama:
   model.save_pretrained_gguf('./krisnam-v2', tokenizer, quantization_method='q4_k_m')

6. Download krisnam-v2-Q4_K_M.gguf and deploy locally with Ollama.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")
    sys.exit(0)

# ── Data preparation ──────────────────────────────────────────────────────────

def find_latest_alpaca(data_dir: str) -> Path | None:
    p = Path(data_dir)
    if not p.exists():
        return None
    candidates = sorted([f for f in p.glob('alpaca_*.jsonl') if f.stat().st_size > 0], reverse=True)
    return candidates[0] if candidates else None

src = find_latest_alpaca(args.data_dir)
if not src:
    print(f'[ERROR] No training data in {args.data_dir}')
    print('  Export first: curl "http://localhost:5050/api/admin/waanda-training/export?incremental=false"')
    sys.exit(1)

with open(src) as f:
    rows = [json.loads(l) for l in f if l.strip()]

print(f'[DATA] {len(rows)} examples from {src}')

if len(rows) < 10:
    print('[ERROR] Need at least 10 examples.')
    sys.exit(1)

if len(rows) < 200:
    print(f'[WARN] Only {len(rows)} examples — model quality will be limited.')
    print('  Recommended: 500+ for a useful model, 1000+ for production quality.')
    print('  Proceeding anyway (--dry-run to just verify setup)...')

# MLX expects train.jsonl + valid.jsonl in a directory
data_prep_dir = Path('/tmp/krisnam-mlx-data')
data_prep_dir.mkdir(parents=True, exist_ok=True)

random.seed(42)
random.shuffle(rows)
n_val      = max(1, int(len(rows) * args.val_pct))
val_rows   = rows[:n_val]
train_rows = rows[n_val:]

ALPACA_PROMPT = (
    "Below is an instruction that describes a task, paired with an input. "
    "Write a response that appropriately completes the request.\n\n"
    "### Instruction:\n{instruction}\n\n### Input:\n{input}\n\n### Response:\n"
)

def to_mlx_row(r: dict) -> dict:
    return {
        "prompt":     ALPACA_PROMPT.format(instruction=r.get("instruction", ""), input=r.get("input", "")),
        "completion": r.get("output", ""),
    }

def write_jsonl(path: Path, data: list[dict]) -> None:
    with open(path, 'w') as f:
        for r in data:
            f.write(json.dumps(to_mlx_row(r)) + '\n')

write_jsonl(data_prep_dir / 'train.jsonl', train_rows)
write_jsonl(data_prep_dir / 'valid.jsonl', val_rows)

print(f'[DATA] Train: {len(train_rows)}, Val: {len(val_rows)}')
print(f'[DATA] Prepared in {data_prep_dir}')

# ── Check mlx-lm ─────────────────────────────────────────────────────────────

try:
    import mlx_lm  # type: ignore[import-not-found]
    print(f'[ENV] mlx-lm {mlx_lm.__version__} found')  # type: ignore[attr-defined]
except ImportError:
    print('[ERROR] mlx-lm not installed.')
    print('  Install: ~/.kimmp-venv/bin/pip install mlx-lm')
    print('  Or run with: ~/.kimmp-venv/bin/python scripts/finetune_krisnam.py')
    sys.exit(1)

# ── Build mlx_lm.lora command ─────────────────────────────────────────────────

output_dir = Path(args.output_dir)
output_dir.mkdir(parents=True, exist_ok=True)

cmd = [
    sys.executable, '-m', 'mlx_lm', 'lora',
    '--model',         args.mlx_model,
    '--train',
    '--data',          str(data_prep_dir),
    '--iters',         str(args.iters),
    '--batch-size',    str(args.batch_size),
    '--num-layers',    str(args.lora_layers),
    '--learning-rate', str(args.learning_rate),
    '--adapter-path',  str(output_dir / 'adapters'),
    '--save-every',    str(max(50, args.iters // 10)),
    '--val-batches',   '2',
]

print(f'\n[CMD] {" ".join(cmd)}\n')

if args.dry_run:
    print('[DRY RUN] Data prepared, command printed. Exiting (--dry-run).')
    sys.exit(0)

# ── Run fine-tune ─────────────────────────────────────────────────────────────

print(f'[TRAIN] Starting MLX LoRA fine-tune — {args.iters} iters on M-series Neural Engine...')
print('  (Ctrl+C to stop early — adapters saved at each checkpoint)\n')

result = subprocess.run(cmd)

if result.returncode != 0:
    print('\n[ERROR] Training failed. Check output above.')
    sys.exit(1)

print(f'\n[DONE] Adapter saved to {output_dir}/adapters/')

# ── Fuse adapter into base model ──────────────────────────────────────────────

fused_dir    = output_dir / 'fused'
gguf_path_direct = fused_dir / 'krisnam-v2.gguf'

print(f'[FUSE] Merging LoRA adapter into base model → {fused_dir}...')

fuse_cmd = [
    sys.executable, '-m', 'mlx_lm', 'fuse',
    '--model',        args.mlx_model,
    '--adapter-path', str(output_dir / 'adapters'),
    '--save-path',    str(fused_dir),
    '--dequantize',
    '--export-gguf',
    '--gguf-path',    str(gguf_path_direct),
]
subprocess.run(fuse_cmd, check=True)
print(f'[FUSE] Done — fused model at {fused_dir}')

gguf_path = gguf_path_direct if gguf_path_direct.exists() else None
if not gguf_path:
    print('[GGUF] GGUF not found after fuse — check fuse output above.')

# ── Re-quantize fused model for MLX server ────────────────────────────────────

mlx_serving_dir = output_dir / 'fused-4bit'
print(f'[QUANTIZE] Re-quantizing fused model → {mlx_serving_dir} (4-bit for MLX server)...')

quantize_cmd = [
    sys.executable, '-m', 'mlx_lm', 'convert',
    '--hf-path',     str(fused_dir),
    '--mlx-path',    str(mlx_serving_dir),
    '-q',
    '--q-bits',      '4',
]
subprocess.run(quantize_cmd, check=True)
print(f'[QUANTIZE] Done — serving weights at {mlx_serving_dir}')
print(f'\n[MLX SERVER] Restart the server to pick up the fine-tuned weights:')
print(f'  pkill -f "mlx_lm.server" 2>/dev/null || true')
print(f'  ~/.kimmp-venv/bin/python -m mlx_lm.server --model {mlx_serving_dir} --port 11435 &')
print(f'  # Update KIMMP_MLX_MODEL in .env to: {mlx_serving_dir}')

# ── Write Modelfile for Ollama ────────────────────────────────────────────────

if gguf_path and gguf_path.exists():
    modelfile_path = output_dir / 'Modelfile'
    modelfile_path.write_text(f"""FROM {gguf_path}

PARAMETER temperature 0.05
PARAMETER num_predict 512
PARAMETER stop "<|end_of_text|>"
PARAMETER stop "<|eot_id|>"

SYSTEM \"\"\"You are Krisnam — the reasoning core of Kangqore's WAANDA Intelligence Engine. You make agent selection decisions for autonomous system activations. Select the minimum agents needed for the trigger. Return only valid JSON: {{"selectedAgents": [...], "reasoning": "...", "priority": "NORMAL|HIGH|CRITICAL"}}\"\"\"
""")
    print(f'\n[DEPLOY] Modelfile written: {modelfile_path}')
    print(f'\nDeploy to Ollama (optional — MLX server is primary):')
    print(f'  ollama create {args.ollama_model_name} -f {modelfile_path}')
    print(f'\nThen set in .env:')
    print(f'  KIMMP_LOCAL_REASON_MODEL={args.ollama_model_name}')
    print(f'  KIMMP_OLLAMA_URL=http://localhost:11434')
    print(f'\nRestart backend:')
    print(f'  docker compose up -d core-backend')

    if args.create_ollama_model:
        print(f'\n[OLLAMA] Creating model {args.ollama_model_name}...')
        subprocess.run(['ollama', 'create', args.ollama_model_name, '-f', str(modelfile_path)], check=True)
        print(f'[OLLAMA] {args.ollama_model_name} is ready.')
else:
    print(f'\n[DONE] Fused MLX model at {fused_dir}')
    print('  GGUF not produced — convert manually with llama.cpp for Ollama.')
