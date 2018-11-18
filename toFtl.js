#!/usr/bin/env node
require("shelljs/global");
const fs = require('fs');
const exec = require('child_process').exec;
const split = require('split');
const chalk = require('chalk');

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

readDir('./').then((data)=>{
  console.log(data.filter(isHtml))
  data.filter(isHtml).forEach(file=>{
    let num = 0;
    let layout_name;
    fs.createReadStream(file)
      .pipe(split())
      .on('data', (line)=>{
        num += 1;
        // console.log(num, line)
        if(line.match(/<extend/g)){
          console.log(chalk.red('file:', num, line, file))
          layout_name = line.split('"')[1].split('/')[1];
          exec(`sed -i .bak ${num}d ${file}`,(err, stdout, stderr)=> {
            console.log(stderr)
          });
          `<@extends name="../layout/${layout_name}.html" />`.toEnd(file)
          console.log(chalk.green("change layout"))
        }

        
        if(line.match(/block name/g)){
          exec(`sed -i .bak 's#block name#@override name#g' ${file}`, (err, stdout, stderr)=>{
            console.log(stderr);
          })
          console.log(chalk.green("block start changed!"))
        }

        /*if(line.match(/<block name="js">/g)){*/
          //console.log(222,line)
          //exec(`sed -i .bak 's#<block name="js">#<@override name="js">#g' ${file}`, (err, stdout, stderr)=>{
            //console.log(stderr);
          //})
        /*}*/
        if(line.match(/<\/block>/g)){
          exec(`sed -i .bak "s#</block>#</@override>#g" ${file}`, (err, stdout, stderr)=>{
            console.log(stderr);
          })
          console.log(chalk.green("block end changed!"))
        }
        
      })
    /*exec(`cat ${file}`, function(err, stdout,stderr){*/
      //console.log(`stdout: ${stdout}`)
    /*});*/
    console.log(chalk.cyan(`${file} was changed!`))
  })
}).then(()=>{
  exec('rm *.bak', (err, stdout, stderr) => {
    console.log(stderr);
  })
})

