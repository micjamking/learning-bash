/**
 * Simple script to download tar.gz files
 * @module app
 */

/** @require */
var tarball = require('tarball-extract');
var rimraf  = require('rimraf');
var colors  = require('colors');
var fs      = require('fs');
var express = require('express');

var app = express();

/** @private */
var urls = [
  'http://www.tldp.org/LDP/Bash-Beginners-Guide/Bash-Beginners-Guide.html.tar.gz',
  'http://www.tldp.org/LDP/abs/abs-guide.html.tar.gz'
];

function loadPage() {
  
  console.log(''); // Create some space after prompt
  
  urls.forEach( function( url ) {

    console.log('Fetching ' + url.blue + '\n');

    var tarname   = url.substring( url.lastIndexOf( '/' ) + 1 ),
        directory = tarname.substring( 0, tarname.indexOf( '.' ) );

    function callback( err, result ){
      if ( !err ) {
        // Remove *tar.gz
        rimraf(tarname, function() { 
          // Rename file
          var filename = directory.toLowerCase();

          fs.rename(directory, filename, function() {
            console.log( 'Downloaded ' + filename.green + ' successfully!\n' );
            
            getPages( fs.readdirSync( filename ), filename );
                                 
          });
        });
      } else { 
        console.log( err );
      }
    }

    tarball.extractTarballDownload( url, tarname, './', {}, callback);
  });
}

function getPages(files, directory){
  files.forEach( function( file ) {
    var path = '/' + directory + '/' + file.replace(/.html/g, '');
    console.log( 'Creating route for' + path);
    app.get( path, function(req, res) {
      res.sendfile( directory + '/' + file );
    });
  });
}

loadPage();

app.get('/', function(req, res){
  res.send('Check the console...');
});

app.listen('8000')
exports = module.exports = app;
