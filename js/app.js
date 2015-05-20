!function t(e,n,r){function a(i,u){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!u&&c)return c(i,!0);if(o)return o(i,!0);throw new Error("Cannot find module '"+i+"'")}var l=n[i]={exports:{}};e[i][0].call(l.exports,function(t){var n=e[i][1][t];return a(n?n:t)},l,l.exports,t,e,n,r)}return n[i].exports}for(var o="function"==typeof require&&require,i=0;i<r.length;i++)a(r[i]);return a}({1:[function(t,e,n){var r=t("./graph"),a=t("./geolocation"),o=r(600,400,{top:40,right:30,bottom:40,left:50},10);a.init(function(t){var e=t.coords.latitude,n=t.coords.longitude;document.getElementById("chart").innerHTML="",o.formatChart("lat="+e+"&lon="+n)}),document.getElementById("city-input").addEventListener("input",function(t){var e=function(){o.submitting=!1,document.getElementById("chart").innerHTML="",o.formatChart("q="+this.value)};o.submitting||(o.submitting=!0,setTimeout(e.bind(t.target),500))})},{"./geolocation":2,"./graph":3}],2:[function(t,e,n){e.exports=function(){function t(){try{return navigator.geolocation?navigator.geolocation:void 0}catch(t){return void 0}}function e(e){(n=t())?n.getCurrentPosition(e):alert("HTML5 Geolocation is not supported.")}var n;return{init:e}}()},{}],3:[function(t,e,n){e.exports=function(t,e,n,r){var a,o,i=["Sun","Mon","Tues","Weds","Thurs","Fri","Sat"],u=function(t){return(1.8*(t-273.15)+32).toFixed(2)},c=function(t){return i[new Date(1e3*t).getDay()]},e=e-n.top-n.bottom,t=t-n.left-n.right;return{submitting:!1,formatChart:function(i){d3.json("http://api.openweathermap.org/data/2.5/forecast/daily?"+i,function(l){var s=[],d=[],f=[],p=[];if(l&&"404"!==l.cod){a=l.list.length,i=l.city.name+", "+l.city.country,l.list.forEach(function(t,e){var n=u(t.temp.day),r=c(t.dt),o={temp:n};s.push(n),d.push(r),e!==a-1&&(o.target=e+1),f.push(o)}),f.forEach(function(t){t.hasOwnProperty("target")&&p.push({source:t,target:f[t.target]})});var g=d3.scale.linear().domain([0,.33*s.length,.66*s.length,s.length]).range(["#B58929","#C61C6F","#268BD2","#85992C"]),m=d3.scale.linear().domain([d3.min(s)-5,d3.max(s)+5]).range([0,e]),y=d3.scale.ordinal().domain(d3.range(0,s.length)).rangeBands([0,t],.2),h=d3.select("body").append("div").attr("id","tool-tip"),v=d3.select("#chart").append("svg"),x=v.style("background","#E7E0CB").attr("width",t+n.left+n.right).attr("height",e+n.top+n.bottom).append("g").attr("transform","translate("+n.left+", "+n.top+")"),b=d3.scale.linear().domain([d3.min(s)-5,d3.max(s)+5]).range([e,0]),E=d3.scale.ordinal().domain(d).rangeBands([0,t],.2),B=d3.svg.axis().scale(b).orient("left").ticks(10),C=d3.svg.axis().scale(E).orient("bottom").tickValues(E.domain()),w=d3.select("svg").append("g"),T=d3.select("svg").append("g");f.forEach(function(t,n){t.x=y(n)+y.rangeBand()/2,t.y=e-m(t.temp)}),x.selectAll("line").data(p).enter().append("line").attr("stroke",function(t,e){return g(e)}).attr("x1",function(t){return t.source.x}).attr("y1",function(t){return t.source.y}).attr("x2",function(t){return t.source.x}).attr("y2",function(t){return t.source.y}).transition().attr("x2",function(t){return t.target.x}).attr("y2",function(t){return t.target.y}).delay(function(t,e){return 200*e}).ease("linear"),x.selectAll("circle").data(f).enter().append("circle").attr("cx",function(t){return t.x}).attr("cy",function(t){return t.y}).attr("fill",function(t,e){return g(e)}).on("mouseover",function(t){h.transition().style("opacity",.9),h.html(t.temp+"&deg;F").style("left",d3.event.pageX-35+"px").style("top",d3.event.pageY-35+"px"),o=this.style.fill,d3.select(this).transition().style("opacity",.5).style("fill","yellow")}).on("mouseout",function(t){d3.select(this).transition().style("opacity",1).style("fill",o),h.transition().style("opacity",0)}).transition().attr("r",r).delay(function(t,e){return 200*e}).ease("elastic"),C(T),T.attr("transform","translate("+n.left+", "+(e+n.top)+")"),B(w),w.attr("transform","translate("+n.left+", "+n.top+")"),v.append("text").classed("headline",!0).attr("x",t/2).attr("y",n.top/2).attr("text-anchor","middle").text("Temperatures for "+i)}})}}}},{}]},{},[1]);