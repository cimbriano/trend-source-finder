var edges;

d3.json("/edges.json", function(error, json){
	if(error) return console.warn(error);
	edges = json;
	visualizeit();
});

function visualizeit(){


    var isNodeInGraph = {};

    for (var i=0;i<edges.length;i++)
    {
      isNodeInGraph[edges[i].child_id] = 0;
      isNodeInGraph[edges[i].parent_id] = 0;
    }


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
    $( "#slider" ).slider();
});