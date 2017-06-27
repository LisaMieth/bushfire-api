require('isomorphic-fetch');
require('babel-polyfill');
const xml2js = require('xml2js');
const { urlMapping } = require('./constants.js');
const { areas, councils, fallbacks } = require('./location-mapping.js');
const apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyD05woHcaU0DLw8_Yfb6U7fnL8JT8awhNA&address=';
const { getAreaDataNSW, getSuburbDataNSW } = require('./fire-brigades/nsw.js');
const { getAreaDataVIC, getSuburbDataVIC } = require('./fire-brigades/vic.js');
const { getAreaDataSA, getSuburbDataSA } = require('./fire-brigades/sa.js');

const parser = new xml2js.Parser({
  explicitRoot: true,
  mergeAttrs: true,
  explicitArray: false,
  normalize: true,
});

const fetchAreas = {
  NSW: getAreaDataNSW,
  VIC: getAreaDataVIC,
  SA: getAreaDataSA,
};

const fetchSuburbs = {
  NSW: getSuburbDataNSW,
  VIC: getSuburbDataVIC,
  SA: getSuburbDataSA,
};

const parseXml = async function(data) {
  return new Promise((resolve, reject) => {
    parser.parseString(data, (err, res) => {
      if(err) reject(err);
      resolve(res);
    });
  });
};

const capitalise = function(str) {
  return str
    .replace(/\w\S*/g, (txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  );
};

const getCouncil = async function(suburb, state = '') {
  const response = state
    ? await fetch(`${apiUrl}${suburb},${state},au`)
    : await fetch(`${apiUrl}${suburb},au`);

  const data = await response.json();

  const council = data.results[0].address_components.reduce((result, current) => {
    if (current.types.indexOf('administrative_area_level_2') !== -1) {
      result = current['short_name']
    }
    else if (!result && current.types.indexOf('administrative_area_level_1') !== -1 && current['short_name'] !== state.toUpperCase()) {
      result = current['short_name'];
    }

    return result;
  }, '');

  // Some results don't have any helpful administrative area level, first item is usually correct
  return council ? council : data.results[0].address_components[0]['short_name'];
};

const fetchData = async function(state) {
  if (!state) return 'Could not find location';

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
};

const fetchAreaData = async function(area) {
  const state = Object.keys(areas).reduce((result, key) => {
    if (areas[key].indexOf(capitalise(area)) !== -1) result = key;

    return result;
  }, null);

  const data = await fetchData(state);

  return fetchAreas[state](data, capitalise(area));
};

const fetchSuburbData = async function(suburb, state) {
  const council = await getCouncil(suburb, state);
  const _state = state.toUpperCase();
  let area = getAreaFromCouncil(council, _state);

  if (!area) area = getAreaFromSuburb(council, _state);

  const areaData = await fetchAreaData(area.toLowerCase());

  return fetchSuburbs[_state](areaData, capitalise(area), capitalise(suburb));
};

const getAreaFromSuburb = function(suburb, state) {
  const fallback = fallbacks[state];
  const council = Object.keys(fallback).find(key => fallback[key].indexOf(suburb) !== - 1);
  const area = getAreaFromCouncil(council, state);

  if (!area) return 'Could not find a matching fire district for your suburb.';
  return area;
};

const getAreaFromCouncil = function(council, state) {
  return areas[state]
    .find(area => councils[state][area]
      .find(councilByArea => council.includes(councilByArea) || councilByArea.includes(council))
    );
};

module.exports = {
  fetchData,
  fetchAreaData,
  fetchSuburbData,
};
