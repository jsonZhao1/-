const assert = require('assert')
const fs = require('fs')
const path = require('path')
const { createOfflineTts } = require('../src/utils/offline-tts')

async function main() {
  const root = path.resolve(process.argv[2] || 'build/tts-assets')
  const tts = createOfflineTts(root)
  await assert.rejects(tts.synthesize(''), /内容为空/)
  const cancelled = tts.synthesize('这段语音应该立即取消。')
  tts.stop()
  await assert.rejects(cancelled, /取消/)
  const text = '解除限速。此标志表示前方路段解除最高限速40公里每小时的规定。禁止长时间停车，请注意交通安全。'
  const start = Date.now()
  const audio = await tts.synthesize(text)
  assert(audio.length > 48000, 'Speech must be longer than one second')
  assert.strictEqual(audio.toString('ascii', 0, 4), 'RIFF')
  // Check actual PCM energy, not just a valid but silent WAV container.
  const dataOffset = audio.indexOf(Buffer.from('data')) + 8
  assert(dataOffset >= 12)
  let peak = 0
  for (let i = dataOffset; i + 1 < audio.length; i += 2) peak = Math.max(peak, Math.abs(audio.readInt16LE(i)))
  assert(peak > 100, 'Generated speech must not be silent')
  assert.strictEqual(await tts.synthesize(text), audio, 'Repeated text should use cache')
  const changed = await tts.synthesize('文字已经修改，现在最高限速60公里每小时。')
  assert(!changed.equals(audio), 'Changed text must produce new speech')
  fs.mkdirSync('tts-smoke-output', { recursive: true })
  fs.writeFileSync('tts-smoke-output/中文朗读示例.wav', audio)
  console.log(JSON.stringify({ bytes: audio.length, peak, elapsedMs: Date.now() - start, root }))
}
main().catch(error => { console.error(error); process.exitCode = 1 })
