import expect from 'expect';
import { getCouncil, getFireDistrictFromCouncil, getFireDistrictFromSuburb } from '../../js/fb/handlers.js';

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
      const expectedResult = ['Mount Alexander', 'Baw Baw', 'French-Elizabeth-Sandstone Islands (Unincorporated)',
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
      const expectedResult = ['Tea Tree Gully', 'Coorong District Council', 'Marree', 'Bower', 'Bute'];

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

  it('should return undefined if district for council cannot be found', () => {
    const councils = ['Bute', 'Paskeville', 'Owen', 'Bower', 'Marree'];

    councils.forEach(council => {
      const actual = getFireDistrictFromCouncil(council, 'SA');
      expect(actual).toBe(null);
    });
  });
});

describe('getFireDistrictFromSuburb', () => {
  it('should find fire district for suburb', () => {
    const councils = ['Bute', 'Paskeville', 'Owen', 'Bower', 'Marree'];
    const expected = ['Yorke Peninsula', 'Yorke Peninsula', 'Mid North', 'Mid North', 'North West Pastoral'];

    councils.forEach((council, index) => {
      const actual = getFireDistrictFromSuburb(council, 'SA');
      expect(actual).toEqual(expected[index]);
    });
  });

  it('should return undefined if no fire district can be found', () => {
    const actual = getFireDistrictFromSuburb('randomStub', 'SA');
    expect(actual).toEqual(null);
  });
});
