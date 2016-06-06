var config = require( './config' );
var request = require( 'request' );

exports.init = function( credentials ) {
  this.credentials = credentials;
  this.token = "";
  this.authorize();
}

exports.authorize = function() {
  request.post( config.odl_server_path + "/oauth2/token"
              , { form: exports.credentials }
              , function( error, response, body ) {
                  if ( response.statusCode == 200 || response.statusCode == 201 ) {
                    // success
                    var data = JSON.parse( body );
                    // one trick here is that usually the "expires_in" field is in seconds, but ODL actually specifies this in milliseconds
                    exports.setToken( data.access_token, parseInt( data.expires_in ) );
                  } else {
                    console.log( error );
                    console.log( body );
                  }
              } );
}

exports.getToken = function() {
  return this.token;
}

exports.setToken = function( token, ttl ) {
  this.token = token;
  this.expiration = new Date().getTime() + ttl;
  setTimeout( exports.authorize, ttl - 60000 ); // reapply 60 seconds before token expiring
}
