const uglify = require("uglify-js");
const fs = require('fs');

const src_path = './src/';
const build_path = './docs/';
const build_name = 'script.min.js';

console.log( `Building ${ build_name }` );

console.log( 'Listing files' );

const file_names = fs.readdirSync( src_path );

console.log( 'Reading files' );

const file_contents = file_names
      .map( name => src_path + name )
      .map( path => fs.readFileSync( path, 'utf8' ) );

console.log( 'Minifying code' );

const minified = uglify.minify( file_contents, { toplevel: true } );

if( minified.error ){
    console.error( minified.error );
    process.exit( 1 );
}

const code = minified.code.replace(/(\n)/g, '').replace(/(\t| +)/g, ' ');

console.log( 'Saving build' );

fs.writeFileSync( build_path + build_name, code, 'utf8');

console.log( 'Build done' );
