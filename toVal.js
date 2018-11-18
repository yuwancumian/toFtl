#!/usr/bin/env node
const fs = require('fs');
const exec = require('child_process').exec;
const split = require('split');
const path = require('path');
const chalk = require("chalk");


const file = path.resolve(__dirname, `${process.argv[2]}.html`);
const val = process.argv[3];
console.log(file);
console.log(val);

function readHtml(){
    let num = 0;
    fs.readFile(file, 'utf-8', function(err,data){
        if (err) {
            return console.log(err);
        }
        var regex = new RegExp("{\\$"+val+"}", "g" );
        // console.log("data", data);
        if (data.match(regex)){
            console.log("hahhah");
        }
        var result = data.replace(regex, "${(" + val + ")!''}");
    
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    })
}

readHtml()
