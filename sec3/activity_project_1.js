d3.csv("sec3/data/revenues.csv").then((data) => {
  // Setup Chart Area and Grouping
  const AREA_HEIGHT = 400;
  const AREA_WIDTH = 600;
  const MARGIN = { LEFT: 100, TOP: 50, RIGHT: 10, BOTTOM: 10 };
  const HEIGHT = AREA_HEIGHT - MARGIN.TOP - MARGIN.LEFT;
  const WIDTH = AREA_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;

  const svg = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", AREA_WIDTH)
    .attr("height", AREA_HEIGHT);

  const g = svg
    .append("g")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  // Set up x and y scale
  const x_values = data.map((d) => d.month);
  const x = d3
    .scaleBand()
    .domain(x_values)
    .range([0, WIDTH])
    .paddingInner(0.2)
    .paddingOuter(0.2);

  const x_axis = d3.axisBottom(x);
  g.append("g")
    .attr("transform", `translate(0,${HEIGHT + 0.05})`)
    .call(x_axis);

  g.append("text")
    .attr("class", "x-axis-label")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month");

  const y_max = d3.max(data, (d) => d.revenue);
  const y = d3.scaleLinear().domain([y_max, 0]).range([0, HEIGHT]);
  const y_axis = d3.axisLeft(y).ticks(5);
  g.append("g").call(y_axis);
  g.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -HEIGHT / 2)
    .attr("y", -60)
    .attr("font-size", 20)
    .attr("text-anchor", "middle")
    .attr("transform", `rotate(-90)`)
    .text("Revenue ($)");

  g.append("text")
    .attr("class", "chart-title")
    .attr("x", WIDTH / 2)
    .attr("y", -10)
    .attr("font-size", 20)
    .attr("text-anchor", "middle")
    .text("Revenue per Month");

  const colors = d3.scaleOrdinal().domain(x_values).range(d3.schemeCategory10);

  const bars = g.selectAll("bars").data(data);

  bars
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.month))
    .attr("y", (d) => y(d.revenue))
    .attr("width", x.bandwidth)
    .attr("height", (d) => HEIGHT - y(d.revenue))
    .attr("fill", (d) => colors(d.month));
});
