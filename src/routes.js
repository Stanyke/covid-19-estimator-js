const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Xml2js = require('xml2js');
const covid19ImpactEstimator = require('./estimator');

const app = express();
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/on-covid-19', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Covid-19 Estimator API'
  });
});

app.post('/api/v1/on-covid-19', (req, res) => {
  const data = {
    region: req.body.region,
    periodType: req.body.periodType,
    timeToElapse: req.body.timeToElapse,
    reportedCases: req.body.reportedCases,
    population: req.body.population,
    totalHospitalBeds: req.body.totalHospitalBeds
  };
  res.send(covid19ImpactEstimator(data));
});

app.get('/api/v1/on-covid-19/jso', (req, res) => {
  const data = {
    region: 'Africa',
    periodType: 'days',
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614
  };
  res.send(covid19ImpactEstimator(data));
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
  const data = {};
  data.region = req.body.region;
  data.periodType = req.body.periodType;
  data.timeToElapse = req.body.timeToElapse;
  data.reportedCases = req.body.reportedCases;
  data.population = req.body.population;
  data.totalHospitalBeds = req.body.totalHospitalBeds;
  res.send(covid19ImpactEstimator(data));
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
  const data = req.body;
  const estimation = covid19ImpactEstimator(data);
  const builder = new Xml2js.Builder();
  res.header('Content-Type', 'application/xml; charset=UTF-8');
  res.status(200).send(builder.buildObject(estimation));
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  const filePath = path.join(__dirname, 'myLogs.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    }
    if (!err) {
      res.header('Content-Type', 'text/plain; charset=UTF-8');
      res.status(200).send(`${data}`);
    }
  });
});

app.delete('/api/v1/on-covid-19/logs', (req, res) => {
  try {
    const filePath = path.join(__dirname, 'myLogs.txt');
    fs.unlinkSync(filePath);
    res.status(201).send({
      message: 'logs deleted'
    });
  } catch (error) {
    throw new Error('We Encoutered an error deleting the logs, try again...');
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server Running On port ${port}`);
});

const routes = app;

module.exports = routes;
