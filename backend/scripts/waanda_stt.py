#!/usr/bin/env python3
"""
WAANDA STT — reads a WAV file (mono, 16-bit PCM) and transcribes via Whisper.
Bypasses ffmpeg by decoding the WAV manually and feeding a float32 numpy array
directly to whisper.transcribe().
Usage: python3 waanda_stt.py <wav_file>
"""
import sys
import wave
import struct
import numpy as np
import whisper

def load_wav(path: str) -> tuple[np.ndarray, int]:
    with wave.open(path, 'rb') as wf:
        n_channels = wf.getnchannels()
        sampwidth  = wf.getsampwidth()
        framerate  = wf.getframerate()
        n_frames   = wf.getnframes()
        raw        = wf.readframes(n_frames)

    if sampwidth == 2:
        samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    elif sampwidth == 4:
        samples = np.frombuffer(raw, dtype=np.int32).astype(np.float32) / 2147483648.0
    else:
        raise ValueError(f"Unsupported sample width: {sampwidth}")

    if n_channels > 1:
        samples = samples.reshape(-1, n_channels).mean(axis=1)

    # Whisper expects 16 kHz
    if framerate != 16000:
        import math
        ratio   = 16000 / framerate
        new_len = int(len(samples) * ratio)
        indices = np.round(np.linspace(0, len(samples) - 1, new_len)).astype(int)
        samples = samples[indices]

    return samples, 16000

if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(1)

    audio, sr = load_wav(sys.argv[1])
    model     = whisper.load_model('tiny.en')
    result    = model.transcribe(audio, language='en', fp16=False)
    print(result['text'].strip())
