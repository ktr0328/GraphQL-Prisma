const kuromoji = require('kuromoji')
const jaconv = require('jaconv')
const path = require('path')

const builder = kuromoji.builder({
  dicPath: path.resolve(__dirname, '../../', 'node_modules/kuromoji/dict')
})

const toRoma = word => {
  return new Promise((resolve, reject) => {
    builder.build((err, tokenizer) => {
      if (err) reject(err)

      const readings = tokenizer.tokenize(word)
        .map(e => e.reading)
        .map(e => jaconv.toHiragana(e))
        .map(e => jaconv.toHebon(e))
        .join('')
      resolve(readings)
    })
  })
}

module.exports = {
  toRoma
}
