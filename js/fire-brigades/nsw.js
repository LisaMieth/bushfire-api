require('isomorphic-fetch');
require('babel-polyfill');

async function getAreaDataNSW(data, area) {
  return await data.FireDangerMap.District
    .find(district => district.Name === area);
}

async function getSuburbDataNSW(areaData, area, suburb) {
  return {
    'Suburb': suburb,
    'Fire District': area,
    'DangerLevelToday': areaData.DangerLevelToday,
    'DangerLevelTomorrow': areaData.DangerLevelTomorrow,
    'FireBanToday': areaData.FireBanToday,
    'FireBanTomorrow': areaData.FireBanTomorrow,
  };
}

module.exports = {
  getAreaDataNSW,
  getSuburbDataNSW,
}
