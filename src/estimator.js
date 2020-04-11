const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Xml2js = require('xml2js');

const app = express();
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};

  let numberOfDays;
  if (data.periodType === 'days') {
    numberOfDays = data.timeToElapse;
  } else if (data.periodType === 'weeks') {
    numberOfDays = 7 * data.timeToElapse;
  }
  if (data.periodType === 'months') {
    numberOfDays = 30 * data.timeToElapse;
  }

  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;

  const exponent = Math.trunc(numberOfDays / 3);

  const infections = impact.currentlyInfected * (2 ** exponent);
  const sInfections = severeImpact.currentlyInfected * (2 ** exponent);

  const severeCases = 0.15 * infections;
  const sSevereCases = 0.15 * sInfections;

  const bedAvailability = 0.35 * data.totalHospitalBeds;

  impact.infectionsByRequestedTime = Math.trunc(
    impact.currentlyInfected * (2 ** exponent)
  );
  severeImpact.infectionsByRequestedTime = Math.trunc(
    severeImpact.currentlyInfected * (2 ** exponent)
  );

  impact.severeCasesByRequestedTime = Math.trunc(severeCases);
  severeImpact.severeCasesByRequestedTime = Math.trunc(sSevereCases);

  impact.hospitalBedsByRequestedTime = Math.trunc(bedAvailability - severeCases);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(bedAvailability - sSevereCases);

  impact.casesForICUByRequestedTime = Math.trunc(0.05 * impact.infectionsByRequestedTime);
  severeImpact.casesForICUByRequestedTime = Math.trunc(0.05
    * severeImpact.infectionsByRequestedTime);

  impact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * impact.infectionsByRequestedTime);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(0.02
    * severeImpact.infectionsByRequestedTime);

  const majorityEarning = Number(data.region.avgDailyIncomePopulation);
  const avgDailyIncome = Number(data.region.avgDailyIncomeInUSD);
  const days = Number(numberOfDays);

  const dollarsInFlight = (impact.infectionsByRequestedTime
    * majorityEarning * avgDailyIncome) / days;
  const sDollarsInFlight = (severeImpact.infectionsByRequestedTime
    * majorityEarning * avgDailyIncome) / days;

  impact.dollarsInFlight = Math.trunc(dollarsInFlight);
  severeImpact.dollarsInFlight = Math.trunc(sDollarsInFlight);

  const result = {
    data,
    impact,
    severeImpact
  };

  return result;
};

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
  const filePath = path.join(__dirname, 'api_log_responses.txt');
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
    const filePath = path.join(__dirname, 'api_log_responses.txt');
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

export default covid19ImpactEstimator;
