var data;

d3.json("/graph.json", function(error, json){
  if(error) return console.warn(error);
  data = json;
  visualizeit();
});

function visualizeit(){
    var width = 960;
    var height = 500;
    var padding = 20;
    
    var force = d3.layout.force()
    .size([width, height])
    .charge(-400)
    .linkDistance(40)
    .on("tick", tick);
    
    var svg = d3.select("#canvas").append("svg")
    .attr("width", width)
    .attr("height", height);
    
    var link = svg.selectAll(".link");
    var node = svg.selectAll(".node");
    
    // Make a linear scale for the x-postion
    var initialScaleData = [];

    for(var i = 0; i < data.tweets.length; i++) {
        initialScaleData[i] = data.tweets[i].created_at_numeric;
    }

    var linearScale = d3.scale.linear()
      .domain([d3.min(initialScaleData), d3.max(initialScaleData)])
      .range([padding, width - padding])
    
    var xAxis = d3.svg.axis()
      .scale(linearScale)
      .orient("bottom")
      .ticks(10)
      .tickFormat(function(d) { var date = new Date(d*1000); return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay(); });  
    
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(xAxis);
    
    
    // console.log("data.tweets.length: " + data.tweets.length);

    force
      .nodes(data.tweets)
      .links(data.edges)
      .start();

  link = link.data(data.edges)
             .enter().append("line")
             .attr("class", "link");

  node = node.data(data.tweets)
             .enter().append("circle")
                .attr("class", "node")
                .attr("cx", function(d) { x = linearScale(d.created_at_numeric); console.log(x); return x; })
                // .attr("cy", function(d) { return height / 2; } )
                .attr("r", function(d) { return 12; })
                .on("click", nodeClick);

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cy", function(d) { return d.y; });
    // .attr("cx", function(d) { return d.x; })
  }

  function nodeClick(d) {

    d3.selectAll(".node").classed('selected', false);
    d3.select(this).classed('selected', true);

    // Get the specific tweet data
    d3.json(d.url, function(error, json) {
      $("#tweet-details").text(json.created_at)
      // $("#created-at").text(json.created_at)
    });
  }

}

$(function() {
    $( "#slider" ).slider({
      range: "min",
      value: 38,
      min: 1,
      max: 700,
      slide: function(event, ui){
        $("#amount").val("$" + ui.value);
      }
    });
    $("#amount").val("$"+$("#slider-range-min").slider("value"));
});
