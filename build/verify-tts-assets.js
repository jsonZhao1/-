const fs = require('fs')
const path = require('path')

module.exports = async context => {
  if (context.electronPlatformName !== 'linux') return
  const root = path.join(context.packager.projectDir, 'build', 'tts-assets')
  for (const file of ['runtime/bin/sherpa-onnx-offline-tts', 'model/model.int8.onnx',
    'model/voices.bin', 'model/tokens.txt', 'model/lexicon-zh.txt',
    'model/dict/jieba.dict.utf8', 'model/espeak-ng-data/phontab',
    'model/date-zh.fst', 'model/number-zh.fst', 'model/phone-zh.fst', 'model/LICENSE']) {
    if (!fs.existsSync(path.join(root, file))) {
      throw new Error(`Missing offline speech asset: ${file}. Run bash build/prepare-tts.sh first.`)
    }
  }
}
