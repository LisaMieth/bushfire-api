import express from 'express';
import {
  fetchData,
  fetchFireDistrictData,
  fetchSuburbData,
} from '../fb/handlers.js';

const app = express();
const port = process.env.PORT || 3000;

app.get('/fire-danger/state/:state', async (req, res) => {
  const state = req.params.state;
  const result = await fetchData(state);
  res.send(result);
});

app.get('/fire-danger/fire-district/:fireDistrict', async (req, res) => {
  const fireDistrict = req.params.fireDistrict;
  const result = await fetchFireDistrictData(fireDistrict);
  res.send(result);
});

app.get('/fire-danger/suburb/:suburb,:state', async (req, res) => {
  const suburb = req.params.suburb;
  const state = req.params.state;
  const result = await fetchSuburbData(suburb, state);
  res.send(result);
});

// any passed in query strings like: ?raw=true&state=qld
// app.get('/fire-danger/search/:suburb', (req, res) => {
//   console.log('in get');
//   // TODO
//   const state = req.query.state;
//   res.send(state);
// });

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
