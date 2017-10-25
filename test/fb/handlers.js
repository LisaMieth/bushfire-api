import expect from 'expect';
import {
  getCouncil,
  getFireDistrictFromCouncil,
  getFireDistrictFromSuburb,
  fetchFireDistrictData,
  fetchSuburbData,
  parseXml,
} from '../../js/fb/handlers.js';

describe('getCouncil', () => {
  it('should return empty string for non-existing suburb', function (done) {
    this.timeout(15000);
    const suburbs = ['NothingRandom', 'TotallyMadeUp', 'TotallyRandom'];

    for (const suburb of suburbs) {
      getCouncil(suburb, 'NSW')
        .then(council => expect(council).toBe(''));
    }
    setTimeout(done, 10000);
  });

  context('NSW', () => {
    it('should find council for actual suburbs', function (done) {
      this.timeout(15000);
      const suburbs = ['West Wollongong', 'Kiama', 'Bigga', 'Eremerang', 'Goodooga'];
      const expectedResult = ['Wollongong', 'Kiama', 'Upper Lachlan Shire', 'Cobar', 'Brewarrina'];

      for (const suburb of suburbs) {
        const index = suburbs.indexOf(suburb);
        getCouncil(suburb, 'NSW')
          .then(council => expect(council).toEqual(expectedResult[index]));
      }
      setTimeout(done, 10000);
    });
  });

  context('VIC', () => {
    it('should find council for actual suburbs', function (done) {
      this.timeout(15000);
      const suburbs = ['Mount Alexander', 'Baw Baw', 'French Island', 'Kevington', 'Yanac', 'Nareeb'];
      const expectedResult = ['Mount Alexander', 'Baw Baw', 'French Island',
        'Mansfield', 'Hindmarsh', 'Nareeb'];

      for (const suburb of suburbs) {
        const index = suburbs.indexOf(suburb);
        getCouncil(suburb, 'VIC')
          .then(council => expect(council).toEqual(expectedResult[index]));
      }
      setTimeout(done, 10000);
    });
  });

  context('SA', () => {
    it('should find council for actual suburbs', function (done) {
      this.timeout(15000);
      const suburbs = ['Tea Tree Gully', 'Coorong', 'Marree', 'Bower', 'Bute'];
      const expectedResult = ['Tea Tree Gully', 'Coorong', 'Marree', 'Bower', 'Bute'];

      for (const suburb of suburbs) {
        const index = suburbs.indexOf(suburb);
        getCouncil(suburb, 'SA')
          .then(council => expect(council).toEqual(expectedResult[index]));
      }
      setTimeout(done, 10000);
    });
  });
});

describe('getFireDistrictFromCouncil', () => {
  it('should find fire distirct for council', () => {
    const councilsByState = {
      NSW: ['Wollongong', 'Cobar'],
      VIC: ['Baw Baw', 'Mansfield'],
      SA: ['Tea Tree Gully', 'Coorong District Council'],
    };

    const expected = {
      NSW: ['Illawara/Shoalhaven', 'Far Western'],
      VIC: ['West and South Gippsland', 'North East'],
      SA: ['Adelaide Metropolitan', 'Upper South East'],
    };

    Object.keys(councilsByState).forEach(key => {
      const councils = councilsByState[key];
      councils.forEach((council, index) => {
        const actual = getFireDistrictFromCouncil(council, key);
        expect(actual).toEqual(expected[key][index]);
      });
    });
  });

  it('should return undefined if district cannot be found', () => {
    const actual = getFireDistrictFromCouncil('randomStub', 'SA');
    expect(actual).toEqual(null);
  });
});

describe('fetchFireDistrictData', () => {
  it('should return promise rejected with error if given wrong state', () => {
    fetchFireDistrictData('Campbelltown', 'vic')
      .catch(error => expect(error).toBeAn(Error));
  });
});

describe('fetchSuburbData', () => {
  it('should return error if cannot find matchin fire district', () => {
    fetchSuburbData('notarealsuburb', 'nsw')
      .catch(error => expect(error).toBeAn(Error));
  });
});

describe('parseXml', (done) => {
  it('should return error if XML response is invalid', () => {
    const invalid = `<?xml version="1.0"?>
    <FireDangerMap>
      <District>
        <Name>Far North Coast</Name>
        <RegionNumber>1</RegionNumber>
        <Councils>Ballina; Byron; Clarence Valley; Kyogle; Lismore; Richmond Valley; Tweed</Councils>
        <DangerLevelToday>None</DangerLevelToday>
        <DangerLevelTomorrow>None</DangerLevelTomorrow>
        <FireBanToday>No</FireBanToday>
        <FireBanTomorrow>No</FireBanTomorrow>
      </District>`;

    parseXml(invalid)
      .catch(error => expect(error).toBeAn(Error))
      .then(done);
  });
});
