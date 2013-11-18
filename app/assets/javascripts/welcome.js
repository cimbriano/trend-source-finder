var tweets;

d3.json("/tweets.json", function(error, json){
	if(error) return console.warn(error);
	tweets = json;
	visualizeit();
});

function visualizeit(){
    var width = 600;
    var svgContainer = d3.select("body").append("svg")
                                       .attr("width", width)
                                       .attr("height", 600);

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
                    .range([0,width])


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


 
