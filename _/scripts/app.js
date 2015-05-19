var graph = require('./graph'),
  tempGraph = graph(600,400,{top: 40, right: 30, bottom: 40, left: 50 },10);

document.getElementById('city-input').addEventListener('input',function(e) {

  var submit = function() {
    tempGraph.submitting = false;
    document.getElementById('chart').innerHTML = '';
    tempGraph.formatChart(this.value);
  };

  if (!tempGraph.submitting) {
    tempGraph.submitting = true;
    setTimeout(submit.bind(e.target), 500);
  }

});
