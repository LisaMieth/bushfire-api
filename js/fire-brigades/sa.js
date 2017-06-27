require('babel-polyfill');

const cleanResult = result => result.replace(/^\s/, '').replace(/\.$/, '');

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

async function getAreaDataSA(data, area) {
  const items = await data.rss.channel.item;
  const item = items.find(item => item.title === area);
  const result = extractFromDescription(item.description);

  return {
    'Fire District': item.title,
    'Link': item.link,
    ...result[0],
    ...result[1],
  };
}

async function getSuburbDataSA(areaData, area, suburb) {
  return {
    Suburb: suburb,
    ...areaData,
  };
}

module.exports = {
  getAreaDataSA,
  getSuburbDataSA,
};
