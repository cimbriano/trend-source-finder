var data;

d3.json("/graph.json", function(error, json){
  if(error) return console.warn(error);
  data = json;
  visualizeit();
});

$(function () {
	$('body').layout({ 
		applyDemoStyles: true,
		east__size:    250,
	    east__minSize: 250,
	    east__initClosed: false,
	    east__resizable: true,
	    east__initHidden: false,
	    center__initClosed: false,
	    center__resizable: true,
	    center__initHidden: false,
	    //south__initHidden: false,
	    center__onresize:		$.layout.callbacks.resizePaneAccordions,
		center__paneSelector: "#paneCenter",
		west__paneSelector: "#paneWest",
		north__paneSelector: "#paneNorth",
		east__paneSelector: "#paneEast",
		south__paneSelector: "#paneSouth"
	});
	
});

$(function() {
  $( "#slider" ).slider({
       range: false,
       min: 1,
       max: 24,
       step: 1,
       values: [ 1],
       slide: function( event, ui ) {
           $('#slider-value').text(ui.values[ 0 ]);
       },
       stop: function(event, ui) {
           visualizeit();
       }
    });
    $('#slider-value').text(1);
});

function visualizeit(){
	d3.select("svg").remove();
	var width = $('#paneCenter').width();
  	var height = $('#paneCenter').height()-120;
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
    var stringDate = [];
    for(var i = 0; i < data.tweets.length; i++) {
        initialScaleData[i] = data.tweets[i].created_at_numeric;
        stringDate[i] = data.tweets[i].created_at;
    }

    var linearScale = d3.scale.linear()
      .domain([d3.min(initialScaleData), d3.max(initialScaleData)])
      .range([padding, width - padding]);

    function getDate(d){return new Date(d.jsonDate);}


    var minDate = new Date(stringDate[initialScaleData.indexOf(d3.min(initialScaleData))]),
        maxDate = new Date(stringDate[initialScaleData.indexOf(d3.max(initialScaleData))]);

    var timeScale = d3.time.scale()
                  .domain([minDate,maxDate])
                  .range([padding, width - padding]);
    
    var xAxis = d3.svg.axis()
      .scale(timeScale)
      .orient("bottom")
      .tickFormat(d3.time.format("%Y-%m-%d"));  
    
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
                .attr("cx", function(d) { x = linearScale(d.created_at_numeric); return x; })
                // .attr("cy", function(d) { return height / 2; } )
                .attr("r", function(d) { return 12; })
                .on("click", nodeClick);


  function tick() {
    link.attr("x1", function(d) { return linearScale(d.source.created_at_numeric); })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return linearScale(d.target.created_at_numeric); })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cy", function(d) { return d.y; });
    // .attr("cx", function(d) { return d.x; })
  }

  function nodeClick(d) {

    d3.selectAll(".node").classed('selected', false);
    d3.select(this).classed('selected', true);

    // Get the specific tweet data
    d3.json(d.url, function(error, json) {
      $("#tweet-details").text(json.created_at);
      // $("#created-at").text(json.created_at)
    });
  }

}
