const fs = require('fs')
const path = require('path')
const { toRoma } = require('./charParse')

const BASE = path.resolve(__dirname, '../../', 'data')
const PATH = path.resolve(BASE, 'raw', '260002bear.csv')
const raw = fs.readFileSync(PATH, 'utf-8')

const tempArray = raw.split('\r\n')
const rawArray = tempArray.map(e => e.split(','))
const jpColumns = rawArray[0];
const restData = tempArray.slice(1);

(async () => {
  const column = await Promise.all(jpColumns.map(e => toRoma(e)))
  const data = {
    valueType: 'nodes',
    values: restData.map(e => {
      const row =  {
        '_typeName': 'kuma'
      }
      column.forEach((v, i) => {
        const arr = e.split(',')
        row[v] = arr[i]
      })

      return row
    })
  }

  fs.writeFile(path.resolve(BASE, 'nodes/', `${"1".padStart(4, "0")}.json`), JSON.stringify(data), err => {
    if (err) console.log(err)
  })
})()
