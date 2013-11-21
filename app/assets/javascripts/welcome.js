var edges;

d3.json("/edges.json", function(error, json){
	if(error) return console.warn(error);
	edges = json;
	visualizeit();
});



function visualizeit(){
	
	$("#slider").slider();
    var width = 600;
    var svgContainer = d3.select(".container").append("svg")
                                       .attr("width", width)
                                       .attr("height", 200);

  var isNodeInGraph = {};

  for (var i=0;i<edges.length;i++)
  {
    isNodeInGraph[edges[i].child_id] = 0;
    isNodeInGraph[edges[i].parent_id] = 0;
  }

    var linearScale = d3.scale.linear()
                    .domain([d3.min(initialScaleData),d3.max(initialScaleData)])
                    .range([0,width]);


    var circleAttributes = circles
                         .attr("cx", function(d){return linearScale(parseInt(d.created_at_numeric))})
                         .attr("cy", function(d){return 100})
                         .attr("r", function (d) { return d.id+10; })
                         .style("fill", function(d) {
                         	return "purple";
                         });

    var textLabels = text
                    .attr("x", function(d){return linearScale(parseInt(d.created_at_numeric))})
                    .attr("y", function(d){return d.id*10})
                    .text(function(d){return "CreatedAt: "+d.created_at+"\n scaled: "+linearScale(parseInt(d.created_at_numeric));})
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "10px")
                    .attr("fill","red");


  var G = jsnx.DiGraph();

  for(var i=0;i<edges.length;i++)
  {
    child_id = edges[i].child_id;
    parent_id = edges[i].parent_id;
    if (isNodeInGraph[child_id] == 0)//node is not in graph yet
    {
      G.add_nodes_from([child_id],{color:'#0064C7'});
      isNodeInGraph[child_id] = 1;
    }
    if (isNodeInGraph[parent_id] == 0)//node is not in graph yet
    {
      G.add_nodes_from([parent_id],{color:'#0064C7'});
      isNodeInGraph[parent_id] = 1;
    }
    G.add_edge(parent_id,child_id);
   
  }

   jsnx.draw(G, {
      element: '#canvas', 
      with_labels: true, 
      node_style: {
          fill: function(d) { 
              return d.data.color; 
          }
      }, 
      label_style: {fill: 'red' }
  });

}

 $(function() {
    $( "#slider-range" ).slider({
      orientation: "horizontal",
      range: true,
      values: [ 17, 67 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
  });
