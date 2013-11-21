var tweets;

d3.json("/tweets.json", function(error, json){
	if(error) return console.warn(error);
	tweets = json;
	visualizeit();
});



////= require jquery_ui
//*= require jquery.ui.slider
//<%link{:href => "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.8/themes/ui-lightness/jquery-ui.css", :rel => "stylesheet", :type => "text/css"}>
function visualizeit(){
	
	$("#slider").slider();
    var width = 600;
    var svgContainer = d3.select(".container").append("svg")
                                       .attr("width", width)
                                       .attr("height", 200);

    var circles = svgContainer.selectAll("circle")
                             .data(tweets)
                             .enter()
                            .append("circle");

    // text element
    var text = svgContainer.selectAll("text")
                          .data(tweets)
                          .enter()
                          .append("text");


    var initialScaleData = [];

    for (var i=0;i<tweets.length;i++)
    {
      initialScaleData[i] = parseInt(tweets[i].created_at_numeric);
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
 
G.add_nodes_from([1,2,3,4,5,[9,{color: '#008A00'}]], {color: '#0064C7'});
G.add_cycle([1,2,3,4,5]);
G.add_edges_from([[1,9], [9,1]]);
 
 jsnx.draw(G, {
    element: '#canvas', 
    with_labels: true, 
    node_style: {
        fill: function(d) { 
            return d.data.color; 
        }
    }, 
    label_style: {fill: 'white' }
});

}
