const fs = require('fs')
const path = require('path')
const axios = require('axios')

const BASE = path.resolve(__dirname, '../../', 'data')
const PATH = path.resolve(BASE, 'raw', '260002bear.csv')

const raw = fs.readFileSync(PATH, 'utf-8')
const tempArray = raw.split('\r\n')

const columns = tempArray[0].split(',')

const parseColumn = word => {
  return new Promise((resolve, reject) => {
    axios({
      url: `https://api.codic.jp/v1/engine/translate.json?text=${word}`,
      headers: {
        Authorization: 'Bearer 6ifQf3yJ9a5lAHVdFUhvbOX21vfBl4KlLY'
      },
      method: 'GET'
    }).then(res => {
      resolve(res)
    }).catch(err => reject(err))
  })
}

parseColumn('こんにちは').then(e => console.log(e))
