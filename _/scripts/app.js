var graph = require('./graph'),
  geoLocation = require('./geolocation'),
  tempGraph = graph(600,400,{top: 40, right: 30, bottom: 40, left: 50 },10);

geoLocation.init(function(pos) {
  var lat = pos.coords.latitude,
    lon = pos.coords.longitude;
  document.getElementById('chart').innerHTML = '';
  tempGraph.formatChart('lat='+lat+'&lon='+lon);
});

document.getElementById('city-input').addEventListener('input',function(e) {

  var submit = function() {
    tempGraph.submitting = false;
    document.getElementById('chart').innerHTML = '';
    tempGraph.formatChart('q='+this.value);
  };

  if (!tempGraph.submitting) {
    tempGraph.submitting = true;
    setTimeout(submit.bind(e.target), 500);
  }

});
