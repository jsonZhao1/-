const assert = require('assert')
require('./test-speech-volume')
const fs = require('fs')
const path = require('path')
const os = require('os')
const seedTexts = require('./tts-texts')
const { createOfflineTts } = require('../src/utils/offline-tts')

async function main() {
  const root = path.resolve(process.argv[2] || 'build/tts-assets')
  const cache = fs.mkdtempSync(path.join(os.tmpdir(), 'anquan-smoke-'))
  const tts = createOfflineTts(root, cache)
  try {
    await assert.rejects(tts.synthesize(''), /内容为空/)
    const cancelled = tts.synthesize('这段语音应该立即取消。')
    tts.stop()
    await assert.rejects(cancelled, /取消/)
    const text = '解除限速。此标志表示前方路段解除最高限速40公里每小时的规定。禁止长时间停车，请注意交通安全。'
    const start = Date.now()
    const audio = await tts.synthesize(text)
    assert(audio.length > 16044, '8 kHz PCM speech must be longer than one second')
    assert.strictEqual(audio.toString('ascii', 0, 4), 'RIFF')
    // Check actual PCM energy, not just a valid but silent WAV container.
    const dataOffset = audio.indexOf(Buffer.from('data')) + 8
    assert(dataOffset >= 12)
    let peak = 0
    for (let i = dataOffset; i + 1 < audio.length; i += 2) peak = Math.max(peak, Math.abs(audio.readInt16LE(i)))
    assert(peak > 100, 'Generated speech must not be silent')
    assert.strictEqual(await tts.synthesize(text), audio, 'Repeated text should use cache')
    const restarted = createOfflineTts(root, cache)
    const cacheStart = Date.now()
    assert((await restarted.synthesize(text)).equals(audio), 'Cache must survive a restart')
    console.log('Persistent cache read ms:', Date.now() - cacheStart)
    restarted.close()
    const changed = await tts.synthesize('文字已经修改，现在最高限速60公里每小时。')
    assert(!changed.equals(audio), 'Changed text must produce new speech')
    const preparation = tts.prepare('正在验证后台准备与前台朗读共用同一份音频。')
    const playback = tts.synthesize('正在验证后台准备与前台朗读共用同一份音频。')
    assert.strictEqual(preparation, playback, 'Identical requests must share synthesis')
    await playback
    // These reads must also work without any model/runtime present.
    const bundledRoot = fs.mkdtempSync(path.join(cache, 'bundle-only-'))
    fs.mkdirSync(path.join(bundledRoot, 'audio'))
    const { speechKey } = require('../src/utils/offline-tts')
    const first = seedTexts()[0]
    const bundledFile = path.join(root, 'audio', speechKey(first) + '.wav')
    assert(fs.existsSync(bundledFile), 'Built-in speech must ship with the application')
    fs.copyFileSync(bundledFile, path.join(bundledRoot, 'audio', speechKey(first) + '.wav'))
    const bundled = createOfflineTts(bundledRoot, cache)
    const background = bundled.prepare('背景准备必须让出前台播放。')
    const backgroundCancelled = assert.rejects(background, /取消/)
    const bundledStart = Date.now()
    assert((await bundled.synthesize(first)).length > 44)
    await backgroundCancelled
    console.log('Bundled audio read ms (no model/runtime):', Date.now() - bundledStart)
    const oldRequest = bundled.synthesize('快速切换后不应播放旧内容。')
    const oldCancelled = assert.rejects(oldRequest, /取消/)
    bundled.stop()
    assert((await bundled.synthesize(first)).length > 44)
    await oldCancelled
    bundled.close()
    fs.mkdirSync('tts-smoke-output', { recursive: true })
    fs.writeFileSync('tts-smoke-output/中文朗读示例.wav', audio)
    console.log(JSON.stringify({ bytes: audio.length, peak, elapsedMs: Date.now() - start, root }))
  } finally {
    tts.close()
    fs.rmSync(cache, { recursive: true, force: true })
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
