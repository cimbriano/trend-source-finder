# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

#Height and Width of SVG Canvas
h = 500
w = 500

# jQuery onLoad
$ ->
	# Add SVG Canvas to DOM
	svg = d3.select("body").append("svg")
	svg.attr("width", w).attr("height", h)

	# Sample dataset for demo
	dataset = [ 5, 10, 15, 20, 25 ]

	# Create circle objects
	circles = svg.selectAll("circle")
				 .data(dataset)
				 .enter()
				 .append("circle")

	# Set circle attributes
	circles.attr( "cx", (d,i) -> (i * 50 ) + 25 )
		   .attr( "cy", (d,i) ->  h / 2 )
		   .attr( "r" , (d,i) ->   d )