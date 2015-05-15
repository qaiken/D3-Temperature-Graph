var daysRef=["Sun","Mon","Tues","Weds","Thurs","Fri","Sat"],circleWidth=10,kelvin_to_f=function(t){return(1.8*(t-273.15)+32).toFixed(2)},unixCode_to_weekDay=function(t){return daysRef[new Date(1e3*t).getDay()]},formatChart=function(t){d3.json("http://api.openweathermap.org/data/2.5/forecast/daily?q="+t,function(e){var n,a=[],r=[],o=[],i=[];if(e&&"404"!==e.cod){n=e.list.length,t=e.city.name+", "+e.city.country,e.list.forEach(function(t,e){var i=kelvin_to_f(t.temp.day),l=unixCode_to_weekDay(t.dt),s={temp:i};a.push(i),r.push(l),e!==n-1&&(s.target=e+1),o.push(s)}),o.forEach(function(t){t.hasOwnProperty("target")&&i.push({source:t,target:o[t.target]})});var l,s={top:40,right:30,bottom:40,left:50},c=400-s.top-s.bottom,d=600-s.left-s.right,u=d3.scale.linear().domain([0,.33*a.length,.66*a.length,a.length]).range(["#B58929","#C61C6F","#268BD2","#85992C"]),f=d3.scale.linear().domain([d3.min(a)-5,d3.max(a)+5]).range([0,c]),p=d3.scale.ordinal().domain(d3.range(0,a.length)).rangeBands([0,d],.2),y=d3.select("body").append("div").attr("id","tool-tip"),g=d3.select("#chart").append("svg"),h=g.style("background","#E7E0CB").attr("width",d+s.left+s.right).attr("height",c+s.top+s.bottom).append("g").attr("transform","translate("+s.left+", "+s.top+")"),m=d3.scale.linear().domain([d3.min(a)-5,d3.max(a)+5]).range([c,0]),x=d3.scale.ordinal().domain(r).rangeBands([0,d],.2),v=d3.svg.axis().scale(m).orient("left").ticks(10),k=d3.svg.axis().scale(x).orient("bottom").tickValues(x.domain()),B=d3.select("svg").append("g"),C=d3.select("svg").append("g");o.forEach(function(t,e){t.x=p(e)+p.rangeBand()/2,t.y=c-f(t.temp)});h.selectAll("line").data(i).enter().append("line").attr("stroke",function(t,e){return u(e)}).attr("x1",function(t){return t.source.x}).attr("y1",function(t){return t.source.y}).attr("x2",function(t){return t.source.x}).attr("y2",function(t){return t.source.y}).transition().attr("x2",function(t){return t.target.x}).attr("y2",function(t){return t.target.y}).delay(function(t,e){return 200*e}).ease("linear"),h.selectAll("circle").data(o).enter().append("circle").attr("cx",function(t){return t.x}).attr("cy",function(t){return t.y}).attr("fill",function(t,e){return u(e)}).on("mouseover",function(t){y.transition().style("opacity",.9),y.html(t.temp+"&deg;F").style("left",d3.event.pageX-35+"px").style("top",d3.event.pageY-35+"px"),l=this.style.fill,d3.select(this).transition().style("opacity",.5).style("fill","yellow")}).on("mouseout",function(t){d3.select(this).transition().style("opacity",1).style("fill",l),y.transition().style("opacity",0)}).transition().attr("r",circleWidth).delay(function(t,e){return 200*e}).ease("elastic");k(C),C.attr("transform","translate("+s.left+", "+(c+s.top)+")"),C.selectAll("path").style({fill:"none",stroke:"#000"}),C.selectAll("line").style({stroke:"#000"}),v(B),B.attr("transform","translate("+s.left+", "+s.top+")"),B.selectAll("path").style({fill:"none",stroke:"#000"}),B.selectAll("line").style({stroke:"#000"}),g.append("text").attr("x",d/2).attr("y",s.top/2).attr("text-anchor","middle").style("font-size","16px").style("text-decoration","underline").text("Temperatures for "+t)}})};document.getElementById("city-input").addEventListener("input",function(t){var e=!1,n=function(t){e=!1,document.getElementById("chart").innerHTML="",formatChart(t.value)};e||(e=!0,setTimeout(n(t.target),500))});