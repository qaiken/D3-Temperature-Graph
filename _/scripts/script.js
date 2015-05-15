var days_ref = [
  'Sun',
  'Mon',
  'Tues',
  'Weds',
  'Thurs',
  'Fri',
  'Sat',
  ],
  kelvin_to_f = function(k) {
    return (((k - 273.15)*1.8) + 32).toFixed(2);
  },
  unixCode_to_weekDay = function(uc) {
    return days_ref[new Date(uc*1000).getDay()];
  },
  formatChart = function(city) {

    d3.json('http://api.openweathermap.org/data/2.5/forecast/daily?q='+city, function(data) {

      var barData = [],
        axisDays = [];

      console.log(data);

      if(!data || data.cod === '404') return;

      data.list.forEach(function(obj) {
        var f = kelvin_to_f(obj.temp.day),
          weekDay = unixCode_to_weekDay(obj.dt);
        barData.push(f);
        axisDays.push(weekDay);
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
          .domain([d3.min(barData)-10, d3.max(barData)+10])
          .range([0, height]),

        xScale = d3.scale.ordinal()
          .domain(d3.range(0, barData.length))
          .rangeBands([0, width], 0.2),

        tooltip = d3.select('body').append('div')
          .style('position', 'absolute')
          .style('padding', '0 10px')
          .style('background', 'white')
          .style('opacity', 0),

        myChart = d3.select('#chart').append('svg')
          .style('background', '#E7E0CB')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
          .selectAll('rect').data(barData)
          .enter().append('rect')
              .style('fill', function(d,i) {
                  return colors(i);
              })
              .attr('width', xScale.rangeBand())
              .attr('x', function(d,i) {
                  return xScale(i);
              })
              .attr('height', 0)
              .attr('y', height)

          .on('mouseover', function(d) {

              tooltip.transition()
                  .style('opacity', .9)

              tooltip.html(d)
                  .style('left', (d3.event.pageX - 35) + 'px')
                  .style('top',  (d3.event.pageY - 30) + 'px')


              tempColor = this.style.fill;
              d3.select(this)
                  .style('opacity', .5)
                  .style('fill', 'yellow')
          })

          .on('mouseout', function(d) {
              d3.select(this)
                  .style('opacity', 1)
                  .style('fill', tempColor)
          }),

        vGuideScale = d3.scale.linear()
          .domain([d3.min(barData)-10, d3.max(barData)+10])
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

      myChart.transition()
        .attr('height', function(d) {
            return yScale(d);
        })
        .attr('y', function(d) {
            return height - yScale(d);
        })
        .delay(function(d, i) {
            return i * 20;
        })
        .duration(1000)
        .ease('elastic');

    });

  };

document.getElementById('city-input').addEventListener('input',function(e) {
  document.getElementById('chart').innerHTML = '';
  formatChart(this.value);
})
