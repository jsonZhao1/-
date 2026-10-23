const fs = require('fs')
const path = require('path')
const vm = require('vm')

// Read the same seed array used by IndexedDB, so audio cannot drift from the UI.
module.exports = function seedTexts() {
  const source = fs.readFileSync(path.join(__dirname, '../src/dexie.js'), 'utf8')
  const start = source.indexOf('db.markStudy.bulkPut([')
  const end = source.indexOf('\n  ])', start)
  if (start < 0 || end < 0) throw new Error('Cannot find markStudy seed array')
  const array = source.slice(start + 'db.markStudy.bulkPut('.length, end + 4)
  const records = vm.runInNewContext(array, { installRootPath: '' }, { timeout: 1000 })
  const texts = [...new Set(records.map(record => record.identifierDesc.trim()).filter(Boolean))]
  if (!texts.length) throw new Error('No built-in speech descriptions found')
  return texts
}
