const fs = require('fs');
const path = require('path');
const axios = require('axios');


//一行目のカラム取得
const getColumns = new Promise(function(fileName) {
  let columns = fileName;
  if(fileName !== '') {
    const BASE = path.resolve(__dirname, '../../', 'data');
    const PATH = path.resolve(BASE, 'raw', `${fileName}.csv`);

    const raw = fs.readFileSync(PATH, 'utf-8');
    const tempArray = raw.split('\r\n');

    columns = tempArray[0].split(',')
  }
  return resolve(columns)
})

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

//codicapi
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
const substringBulanket =new Promise(columns) {
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
  return resolve(columns)
};

//記号削除
const sliceAlphabeticSymbols = (columns) =>{
  const alphabeticSymbol = new RegExp('[-=~〜＝./。・a-zA-Z]')
  columns.forEach((word, index) => {
    columns[index] = word.replace(alphabeticSymbol, '_');
  });
  return columns
}

//記号削除
const numChange = (columns) =>{
  const num = new RegExp('[/^[-]?[0-9]+(\\.[0-9]+)?$/]')
  columns.forEach((word, index) => {
    if (-1 === word.search(num)){
      console.log(word)
    }
  })
}


for (let i = 1;i < getFileIndex();i++) {
  const fileName = getFileName('titles', i)
  const columns = substringBulanket(substringBulanket(substringBulanket(getColumns(fileName))))
  parseColumn(columns[0])

  Promise.all( [ getColumns(fileName)] ).then( function ( coulumns ) {
    console.log( coulumns ) ;
  } ) ;
}

