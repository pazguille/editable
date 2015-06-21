'use strict';

var fs = require('fs');
var browserify = require('browserify');

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

browserify({'debug': true, 'standalone': 'Editable'})
  .require('./index.js', {'entry': true})
  .bundle()
  .on('error', function(err) { console.log('Error : ' + err.message); })
  .pipe(fs.createWriteStream('dist/editable.js'));