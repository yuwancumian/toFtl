#!/usr/bin/env node
console.log('tolayout')
const fs = require('fs');
const exec = require('child_process').exec;
const split = require('split');
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
        exec(`sed -i .bak 's#__INS__/#/#g' ${file}`, (err,stdout, stderr)=>{
        })
        if(!line.match(/vendor/g)){
          console.log('not match', num)
          exec(`sed -i .bak 's#src="/js/#src="vendor/js/#g' ${file}`, (err, stdout, stderr)=>{
          })
        }
        
        
        if(line.match(/<block name="content">/g)){
          console.log(111,line)
          exec(`sed -i .bak 's#<block name="content">#<@block name="content">#g' ${file}`, (err, stdout, stderr)=>{
            console.log(stderr);
          })
        }

        if(line.match(/<block name="js">/g)){
          console.log(222,line)
          exec(`sed -i .bak 's#<block name="js">#<@block name="js">#g' ${file}`, (err, stdout, stderr)=>{
            console.log(stderr);
          })
        }
        if(line.match(/<\/block>/g)){
          console.log('block1', num)
          exec(`sed -i .bak "s#</block>#</@block>#g" ${file}`, (err, stdout, stderr)=>{
            console.log('</@block was replaced!');
          })
        }
      })
    /*exec(`cat ${file}`, function(err, stdout,stderr){*/
      //console.log(`stdout: ${stdout}`)
    /*});*/
  })
})
