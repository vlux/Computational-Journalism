var force_width = 1100;
var force_height = 900;


d3.json("Jackie Chan.json", function(error, root) {

	var node_radius = function(edge) {
		return Math.sqrt(edge.weight * 20)
	};

	var svg = d3.select("#force").append("svg")
		.attr("width", force_width)
		.attr("height", force_height);

	var force = d3.layout.force()
		.nodes(root.nodes)
		.links(root.edges)
		.size([force_width - 20, force_height - 20])
		.linkDistance(function(edge) {
			return edge.weight * 146
		})
		.charge(-900)
		.theta(0.1)
		.gravity(0.15)
		.start();


	var mouseOverFunction = function(d) {
		var circle = d3.select(this);
		circle.transition(500)
			.attr("r", function() {
				return 1.4 * node_radius
			});

		svg_nodes.transition(500)
			.style("opacity", function(o) {
				return isConnected(o, d) ? 1.0 : 0.15;
			})

		edges_line.transition(500)
			.style("stroke-opacity", function(o) {
				return o.source === d || o.target === d ? 1 : 0.15;
			})

		edges_text.style("fill-opacity", function(edge) {
			if (edge.source === d || edge.target === d) {
				return 1.0;
			}
		})

	}

	var mouseOutFunction = function() {
		svg_nodes.transition(500);
		edges_line.transition(500);
		circle.transition(500)
			.attr("r", node_radius);
		edges_text.style("fill-opacity", function(edge) {
			if (edge.source === d || edge.target === d) {
				return 0.0;
			}
		});
	}

	function isConnected(a, b) {
		return isConnectedAsTarget(a, b) || isConnectedAsSource(a, b) || a.index == b.index;
	}

	function isConnectedAsSource(a, b) {
		return linkedByIndex[a.index + "," + b.index];
	}

	function isConnectedAsTarget(a, b) {
		return linkedByIndex[b.index + "," + a.index];
	}

	function isEqual(a, b) {
		return a.index == b.index;
	}

	var edges_line = svg.selectAll("line")
		.data(root.edges)
		.enter()
		.append("line")
		.style("stroke", '#7c7676')
		.style("stroke-width", function(edge) {
			return edge.weight * 1.5;
		});

	var linkedByIndex = {};
	root.edges.forEach(function(d) {
		linkedByIndex[d.source.index + "," + d.target.index] = true;
	});

	var edges_text = svg.selectAll(".linetext")
		.data(root.edges)
		.enter()
		.append("text")
		.attr("class", "linetext")
		.text(function(d) {
			return d.relation;
		});

	var color = d3.scale.category20b();

	var svg_nodes = svg.selectAll("circle")
		.data(root.nodes)
		.enter()
		.append("circle")
		.attr("r", node_radius)
		.style("fill", function(d, i) {
			if (d.sex == "male") {
				return "#10e3e3";
			} else {
				return "#e983ca";
			};
		})
		.on("mouseover", mouseOverFunction)
		.on("mouseout", mouseOutFunction)
		.call(force.drag);

	var text_dx = -20;
	var text_dy = 20;

	var nodes_text = svg.selectAll(".nodetext")
		.data(root.nodes)
		.enter()
		.append("text")
		.attr("class", "nodetext")
		.attr("dx", text_dx)
		.attr("dy", text_dy)
		.text(function(d) {
			return d.name;
		})
        .attr('fill',function(d){
            if(d.sex == 'male' && d.id !='55')
                return '#10e3e3';
            if(d.id == '55')
                return '#555a58'
            if(d.sex == 'female')
                return "#e983ca"
        });

	force.on("tick", function() {

		edges_line.attr("x1", function(d) {
			return d.source.x;
		});
		edges_line.attr("y1", function(d) {
			return d.source.y;
		});
		edges_line.attr("x2", function(d) {
			return d.target.x;
		});
		edges_line.attr("y2", function(d) {
			return d.target.y;
		});

		edges_text.attr("x", function(d) {
			return (d.source.x + d.target.x) / 2;
		});
		edges_text.attr("y", function(d) {
			return (d.source.y + d.target.y) / 2;
		});

		svg_nodes.attr("cx", function(d) {
			return d.x;
		});
		svg_nodes.attr("cy", function(d) {
			return d.y;
		});

		nodes_text.attr("x", function(d) {
			return d.x
		});
		nodes_text.attr("y", function(d) {
			return d.y
		});
	});
});
