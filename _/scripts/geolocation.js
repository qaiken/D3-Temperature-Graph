module.exports = (function() {
  var geo;

  function getGeoLocation() {
    try {
      if( !!navigator.geolocation ) return navigator.geolocation;
      else return undefined;
    } catch(e) {
      return undefined;
    }
  }

  function init(cb) {
    if( geo = getGeoLocation() )
      geo.getCurrentPosition(cb);
    else
      alert('HTML5 Geolocation is not supported.');
  }

  return {
    init: init
  };
}());