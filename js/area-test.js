// Script to compare councils extracted from Google Map's API response with councils in location-mapping

require('babel-polyfill');
const { getCouncil } = require('./parser.js');
const { areas, councils } = require('./location-mapping.js');

async function testAreas(state) {
  const areasByState = areas[state];
  for(let area of areasByState) {
    const councilsByArea = councils[state][area];
    for (let council of councilsByArea) {
      const data = await getCouncil(council, state);
      console.log(council, data);
    }
  }
}

testAreas('SA');
testAreas('NSW');
testAreas('VIC')
