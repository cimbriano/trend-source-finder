var data;
var currentdata;
var radius = 5;
var scaledvalue_start = 1;
var scaledvalue = 100;
var singleton = -1;
var reply = -1;
var edgevisible = [];
var nodevisible = [];
d3.json("/graph.json", function(error, json){
  if(error) return console.warn(error);
  data = json;
  currentdata = jQuery.extend(true, {}, data);
  for(var i = 0; i < currentdata.tweets.length; i++){
    nodevisible[i] = radius;
  }
  for(var i = 0; i < currentdata.edges.length; i++){
    edgevisible[i] = 1;
  }
  visualizeit(1, 100);
});

$(function () { //body layout
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
      center__onresize:   $.layout.callbacks.resizePaneAccordions,
    center__paneSelector: "#paneCenter",
    west__paneSelector: "#paneWest",
    north__paneSelector: "#paneNorth",
    east__paneSelector: "#paneEast",
    south__paneSelector: "#paneSouth"
  });
  
});

$(function() {//slider
  $( "#slider" ).slider({
       range: true,
       min: 1,
       max: 100,
       step: 1,
       values: [ 1, 100],
       slide: function( event, ui ) {
           $('#slider-value').text(ui.values[ 0 ] + " to " + ui.values[ 1 ]);
           scaledvalue_start = ui.values[0];
           scaledvalue = ui.values[1];
           visualizeit(ui.values[0], ui.values[1]);
       },
       //stop: function(event, ui) {
       //    visualizeit(ui.values[0]);
       //}
    });
    $('#slider-value').text(1);
});

function check_tweettype(){
  if($('input[name=tweet-group]:radio:checked').val()=='reply'){
    reply = 1;
    nodevisibility();
    edgevisibility();
  }
  else if($('input[name=tweet-group]:radio:checked').val()=='retweet'){
    reply = 0;
    nodevisibility();
    edgevisibility();
  }
}

$(function() {//reply-retweet
  $("#tweettype").removeAttr('checked');
  $("#reply").attr("disabled",true);
  $("#retweet").attr("disabled",true);
  $('#tweettype').click(function (){
    if ($(this).is (':checked')){
      $("#reply").removeAttr("disabled");
      $("#retweet").removeAttr("disabled");
      check_tweettype();
    }else{
      reply = -1;
      nodevisibility();
      edgevisibility();
      $("#reply").attr("disabled",true);
      $("#retweet").attr("disabled",true);
      currentdata = jQuery.extend(true, {}, data);
    }
    visualizeit(scaledvalue_start, scaledvalue);
  });
  
  $(".tweet-group").click(function(){
      check_tweettype();
      visualizeit(scaledvalue_start, scaledvalue);
   });
});

function check_actiontype(){
  if($('input[name=action-group]:radio:checked').val()=='show'){
    singleton = 0;
    nodevisibility();
    edgevisibility();
  }
  else if($('input[name=action-group]:radio:checked').val()=='hide'){
    singleton = 1;
    nodevisibility();
    edgevisibility();
  }
}

$(function() { //show-hide edges
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
      nodevisibility();
      edgevisibility();
      $("#show").attr("disabled",true);
      $("#hide").attr("disabled",true);
      currentdata = jQuery.extend(true, {}, data);
    }
    visualizeit(scaledvalue_start, scaledvalue);
  });

  $(".action-group").click(function(){
      check_actiontype();
      visualizeit(scaledvalue_start, scaledvalue);
   });
});

function edgevisibility(){
  for(var j = 0; j < data.edges.length; j++) {
    if(nodevisible[data.edges[j].parent_id-1]==0 | nodevisible[data.edges[j].child_id-1]==0){
      edgevisible[j] = 0;
    }else{
      edgevisible[j] = 1;
    }
  }
}

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

function check_reply(d){
  if(reply==-1){
    nodevisible[d.id-1] = radius;
    return radius;
  }
  if(reply==1){
    if(d.in_reply_to_status_str!=null){
      nodevisible[d.id-1] = radius;
      return radius;
    }else{
      nodevisible[d.id-1] = 0;
      return 0;
    }
  }
  if(reply==0){
    if(d.retweeted_id!=null){
      nodevisible[d.id-1] = radius;
      return radius;
    }else{
      nodevisible[d.id-1] = 0;
      return 0;
    }
  }
}

function nodevisibility(){
  for(var i = 0; i < currentdata.tweets.length; i++){
    if(singleton==-1){
      check_reply(currentdata.tweets[i]);
    }
    if(singleton==0){
      if(get_nodetype(currentdata.tweets[i])=='ns'){
        check_reply(currentdata.tweets[i]);
      }else{
        nodevisible[currentdata.tweets[i].id-1] = 0;
      }
    }
    if(singleton==1){
      if(get_nodetype(currentdata.tweets[i])=='s'){
        check_reply(currentdata.tweets[i]);
      }else{
        nodevisible[currentdata.tweets[i].id-1] = 0;
      }
    }
  }
}

function get_radius(d){
  if(singleton==-1){
    return check_reply(d);
  }
  if(singleton==0){
    if(get_nodetype(d)=='ns'){
      return check_reply(d);
    }else{
      nodevisible[d.id-1] = 0;
      return 0;
    }
  }
  if(singleton==1){
    if(get_nodetype(d)=='s'){
      return check_reply(d);
    }else{
      nodevisible[d.id-1] = 0;
      return 0;
    }
  }
}

//upToTime show time scale from 0 to 100. If 100, will show 100% time scale.
function visualizeit(fromTime, upToTime){
  d3.select("svg").remove();
  var width = $('#paneCenter').width();
  var height = $('#paneCenter').height()-120;
  var padding = 20;
  
  var force = d3.layout.force()
    .size([width, height])
    // .charge(-20)
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
    var parent = [];
    var mark = [];
    var a = new Array(currentdata.tweets.length);
    var path = new Array(currentdata.tweets.length);
    
  for(var i = 0; i < currentdata.tweets.length; i++) {
      initialScaleData[i] = currentdata.tweets[i].created_at_numeric;
      stringDate[i] = currentdata.tweets[i].created_at;
      a[i] = [];
      parent[i] = -1;
      mark[i] = 0;
      path[i] = [];
  }

    for(var i = 0; i < currentdata.edges.length; i++) {
        a[currentdata.edges[i].parent_id] = [];
        path[currentdata.edges[i].parent_id] = [];
        path[currentdata.edges[i].child_id] = [];
        parent[currentdata.edges[i].parent_id] = -1;
    }
    for(var i = 0; i < currentdata.edges.length; i++) {
        parent[currentdata.edges[i].child_id] = currentdata.edges[i].parent_id;
        a[currentdata.edges[i].parent_id].push(currentdata.edges[i].child_id);
    }
    
    function dfs(x) {
        mark[x] = 1;
        for(var i = 0;i<a[x].length;i++) {
            if(mark[a[x][i]] == 0) {
                dfs(a[x][i]);
            }
        }
        
    }
    
    for(var i = 0; i < currentdata.tweets.length; i++) {
        var y = i;
        //alert(i);
        while(y != -1){
            mark[y] = 1;
            y = parent[y];
        }
        dfs(i);
        for(var j=0;j<currentdata.tweets.length; j++) {
            if(mark[j] == 1){
                path[i].push(j);
                mark[j] = 0;
            }
        }
    }

  var linearScale = d3.scale.linear()
    .domain([d3.min(initialScaleData), d3.max(initialScaleData)])
    //.range([padding, (width - padding)]);
    .range([padding - (fromTime/100)*(width), (100/upToTime)*(width - padding)]);
    
    var linearScaleY = d3.scale.linear()
    .domain([d3.min(initialScaleData), d3.max(initialScaleData)])
    //.range([padding, (width - padding)]);
    .range([padding - (fromTime/100)*(width), (100/upToTime)*(width - padding)]);

  function getDate(d){return new Date(d.jsonDate);}

  var minDate = new Date(stringDate[initialScaleData.indexOf(d3.min(initialScaleData))]),
      maxDate = new Date(stringDate[initialScaleData.indexOf(d3.max(initialScaleData))]);

  var timeScale = d3.time.scale()
                .domain([minDate,maxDate])
                //.range([padding, (width - padding)]);
                .range([padding - (fromTime/100)*(width), (100/upToTime)*(width - padding)]);
  
  var xAxis = d3.svg.axis()
    .scale(timeScale)
    .orient("bottom")
    .ticks(5)
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
             .attr("class", "link")
             .on('mouseover', function(d, i){ return 'link test'; });

  node = node.data(currentdata.tweets);
             
  node = node.enter().append("circle")
                .attr("id", function(d){ return d.id; })
                .attr("class", "node")
                //.attr("class", function(d){ return d.id; })
                .attr("cx", function(d) { x = linearScale(d.created_at_numeric); return x; })
                // .attr("cy", function(d) { return height / 2; } )
                .attr("r", function(d) { 
                  //return get_radius(d); 
                  return nodevisible[d.id-1];
                  })
                .on('mouseover', mouseover_node)
                .on("click", nodeClick);

  function mouseover_node(d){
    d3.selectAll(".node").classed('hovered', false);
    d3.select(this).classed('hovered', true);
    
    d3.select(this).append("title")
          .text(d.id);
  }

  function tick() {
      node.attr("cy", function(d) { return d.y; });
    
    if(singleton==1){
      return;
    }
    
      link.attr("x1", function(d) {
                if(nodevisible[d.parent_id-1]==0 || nodevisible[d.child_id-1]==0){
                return 0;
                }
                return linearScale(d.source.created_at_numeric); })
      .attr("y1", function(d) {
            if(nodevisible[d.parent_id-1]==0 || nodevisible[d.child_id-1]==0){
            return 0;
            }
            return d.source.y; })
      .attr("x2", function(d) {
            if(nodevisible[d.parent_id-1]==0 || nodevisible[d.child_id-1]==0){
            return 0;
            }
            return linearScale(d.target.created_at_numeric); })
      .attr("y2", function(d) {
            if(nodevisible[d.parent_id-1]==0 || nodevisible[d.child_id-1]==0){
            return 0;
            }
            return d.target.y; });    // .attr("cx", function(d) { return d.x; })
  }
    
    function dfs(x) {
        mark[x] = 1;
        for(var i = 0;i<a[x].length;i++) {
            if(mark[a[x][i]] == 0) {
                dfs(a[x][i]);
            }
        }
        
    }

  function nodeClick(d, i) {
    d3.selectAll(".node").classed('selected', false);
      var x = d3.select(this);
      var id = x.attr("id");
      for(var i=0;i<path[id].length;i++) {
          mark[path[id][i]] = 1;
      }
      /*dfs(x.attr("id"));
       var y = x.attr("id");
       while(y != -1){
       mark[y] = 1;
       y = parent[y];
       }*/
      d3.selectAll(".node").sort(function (a, b) { // select the parent and sort the path's
                                 if(mark[a.id]) {
                                 return 1;
                                 }
                                 else {
                                 return -1;
                                 }
                                 });
      
      /*for(var i=0;i<currentdata.tweets.length;i++) {
       if(mark[i] == 1){
       d3.select("[id='" + i + "']")
       .classed('selected', true);
       // .sort(function (a, b) {return 10;});
       }
       mark[i] = 0;
       }*/
      for(var i=0;i<path[id].length;i++) {
          d3.select("[id='" + path[id][i] + "']")
          .classed('selected', true);
          mark[path[id][i]] = 0;
      }
      
    d3.select(this).classed('selected', true).sort(function (a, b) {return 10;});
      
     

    // Get the specific tweet data
    d3.json(d.url, function(error, json){
      $("#tweet-details-text").text(json.text);

      var date = d3.time.format('%Y-%m-%dT%H:%M:%S.000Z').parse(json.created_at);
      $("#tweet-details-day").text(d3.time.format('%a %b-%d, %Y')(new Date(date)));
      $("#tweet-details-time").text(d3.time.format('%I:%M:%S %p')(new Date(date)));

      if(json.in_reply_to_status_str==null){
        $("#tweet-details-replyto-id").text('None');
      }else{
        $("#tweet-details-replyto-id").text(json.in_reply_to_status_str);
      }

      if(json.retweeted_id==null){
        $("#tweet-details-retweet").text('No');
      }else{
        $("#tweet-details-retweet").text('Yes');
      }

      $("#tweet-details-id").text(json.id);
    });
  }
}
