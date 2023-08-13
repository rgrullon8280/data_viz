const color = d3
  .scaleOrdinal()
  .domain(["NYC", "LA", "CHI", "ATL"])
  .range(d3.schemeCategory10);

console.log(color("NYC"));
