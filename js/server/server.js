import express from 'express';
import {
  fetchData,
  fetchFireDistrictData,
  fetchSuburbData,
} from '../fb/handlers.js';

export const app = express();
const port = process.env.PORT || 3000;

app.get('/fire-danger/state/:state', async (req, res) => {
  try {
    const state = req.params.state;
    const result = await fetchData(state);
    res.send(result);
  }
  catch (error) {
    res.status(404).send(error.message);
  }
});

app.get('/fire-danger/fire-district/:fireDistrict,:state', async (req, res) => {
  const { state, fireDistrict } = req.params;

  try {
    const result = await fetchFireDistrictData(fireDistrict, state);
    res.send(result);
  }
  catch (error) {
    res.status(404).send(error.message);
  }
});

app.get('/fire-danger/suburb/:suburb,:state', async (req, res) => {
  const { state, suburb } = req.params;
  try {
    const result = await fetchSuburbData(suburb, state);
    res.send(result);
  }
  catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
