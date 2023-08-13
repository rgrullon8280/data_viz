d3.json("./sec2/data/buildings.json").then((data) => {
  data.map((d) => {
    console.log(d);
  });

  const svg = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", 400)
    .attr("height", 400);

  const rectangles = svg.selectAll("rectangle").data(data);
  const width = 50;
  const colors = ["red", "blue", "green", "yellow", "orange"];
  const padding = 5;
  rectangles
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * width + width)
    .attr("y", 10)
    .attr("width", width - padding)
    .attr("height", (d, i) => d.height)
    .attr("fill", (d, i) => colors[i])
    .attr("stroke", "black");
});
