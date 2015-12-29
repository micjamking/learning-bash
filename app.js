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

function loadPage(req, res){
  
  console.log(''); // Create some space after prompt
  
  urls.forEach( function( url ) {

    console.log('Fetching ' + url.blue + '\n');

    var tarname  = url.substring( url.lastIndexOf( '/' ) + 1 ),
        filename = tarname.substring( 0, tarname.indexOf( '.' ) );

    function callback( err, result ){
      if ( !err ) {
        // Remove *tar.gz
        rimraf(tarname, function() { 
          // Rename file
          fs.rename(filename, filename.toLowerCase(), function() {
            console.log( 'Downloaded ' + filename.toLowerCase().green + ' successfully!\n' );
          });
        });
      } else { 
        console.log( err );
      }
    }

    tarball.extractTarballDownload( url, tarname, './', {}, callback);
  });

  res.send('Check the console...')
}

app.get('/', loadPage);
app.listen('8000')
exports = module.exports = app;
