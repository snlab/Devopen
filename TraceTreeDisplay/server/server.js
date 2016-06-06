//
// simple nodejs server that acts as an intermediary between ODL/ONOS and the web GUI
//

// requires
var fs = require( 'fs' );
var colors = require( 'colors' );
var express = require( 'express' );
var app = express();
var bodyParser = require( 'body-parser' );
var multiparty = require( 'multiparty' );
var http = require( 'http' );
var request = require( 'request' );

var tracetree = require( './tracetree' );
var config = require( './config' );
var oauth = require( './oauth' );
var odl_restconf = require( './odl-restconf' );

var Server = function( port ) {
  app.use( express.static( './' ) );
  app.use( bodyParser.json() ); // for parsing application/json
  app.use( bodyParser.urlencoded( { extended: true } ) ); // for parsing application/x-www-form-urlencoded

  app.route( '/login' )
    .post( function( req, res, next ) {
      var form = new multiparty.Form();

      form.parse( req, function( err, fields, files ) {
        // expecting:
        // fields.username
        // fields.password
        res.send( 'ok' );
      } );
    } );

  app.get( '/', function( req, res ) {
    res.writeHead( 302, { Location: '/maple/maple.html' } );
    res.end();
  } );

  app.get( '/v0/tt', tracetree.v0 );
  app.get( '/odl-restconf/*', odl_restconf.forward );

  port = port || 3000;
  app.listen( port );

  process.stdout.write( "server started:\t" + ( "http://localhost:" + port ).green + "\n" );

  // BAD! FIXME
  var credentials = { grant_type: "password"
                    , username:   "admin"
                    , password:   "admin"
                    , scope:      "sdn"
                    };

  oauth.init( credentials );

  return {
    port: port,
  }
};

var server = new Server();
