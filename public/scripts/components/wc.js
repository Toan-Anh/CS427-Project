import cloud from 'd3-cloud';




var draw = function (words) {
    var width = document.getElementById('word-cloud-content').clientWidth;
    var height = document.getElementById('word-cloud-content').clientHeight;
    var color = d3.scaleLinear()
        .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
        .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

    cloud().size([width, height])
        .words(words)
        .rotate(0)
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
            .style("font-size", function (d) { return d.size + "px"; })
            .style("fill", function (d, i) { return color(i); })
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }

}

export default draw;