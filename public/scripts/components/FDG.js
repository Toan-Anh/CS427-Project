'use strict'

class FDG {
    render(data) {
        netClustering.cluster(data.vertices, data.edges);
        console.log(data.vertices);

        console.log(document.getElementById('FDG Layout').clientWidth);
        console.log(document.getElementById('FDG Layout').clientHeight);

        var svg = d3.select("#artist-graph"),
            width = document.getElementById('FDG Layout').clientWidth,
            height = document.getElementById('FDG Layout').clientHeight;

        svg.attr('width', () => `${width}px`)
            .attr('height', () => `${height}px`);

        d3.selectAll("#artist-graph > *").remove();

        var color = d3.scaleOrdinal(d3.schemeCategory20);
        var simulation = d3.forceSimulation()
            .force("forceX", d3.forceX().x(width / 2)
                .strength((d) => { return (d.value / data.maxValue) === 1 ? 0.3 : 0.01 }))
            .force("forceY", d3.forceY().y(height / 2)
                .strength((d) => { return (d.value / data.maxValue) === 1 ? 0.3 : 0.01 }))
            .force("link", d3.forceLink()
                // .id((d) => { return d.id; })
                .distance(100))
            .force("charge", d3.forceManyBody().strength(-100))// + (-100) * (15 / data.vertices.length)))
            .force("collision", d3.forceCollide().radius((d) => { return d.value + 15; }));

        var defs = svg.append('defs')
            .selectAll("pattern")
            .data(data.vertices)
            .enter().append('pattern')
            .attr("id", (d) => d.mbid)
            .attr("width", (d) => { return 2 * (d.value + 15); })
            .attr("height", (d) => { return 2 * (d.value + 15); })
            .attr("patternUnits", "objectBoundingBox");

        defs.append("svg:image")
            .attr("xlink:href", (d) => d.image)
            .attr("width", (d) => { return 2 * (d.value + 15); })
            .attr("height", (d) => { return 2 * (d.value + 15); })
            .attr("x", 0)
            .attr("y", 0);

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.edges)
            .enter().append("line")
            .attr("stroke-width", (d) => { return 2; });

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(data.vertices)
            .enter().append("circle")
            .attr("r", (d) => { return d.value + 15; })
            // .attr("fill", function (d) { return `url(#${d.mbid})`; })
            .attr("fill", function (d) { return color(d.cluster); })
            .on("mouseenter", onNodeClick)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function (d) { return d.id; });

        simulation
            .nodes(data.vertices)
            .on("tick", ticked);

        simulation.force("link")
            .links(data.edges);

        function ticked() {
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; });
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.7).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        function onNodeClick(d) {
            console.log(d);
        }
    }
}

export default new FDG();