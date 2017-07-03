/*
* Functions extracting necessary information from parsed JSON data by fireDistirct and suburb.
* The data comes from the states' fire brigades, but it looks different for every state,
* hence different methods for each state are necessary.
*/

// Get fire distirct data for NSW
async function getFireDistirctDataNSW(data, fireDistirct) {
  return await data.FireDangerMap.District
    .find(district => district.Name === fireDistirct);
}

// Get suburb data for NSW
async function getSuburbDataNSW(fireDistirctData, fireDistirct, suburb) {
  return {
    Suburb: suburb,
    'Fire District': fireDistirct,
    'Danger Level Today': fireDistirctData.DangerLevelToday,
    'Danger Level Tomorrow': fireDistirctData.DangerLevelTomorrow,
    'Fire Ban Today': fireDistirctData.FireBanToday,
    'Fire Ban Tomorrow': fireDistirctData.FireBanTomorrow,
  };
}

// FOR VIC DATA
// Extract fire danger data from parsed data -> issue VIC
function extractIssue({ issueFor, declaration, declareList }, fireDistirct) {
  return {
    issueFor,
    declaration,
    status: declareList.find(item => item.name === fireDistirct).status,
  };
}

// Get fireDistirct data for VIC
async function getFireDistirctDataVIC(data, fireDistirct) {
  const results = await data.results;
  const resultToday = extractIssue(results[0], fireDistirct);
  const resultTomorrow = extractIssue(results[1], fireDistirct);

  return {
    [fireDistirct]: [resultToday, resultTomorrow],
  };
}

// Get suburb data for VIC
async function getSuburbDataVIC(fireDistirctData, fireDistirct, suburb) {
  return {
    Suburb: suburb,
    'Fire District': fireDistirct,
    Today: fireDistirctData[fireDistirct][0],
    Tomorrow: fireDistirctData[fireDistirct][1],
  };
}

// FOR SA DATA
// Remove any dots and whitespace
const cleanResult = result => result.replace(/^\s/, '').replace(/\.$/, '');

// FOR SA DATA
// Extract fire danger data from parsed data -> description
function extractFromDescription(description) {
  const extracted = description.split('<br />');

  return extracted.map(extract => {
    const itemIndex = extract.indexOf('Today') !== -1 ? 0 : extract.indexOf('Tomorrow');
    const fbIndex = extract.indexOf('Total');
    const fdrIndex = extract.indexOf('Fire Danger');

    const key = extract.slice(itemIndex, fbIndex - 2);
    const fireBan = extract.slice(fbIndex, fdrIndex - 1).split(':');
    const fireDangerRating = extract.slice(fdrIndex).split(':');

    return {
      [key]: {
        [fireDangerRating[0]]: cleanResult(fireDangerRating[1]),
        [fireBan[0]]: cleanResult(fireBan[1]),
      },
    };
  });
}

// Get fireDistirct data for SA
async function getFireDistirctDataSA(data, fireDistirct) {
  const items = await data.rss.channel.item;
  const item = items.find(element => element.title === fireDistirct);
  const result = extractFromDescription(item.description);

  return {
    'Fire District': item.title,
    Link: item.link,
    ...result[0],
    ...result[1],
  };
}

// Get suburb data for SA
async function getSuburbDataSA(fireDistirctData, fireDistirct, suburb) {
  return {
    Suburb: suburb,
    ...fireDistirctData,
  };
}

// Mapping for fireDistirct data functions
export const fetchFireDistricts = {
  NSW: getFireDistirctDataNSW,
  VIC: getFireDistirctDataVIC,
  SA: getFireDistirctDataSA,
};

// Mapping for suburb data function
export const fetchSuburbs = {
  NSW: getSuburbDataNSW,
  VIC: getSuburbDataVIC,
  SA: getSuburbDataSA,
};
