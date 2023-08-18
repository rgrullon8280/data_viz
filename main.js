// Setup Chart Area and Grouping
const AREA_HEIGHT = 500;
const AREA_WIDTH = 600;
const MARGIN = { LEFT: 100, TOP: 100, RIGHT: 10, BOTTOM: 100 };
const HEIGHT = AREA_HEIGHT - MARGIN.TOP - MARGIN.LEFT;
const WIDTH = AREA_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;

let flag = true;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", AREA_WIDTH)
  .attr("height", AREA_HEIGHT);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

const x = d3.scaleBand().range([0, WIDTH]).paddingInner(0.2).paddingOuter(0.2);

const xAxisGroup = g
  .append("g")
  .attr("transform", `translate(0,${HEIGHT + 0.05})`);

g.append("text")
  .attr("class", "x-axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month");

const y = d3.scaleLinear().range([0, HEIGHT]);

const yAxisGroup = g.append("g");

const yLabel = g
  .append("text")
  .attr("class", "y-axis-label")
  .attr("x", -HEIGHT / 2)
  .attr("y", -60)
  .attr("font-size", 20)
  .attr("text-anchor", "middle")
  .attr("transform", `rotate(-90)`);

g.append("text")
  .attr("class", "chart-title")
  .attr("x", WIDTH / 2)
  .attr("y", -10)
  .attr("font-size", 20)
  .attr("text-anchor", "middle")
  .text("Revenue per Month");

const colors = d3.scaleOrdinal().range(d3.schemeCategory10);

d3.csv("sec3/data/revenues.csv").then((data) => {
  data.forEach((d) => {
    d.revenue = Number(d.revenue);
    d.profit = Number(d.profit);
  });
  d3.interval(() => {
    flag = !flag;
    update(data);
  }, 2000);
  update(data);
});

const update = (data) => {
  const value = flag ? "revenue" : "profit";
  const y_max = d3.max(data, (d) => d[value]);
  y.domain([y_max, 0]);
  const x_values = data.map((d) => d.month);
  x.domain(x_values);
  // Set up x and y scale

  const x_axis = d3.axisBottom(x);

  xAxisGroup.call(x_axis);

  const y_axis = d3.axisLeft(y).ticks(5);
  yAxisGroup.call(y_axis);

  colors.domain(x_values);

  const bars = g.selectAll("rect").data(data);

  bars.exit().remove();

  bars
    .attr("x", (d) => x(d.month))
    .attr("y", (d) => y(d[value]))
    .attr("width", x.bandwidth)
    .attr("height", (d) => HEIGHT - y(d[value]))
    .attr("fill", "red");

  bars
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.month))
    .attr("y", (d) => y(d[value]))
    .attr("width", x.bandwidth)
    .attr("height", (d) => HEIGHT - y(d[value]))
    .attr("fill", "grey");

  const text = flag ? "Revenue ($)" : "Profit ($)";
  yLabel.text(text);
};
