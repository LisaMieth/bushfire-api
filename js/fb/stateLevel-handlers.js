/*
* Functions extracting necessary information from parsed JSON data by fireDistrict and suburb.
* The data comes from the states' fire brigades, but it looks different for every state,
* hence different methods for each state are necessary.
*/

// Get fire District data for NSW
function getFireDistrictDataNSW(data, fireDistrict) {
  return data.FireDangerMap.District
    .find(district => district.Name === fireDistrict || district.Name.includes(fireDistrict));
}

// Get suburb data for NSW
function getSuburbDataNSW(fireDistrictData, fireDistrict, suburb) {
  return {
    Suburb: suburb,
    FireDistrict: fireDistrict,
    DangerLevelToday: fireDistrictData.DangerLevelToday,
    DangerLevelTomorrow: fireDistrictData.DangerLevelTomorrow,
    FireBanToday: fireDistrictData.FireBanToday,
    FireBanTomorrow: fireDistrictData.FireBanTomorrow,
  };
}

// Get fire district data for ACT
function getFireDistrictDataACT(data, fireDistrict) {
  return getFireDistrictDataNSW(data, fireDistrict);
}

// FOR VIC DATA
// Extract fire danger data from parsed data -> issue VIC
function extractIssue({ issueFor, declaration, declareList }, fireDistrict) {
  return {
    issueFor,
    declaration,
    status: declareList.find(item => item.name === fireDistrict).status,
  };
}

// Get fireDistrict data for VIC
function getFireDistrictDataVIC(data, fireDistrict) {
  const results = data.results;
  const resultToday = extractIssue(results[0], fireDistrict);
  const resultTomorrow = extractIssue(results[1], fireDistrict);

  return {
    [fireDistrict]: [resultToday, resultTomorrow],
  };
}

// Get suburb data for VIC
function getSuburbDataVIC(fireDistrictData, fireDistrict, suburb) {
  return {
    Suburb: suburb,
    'Fire District': fireDistrict,
    Today: fireDistrictData[fireDistrict][0],
    Tomorrow: fireDistrictData[fireDistrict][1],
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

// Get fireDistrict data for SA
function getFireDistrictDataSA(data, fireDistrict) {
  const items = data.rss.channel.item;
  const item = items.find(element => element.title === fireDistrict);
  const result = extractFromDescription(item.description);

  return {
    'Fire District': item.title,
    Link: item.link,
    ...result[0],
    ...result[1],
  };
}

// Get suburb data for SA
function getSuburbDataSA(fireDistrictData, fireDistrict, suburb) {
  return {
    Suburb: suburb,
    ...fireDistrictData,
  };
}

// Mapping for fireDistrict data functions
export const fetchFireDistricts = {
  NSW: getFireDistrictDataNSW,
  ACT: getFireDistrictDataACT,
  VIC: getFireDistrictDataVIC,
  SA: getFireDistrictDataSA,
};

// Mapping for suburb data function
export const fetchSuburbs = {
  NSW: getSuburbDataNSW,
  VIC: getSuburbDataVIC,
  SA: getSuburbDataSA,
};
