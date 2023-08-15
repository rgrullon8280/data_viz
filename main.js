d3.json("./sec3/data/buildings.json").then((data) => {
  const CHART_AREA_WIDTH = 600;
  const CHART_AREA_HEIGHT = 400;
  const MARGIN = { LEFT: 100, TOP: 10, RIGHT: 10, BOTTOM: 130 };
  const GROUP_WIDTH = CHART_AREA_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
  const GROUP_HEIGHT = CHART_AREA_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

  const g = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", CHART_AREA_WIDTH)
    .attr("height", CHART_AREA_HEIGHT)
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT},${MARGIN.TOP})`);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, GROUP_WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);

  const MAX_HEIGHT = d3.max(data, (d) => d.height)
  const y = d3
    .scaleLinear()
    .domain([0, MAX_HEIGHT])
    .range([GROUP_HEIGHT, 0]);

  const xAxisCall = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${GROUP_HEIGHT})`)
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-30)");
  const yAxisCall = d3.axisLeft(y);
  g.append("g").attr("class", "y axis").call(yAxisCall);

  // X Axis Label
  g.append("text")
    .attr("class", "x axis-label")
    .attr("x", GROUP_WIDTH / 2)
    .attr("y", GROUP_HEIGHT + 110)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Worlds Largest Buildings");

  // Y Axis Label
  g.append("text")
  .attr("class", "y axis-label")
  .attr("x",-GROUP_HEIGHT/2)
  .attr("y", -50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Height")
  const colors = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(d3.schemeCategory10);

  const bars = g.selectAll("bars").data(data);

  bars
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.name))
    .attr("y", (d) => y(MAX_HEIGHT)+y(d.height))
    .attr("width", x.bandwidth())
    .attr("height", (d) => GROUP_HEIGHT-y(d.height))
    .attr("stroke", "black")
    .attr("fill", (d) => colors(d.name));
});
