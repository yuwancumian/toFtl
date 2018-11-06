#!/usr/bin/env node
const fs = require('fs');
const exec = require('child_process').exec;
const split = require('split');

console.log(111)
function readdir(dest){
  return new Promise((resolve, reject)=>{
    fs.readdir(dest, (err,data)=>{
      err ? reject(err) : resolve(data)
    })
  })
}
function isHtml(file){
  return file.split('.').pop()==='html';
}

readdir('./').then((data)=>{
  console.log(data)
  console.log(data.filter(isHtml))
  data.filter(isHtml).forEach(file=>{
    let num = 0;
    fs.createReadStream(file)
      .pipe(split())
      .on('data', (line)=>{
        num += 1;
        // console.log(num, line)
        if(line.match(/<extend/g)){
          exec(`sed -i .bak ${num}d ${file}`,(err, stdout, stderr)=> {
            console.log(stderr)
          })
        }
        
        if(line.match(/<block name="content">/g)){
          console.log(111,line)
          exec(`sed -i .bak 's#<block name="content">#<@override name="content">#g' ${file}`, (err, stdout, stderr)=>{
            console.log(stderr);
          })
        }

        if(line.match(/<block name="js">/g)){
          console.log(222,line)
          exec(`sed -i .bak 's#<block name="js">#<@override name="js">#g' ${file}`, (err, stdout, stderr)=>{
            console.log(stderr);
          })
        }
        if(line.match(/<\/block>/g)){
          console.log('block1', num)
          exec(`sed -i .bak "s#</block>#</@override>#g" ${file}`, (err, stdout, stderr)=>{
            console.log(stderr);
          })
        }
      })
    /*exec(`cat ${file}`, function(err, stdout,stderr){*/
      //console.log(`stdout: ${stdout}`)
    /*});*/
    console.log(file)
  })
})
