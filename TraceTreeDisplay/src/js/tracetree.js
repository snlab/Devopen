mapleControllers.controller( 'TTCtrl', function ( $scope, $http, $timeout ) {
  $scope.pollServer = function() {
    $http.get( '/v0/tt' ).success( $scope.draw );
  }

  $scope.clearPeriodicUpdates = function() {
    clearInterval( $scope.periodicallyUpdateId );
  }

  $scope.buildsvg = function() {
    $scope.svg = d3.select( "svg" );
    $scope.svg.classed( { 'grabbing': false, 'grabbable': true } );

    $scope.svg.attr( "height", Utils.getViewportSize().h );

    $scope.svgg = $scope.svg.append( "g" );
    // pan
    $scope.zoom = d3.behavior.zoom().on( "zoom", function() {
      $scope.svgg.attr( "transform", "translate(" + d3.event.translate + ")" +
                        "scale(" + d3.event.scale + ")" );
    } );

    $scope.drag = d3.behavior.drag();

    $scope.drag.on( "dragstart", function() {
      $scope.dragging = true;
      $scope.svg.classed( { 'grabbing': true, 'grabbable': false } );
    } );
    $scope.drag.on( "dragend", function() {
      $scope.dragging = false;
      $scope.svg.classed( { 'grabbing': false, 'grabbable': true } );
    } );

    $scope.svg.call( $scope.zoom );
    $scope.svg.call( $scope.drag );
  }

  $scope.draw = function( data ) {
    // build dagreD3 graph
    {
      var tt = new dagreD3.graphlib.Graph( { multigraph: true } ).setGraph({}).setDefaultEdgeLabel( function() { return {}; });

      data.ttnodes.forEach( function( n ) {
        tt.setNode( n.id, { label: n.type, class: "tracetree-node" } );
        if (n.type == "L" && n["maple-l-type:link"]) {
          tt.setNode( n.id + ":action", { label: "toPorts", class: "tracetree-node" } );
          var actions_label = "";
          n["maple-l-type:link"].forEach( function( l ) {
            actions_label = actions_label + l["src-node"].port + " -> " + l["dst-node"].port + "\n";
          });
          tt.setEdge( n.id
                    , n.id + ":action"
                    , { label: actions_label
                      , lineInterpolate: "bundle" }
                    , n.id + ":path");
        }
      } );

      data.ttlinks.forEach( function( l ) {
        tt.setEdge( l.predicateID
                  , l.destinationID
                  , { label: " " + ( l.operator == "==" ? "": l.operator ) + " " + l.condition.toString()
                    , lineInterpolate: "bundle" }
                  , l.id );
      } );

      tt.nodes().forEach( function( n ) {
        var node = tt.node( n );

        if ( node ) {
          if ( $scope.nodeIsAction( node ) ) {
            $scope.applySpecialActionStyle( node );
            node.rx = 5;
            node.ry = 5;
          } else {
            node.shape = "ellipse";
          }
        }
      } );

      var renderer = new dagreD3.render();

      renderer( d3.select( "svg g" ), tt );

      if ( !$scope.resetPosition ) {
        $scope.resetPosition = true;
        var bbox = $scope.svg.node().getBoundingClientRect();
        var graphScale = bbox.width / tt.graph().width; // fit to viewport
        var top_margin = 20;
        $scope.zoom.scale( graphScale )
                   .translate( [ ( bbox.width - graphScale * tt.graph().width ) / 2, top_margin ] )
                   .event( $scope.svg );
      }
    }
  }

  $scope.actionLabels = [ "action", "drop", "flood", "punt", "toPorts" ];

  $scope.nodeIsAction = function( node ) {
    return $scope.actionLabels.indexOf( node.label ) > -1;
  }

  $scope.applySpecialActionStyle = function( node ) {
    switch ( node.label ) {
      case "drop":
        node.style = 'fill: #f77; stroke: #000'; // red
        break;
      case "toPorts":
        node.style = 'fill: #afa; stroke: #000'; // green
        break;
    }
  }

  Mousetrap.bind( '1', function() {
    $http.get( '/maple/tt_test.json' ).success( $scope.draw );
  } );

  Mousetrap.bind( '2', function() {
    $http.get( '/maple/tt_test_2.json' ).success( $scope.draw );
  } );

  Mousetrap.bind( '3', function() {
    $http.get( '/maple/tt_test_action.json' ).success( $scope.draw );
  } );

  Mousetrap.bind( '4', function() {
    $http.get( '/maple/tt_test_output.json' ).success( $scope.draw );
  } );

  // init
  {
    $scope.buildsvg();
    $scope.periodicallyUpdateId = setInterval( function() { $scope.pollServer(); }, 1000 );

    serverEventSrc = new EventSource( '/event' );
    serverEventSrc.addEventListener( 'message', function ( msg ) {
      $scope.pollServer();
    }, false);

    $( window ).resize( function() {
      $scope.svg.attr( "height", Utils.getViewportSize().h );
    } );
  }
} );
