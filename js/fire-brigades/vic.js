require('isomorphic-fetch');
require('babel-polyfill');

function extractIssue({ issueFor, declaration, declareList }, area) {
  return  {
    issueFor,
    declaration,
    status: declareList.find(item => item.name === area).status,
  };
}

async function getAreaDataVIC(data, area) {
  const results = await data.results;
  const resultToday = extractIssue(results[0], area);
  const resultTomorrow = extractIssue(results[1], area);

  return {
    [area] : [resultToday, resultTomorrow],
  };
}

async function getSuburbDataVIC(areaData, area, suburb) {
  return {
    'Suburb': suburb,
    'Fire District': area,
    'Today': areaData[area][0],
    'Tomorrow': areaData[area][1],
  };
}

module.exports = {
  getAreaDataVIC,
  getSuburbDataVIC,
};
