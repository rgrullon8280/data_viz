/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

// Constants
const AREA_HEIGHT = 400;
const AREA_WIDTH = 600;
const MARGIN = { LEFT: 100, TOP: 10, RIGHT: 10, BOTTOM: 100 };
const HEIGHT = AREA_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
const WIDTH = AREA_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
const xScale = d3.scaleLog().range([0, WIDTH]).base(10).domain([100, 150000]);
const yScale = d3.scaleLinear().range([HEIGHT, 0]).domain([0, 90]);
const rScale = d3.scaleLinear().range([5, 25]);
const colorScale = d3.scaleOrdinal().range(d3.schemePastel1);
const t = d3.transition().duration(50);
let i = 0;

// SVG Canvas and Group
const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", AREA_WIDTH)
  .attr("height", AREA_HEIGHT);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// Year Label
const yearLabel = g
  .append("text")
  .attr("class", "year-label")
  .attr("x", WIDTH - 20)
  .attr("y", HEIGHT - 10)
  .attr("font-size", 20)
  .attr("text-anchor", "middle");

// Axes
const xAxis = g.append("g").attr("transform", `translate(0,${HEIGHT})`);
const xAxisCall = d3
  .axisBottom(xScale)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format("$,"));
xAxis.transition(t).call(xAxisCall);

const yAxis = g.append("g");
const yAxisCall = d3.axisLeft(yScale);
yAxis.transition(t).call(yAxisCall);

// Data Loading
d3.json("data/data.json")
  .then((data) => {
    data.forEach((d) => {
      d.countries = d.countries.filter((c) => c.income && c.life_exp);
      d.countries.forEach((c) => {
        c.income = Number(c.income);
        c.life_exp = Number(c.life_exp);
        c.population = Number(c.population);
      });
    });

    const r_max = d3.max(data, (d) => d3.max(d.countries, (c) => c.population));
    rScale.domain([0, r_max]);
    colorScale.domain(getCountries(data));

    let interval = d3.interval(() => {
      update(data[i]);
      i += 1;
      // Check if we've reached the end of the data array
      if (i >= data.length) {
        interval.stop(); // Stop the interval
      }
    }, 100);
    update(data[i]);
  })
  .catch(errorHandling);

function errorHandling(error) {
  console.error("Error loading or processing the data:", error);
}

// Update Function
const update = (data) => {
  if (!data) return;
  const countries = data.countries;
  yearLabel.text(data.year);
  const circles = g.selectAll("circle").data(countries, (d) => d.country);

  // Exit
  circles.exit().remove();

  // Enter + Update (without transitions)
  circles
    .enter()
    .append("circle")
    .merge(circles) // Merging the enter and update selections
    .attr("cx", (d) => xScale(d.income))
    .attr("cy", (d) => yScale(d.life_exp))
    .attr("r", (d) => rScale(d.population))
    .attr("fill", (d) => colorScale(d.country));

  // circles
  //   .exit()
  //   .interrupt()
  //   .transition(t)
  //   .attr("r", 0)
  //   .attr("fill", "red")
  //   .remove();

  // // Enter
  // circles
  //   .enter()
  //   .append("circle")
  //   .attr("cx", (d) => xScale(d.income))
  //   .attr("cy", (d) => yScale(d.life_exp))
  //   .attr("r", 0)
  //   .attr("fill", (d) => colorScale(d.country))
  //   .merge(circles) // Merging the enter and update selections
  //   .interrupt()
  //   .transition(t)
  //   .attr("cx", (d) => xScale(d.income))
  //   .attr("cy", (d) => yScale(d.life_exp))
  //   .attr("r", (d) => rScale(d.population));
};

// Utility Function
const getCountries = (data) => {
  let countrySet = new Set();

  data.forEach((d) => {
    d.countries.forEach((c) => {
      countrySet.add(c.country);
    });
  });

  return [...countrySet];
};
