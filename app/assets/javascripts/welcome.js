var tweets;

d3.json("/tweets.json", function(error, json){
	if(error) return console.warn(error);
	tweets = json;
	visualizeit();
});

function visualizeit(){
 var svgContainer = d3.select("body").append("svg")
                                     .attr("width", 1200)
                                     .attr("height", 1200);
 
 var circles = svgContainer.selectAll("circle")
                           .data(tweets)
                           .enter()
                          .append("circle");

var circleAttributes = circles
                       .attr("cx", function(d){return d.id*100})
                       .attr("cy", function(d){return d.id*100})
                       .attr("r", function (d) { return d.id+10; })
                       .style("fill", function(d) {
                       	return "purple";
                       });
}