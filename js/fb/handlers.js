import 'isomorphic-fetch';
import xml2js from 'xml2js';
import { fireDistricts, councils, fallbacks } from './location-mapping.js';
import { fetchFireDistricts, fetchSuburbs } from './stateLevel-handlers.js';

const googleMapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyD05woHcaU0DLw8_Yfb6U7fnL8JT8awhNA&address=';

// Mapping for Fire Services urls
const urlMapping = {
  NSW: 'http://www.rfs.nsw.gov.au/feeds/fdrToban.xml',
  VIC: 'https://data.emergency.vic.gov.au/Show?pageId=getFDRTFBJSON',
  SA: 'http://www.cfs.sa.gov.au/fire_bans_rss/index.jsp',
};

const parser = new xml2js.Parser({
  explicitRoot: true,
  mergeAttrs: true,
  explicitArray: false,
  normalize: true,
});

/*
* Parses the XML data to JSON
* @param {String} data - XML data
*
* @return {Promise} promise that resolves to JSON data
*/
async function parseXml(data) {
  return new Promise((resolve, reject) => {
    parser.parseString(data, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

// Capitalises first letter of every word
const capitalise = str => (
  str.replace(/\w\S*/g, (txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()))
);

/*
* Finds council for suburb by state via Google Maps API
* @param {String} suburb
* @params {String} state
*
* @return {String} council or empty if no results was returned
*/
export async function getCouncil(suburb, state) {
  // Get Google Maps data
  const response = await fetch(`${googleMapsUrl}${suburb},${state},au`);
  const data = await response.json();

  if (!data.results.length) return '';

  // Find what should be the council in Google's response
  const council = data.results[0].address_components.reduce((result, current) => {
    // Admin area level 2 is council, but not always present
    if (current.types.indexOf('administrative_area_level_2') !== -1) {
      // eslint-disable-next-line no-param-reassign
      result = current.short_name;
    }
    // Otherwise use admin area level 1 if that is not equal to the state
    else if (!result && current.types.indexOf('administrative_area_level_1') !== -1 && current.short_name !== state.toUpperCase()) {
      // eslint-disable-next-line no-param-reassign
      result = current.short_name;
    }
    return result;
  }, '');

  // Some results don't have any helpful administrative area level, first item is usually correct
  return council || data.results[0].address_components[0].short_name;
}

// Find matching fire district for council
export function getFireDistrictFromCouncil(council, state) {
  const result = fireDistricts[state]
    .find(fireDistrict => councils[state][fireDistrict]
      .find(councilByDistrict =>
        council.includes(councilByDistrict) || councilByDistrict.includes(council))
    );

  return result || null;
}

// Try and find matching fire district for suburb
export function getFireDistrictFromSuburb(suburb, state) {
  const fallback = fallbacks[state];

  if (!fallback) return null;

  const council = Object.keys(fallback).find(key => fallback[key].indexOf(suburb) !== -1);
  // No council found means we cannot find a matchin fire district
  if (!council) return null;

  const fireDistrict = getFireDistrictFromCouncil(council, state);

  return fireDistrict;
}

/*
* Fetches data by state from appropriate fire service
* @param {String} state
*
* @return {String} result as JSON
*/
export async function fetchData(state) {
  const data = await fetch(urlMapping[state.toUpperCase()]);
  const result = await data.text();

  // Some fire services offer JSON feed
  try {
    return JSON.parse(result);
  }
  // Most only offer XMl feed
  catch (e) {
    return await parseXml(result);
  }
}

/*
* Fetch data by fire district from appropriate fire service
* @param {String} fireDistrict
*
* @return {String} result as JSON
*/
export async function fetchFireDistrictData(fireDistrict, state) {
  // Find state the fire district is in
  const stateByFireDistrict = Object.keys(fireDistricts).reduce((result, key) => {
    // eslint-disable-next-line no-param-reassign
    if (fireDistricts[key].indexOf(capitalise(fireDistrict)) !== -1) result = key;
    return result;
  }, null);
  const _state = state.toUpperCase();

  if (_state !== stateByFireDistrict) throw new Error('State is not matching fire district');

  const data = await fetchData(state);

  // Use appropriate method, depending on the state
  return fetchFireDistricts[_state](data, capitalise(fireDistrict));
}

/*
* Fetch data by suburb, state from appropriate fire service
* @param {String} fireDistrict
*
* @return {String} result as JSON
*/
export async function fetchSuburbData(suburb, state) {
  const council = await getCouncil(suburb, state);
  const _state = state.toUpperCase();

  // Try and find fire district by council or suburb
  const fireDistrict = getFireDistrictFromCouncil(council, _state)
    || getFireDistrictFromSuburb(council, _state);

  // If no fire district found, try to find it by suburb
  if (!fireDistrict) throw new Error('Could not find a fire district for your suburb.');

  const fireDistrictData = await fetchFireDistrictData(fireDistrict.toLowerCase(), _state);

  return fetchSuburbs[_state](fireDistrictData, capitalise(fireDistrict), capitalise(suburb));
}
