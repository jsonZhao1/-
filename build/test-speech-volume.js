const assert = require('assert')
const { boostSpeech } = require('../src/utils/speech-volume')

function wav(samples) {
  // Include an odd-length metadata chunk to verify RIFF padding handling.
  const audio = Buffer.alloc(54 + samples.length * 2)
  audio.write('RIFF', 0)
  audio.writeUInt32LE(audio.length - 8, 4)
  audio.write('WAVEfmt ', 8)
  audio.writeUInt32LE(16, 16)
  audio.writeUInt16LE(1, 20)
  audio.writeUInt16LE(1, 22)
  audio.writeUInt32LE(8000, 24)
  audio.writeUInt32LE(16000, 28)
  audio.writeUInt16LE(2, 32)
  audio.writeUInt16LE(16, 34)
  audio.write('JUNK', 36)
  audio.writeUInt32LE(1, 40)
  audio.write('data', 46)
  audio.writeUInt32LE(samples.length * 2, 50)
  samples.forEach((sample, i) => audio.writeInt16LE(sample, 54 + i * 2))
  return audio
}

for (const samples of [[-10000, 0, 10000], [-32768, 32767], [-10, 10], [0, 0]]) {
  const original = wav(samples)
  const snapshot = Buffer.from(original)
  const result = boostSpeech(original)
  assert(original.equals(snapshot), 'Do not change cached/source audio')
  assert(result.subarray(0, 54).equals(original.subarray(0, 54)), 'Preserve WAV metadata')
  samples.forEach((sample, i) => {
    const adjusted = result.readInt16LE(54 + i * 2)
    assert(Math.abs(adjusted) <= Math.floor(32767 * 0.9), 'Leave headroom without clipping')
    if (sample) assert.strictEqual(Math.sign(adjusted), Math.sign(sample))
    if (Math.abs(sample) === 10000) assert(Math.abs(adjusted) > 29000)
    if (Math.abs(sample) === 10) assert.strictEqual(Math.abs(adjusted), 40, 'Cap amplification')
  })
  assert(boostSpeech(snapshot).equals(result), 'Repeated cache loads must not accumulate gain')
}
const truncated = wav([1000]).subarray(0, 55)
assert.strictEqual(boostSpeech(truncated), truncated)
console.log('Speech gain, clipping, metadata, silence and cache safety checks passed')
