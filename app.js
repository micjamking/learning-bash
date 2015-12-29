/**
 * Simple script to download tar.gz files
 * @module app
 */

/** @require */
var tarball = require('tarball-extract');
var rimraf = require('rimraf');

/** @private */
var urls = [
  'http://www.tldp.org/LDP/Bash-Beginners-Guide/Bash-Beginners-Guide.html.tar.gz',
  'http://www.tldp.org/LDP/abs/abs-guide.html.tar.gz'
];

urls.forEach( function( url ) {

  var tarname  = url.substring( url.lastIndexOf( '/' ) + 1 ),
      filename = tarname.substring( 0, tarname.indexOf( '.' ) );

  function callback( err, result ){
    if ( !err ) {
      console.log( result );
    } else { 
      console.log( err );
    }
  }

  tarball.extractTarballDownload( url, tarname, filename, {}, callback);
});
