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

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

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
    
    var old_directory = (directory === 'bash-beginners-guide') ? 'Bash-Beginners-Guide' : directory;
    
    var path = (file === 'index.html') ? '/' + directory + '/' : '/' + directory + '/' + file.replace(/.html/g, '');
    
    app.get( path, function(req, res) {
      res.sendFile( '/' + file, { root: __dirname + '/' + directory } );
    });

    // Redirect if .html
    app.get( path + '.html', function(req, res) {
      res.redirect(path);
    });

    // Redirect capitalized path name to lowercase
    app.get( '/' + old_directory + '/' + file, function(req, res){
      res.redirect(path);
    });
  });
}

app.get('/', function(req, res){
  res.send('<a href="/abs-guide/">Advanced Bash Scripting Guide</a>\n<a href="/bash-beginners-guide/">Bash Guide for Beginners</a>');
  loadPage();
});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});
exports = module.exports = app;
