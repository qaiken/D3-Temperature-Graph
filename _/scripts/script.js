var daysRef = [
  'Sun',
  'Mon',
  'Tues',
  'Weds',
  'Thurs',
  'Fri',
  'Sat',
  ],
  circleWidth = 10,
  kelvin_to_f = function(k) {
    return (((k - 273.15)*1.8) + 32).toFixed(2);
  },
  unixCode_to_weekDay = function(uc) {
    return daysRef[new Date(uc*1000).getDay()];
  },
  formatChart = function(city) {

    d3.json('http://api.openweathermap.org/data/2.5/forecast/daily?q='+city, function(data) {

      var barData = [],
        axisDays = [],
        nodes = [],
        links = [],
        dataLength;

      if(!data || data.cod === '404') return;

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

      nodes.forEach(function(node) {

        if( node.hasOwnProperty('target') ) {
          links.push({
            'source': node,
            'target': nodes[node.target]
          });
        }

      });

      var margin = { top: 30, right: 30, bottom: 40, left:50 },
        height = 400 - margin.top - margin.bottom,
        width = 600 - margin.left - margin.right,
        barWidth = 50,
        barOffset = 5,
        tempColor,

        colors = d3.scale.linear()
          .domain([0, barData.length*0.33, barData.length*0.66, barData.length])
          .range(['#B58929','#C61C6F', '#268BD2', '#85992C']),

        yScale = d3.scale.linear()
          .domain([d3.min(barData)-5, d3.max(barData)+5])
          .range([0, height]),

        xScale = d3.scale.ordinal()
          .domain(d3.range(0, barData.length))
          .rangeBands([0, width], 0.2),

        tooltip = d3.select('body').append('div')
          .attr('id','tooltip')
          .style('position', 'absolute')
          .style('padding', '0 10px')
          .style('background', 'white')
          .style('opacity', 0),

        mySVG = d3.select('#chart').append('svg')
          .style('background', '#E7E0CB')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')'),

        vGuideScale = d3.scale.linear()
          .domain([d3.min(barData)-5, d3.max(barData)+5])
          .range([height, 0]),

        hGuideScale = d3.scale.ordinal()
          .domain(axisDays)
          .rangeBands([0, width], 0.2),

        vAxis = d3.svg.axis()
          .scale(vGuideScale)
          .orient('left')
          .ticks(10),

        hAxis = d3.svg.axis()
          .scale(hGuideScale)
          .orient('bottom')
          .tickValues(hGuideScale.domain()),

        vGuide = d3.select('svg').append('g'),
        hGuide = d3.select('svg').append('g');

      nodes.forEach(function(node,i) {
        node.x = xScale(i) + xScale.rangeBand()/2;
        node.y = height - yScale(node.temp);
      });

      var link = mySVG.selectAll('line')
        .data(links).enter().append('line')
        .attr('stroke', function(d,i) {
            return colors(i);
        });

      link
        .attr('x1', function(d) { return d.source.x })
        .attr('y1', function(d) { return d.source.y })
        .attr('x2', function(d) { return d.target.x })
        .attr('y2', function(d) { return d.target.y });

      var node = mySVG.selectAll('circle')
        .data(nodes).enter()
        .append('circle');
      node
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; })
        .attr('fill', function(d,i) {
            return colors(i);
        })
        .transition()
        .attr('r',circleWidth)
        .delay(function(d, i) {
            return i * 200;
        })
        .ease('elastic');

      node
        .on('mouseover', function(d) {

          tooltip.transition()
              .style('opacity', .9)

          tooltip.html(d.temp + '&deg;' + 'F')
              .style('left', (d3.event.pageX - 35) + 'px')
              .style('top',  (d3.event.pageY - 35) + 'px')

          tempColor = this.style.fill;

          d3.select(this).transition()
              .style('opacity', .5)
              .style('fill', 'yellow')

        })
        .on('mouseout', function(d) {

          d3.select(this).transition()
            .style('opacity', 1)
            .style('fill', tempColor)

          tooltip.transition()
            .style('opacity',0);

        });

      hAxis(hGuide);
      hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')');
      hGuide.selectAll('path')
          .style({ fill: 'none', stroke: "#000"});
      hGuide.selectAll('line')
          .style({ stroke: "#000"});

      vAxis(vGuide);
      vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
      vGuide.selectAll('path')
          .style({ fill: 'none', stroke: "#000"});
      vGuide.selectAll('line')
          .style({ stroke: "#000"});

    });

  };

document.getElementById('city-input').addEventListener('input',function(e) {
  document.getElementById('chart').innerHTML = '';
  formatChart(this.value);
})
