/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

// Define constants for dimensions
const AREA_HEIGHT = 450;
const AREA_WIDTH = 600;
const MARGIN = { LEFT: 100, TOP: 50, RIGHT: 10, BOTTOM: 100 };
const HEIGHT = AREA_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;
const WIDTH = AREA_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;

// Create scales for the data
const xScale = d3.scaleLog().range([0, WIDTH]).base(10).domain([100, 150000]);
const yScale = d3.scaleLinear().range([HEIGHT, 0]).domain([0, 90]);
const rScale = d3.scaleLinear().range([25 * Math.PI, 1500 * Math.PI]);
const colorScale = d3.scaleOrdinal().range(d3.schemePastel1);

// Define the main SVG canvas and append it to the chart area
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

// X Label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Income ($)");

// Y Label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy (Years)");

// Title
g.append("text")
  .attr("class", "title")
  .attr("x", WIDTH / 2)
  .attr("y", 0)
  .attr("font-size", "24px")
  .attr("text-anchor", "middle")
  .text("Wealth & Health of Nations");

// Define the X and Y axes and append them to the group
const xAxis = g.append("g").attr("transform", `translate(0,${HEIGHT})`);
const xAxisCall = d3
  .axisBottom(xScale)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format("$,"));
xAxis.call(xAxisCall);

const yAxis = g.append("g");
const yAxisCall = d3.axisLeft(yScale);
yAxis.call(yAxisCall);

// Initial data index
let i = 0;

// Load data from the JSON file and process it
d3.json("data/data.json")
  .then((loadedData) => {
    // Pre-process data: Convert strings to numbers and filter out invalid entries
    loadedData.forEach((yearData) => {
      yearData.countries = yearData.countries.filter(
        (country) => country.income && country.life_exp
      );
      yearData.countries.forEach((country) => {
        country.income = Number(country.income);
        country.life_exp = Number(country.life_exp);
        country.population = Number(country.population);
      });
    });

    // Update scales' domains based on data
    const r_max = d3.max(loadedData, (yearData) =>
      d3.max(yearData.countries, (country) => country.population)
    );
    rScale.domain([0, r_max]);
    colorScale.domain(getUniqueCountries(loadedData));

    // Update visualization every 250ms
    d3.interval(() => {
      updateData(loadedData[i]);
      i++;
      if (i >= loadedData.length) {
        i = 0; // Loop back to start
      }
    }, 100);

    // Initial update
    updateData(loadedData[i]);
  })
  .catch(handleError);

function handleError(error) {
  console.error("Error loading or processing the data:", error);
}

function updateData(data) {
  if (!data) return;

  const countries = data.countries;

  // Update year label
  yearLabel.text(data.year);

  // Data join: Bind the data to the circles
  const circles = g.selectAll("circle").data(countries, (d) => d.country);

  // Interrupt any ongoing transitions
  circles.interrupt();

  // Remove any circles that no longer have corresponding data points
  circles.exit().remove();

  // For new data points, create new circles and set their attributes
  circles
    .enter()
    .append("circle")
    .merge(circles) // Combine the enter and update selections
    .attr("cx", (d) => xScale(d.income))
    .attr("cy", (d) => yScale(d.life_exp))
    .attr("r", (d) => Math.sqrt(rScale(d.population) / Math.PI))
    .attr("fill", (d) => colorScale(d.country));
}

function getUniqueCountries(data) {
  const countrySet = new Set();
  data.forEach((yearData) => {
    yearData.countries.forEach((country) => {
      countrySet.add(country.country);
    });
  });
  return Array.from(countrySet);
}
