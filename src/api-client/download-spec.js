//node script download http://localhost:3000/docs-json to local file /src/api-client/openapi.json

const { readFileSync, writeFileSync, createWriteStream } = require('fs');
const { resolve } = require('path');
var http = require('http');

const specUrl = 'http://localhost:3000/docs-json';
const specFile = resolve(__dirname, 'openapi.json');


download(specUrl, specFile)
.then(data => {

  // TODO jeśli jest potrzeba, tu możesz zmodyfikować wygenerowany spec
  // data.paths["/agreement/pdf"].get.responses[200].content["application/pdf"].schema.format = 'binary';

  //
  
  const str = JSON.stringify(data, null, 2);
  writeFileSync(specFile, str);
  console.log('DOWNLOAD COMPLETED :)')
  console.log('FROM:', specUrl)
  console.log('TO:', specFile)
})
.catch(err => {
  console.log('DOWNLOAD ERROR', err);
  console.log('SpecUrl', specUrl)
  console.log('SpecFile', specFile)
})


// HELPERS


function download(url, dest) {
  return new Promise((resolve, reject) => {

    let options = {
    }
    console.log('DOWNLOAD', url)
    var file = createWriteStream(dest);
    const req = http.get(url, options, function(res) {
      res.pipe(file);

      console.log('RESPONSE STATUS: ' + res.statusCode);

      file.on('finish', function() {
        file.close(() => {
          const spec = readFileSync(specFile);
          try {
            const data = JSON.parse(spec);
            resolve(data);
          } catch (error) {
            reject('Spec File Parsing Error');
          }
        });  // close() is async, call cb after close completes.
      });
      file.on('error', function(err) {
        console.log('err', err)
        reject(err);
        file.close((data) => {
          console.log('err2', data)
          reject(err);
        });  // close() is async, call cb after close completes.
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
  });
}