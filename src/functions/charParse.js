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
        .map(e => {
          let letter = jaconv.toHebon(e)
          letter = letter.toLowerCase()
          letter = letter.charAt(0).toUpperCase() + letter.slice(1)
          return letter
        })
        .map(e => e.replace(/\W/g, ''))
        .filter(e => e)
        .join('')
      resolve(readings)
    })
  })
}

module.exports = {
  toRoma
}
