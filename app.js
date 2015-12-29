/**
 * Simple script to download tar.gz files
 * @module app
 */

/** @require */
var tarball = require('tarball-extract');
var rimraf  = require('rimraf');
var colors  = require('colors');

/** @private */
var urls = [
  'http://www.tldp.org/LDP/Bash-Beginners-Guide/Bash-Beginners-Guide.html.tar.gz',
  'http://www.tldp.org/LDP/abs/abs-guide.html.tar.gz'
];

console.log('\n');

urls.forEach( function( url ) {

  console.log('Fetching ' + url.blue + '\n');

  var tarname  = url.substring( url.lastIndexOf( '/' ) + 1 ),
      filename = tarname.substring( 0, tarname.indexOf( '.' ) ).toLowerCase();

  function callback( err, result ){
    if ( !err ) {
      rimraf(tarname, function() { 
        console.log( 'Downloaded ' + result.destination.green + ' successfully!' );
      });
    } else { 
      console.log( err );
    }
  }

  tarball.extractTarballDownload( url, tarname, filename, {}, callback);
});
