// pcm-recorder-worklet.js
// AudioWorkletProcessor that forwards raw mic audio to the main thread in
// fixed-size Float32 frames. Runs on the audio rendering thread — no DOM,
// no access to the page's modules — so resampling to 16kHz for Deepgram
// happens back on the main thread in useVoiceAssistant.js.

class PcmRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.frameSize = 2048;
    this.buffer = new Float32Array(this.frameSize);
    this.bufferIndex = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    const channel = input[0];

    for (let i = 0; i < channel.length; i++) {
      this.buffer[this.bufferIndex++] = channel[i];
      if (this.bufferIndex >= this.frameSize) {
        this.port.postMessage({ samples: this.buffer.slice(0), sampleRate });
        this.bufferIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor('pcm-recorder-processor', PcmRecorderProcessor);
