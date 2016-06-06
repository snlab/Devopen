// utils.js
// basic DOM and misc. object helpers that have proved useful

var Utils = {
  getViewportSize: function() {
    var viewPortWidth;
    var viewPortHeight;

    if (typeof window.innerWidth != 'undefined') {
      viewPortWidth  = window.innerWidth;
      viewPortHeight = window.innerHeight;
    } else if ( typeof document.documentElement             != 'undefined' &&
                typeof document.documentElement.clientWidth != 'undefined' &&
                document.documentElement.clientWidth        != 0 ) {
      // IE6 in standards compliant mode
      viewPortWidth  = document.documentElement.clientWidth;
      viewPortHeight = document.documentElement.clientHeigh;
    } else {
      // sigh...
      viewPortWidth  = document.getElementsByTagName('body')[0].clientWidth;
      viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
    }

    return { w: viewPortWidth
           , h: viewPortHeight };
  },

  // a custom indexOf method that takes in a custom equals method
  indexOf: function ( haystack, needle, equals, fromIndex ) {
    if ( !equals ) return haystack.indexOf( needle, fromIndex );

    var i, pivot = ( fromIndex ) ? fromIndex : 0, length;
  
    if ( !haystack ) {
      throw new TypeError();
    }
  
    length = haystack.length;
  
    if ( length === 0 || pivot >= length ) {
      return -1;
    }
  
    if ( pivot < 0 ) {
      pivot = length - Math.abs( pivot );
    }
  
    for ( i = pivot; i < length; i++ ) {
      if ( equals( haystack[i], needle ) || haystack[i] === needle ) {
        return i;
      }
    }
    return -1;
  },
}
