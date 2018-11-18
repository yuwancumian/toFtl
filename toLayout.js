#!/usr/bin/env node
console.log('tolayout')
const fs = require('fs');
const exec = require('child_process').exec;
const split = require('split');
const path = require('path');
function readDir(dest){
  return new Promise((resolve, reject)=>{
    fs.readdir(dest, (err,data)=>{
      err ? reject(err) : resolve(data)
    })
  })
}
function isHtml(file){
  return file.split('.').pop()==='html';
}

function changeLine (file, line, num) {
  if(line.match(/<extend/g)){
    exec(`sed -i .bak ${num}d ${file}`,(err, stdout, stderr)=> {
      console.log(stderr)
    })
  }
  exec(`sed -i .bak 's#__INS__/#/#g' ${file}`, (err,stdout, stderr)=>{
  })
  if(!line.match(/vendor/g)){
    exec(`sed -i .bak 's#src="/js/#src="vendor/js/#g' ${file}`, (err, stdout, stderr)=>{
    })
  }
  
  
  if(line.match(/<block name="content">/g)){

    exec(`sed -i .bak 's#<block name="content">#<@block name="content">#g' ${file}`, (err, stdout, stderr)=>{
      console.log(stderr);
    })
  }

  if(line.match(/<block name="js">/g)){
    exec(`sed -i .bak 's#<block name="js">#<@block name="js">#g' ${file}`, (err, stdout, stderr)=>{
      console.log(stderr);
    })
  }
  if(line.match(/<\/block>/g)){
    exec(`sed -i .bak "s#</block>#</@block>#g" ${file}`, (err, stdout, stderr)=>{
      console.log('<@block> was replaced!');
    })
  }
  exec('rm *.bak')
}
let num = 0;
if (process.argv[2]) {
  const file = path.resolve(__dirname, process.argv[2]);
  fs.createReadStream(file)
  .pipe(split())
  .on('data', (line)=>{
    num += 1;
    // console.log(num, line)
    changeLine(file, line, num);
  })
} else {
  readDir('./').then((data)=>{
    console.log(data)
    console.log(data.filter(isHtml))
    data.filter(isHtml).forEach(file=>{
      fs.createReadStream(file)
        .pipe(split())
        .on('data', (line)=>{
          num += 1;
          // console.log(num, line)
          changeLine(file, line, num);
        })
      /*exec(`cat ${file}`, function(err, stdout,stderr){*/
        //console.log(`stdout: ${stdout}`)
      /*});*/
    })
  })
  
}


