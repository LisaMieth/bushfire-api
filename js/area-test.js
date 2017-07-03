// Script to compare councils extracted from
// Google Map's API response with councils in location-mapping

require('babel-polyfill');
import { getCouncil } from './fb/handlers.js';
import { fireDistricts, councils } from './fb/location-mapping.js';

async function testAreas(state) {
  const areasByState = fireDistricts[state];

  for (const area of areasByState) {
    const councilsByArea = councils[state][area];
    for (const council of councilsByArea) {
      const data = await getCouncil(council, state);
      console.log(council, data);
    }
  }
}

testAreas('SA');
testAreas('NSW');
testAreas('VIC');
