const fs = require('fs');
const path = require('path');
const axios = require('axios');

//一行目のカラム取得
const getColumns = fileName => {
  let columns = fileName;
  if(fileName !== '') {
    const BASE = path.resolve(__dirname, '../../', 'data');
    const PATH = path.resolve(BASE, 'raw', `${fileName}.csv`);

    const raw = fs.readFileSync(PATH, 'utf-8');
    const tempArray = raw.split('\r\n');

    columns = tempArray[0].split(',')
  }
  return columns
};

//ファイル名取得
const getFileName = (fileName = 'titles',index=1) => {
  const BASE = path.resolve(__dirname, '../../', 'data');
  const PATH = path.resolve(BASE, 'raw', `${fileName}.csv`);
  const raw = fs.readFileSync(PATH, 'utf-8');

  const tempArray = raw.split('\r\n');

  const columns = tempArray[0].split(',');

  return columns[index].split('\n')[1]
};

//全行数確認
const getFileIndex = (fileName = 'titles')=>{
  const BASE = path.resolve(__dirname, '../../', 'data');
  const PATH = path.resolve(BASE, 'raw', `${fileName}.csv`);
  const raw = fs.readFileSync(PATH, 'utf-8');

  const tempArray = raw.split('\r\n');
  const columns = tempArray[0].split(',');

  return columns.length
};

//codic api
const parseColumn = word => {
  return new Promise((resolve, reject) => {
    axios({
      url: `https://api.codic.jp/v1/engine/translate.json?text=${encodeURIComponent(word)}`,
      headers: {
        Authorization: 'Bearer 6ifQf3yJ9a5lAHVdFUhvbOX21vfBl4KlLY'
      },
      method: 'GET'
    }).then(res => {
      resolve(res)
    }).catch(err => reject(err))
  })
};

//かっこでくくられた文字を削除
const substringBulanket = (columns) => {
  const firstblankets = [new RegExp("[(]"), new RegExp("[（]"), new RegExp("[\[]"), new RegExp("[「]"), new RegExp("[{]"), new RegExp("[『]"), new RegExp("[<]"), new RegExp("[＜]")];
  const backblankets = [new RegExp("[)]"), new RegExp("[）]"), new RegExp("[\]]"), new RegExp("[」]"), new RegExp("[}]"), new RegExp("[』]"), new RegExp("[>]"), new RegExp("[＞]")];
  columns.forEach((word, index) => {
    firstblankets.forEach((v,i) =>{
      const startPoint = word.search(firstblankets[i]);
      if (startPoint !== -1) {
        const endPoint = word.search(backblankets[i]);
        if (endPoint !==-1) {
          columns[index] = word.substring(0,startPoint)+word.substring(endPoint+1,word.length)
        }
      }
    });
  });
  return columns
};

//記号削除
const sliceAlphabeticSymbols = (columns) =>{
  const alphabeticSymbol = new RegExp('[-=~〜＝./。・a-zA-Z]')
  columns.forEach((word, index) => {
    columns[index] = word.replace(alphabeticSymbol, '_');
  });
  return columns
}

//parseColumn('こんにちは').then(e => console.log(e))
//console.log(getColumns(getFileName('titles',3)))

for (let i = 1;i < getFileIndex();i++) {
  const columns = getColumns(getFileName('titles', i))
  console.log(substringBulanket(substringBulanket(substringBulanket(getColumns(getFileName())))))
}

