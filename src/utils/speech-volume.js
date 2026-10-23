// Adjust PCM samples, since HTMLAudioElement.volume cannot amplify above 1.
// Original cached files remain unchanged; apply once when loading into memory.
function boostSpeech(audio) {
  if (audio.length < 44 || audio.toString('ascii', 0, 4) !== 'RIFF' ||
      audio.toString('ascii', 8, 12) !== 'WAVE') return audio
  let pcm16 = false
  let start = 0
  let end = 0
  for (let offset = 12; offset + 8 <= audio.length;) {
    const size = audio.readUInt32LE(offset + 4)
    const next = offset + 8 + size
    if (next > audio.length) return audio
    const type = audio.toString('ascii', offset, offset + 4)
    if (type === 'fmt ' && size >= 16) {
      pcm16 = audio.readUInt16LE(offset + 8) === 1 && audio.readUInt16LE(offset + 22) === 16
    } else if (type === 'data') {
      start = offset + 8
      end = next
    }
    offset = next + (size % 2)
  }
  if (!pcm16 || !start || (end - start) % 2) return audio
  let peak = 0
  for (let i = start; i < end; i += 2) peak = Math.max(peak, Math.abs(audio.readInt16LE(i)))
  if (!peak) return audio
  const gain = Math.min(4, Math.floor(32767 * 0.9) / peak)
  const result = Buffer.from(audio)
  for (let i = start; i < end; i += 2) {
    result.writeInt16LE(Math.round(audio.readInt16LE(i) * gain), i)
  }
  return result
}

module.exports = { boostSpeech }
