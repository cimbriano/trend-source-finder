var data;
var currentdata;
var radius = 8;
var scaledvalue_start = 1;
var scaledvalue = 100;
var singleton = -1;
var reply = -1;
var nodevisible = [];
d3.json("/graph.json", function(error, json){
        if(error) return console.warn(error);
        data = json;
        currentdata = jQuery.extend(true, {}, data);
        for(var i = 0; i < currentdata.tweets.length; i++){
        nodevisible[i] = radius;
        }
        // alert(currentdata.users.length);
        visualizeit();
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


function check_tweettype(){
    if($('input[name=tweet-group]:radio:checked').val()=='reply'){
        reply = 1;
        nodevisibility();
    }
    else if($('input[name=tweet-group]:radio:checked').val()=='retweet'){
        reply = 0;
        nodevisibility();
    }
}

$(function() {//reply-retweet
  $("#tweettype").removeAttr('checked');
  $("#reply").attr("disabled",true);
  $("#retweet").attr("disabled",true);
  $('#tweettype').click(function (){
                        if ($(this).is (':checked')){
                        $("#search-box").attr("disabled", true);
                        $("#reply").removeAttr("disabled");
                        $("#retweet").removeAttr("disabled");
                        check_tweettype();
                        }else{
                        if(singleton == -1) {
                        $("#search-box").attr("disabled", false);
                        }
                        reply = -1;
                        nodevisibility();
                        $("#reply").attr("disabled",true);
                        $("#retweet").attr("disabled",true);
                        currentdata = jQuery.extend(true, {}, data);
                        }
                        visualizeit();
                        });
  
  $(".tweet-group").click(function(){
                          check_tweettype();
                          visualizeit();
                          });
  });

function check_actiontype(){
    if($('input[name=action-group]:radio:checked').val()=='show'){
        singleton = 0;
        nodevisibility();
    }
    else if($('input[name=action-group]:radio:checked').val()=='hide'){
        singleton = 1;
        nodevisibility();
    }
}

$(function() { //show-hide edges
  $("#nodetype").removeAttr('checked');
  $("#show").attr("disabled",true);
  $("#hide").attr("disabled",true);
  $('#nodetype').click(function (){
                       if ($(this).is (':checked')){
                       $("#search-box").attr("disabled", true);
                       $("#show").removeAttr("disabled");
                       $("#hide").removeAttr("disabled");
                       check_actiontype();
                       }else{
                       if(reply == -1) {
                       $("#search-box").attr("disabled", false);
                       }
                       singleton = -1;
                       nodevisibility();
                       $("#show").attr("disabled",true);
                       $("#hide").attr("disabled",true);
                       currentdata = jQuery.extend(true, {}, data);
                       }
                       visualizeit();
                       });
  
  $(".action-group").click(function(){
                           check_actiontype();
                           visualizeit();
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

function check_reply(d){
    if(reply==-1){
        nodevisible[d.id-1] = radius;
        return radius;
    }
    if(reply==1){
        if(d.in_reply_chain == 1){
            nodevisible[d.id-1] = radius;
            return radius;
        }else {
            nodevisible[d.id-1] = 0;
            return 0;
        }
    }
    if(reply==0){
        if(d.in_retweet_chain == 1){
            nodevisible[d.id-1] = radius;
            return radius;
        }else {
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

$(function() {
  $("#search-box").keyup(function(){
                         //alert($(this).val());
                         //alert("salam");
                         var val = $(this).val();
                         if(reply != -1 || singleton != -1) {
                         return;
                         }
                         if(val == "") {
                         for(var i = 0; i < currentdata.tweets.length; i++) {
                         nodevisible[i] = radius;
                         }
                         }
                         else {
                         for(var i = 0; i < currentdata.tweets.length; i++) {
                         var id = i;//currentdata.tweets[i].id;
                         //console.log(i);
                         d3.json(currentdata.tweets[i].url, function(error, json){
                                 nodevisible[json.id - 1] = 0;
                                 //console.log(val + " " + json.user.user_name);
                                 if(val == json.user.user_name) {
                                 //alert(id);
                                 //console.log("found at: " + json.id);
                                 nodevisible[json.id - 1] = radius;
                                 }
                                 }
                                 )
                         
                         }
                         }
                         visualizeit();
                         });
  });

function visualizeit(){
    d3.select("svg").remove();
    var width = $('#paneCenter').width();
    var height = $('#paneCenter').height()-120;
    var padding = 20;

    var color = d3.scale.category10()
                  .domain(d3.range(4))
    
    var force = d3.layout.force()
    .size([width, height])
    // .charge(-20)
    .linkDistance(40)
    .on("tick", tick);
    
    var svg = d3.select("#canvas").append("svg")
    .attr("width", width)
    .attr("height", height+80);
    
    var link = svg.selectAll(".link");
    var node = svg.selectAll(".node");
    
    // Make a linear scale for the x-postion
    var initialScaleData = [];
    var stringDate = [];
    var parent = [];
    var mark = [];
    var a = new Array(currentdata.tweets.length);
    var sortable = [];
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
        a[currentdata.edges[i].child_id] = [];
        path[currentdata.edges[i].parent_id] = [];
        path[currentdata.edges[i].child_id] = [];
        parent[currentdata.edges[i].parent_id] = -1;
    }
    for(var i = 0; i < currentdata.edges.length; i++) {
        parent[currentdata.edges[i].child_id] = currentdata.edges[i].parent_id;
        a[currentdata.edges[i].parent_id].push(currentdata.edges[i].child_id);
    }

    for(var i = 0; i < currentdata.tweets.length; i++) {
        //console.log(a[i].length);
        sortable.push([i, a[currentdata.tweets[i].id].length]);
    }
    sortable.sort(function(a, b) {return b[1] - a[1];});
    
    
    d3.json(currentdata.tweets[sortable[0][0]].url, function(error, json){
           // $("#user-details-name").text(json.user.user_name);
            //alert(json.user.user_name + " " + sortable[0][1]);

            
    }
            );
    
        //for(var i = 0; i < currentdata.tweets.length; i++) {
     //   console.log(sortable[i][0] + " " + sortable[i][1]);
    //}
    
    //console.log(sortable[0][0] + " " + sortable[0][1]);
    //console.log(sortable[1][0] + " " + sortable[1][1]);
    
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
    .range([padding, (width - padding)]);
    
    var linearScaleY = d3.scale.linear()
    .domain([d3.min(initialScaleData), d3.max(initialScaleData)])
    .range([padding, (width - padding)]);
    
    var minDate = new Date(stringDate[initialScaleData.indexOf(d3.min(initialScaleData))]),
    maxDate = new Date(stringDate[initialScaleData.indexOf(d3.max(initialScaleData))]);
    
    var timeScale = d3.time.scale()
    .domain([minDate,maxDate])
    .range([padding, (width - padding)]);
    
    var xAxis = d3.svg.axis()
    .scale(timeScale)
    .orient("bottom")
    .ticks(5)
    .tickFormat(d3.time.format("%x"));
    
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);
    

    // histogram of volume
    var values = initialScaleData.map(function(d){return d*1000;});

    var context_height = 30, axis_height = 20;
    var all_height = height+context_height+axis_height+axis_height;

    var minDate_raw = d3.min(values), maxDate_raw = d3.max(values);


    var parseDate = d3.time.format('%Y-%m-%dT%H:%M:%S.000Z').parse;


    var focus_x = d3.scale.linear()
        .domain([minDate_raw, maxDate_raw])
        .range([padding, width - padding]);


    var context_x = d3.scale.linear()
        .domain(focus_x.domain())
        .range(focus_x.range());


    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(focus_x.ticks(100))
        (values);


    var brush = d3.svg.brush()
        .x(context_x)
        .on("brush", brushed);

    var context_y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([context_height, 0]);

    var hist = data;
    var context_area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return context_x(d.x); })
        .y0(context_height)
        .y1(function(d) { return context_y(d.y); });

    var context = svg.append("g")
        .attr("height", 20)
        .attr("transform", "translate(" + 0 + "," + height + ")");


      context.append("path")
          .datum(hist)
          .attr("d", context_area)
          .attr('class', 'histogram');



      context.append("g")
          .attr("class", "x brush")
          .call(brush)
        .selectAll("rect")
          .attr("y", -6)
          .attr("height", context_height + 7);

    var context_xAxis = d3.svg.axis()
        .scale(d3.time.scale().domain([new Date(context_x.domain()[0]),new Date(context_x.domain()[1])]).range([padding, width - padding]))
        .orient("bottom")
        .ticks(5)
        .tickFormat(d3.time.format("%x"));
      
    // context axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + context_height) + ")")
        .call(context_xAxis);


    // y brush
    var ybrush_scale = d3.scale.linear().domain([0,height]).range([(2 * padding), height - (2 * padding)]);
    var ybrush = d3.svg.brush()
        .y(ybrush_scale)
        .on("brush", ybrushed);

    var yAxis = d3.svg.axis()
                .scale(d3.scale.linear().domain([1,10]).range([(2 * padding) ,height - (2 * padding)]))
                .orient("left")
                .tickFormat('');

    var yAxis_region = svg.append("g")
        .attr("class", "y axis")
        .attr("transform","translate(20,0)")
        .call(yAxis);

    yAxis_region.append("g")
        .attr("class", "y brush")
        .call(ybrush)
      .selectAll("rect")
        .attr("x", -6)
        .attr("width", 20);


    var newLinearScale = linearScale;
    drawGraph(newLinearScale,ybrush_scale);
    force.start();

    function brushed() {
      focus_x.domain(brush.empty() ? context_x.domain() : brush.extent());
      xAxis = d3.svg.axis()
        .scale(d3.time.scale().domain([new Date(focus_x.domain()[0]),new Date(focus_x.domain()[1])]).range([padding, width - padding]))
        .orient("bottom");
      svg.select(".axis").call(xAxis);
      newLinearScale = d3.scale.linear().domain([focus_x.domain()[0]/1000,focus_x.domain()[1]/1000]).range([padding, width - padding]);

      force.start();
    }

    function ybrushed() {
        xAxis = d3.svg.axis()
          .scale(d3.time.scale().domain([new Date(focus_x.domain()[0]),new Date(focus_x.domain()[1])]).range([padding, width - padding]))
          .orient("bottom");
        svg.select(".axis").call(xAxis);
        newLinearScale = d3.scale.linear().domain([focus_x.domain()[0]/1000,focus_x.domain()[1]/1000]).range([padding, width - padding]);
        ybrush_scale = d3.scale.linear().domain(ybrush.empty()?[0,height]:ybrush.extent()).range([0,height]);

        force.start();
    }


    // end of histogram

    function drawGraph(newLinearScale,ybrush_scale) {

    force
    .theta(10)  // Removes "jiggle"
    .nodes(currentdata.tweets)
    .links(currentdata.edges)
    
    link = link.data(currentdata.edges)
    .enter().append("line")
    .attr("class", "link")
    .on('mouseover', function(d, i){ return 'link test'; });
    
    node = node.data(currentdata.tweets);
    
    node.attr("r", function(d) {
              //return get_radius(d);
              return nodevisible[d.id-1]});
    
    node = node.enter().append("circle")
    .attr("id", function(d){ return d.id; })
    .attr("class", function (d) {
      classes = 'node'
      classes += ' ' + d.user_name;
      classes += ' n' + d.twitter_id;
      classes += d.in_reply_chain ? ' reply' : '';
      classes += d.in_retweet_chain ? ' retweet' : '';
      return classes
    })
    //.attr("class", function(d){ return d.id; })
    .attr("cx", function(d) { x = newLinearScale(d.created_at_numeric); return x; })
    .attr("cy", function(d) { y = ybrush_scale(d.y); return y; } )
    .attr("r", function(d) {
          //return get_radius(d);
          return nodevisible[d.id-1];
          })
    .style('fill', function(d) {return color(d.type); } )
    .on('mouseover', mouseover_node)
    .on("click", nodeClick);



  }
    
    function mouseover_node(d){
        d3.selectAll(".node").classed('hovered', false);
        d3.select(this).classed('hovered', true);
        
        d3.select(this).append("title")
        .text(d.id);
    }
    
    function tick() {
        node.attr("cx", function(d) {return newLinearScale(d.created_at_numeric);})
        node.attr("cy", function(d) { return ybrush_scale(d.y); });
        
        if(singleton==1){
            return;
        }
        
        
        link.attr("x1", function(d) {
                  if(nodevisible[d.parent_id-1]==0 || nodevisible[d.child_id-1]==0){
                  return 0;
                  }
                  return newLinearScale(d.source.created_at_numeric); })
        .attr("y1", function(d) {
              if(nodevisible[d.parent_id-1]==0 || nodevisible[d.child_id-1]==0){
              return 0;
              }
              return ybrush_scale(d.source.y); })
        .attr("x2", function(d) {
              if(nodevisible[d.parent_id-1]==0 || nodevisible[d.child_id-1]==0){
              return 0;
              }
              return newLinearScale(d.target.created_at_numeric); })
        .attr("y2", function(d) {
              if(nodevisible[d.parent_id-1]==0 || nodevisible[d.child_id-1]==0){
              return 0;
              }
              return ybrush_scale(d.target.y); });
        // .attr("cx", function(d) { return d.x; })
    }
    
    
    function nodeClick(d, i) {
        d3.selectAll(".node").classed('selected', false);
        var x = d3.select(this);
        var id = x.attr("id");
        for(var i=0;i<path[id].length;i++) {
            mark[path[id][i]] = 1;
        }
        /*var x = d3.select(this);
         var x = d3.select(this);
         dfs(x.attr("id"));
         var y = x.attr("id");
         while(y != -1){
         mark[y] = 1;
         y = parent[y];
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
                $("#user-details-name").text(json.user.user_name);
                $("#user-details-followers").text(json.user.followers);
                $("#user-details-friends").text(json.user.friends);
                $("#user-details-location").text(json.user.location);
                $("#user-details-description").text(json.user.description);
                $("#tweet-details-text").text(json.text);
                //alert(json.user.user_name);
                
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
                
                $('#tweet-details-in-reply-chain').text(json.in_reply_chain);
                $('#tweet-details-in-retweet-chain').text(json.in_retweet_chain)
                });
    }
}
