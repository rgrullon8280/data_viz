d3.csv("./sec2/data/ages.csv").then((csvData) => {
  csvData.map((data) => {
    data.age = Number(data.age);
  });

  const svg = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", 400)
    .attr("height", 400);

  const circles = svg.selectAll("circle").data(csvData);

  circles
    .enter()
    .append("circle")
    .attr("cx", (d, i) => d.age + (i * 3 + 1) * 23 + 50)
    .attr("cy", 150)
    .attr("r", (d) => d.age)
    .attr("fill", "red");
});
