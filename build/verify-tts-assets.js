const fs = require('fs')
const path = require('path')
const { speechKey, validAudio } = require('../src/utils/offline-tts')
const seedTexts = require('./tts-texts')

module.exports = async context => {
  if (context.electronPlatformName !== 'linux') return
  const root = path.join(context.packager.projectDir, 'build', 'tts-assets')
  for (const file of ['runtime/bin/sherpa-onnx-offline-tts', 'model/model.onnx',
    'model/tokens.txt', 'model/lexicon.txt',
    'model/date.fst', 'model/number.fst', 'model/phone.fst', 'model/APACHE-2.0.txt']) {
    if (!fs.existsSync(path.join(root, file))) {
      throw new Error(`Missing offline speech asset: ${file}. Run bash build/prepare-tts.sh first.`)
    }
  }
  for (const text of seedTexts()) {
    const file = path.join(root, 'audio', speechKey(text) + '.wav')
    if (!fs.existsSync(file) || !validAudio(fs.readFileSync(file))) {
      throw new Error('Missing pre-generated speech; run node build/prepare-tts-audio.js: ' + text.slice(0, 30))
    }
  }
}
