import cloud from 'd3-cloud';




var draw = function (words) {
    var width = document.getElementById('word-cloud-content').clientWidth;
    var height = document.getElementById('word-cloud-content').clientHeight;
    var color = d3.scaleLinear()
        .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
        .range(["#ffffff", "#95a5a6","#bdc3c7", "#ecf0f1", "#e74c3c", "#e67e22", "#f1c40f", "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e"]);

    cloud().size([width, height])
        .words(words)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .padding(5)
        .font('Impact')
        .fontSize(function (d) { return d.size; })
        .on("end", () => { renderWordCloud() })
        .start();

    function renderWordCloud() {
        d3.select(".word-cloud").append("svg")
            .attr("width", width)
            .attr("height", height)
            //.attr("class", ".word-cloud")
            .append("g")
            // without the transform, words words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", `translate(${width / 2},${height / 2})`)
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .attr("text-anchor", "middle")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function (d, i) { return color(i); })
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }

}

export default draw;