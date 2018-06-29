const fs = require('fs');
const path = require('path');
const axios = require('axios');

Promise.resolve()
  .then(function () {//全行抽出
    return new Promise(function (resolve, reject) {
      const BASE = path.resolve(__dirname, '../../', 'data');
      const PATH = path.resolve(BASE, 'raw', `titles.csv`);
      const raw = fs.readFileSync(PATH, 'utf-8');

      const tempArray = raw.split('\r\n');
      const columns = tempArray[0].split(',');

      return resolve(columns.length)

    });
  })
  .then(function (value) {//ファイルの名前抽出
    return new Promise(function (resolve, reject) {
      const BASE = path.resolve(__dirname, '../../', 'data');
      const PATH = path.resolve(BASE, 'raw', `titles.csv`);
      const raw = fs.readFileSync(PATH, 'utf-8');

      const tempArray = raw.split('\r\n');

      const columns = tempArray[0].split(',');

      const values = []
      for (let i = 1; i < value; i++) {
        values.push(columns[i].split('\n')[1])
      }

      return resolve(values)

    });
  })
  .then(function (values) {//カラム名抽出
    return new Promise(function (resolve, reject) {
      const columnNames = []
      values.forEach(fileName => {
        if (fileName !== '') {
          const BASE = path.resolve(__dirname, '../../', 'data');
          const PATH = path.resolve(BASE, 'raw', `${fileName}.csv`);

          const raw = fs.readFileSync(PATH, 'utf-8');
          const tempArray = raw.split('\r\n');

          columnNames.push(tempArray[0].split(','))
        }

        return resolve(columnNames)
      });
    })
  })
  .then(function (columnNames) {//かっこの中身を消去
    return new Promise(function (resoleve, reject) {
      const firstblankets = [new RegExp("[(]"), new RegExp("[（]"), new RegExp("[\[]"), new RegExp("[「]"), new RegExp("[{]"), new RegExp("[『]"), new RegExp("[<]"), new RegExp("[＜]")];
      const backblankets = [new RegExp("[)]"), new RegExp("[）]"), new RegExp("[\]]"), new RegExp("[」]"), new RegExp("[}]"), new RegExp("[』]"), new RegExp("[>]"), new RegExp("[＞]")];
      columnNames.forEach((columns,num) =>{
        columns.forEach((word, index) => {
          firstblankets.forEach((v, i) => {
            const startPoint = word.search(firstblankets[i]);
            if (startPoint !== -1) {
              const endPoint = word.search(backblankets[i]);
              if (endPoint !== -1) {
                columnNames[num][index] = word.substring(0, startPoint) + word.substring(endPoint + 1, word.length)
              }
            }
          });
        });
      })
      return resoleve(columnNames)
    })
  }).then(function (columnNames) {//かっこの中身を消去
    return new Promise(function (resoleve, reject) {
      const firstblankets = [new RegExp("[\(]"), new RegExp("[（]"), new RegExp("[\[]"), new RegExp("[「]"), new RegExp("[\{]"), new RegExp("[『]"), new RegExp("[\<]"), new RegExp("[＜]"),new RegExp("[（]")];
      const backblankets = [new RegExp("[\)]"), new RegExp("[）]"), new RegExp("[\]]"), new RegExp("[」]"), new RegExp("[\}]"), new RegExp("[』]"), new RegExp("[\>]"), new RegExp("[＞]"),new RegExp("[)]")];
      columnNames.forEach((columns,num) =>{
        columns.forEach((word, index) => {
          firstblankets.forEach((v, i) => {
            const startPoint = word.search(firstblankets[i]);
            if (startPoint !== -1) {
              const endPoint = word.search(backblankets[i]);
              if (endPoint !== -1) {
                columnNames[num][index] = word.substring(0, startPoint) + word.substring(endPoint + 1, word.length)
              }
            }
          });
        });
      })
      columnNames.forEach((columns,num) =>{
        columns.forEach((word, index) => {
          firstblankets.forEach((v, i) => {
            const startPoint = word.search(firstblankets[i]);
            if (startPoint !== -1) {
              const endPoint = word.search(backblankets[i]);
              if (endPoint !== -1) {
                columnNames[num][index] = word.substring(0, startPoint) + word.substring(endPoint + 1, word.length)
              }
            }
          });
        });
      })
      return resoleve(columnNames)
  }).then(function(columnNames) {
    return new Promise(function(resolve, reject) {
      const alphabeticSymbol = new RegExp('[\-\=\~〜＝\.\/。、・\\r]')
      columnNames.forEach((columns,num)=>{
        columns.forEach((word, index) => {
          columnNames[num][index] = word.replace(alphabeticSymbol, '_');
          columnNames[num][index] = columnNames[num][index].replace(alphabeticSymbol, '_');
          columnNames[num][index] = columnNames[num][index].replace(alphabeticSymbol, '_');
          columnNames[num][index] = columnNames[num][index].replace('[\\[.*\\]]', '_');
        });
      })
      return resolve(columnNames)
    });
  })
  }).then(function (columnNames) {
    console.log(columnNames.forEach(e=>console.log(e)))
    console.log(columnNames.length)

})
  .catch(function (error) {
    console.log(error);
  });

