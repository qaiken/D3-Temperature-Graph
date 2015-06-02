var d3 = require('d3');

module.exports = function(width,height,margin,circleWidth) {

  var dataLength, colors, yScale, xScale, vGuideScale, hGuideScale, vAxis, hAxis;
  var barData = [];
  var axisDays = [];
  var nodes = [];
  var links = [];
  var barWidth = 50;
  var barOffset = 5;
  var tooltip = d3.select('#tool-tip');
  var height = height - margin.top - margin.bottom;
  var width = width - margin.left - margin.right;
  var daysRef = ['Sun','Mon','Tues','Weds','Thurs','Fri','Sat'];

  var kelvin_to_f = function(k) {
    return (((k - 273.15)*1.8) + 32).toFixed(2);
  };

  var unixCode_to_weekDay = function(uc) {
    return daysRef[new Date(uc*1000).getDay()];
  };

  var svgContainer = d3.select('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  var chart = svgContainer
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  var vGuide = svgContainer.append('g')
    .classed('axis',true)
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  var hGuide = svgContainer.append('g')
    .classed('axis',true)
    .attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');

  var headline = svgContainer.append('text')
    .classed('headline',true)
    .attr('x', (width / 2))
    .attr('y', (margin.top / 2))
    .attr('text-anchor', 'middle')
    .text('Temperatures for ');

  var citySpan = headline.append('tspan')
    .text('Loading Location...');

  return {
    submitting: false,
    initData: function(data) {
      var city;

      if(!data || data.cod === '404') return;

      barData = [];
      axisDays = [];
      nodes = [];
      links = [];

      city = data.city.name + ', ' + data.city.country;

      citySpan.text(city);

      dataLength = data.list.length;

      data.list.forEach(function(obj,i) {

        var f = kelvin_to_f(obj.temp.day),
          weekDay = unixCode_to_weekDay(obj.dt),
          node = {
            'temp': f
          };

        barData.push(f);
        axisDays.push(weekDay);

        if(i !== dataLength-1) node.target = i+1;

        nodes.push(node);

      });

      colors = d3.scale.linear()
        .domain([0, barData.length*0.33, barData.length*0.66, 7])
        .range(['#B58929','#C61C6F', '#268BD2', '#85992C']);

      yScale = d3.scale.linear()
        .domain([d3.min(barData)-5, d3.max(barData)+5])
        .range([0, height]);

      xScale = d3.scale.ordinal()
        .domain(d3.range(0, barData.length))
        .rangeBands([0, width], 0.2);

      vGuideScale = d3.scale.linear()
        .domain([d3.min(barData)-5, d3.max(barData)+5])
        .range([height, 0]);

      hGuideScale = d3.scale.ordinal()
        .domain(axisDays)
        .rangeBands([0, width], 0.2);

      vAxis = d3.svg.axis()
        .scale(vGuideScale)
        .orient('left')
        .ticks(10);

      hAxis = d3.svg.axis()
        .scale(hGuideScale)
        .orient('bottom')
        .tickValues(hGuideScale.domain());

      hAxis(hGuide);

      vAxis(vGuide);

      nodes.forEach(function(node,i) {

        node.x = xScale(i) + xScale.rangeBand()/2;
        node.y = height - yScale(node.temp);

        if( node.hasOwnProperty('target') ) {
          links.push({
            'source': node,
            'target': nodes[node.target]
          });
        }

      });
    },
    initChart: function(location) {

      d3.json('http://api.openweathermap.org/data/2.5/forecast/daily?'+location, function(data) {

        var tempColor;

        this.initData(data);

        chart.selectAll('line')
          .data(links).enter().append('line')
          .attr('stroke', function(d,i) {
            return colors(i);
          })
          .attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.source.x; })
          .attr('y2', function(d) { return d.source.y; })
          .transition()
          .delay(function(d,i) {
            return i * 200;
          })
          .ease('linear')
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

        chart.selectAll('circle')
          .data(nodes).enter()
          .append('circle')
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })
          .attr('fill', function(d,i) {
            return colors(i);
          })
          .on('mouseover', function(d) {

            tooltip.transition()
              .style('opacity',0.9);

            tooltip.html(d.temp + '&deg;' + 'F')
              .style('left', (d3.event.pageX - 35) + 'px')
              .style('top',  (d3.event.pageY - 35) + 'px');

            tempColor = this.style.fill;

            d3.select(this).transition()
              .style('opacity',0.5)
              .style('fill', 'yellow');

          })
          .on('mouseout', function(d) {

            d3.select(this).transition()
              .style('opacity',1)
              .style('fill', tempColor);

            tooltip.transition()
              .style('opacity',0);

          })
          .transition()
          .delay(function(d,i) {
            return i * 200;
          })
          .ease('elastic')
          .attr('r',circleWidth);

      }.bind(this));

    },
    updateChart: function(location) {

      d3.json('http://api.openweathermap.org/data/2.5/forecast/daily?'+location, function(data) {

        this.initData(data);

        chart.selectAll('circle')
          .data(nodes)
          .transition()
          .duration(2000)
          .ease('elastic')
          .attr('cy', function(d) { return d.y; });

        chart.selectAll('line')
          .data(links)
          .transition()
          .duration(2000)
          .ease('elastic')
          .attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

      }.bind(this));

    }

  };

};
