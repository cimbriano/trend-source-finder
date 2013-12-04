var data;
var currentdata;
var scaledvalue = 100;
var singleton = -1;
d3.json("/graph.json", function(error, json){
  if(error) return console.warn(error);
  data = json;
  currentdata = jQuery.extend(true, {}, data);
  visualizeit(100);
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
       max: 100,
       step: 1,
       values: [ 100],
       slide: function( event, ui ) {
           $('#slider-value').text(ui.values[ 0 ]);
           scaledvalue = ui.values[0];
           visualizeit(ui.values[0]);
       },
       //stop: function(event, ui) {
       //    visualizeit(ui.values[0]);
       //}
    });
    $('#slider-value').text(1);
});

function check_actiontype(){	
	if($('input[name=action-group]:radio:checked').val()=='show'){
		singleton = 1;
	}
	else if($('input[name=action-group]:radio:checked').val()=='hide'){
		singleton = 0;
	}
}

$(function() {
	$("#nodetype").removeAttr('checked');
	$("#show").attr("disabled",true);
	$("#hide").attr("disabled",true);
	$('#nodetype').click(function (){
		if ($(this).is (':checked')){
			$("#show").removeAttr("disabled");
			$("#hide").removeAttr("disabled");
			check_actiontype();
		}else{
		  singleton = -1;
			$("#show").attr("disabled",true);
			$("#hide").attr("disabled",true);
			currentdata = jQuery.extend(true, {}, data);
		}
		visualizeit(scaledvalue);
	});
	
	$(".action-group").click(function(){
    	check_actiontype();
    	visualizeit(scaledvalue);
   });
});

function get_nodetype(d){
  var tweetid = d.id;
  var found = 0;
  for(var j = 0; j < data.edges.length; j++) {
    if(data.edges[j].parent_id==tweetid | data.edges[j].child_id==tweetid){
      found = 1;
      break;
    }
  }
  if(found==0){
    return 's';
  }
  else{
    return 'ns';
  }
}

function get_radius(d){
  if(singleton==-1){
    return 12;
  }
  if(singleton==1){
    if(get_nodetype(d)=='s'){
      return 12;
    }else{
      return 0;
    }
  }
  if(singleton==0){
    if(get_nodetype(d)=='ns'){
      return 12;
    }else{
      return 0;
    }
  }
}

//upToTime show time scale from 0 to 100. If 100, will show 100% time scale.
function visualizeit(upToTime){
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
  for(var i = 0; i < currentdata.tweets.length; i++) {
      initialScaleData[i] = currentdata.tweets[i].created_at_numeric;
      stringDate[i] = currentdata.tweets[i].created_at;
  }

  var linearScale = d3.scale.linear()
    .domain([d3.min(initialScaleData), d3.max(initialScaleData)])
    .range([padding, 100/upToTime*(width - padding)]);

  function getDate(d){return new Date(d.jsonDate);}

  var minDate = new Date(stringDate[initialScaleData.indexOf(d3.min(initialScaleData))]),
      maxDate = new Date(stringDate[initialScaleData.indexOf(d3.max(initialScaleData))]);

  var timeScale = d3.time.scale()
                .domain([minDate,maxDate])
                .range([padding, 100/upToTime*(width - padding)]);
  
  var xAxis = d3.svg.axis()
    .scale(timeScale)
    .orient("bottom")
    .tickFormat(d3.time.format("%b-%d"));  
  
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);
  
  force
    .theta(10)  // Removes "jiggle"
    .nodes(currentdata.tweets)
    .links(currentdata.edges)
    .start();

  link = link.data(currentdata.edges)
             .enter().append("line")
             .attr("class", "link");

  node = node.data(currentdata.tweets);
             
  node = node.enter().append("circle")
                .attr("class", "node")
                .attr("cx", function(d) { x = linearScale(d.created_at_numeric); return x; })
                // .attr("cy", function(d) { return height / 2; } )
                .attr("r", function(d) { return get_radius(d); })
                .on("click", nodeClick);

  function tick() {
    node.attr("cy", function(d) { return d.y; });
    
    if(singleton==1){
      return;
    }
    link.attr("x1", function(d) { return linearScale(d.source.created_at_numeric); })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return linearScale(d.target.created_at_numeric); })
        .attr("y2", function(d) { return d.target.y; });
    // .attr("cx", function(d) { return d.x; })
  }

  function nodeClick(d) {
    d3.selectAll(".node").classed('selected', false);
    d3.select(this).classed('selected', true);

    // Get the specific tweet data
    d3.json(d.url, function(error, json){
      $("#text").text(json.text);

      var date = d3.time.format('%Y-%m-%dT%H:%M:%S.000Z').parse(json.created_at);
      $("#day").text(d3.time.format('%a %b-%d, %Y')(new Date(date)));
      $("#time").text(d3.time.format('%I:%M:%S %p')(new Date(date)));

      $("#replyid").text(json.in_reply_to_status_str);

      if(json.retweeted_id==null){
      	$("#retweet").text('Yes');
      }else{
      	$("#retweet").text('No');
      }
      $("#tweetid").text(json.id);
    });
  }
}
