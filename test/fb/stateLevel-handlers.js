import expect from 'expect';
import { fetchFireDistricts, fetchSuburbs } from '../../js/fb/stateLevel-handlers.js';

describe('VIC', () => {
  const data = {
    results: [
      {
        issueFor: '06/07/2017',
        status: 'N',
        declaration: 'Today, Thu, 6 Jul 2017 is not currently a day of Total Fire Ban.',
        declareList: [
          {
            name: 'Mallee',
            status: 'NO - RESTRICTIONS MAY APPLY',
          },
          {
            name: 'Central',
            status: 'NO - RESTRICTIONS MAY APPLY',
          },
        ],
      },
      {
        issueFor: '07/07/2017',
        status: 'N',
        declaration: 'Tomorrow, Fri, 7 Jul 2017 is not currently a day of Total Fire Ban.',
        declareList: [
          {
            name: 'Mallee',
            status: 'NO - RESTRICTIONS MAY APPLY',
          },
          {
            name: 'Central',
            status: 'NO - RESTRICTIONS MAY APPLY',
          },
        ],
      },
    ],
  };

  const fireDistrictData = {
    Central: [
      {
        issueFor: '06/07/2017',
        declaration: 'Today, Thu, 6 Jul 2017 is not currently a day of Total Fire Ban.',
        status: 'NO - RESTRICTIONS MAY APPLY',
      },
      {
        issueFor: '07/07/2017',
        declaration: 'Tomorrow, Fri, 7 Jul 2017 is not currently a day of Total Fire Ban.',
        status: 'NO - RESTRICTIONS MAY APPLY',
      },
    ],
  };
  it('should return fire district data in appropriate format', () => {
    const actual = fetchFireDistricts['VIC'](data, 'Central');
    expect(actual).toEqual(fireDistrictData);
  });

  it('should return suburb data in appropriate format', () => {
    const expected = {
      Suburb: 'Ballarat North',
      'Fire District': 'Central',
      Today: fireDistrictData['Central'][0],
      Tomorrow: fireDistrictData['Central'][1],
    };
    const actual = fetchSuburbs['VIC'](fireDistrictData, 'Central', 'Ballarat North');
    expect(actual).toEqual(expected);
  });
});

describe('NSW', () => {
  const data = {
    FireDangerMap: {
      District: [
        {
          Name: 'Far North Coast',
          RegionNumber: '1',
          Councils: 'Ballina; Byron; Clarence Valley; Kyogle; Lismore; Richmond Valley; Tweed',
          DangerLevelToday: 'None',
          DangerLevelTomorrow: 'None',
          FireBanToday: 'No',
          FireBanTomorrow: 'No',
        },
        {
          Name: 'Greater Hunter',
          RegionNumber: '3',
          Councils: 'Cessnock; Dungog; Lake Macquarie; Maitland; Muswellbrook; Newcastle; Port Stephens; Singleton; Upper Hunter',
          DangerLevelToday: 'None',
          DangerLevelTomorrow: 'None',
          FireBanToday: 'No',
          FireBanTomorrow: 'No',
        },
      ],
    },
  };

  const fireDistrictData = {
    Name: 'Greater Hunter',
    RegionNumber: '3',
    Councils: 'Cessnock; Dungog; Lake Macquarie; Maitland; Muswellbrook; Newcastle; Port Stephens; Singleton; Upper Hunter',
    DangerLevelToday: 'None',
    DangerLevelTomorrow: 'None',
    FireBanToday: 'No',
    FireBanTomorrow: 'No',
  };

  it('should return fire district data in appropriate format', () => {
    const actual = fetchFireDistricts['NSW'](data, 'Greater Hunter');
    expect(actual).toEqual(fireDistrictData);
  });

  it('should return suburb data in appropriate format', () => {
    const expected = {
      Suburb: 'Newcastle West',
      FireDistrict: 'Greater Hunter',
      DangerLevelToday: 'None',
      DangerLevelTomorrow: 'None',
      FireBanToday: 'No',
      FireBanTomorrow: 'No',
    };
    const actual = fetchSuburbs['NSW'](fireDistrictData, 'Greater Hunter', 'Newcastle West');
    expect(actual).toEqual(expected);
  });
});

describe('SA', () => {
  const data = {
    rss: {
      channel: {
        title: 'CFS Current Fire Bans for South Australia',
        link: 'http://cms.esau.sa.gov.au',
        description: 'CFS Fire Bans Feed for South Australia',
        item: [
          {
            title: 'Adelaide Metropolitan',
            link: 'http://cms.esau.sa.gov.au',
            description: 'Today (00:00 - 23:59), 06 July 2017: Total Fire Ban: No. Fire Danger Rating: No Fire Danger Rating.<br />Tomorrow (00:00 - 23:59), 07 July 2017: Total Fire Ban: No. Fire Danger Rating: No Fire Danger Rating.',
          },
          {
            title: 'Mount Lofty Ranges',
            link: 'http://cms.esau.sa.gov.au',
            description: 'Today (00:00 - 23:59), 06 July 2017: Total Fire Ban: No. Fire Danger Rating: No Fire Danger Rating.<br />Tomorrow (00:00 - 23:59), 07 July 2017: Total Fire Ban: No. Fire Danger Rating: No Fire Danger Rating.',
          },
        ],
      },
    },
  };
  const fireDistrictData = {
    'Fire District': 'Adelaide Metropolitan',
    Link: 'http://cms.esau.sa.gov.au',
    'Today (00:00 - 23:59), 06 July 2017': {
      'Fire Danger Rating': 'No Fire Danger Rating',
      'Total Fire Ban': 'No',
    },
    'Tomorrow (00:00 - 23:59), 07 July 2017': {
      'Fire Danger Rating': 'No Fire Danger Rating',
      'Total Fire Ban': 'No',
    },
  };

  it('should return fire district data in appropriate format', () => {
    const actual = fetchFireDistricts['SA'](data, 'Adelaide Metropolitan');
    expect(actual).toEqual(fireDistrictData);
  });

  it('should return suburb data in appropriate format', () => {
    const expected = {
      Suburb: 'Campbelltown',
      'Fire District': 'Adelaide Metropolitan',
      Link: 'http://cms.esau.sa.gov.au',
      'Today (00:00 - 23:59), 06 July 2017': {
        'Fire Danger Rating': 'No Fire Danger Rating',
        'Total Fire Ban': 'No',
      },
      'Tomorrow (00:00 - 23:59), 07 July 2017': {
        'Fire Danger Rating': 'No Fire Danger Rating',
        'Total Fire Ban': 'No',
      },
    };
    const actual = fetchSuburbs['SA'](fireDistrictData, 'Adelaide Metropolitan', 'Campbelltown');
    expect(actual).toEqual(expected);
  });
});
