var graph = require('./graph'),
  geoLocation = require('./geolocation'),
  tempGraph = graph(600,400,{top: 40, right: 30, bottom: 40, left: 50 },10);

geoLocation.init(function(pos) {
  var lat = pos.coords.latitude,
    lon = pos.coords.longitude;
  tempGraph.initChart('lat='+lat+'&lon='+lon);
});

document.getElementById('city-input').addEventListener('input',function(e) {

  var submit = function(value) {
    tempGraph.updateChart('q='+value);
    setTimeout(function() {
      tempGraph.submitting = false;
    }, 500);
  };

  if (!tempGraph.submitting) {
    tempGraph.submitting = true;
    submit(e.target.value);
  }

});
