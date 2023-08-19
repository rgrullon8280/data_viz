/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */


const AREA_HEIGHT = 400;
const AREA_WIDTH = 600;
const MARGIN = { LEFT: 100, TOP: 10, RIGHT: 10, BOTTOM: 100 };
const HEIGHT = AREA_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
const WIDTH = AREA_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", AREA_WIDTH)
  .attr("height", AREA_HEIGHT);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

const xScale = d3.scaleLog().range([0, WIDTH]).base(10);
const xAxis = g.append("g").attr("transform", `translate(0,${HEIGHT + 0.05})`);

const yScale = d3.scaleLinear().range([HEIGHT, 0]);
const yAxis = g.append("g");

const rScale = d3.scaleLinear().range([0, 15]);

d3.json("data/data.json").then(function (data) {
  data.forEach((d) => {
    d.countries.forEach((c) => {
      c.income = Number(c.income);
      c.life_exp = Number(c.life_exp);
      c.population = Number(c.population);
    });
  });

  const x_max = d3.max(data, (d) => d3.max(d.countries, (a) => a.income));
  const y_max = d3.max(
    data,
    (d) => d3.max(d.countries, (a) => a.life_exp) + 10
  );
  xScale.domain([1, 40000]);
  yScale.domain([0, y_max]);
  const xAxisCall = d3.axisBottom(xScale).tickValues([1, 400, 4000, 40000]);
  const yAxisCall = d3.axisLeft(yScale);
  xAxis.call(xAxisCall);
  yAxis.call(yAxisCall);

  const r_max = d3.max(data, (d) => d3.max(d.countries, (c) => c.population));
  rScale.domain([0, r_max]);
  const countryNames = getCountries(data)
  i = 200;
  // d3.interval(() => {
  //   update(data[i]);
  //   i += 1;
  // }, 500);
  update(data[0], countryNames);
});

const update = (data, names) => {
  const countries = data.countries;
  const year = data.year;
  const circles = g.selectAll("circle").data(countries, (d) => d.country);
  // console.log(countries);
  const colorScale = d3
    .scaleOrdinal()
    .domain(names)
    .range(d3.schemePastel1);

  console.log(colorScale);
  circles
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      // console.log(xScale(d.income))
      if (isNaN(xScale(d.income))) return 0;
      return xScale(d.income);
    })
    .attr("cy", (d) => {
      // console.log(yScale(d.life_exp))
      return yScale(d.life_exp);
    })
    .attr("r", (d) => 5)
    .attr("fill", (d) => colorScale(d.country));
};

const getCountries = (data) => {
  let retDict = {};
  data.forEach((d) => {
    d.countries.forEach((c) => {
      if (c.country in retDict) return;
      retDict[c.country] = "found";
    });
  });
  return Object.keys(retDict);
};
