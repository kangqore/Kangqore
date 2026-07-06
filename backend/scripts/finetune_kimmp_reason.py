#!/usr/bin/env python3
"""
KIMMP Gen 2 — Fine-Tune Script (Apple Silicon / MLX)
======================================================
Fine-tunes Llama-3.2-3B-Instruct on Kangqore's REASON phase training data
to produce a local routing model that replaces Claude API calls in reasonPhase().

Requires Python 3.11+ and runs on Apple M-series chips via MLX.
For NVIDIA GPU (cloud), see the --cloud flag which prints the Colab/Unsloth recipe.

Architecture after fine-tune:
  REASON phase → kimmp-reason:v1  (local, ~50ms latency, no API cost)
  SPEAK  phase → Claude claude-opus-4-8  (unchanged)
  GOVERN phase → Claude claude-opus-4-8  (unchanged)

Quick start:
  # Install uv if you don't have it:
  curl -LsSf https://astral.sh/uv/install.sh | sh

  # Install dependencies:
  uv pip install mlx-lm

  # Export training data:
  curl -s "http://localhost:5050/api/admin/waanda-training/export?incremental=false" > /dev/null

  # Run fine-tune:
  python3.11 scripts/finetune_kimmp_reason.py

  # Deploy to Ollama:
  python3.11 scripts/finetune_kimmp_reason.py --create-ollama-model
"""

import argparse
import json
import random
import subprocess
import sys
from pathlib import Path

# ── CLI ───────────────────────────────────────────────────────────────────────

parser = argparse.ArgumentParser(description='Fine-tune KIMMP REASON model (Apple Silicon / MLX)')
parser.add_argument('--data-dir',       type=str, default='/tmp/waanda-training', help='Waanda export directory')
parser.add_argument('--mlx-model',      type=str, default='mlx-community/Llama-3.2-3B-Instruct-4bit', help='MLX quantized base model')
parser.add_argument('--output-dir',     type=str, default='./models/kimmp-reason-v1', help='Output directory')
parser.add_argument('--iters',          type=int, default=1000,  help='Training iterations (100 for smoke test, 1000 for real run)')
parser.add_argument('--batch-size',     type=int, default=4,     help='Batch size')
parser.add_argument('--lora-layers',    type=int, default=16,    help='Number of LoRA layers to train')
parser.add_argument('--learning-rate',  type=float, default=1e-4, help='Learning rate')
parser.add_argument('--val-pct',        type=float, default=0.1,  help='Validation split fraction')
parser.add_argument('--dry-run',        action='store_true', help='Prepare data and print command, then exit')
parser.add_argument('--cloud',          action='store_true', help='Print Google Colab / Unsloth recipe and exit')
parser.add_argument('--create-ollama-model', action='store_true', help='Convert trained adapter to Ollama model after training')
parser.add_argument('--ollama-model-name', type=str, default='kimmp-reason:v1', help='Ollama model name to create')
args = parser.parse_args()

# ── Cloud recipe (Colab / Unsloth) ───────────────────────────────────────────

if args.cloud:
    print("""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KIMMP Gen 2 — Google Colab / Unsloth Fine-Tune Recipe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Upload your training data to Colab:
   - Download: curl http://localhost:5050/api/admin/waanda-training/export?incremental=false
   - Get the alpaca_*.jsonl file from /tmp/waanda-training/
   - Upload to /content/alpaca_kimmp.jsonl in Colab

2. In Colab (GPU runtime — T4 is free, A100 ~$0.50/hr):

   %%bash
   pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
   pip install --no-deps trl peft accelerate bitsandbytes

3. Fine-tune:

   from unsloth import FastLanguageModel
   from datasets import Dataset
   from trl import SFTTrainer
   from transformers import TrainingArguments
   import json

   # Load data
   with open('/content/alpaca_kimmp.jsonl') as f:
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
           logging_steps=1, optim='adamw_8bit', output_dir='./kimmp-out',
           report_to='none'))
   trainer.train()

4. Export GGUF for Ollama:
   model.save_pretrained_gguf('./kimmp-reason-v1', tokenizer, quantization_method='q4_k_m')

5. Download kimmp-reason-v1-Q4_K_M.gguf and deploy locally with Ollama.
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

# MLX expects train.jsonl + valid.jsonl in a directory, Alpaca format
data_prep_dir = Path('/tmp/kimmp-mlx-data')
data_prep_dir.mkdir(parents=True, exist_ok=True)

random.seed(42)
random.shuffle(rows)
n_val   = max(1, int(len(rows) * args.val_pct))
val_rows = rows[:n_val]
train_rows = rows[n_val:]

ALPACA_PROMPT = (
    "Below is an instruction that describes a task, paired with an input. "
    "Write a response that appropriately completes the request.\n\n"
    "### Instruction:\n{instruction}\n\n### Input:\n{input}\n\n### Response:\n"
)

def to_mlx_row(r: dict) -> dict:
    return {
        "prompt":     ALPACA_PROMPT.format(instruction=r.get("instruction",""), input=r.get("input","")),
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
    import mlx_lm  # type: ignore[import-not-found]  # installed in venv, not system python
    print(f'[ENV] mlx-lm {mlx_lm.__version__} found')  # type: ignore[attr-defined]
except ImportError:
    print('[ERROR] mlx-lm not installed.')
    print('  Install: uv pip install mlx-lm')
    print('  Then re-run this script.')
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

print(f'[TRAIN] Starting MLX fine-tune — {args.iters} iters on M-series Neural Engine...')
print('  (Ctrl+C to stop early — adapters saved at each checkpoint)\n')

result = subprocess.run(cmd)

if result.returncode != 0:
    print('\n[ERROR] Training failed. Check output above.')
    sys.exit(1)

print(f'\n[DONE] Adapter saved to {output_dir}/adapters/')

# ── Fuse adapter into model ───────────────────────────────────────────────────

fused_dir = output_dir / 'fused'
print(f'[FUSE] Merging LoRA adapter into base model → {fused_dir}...')

gguf_path_direct = fused_dir / 'kimmp-reason-v1.gguf'
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

# ── Convert to GGUF for Ollama ────────────────────────────────────────────────

gguf_dir = output_dir / 'gguf'
gguf_dir.mkdir(parents=True, exist_ok=True)

gguf_path = gguf_path_direct if gguf_path_direct.exists() else None
if not gguf_path:
    print('[GGUF] GGUF not found after fuse — check fuse output above.')

# ── Write Modelfile for Ollama ────────────────────────────────────────────────

if gguf_path and gguf_path.exists():
    modelfile_path = output_dir / 'Modelfile'
    modelfile_path.write_text(f"""FROM {gguf_path}

PARAMETER temperature 0.05
PARAMETER num_predict 512
PARAMETER stop "<|end_of_text|>"
PARAMETER stop "<|eot_id|>"

SYSTEM \"\"\"You are KIMMP — Kangqore Intelligence Mapping and Management Platform. You make agent selection decisions for autonomous system activations. Select the minimum agents needed for the trigger. Return only valid JSON: {{"selectedAgents": [...], "reasoning": "...", "priority": "NORMAL|HIGH|CRITICAL"}}\"\"\"
""")
    print(f'\n[DEPLOY] Modelfile written: {modelfile_path}')
    print(f'\nDeploy to Ollama:')
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
    print('  Convert to GGUF manually with llama.cpp to deploy via Ollama.')
