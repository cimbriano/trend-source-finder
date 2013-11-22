var data;

d3.json("/tweets.json", function(error, json){
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

  // var link = svg.selectAll(".link");
  var node = svg.selectAll(".node");

  // Make a linear scale for the x-postion
  var initialScaleData = [];
  for(var i = 0; i < data.length; i++) {
    initialScaleData[i] = data[i].created_at_numeric;
  }

  var linearScale = d3.scale.linear()
                      .domain([d3.min(initialScaleData), d3.max(initialScaleData)])
                      .range([padding, width - padding])


  force
    .nodes(data)
    // .links(graph.links)
    .start();

  // link = 

  node = node.data(data)
             .enter().append("circle")
                .attr("class", "node")
                .attr("cx", function(d) { x = linearScale(d.created_at_numeric); console.log(x); return x; })
                // .attr("cy", function(d) { return height / 2; } )
                .attr("r", function(d) { return 12; })
                .on("click", nodeClick);

  function tick() {
    // link.attr("x1", function(d) { return d.source.x; })
    //     .attr("y1", function(d) { return d.source.y; })
    //     .attr("x2", function(d) { return d.target.x; })
    //     .attr("y2", function(d) { return d.target.y; });

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
  $( "#slider" ).slider();
});
