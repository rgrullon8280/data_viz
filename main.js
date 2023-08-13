console.log("hello world");

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", "500")
  .attr("height", "400");

svg
  .append("circle")
  .attr("cx", 100)
  .attr("cy", 70)
  .attr("r", 40)
  .attr("fill", "red");

svg
  .append("line")
  .attr("y1", 190)
  .attr("y2", 195)
  .attr("x1", 110)
  .attr("x2", 140)
  .attr("stroke", "blue")
  .attr("stroke-width", 10);

svg
  .append("ellipse")
  .attr("cx", 200)
  .attr("cy", 100)
  .attr("rx", 40)
  .attr("ry", 70)
  .attr("fill", "green");
