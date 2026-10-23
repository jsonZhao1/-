const fs = require('fs')
const path = require('path')
const { createOfflineTts, speechKey } = require('../src/utils/offline-tts')
const seedTexts = require('./tts-texts')

async function main() {
  const root = path.resolve(process.argv[2] || 'build/tts-assets')
  const output = path.join(root, 'audio')
  const tts = createOfflineTts(root, output)
  const texts = seedTexts()
  let bytes = 0
  const started = Date.now()
  for (let i = 0; i < texts.length; i++) {
    const audio = await tts.synthesize(texts[i])
    bytes += audio.length
    console.log(`Prepared speech ${i + 1}/${texts.length}`)
  }
  fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(texts.map(speechKey), null, 2))
  console.log(JSON.stringify({ count: texts.length, bytes, elapsedMs: Date.now() - started }))
}
main().catch(error => { console.error(error); process.exitCode = 1 })
