import _mergeWith from 'lodash.mergewith';

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
// Merge FireBan and DangerRating data by date
function mergeItems(data, fireDistrict) {
  const cache = {};

  return data.reduce((result, current) => {
    const { issueFor: date } = current;

    if (!cache[date]) {
      cache[date] = current;
      return result;
    }

    // eslint-disable-next-line consistent-return
    const mergedItem = _mergeWith(cache[date], current, (value, src) => {
      if (Array.isArray(value)) {
        const valueMatch = value.find(item => item.name === fireDistrict);
        const srcMatch = src.find(item => item.name === fireDistrict);
        return {
          fireDistrict: valueMatch.name,
          fireBan: valueMatch.status,
          dangerRating: srcMatch.status,
        };
      }
    });

    result.push(mergedItem);
    return result;
  }, []);
}

// Get fireDistrict data for VIC
function getFireDistrictDataVIC(data, fireDistrict) {
  const results = data.results;
  const merged = mergeItems(results, fireDistrict);
  return { [fireDistrict]: merged };
}

// Get suburb data for VIC
function getSuburbDataVIC(fireDistrictData, fireDistrict, suburb) {
  return { [suburb]: fireDistrictData[fireDistrict] };
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
