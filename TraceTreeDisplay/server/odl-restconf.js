var config = require( './config' );
var oauth = require( './oauth' );
var request = require( 'request' );

exports.forward = function( req, res ) {
  var opts = { url: config.odl_server_path + "/restconf/" + req.params[0]
             , headers: { 'Authorization': 'Bearer ' + oauth.getToken() } };

  request.get( opts
             , function( error, response, data ) {
                 res.writeHead( 200, { 'Content-Type': 'application/json' } );
                 res.write( data );
                 res.end();
               } );
}
