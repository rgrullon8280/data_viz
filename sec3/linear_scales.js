d3.json("./sec3/data/buildings.json").then((data) => {
  data.map((d) => (d.height = Number(d.height)));
  const maxHeight = data.reduce((a, c) => {
    return c.height > a ? c.height : a;
  }, -Infinity);
  const width = 400;
  const height = 400;
  const y = d3.scaleLinear().domain([0, maxHeight]).range([0, height]);

  const svg = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const rectWidth = 40;
  const padding = 10;
  const mycolors = ["red", "blue", "green", "yellow", "orange"];
  const rectangles = svg.selectAll("rectangle").data(data);
  rectangles
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * rectWidth + 10)
    .attr("y", 0)
    .attr("height", ({ height }, i) => y(height))
    .attr("width", rectWidth - padding)
    .attr("fill", (d, i) => mycolors[i]);
});
