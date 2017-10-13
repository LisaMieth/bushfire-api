import expect from 'expect';
import request from 'supertest';
import { app } from '../../js/server/server.js';

describe('/state', () => {
  context('NSW', () => {
    it('should send back json for valid request', (done) => {
      request(app)
        .get('/fire-danger/state/nsw')
        .expect(200)
        .expect(res => {
          expect(res.type).toEqual('application/json');
          expect(JSON.parse(res.text)).toIncludeKeys(['FireDangerMap']);
        })
        .end(done);
    });
  });

  context('ACT', () => {
    it('should send back json for valid request', (done) => {
      request(app)
        .get('/fire-danger/state/ACT')
        .expect(200)
        .expect(res => {
          expect(res.type).toEqual('application/json');
          expect(JSON.parse(res.text)).toInclude({ Name: 'ACT' });
        })
        .end(done);
    });
  });

  context('VIC', () => {
    it('should send back json for valid request', (done) => {
      request(app)
        .get('/fire-danger/state/vic')
        .expect(200)
        .expect(res => {
          expect(res.type).toEqual('application/json');
          expect(JSON.parse(res.text)).toIncludeKeys(['results']);
        })
        .end(done);
    });
  });

  context('SA', () => {
    it('should send back json for valid request', (done) => {
      request(app)
        .get('/fire-danger/state/sa')
        .expect(200)
        .expect(res => {
          expect(res.type).toEqual('application/json');
          expect(JSON.parse(res.text)).toIncludeKeys(['rss']);
        })
        .end(done);
    });
  });

  it('should send back 404 for unsupported state', (done) => {
    request(app)
      .get('/fire-danger/state/qld')
      .expect(404)
      .expect(res => expect(res.error.text).toBe('This state is currently not supported'))
      .end(done);
  });
});

describe('/fire-district', () => {
  context('NSW', () => {
    it('should return proper data for valid fire district', (done) => {
      request(app)
        .get('/fire-danger/fire-district/greater%20sydney,nsw')
        .expect(200)
        .expect(res => expect(JSON.parse(res.text)).toInclude({ Name: 'Greater Sydney Region' }))
        .end(done);
    });
  });

  context('ACT', () => {
    it('should return proper data for valid fire district', (done) => {
      request(app)
        .get('/fire-danger/fire-district/gungahlin,act')
        .expect(200)
        .expect(res => expect(JSON.parse(res.text)).toInclude({ Name: 'ACT' }))
        .end(done);
    });
  });

  context('VIC', () => {
    it('should return proper data for valid fire district', (done) => {
      request(app)
        .get('/fire-danger/fire-district/mallee,vic')
        .expect(200)
        .expect(res => {
          const parsed = JSON.parse(res.text);
          expect(parsed).toIncludeKeys(['Mallee']);

          parsed['Mallee'].forEach(item => {
            expect(item.declareList.fireDistrict).toEqual('Mallee');
            expect(item.declareList).toIncludeKeys(['fireBan', 'fireDistrict']);
          });
        })
        .end(done);
    });
  });

  context('SA', () => {
    it('should return proper data for valid fire district', (done) => {
      request(app)
        .get('/fire-danger/fire-district/adelaide%20metropolitan,sa')
        .expect(200)
        .expect(res => expect(JSON.parse(res.text)).toInclude({ 'Fire District': 'Adelaide Metropolitan' }))
        .end(done);
    });
  });

  it('should return 404 if state does not match fire district', (done) => {
    request(app)
      .get('/fire-danger/fire-district/mallee,sa')
      .expect(404)
      .expect(res => expect(res.error.text).toEqual('State is not matching fire district'))
      .end(done);
  });
});

describe('/suburb', () => {
  context('NSW', () => {
    it('should return proper data for valid suburb', (done) => {
      request(app)
        .get('/fire-danger/suburb/katoomba,nsw')
        .expect(200)
        .expect(res => expect(JSON.parse(res.text)).toInclude({ Suburb: 'Katoomba', FireDistrict: 'Greater Sydney' }))
        .end(done);
    });
  });

  context('ACT', () => {
    it('should return proper data for valid suburb', (done) => {
      request(app)
        .get('/fire-danger/suburb/braddon,act')
        .expect(200)
        .expect(res => expect(JSON.parse(res.text)).toInclude({ Name: 'ACT' }))
        .end(done);
    });
  });

  context('VIC', () => {
    it('should return proper data for valid suburb', (done) => {
      request(app)
        .get('/fire-danger/suburb/richmond,vic')
        .expect(200)
        .expect(res => {
          const parsed = JSON.parse(res.text);
          expect(parsed).toIncludeKey('Richmond');
          parsed['Richmond'].forEach(item => {
            expect(item.declareList.fireDistrict).toEqual('Central');
            expect(item.declareList).toIncludeKeys(['fireBan', 'fireDistrict']);
          });
        })
        .end(done);
    });
  });

  context('SA', () => {
    it('should return proper data for valid suburb', (done) => {
      request(app)
        .get('/fire-danger/suburb/campbelltown,sa')
        .expect(200)
        .expect(res => expect(JSON.parse(res.text)).toInclude({ Suburb: 'Campbelltown', 'Fire District': 'Adelaide Metropolitan' }))
        .end(done);
    });
  });

  it('should return 404 if no fire district for suburb found', (done) => {
    request(app)
      .get('/fire-danger/suburb/campbelltown,vic')
      .expect(404)
      .expect(res => expect(res.error.text).toEqual('Could not find a fire district for your suburb.'))
      .end(done);
  });
});
