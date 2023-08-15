d3.json("./sec3/data/buildings.json").then((data) => {
  const CHART_AREA_WIDTH = 600;
  const CHART_AREA_HEIGHT = 400;
  const MARGIN = { LEFT: 100, TOP: 10, RIGHT: 10, BOTTOM: 100 };
  const GROUP_WIDTH = CHART_AREA_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
  const GROUP_HEIGHT = CHART_AREA_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

  const g = d3
    .select("#chart-area")
    .append("svg")
    .attr("width", CHART_AREA_WIDTH)
    .attr("height", CHART_AREA_HEIGHT)
    .append("g")
    .attr("transform",`translate(${MARGIN.LEFT},${MARGIN.TOP})`)

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, GROUP_WIDTH])
    .paddingInner(0.1)
    .paddingOuter(0.2);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.height)])
    .range([0, GROUP_HEIGHT]);

  const colors = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.name))
    .range(d3.schemeCategory10);

  const bars = g.selectAll("bars").data(data);

  bars
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.name))
    .attr("y", 10)
    .attr("width", x.bandwidth())
    .attr("height", (d) => y(d.height))
    .attr("stroke", "black")
    .attr("fill", (d) => colors(d.name));
});
