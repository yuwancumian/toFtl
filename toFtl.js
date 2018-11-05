#!/usr/bin/env node
require('shelljs/global');
ls('*.html').forEach(function(file){
  console.log(file);
  sed('-i', '<extend name="Layout/ins_page" />', '', file);
  sed('-i', '<block name="content">', '<@override name="content">', file)
  sed('-i', '<block name="js">', '<@override name="js">', file)
  sed('-i', '</block>', '</@override>', file)
  '<@extends name="../layout/ins_page.html"/>\n'.toEnd(file)
  echo(cat(file));
})
