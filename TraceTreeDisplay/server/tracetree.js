var config = require( './config' );
var oauth = require( './oauth' );
var request = require( 'request' );

exports.v0 = function( req, res ) {
  var opts = { url: config.odl_server_path + "/restconf/config/maple-tracetree:tracetrees"
             , headers: { 'Authorization': 'Bearer ' + oauth.getToken() } };

  request.get( opts
             , function( error, response, body ) {
                 try {
                   res.writeHead( 200, { 'Content-Type': 'application/json' } );
                   res.write( simplify( JSON.parse( body ) ) );
                   res.end();
                 } catch( e ) {
                   console.log( e );
                   res.end();
                 }
               } );
}

function simplify( data ) {
  var out = {};
  out.ttnodes = data.tracetrees[ "maple-apps" ][0].ttnodes.map( function( n ) {
    var outnode = {};
    Object.keys( n ).forEach( function( k ) {
      outnode[ k ] = n[ k ];
    } );
    if ( outnode.type == "V" ) {
      // just use the actual v-type as the type for the node label (GUI just uses node.type as the label)
      outnode.type = prettifyUnderscoreCase( outnode[ "maple-v-type:field" ] );
      outnode[ "maple-v-type:field" ] = undefined;
    }
    return outnode;
  } );
  out.ttlinks = data.tracetrees[ "maple-apps" ][0].ttlinks.map( function( l ) {
    var outlink = {};
    Object.keys( l ).forEach( function( k ) {
      switch ( k ) {
        case "predicate-id":
          outlink.predicateID = l[ k ];
          break;
        case "destination-id":
          outlink.destinationID= l[ k ];
          break;
        default:
          outlink[ k ] = l[ k ];
          break;
      }
    } );
    return outlink;
  } );
  return JSON.stringify( out );
}

function prettifyUnderscoreCase( str ) {
  return str.toLowerCase().replace(/_(.)/g, function( match, group1 ) {
    return group1.toUpperCase();
  });
}
