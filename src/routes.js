const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Xml2js = require('xml2js');
const hrtime = require('process.hrtime');
const covid19ImpactEstimator = require('./estimator');

const app = express();
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const logsFilePath = path.join(__dirname, 'api_log_responses.txt');

app.get('/api/v1/on-covid-19', (req, res) => {
  const apiRunTimeStart = hrtime();
  const timeInNanoSec = 1e9;
  const apiRunTimeDifference = process.hrtime(apiRunTimeStart);

  const requestApi = res.status(200).json({
    success: true,
    message: 'Welcome to Covid-19 Estimator RestFul API'
  });

  const apiRunTimeEnd = Math.trunc((apiRunTimeDifference[0]
     * timeInNanoSec + apiRunTimeDifference[1]) / 500);

  if (requestApi) {
    fs.appendFile(logsFilePath, `\nGET\t\t/api/v1/on-covid-19\t\t200\t\t${apiRunTimeEnd}ms`, (err) => {
      if (err) throw err;
    });
  }
});

app.post('/api/v1/on-covid-19', (req, res) => {
  const apiRunTimeStart = hrtime();
  const timeInNanoSec = 1e9;
  const apiRunTimeDifference = process.hrtime(apiRunTimeStart);

  const data = req.body;

  const sendApiRequest = res.send(covid19ImpactEstimator(data));

  const apiRunTimeEnd = Math.trunc((apiRunTimeDifference[0]
     * timeInNanoSec + apiRunTimeDifference[1]) / 500);

  if (sendApiRequest) {
    fs.appendFile(logsFilePath, `\nPOST\t\t/api/v1/on-covid-19\t\t200\t\t${apiRunTimeEnd}ms`, (err) => {
      if (err) throw err;
    });
  }
});

app.get('/api/v1/on-covid-19/json', (req, res) => {
  const apiRunTimeStart = hrtime();
  const timeInNanoSec = 1e9;
  const apiRunTimeDifference = process.hrtime(apiRunTimeStart);

  const data = {};
  data.region = {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  };
  data.periodType = 'days';
  data.timeToElapse = 58;
  data.reportedCases = 674;
  data.population = 66622705;
  data.totalHospitalBeds = 1380614;

  const requestApi = res.send(covid19ImpactEstimator(data));

  const apiRunTimeEnd = Math.trunc((apiRunTimeDifference[0]
     * timeInNanoSec + apiRunTimeDifference[1]) / 500);

  if (requestApi) {
    fs.appendFile(logsFilePath, `\nGET\t\t/api/v1/on-covid-19/json\t\t200\t\t${apiRunTimeEnd}ms`, (err) => {
      if (err) throw err;
    });
  }
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
  const apiRunTimeStart = hrtime();
  const timeInNanoSec = 1e9;
  const apiRunTimeDifference = process.hrtime(apiRunTimeStart);

  const data = {};
  data.region = req.body.region;
  data.periodType = req.body.periodType;
  data.timeToElapse = req.body.timeToElapse;
  data.reportedCases = req.body.reportedCases;
  data.population = req.body.population;
  data.totalHospitalBeds = req.body.totalHospitalBeds;

  const sendApiRequest = res.send(covid19ImpactEstimator(data));

  const apiRunTimeEnd = Math.trunc((apiRunTimeDifference[0]
     * timeInNanoSec + apiRunTimeDifference[1]) / 500);

  if (sendApiRequest) {
    fs.appendFile(logsFilePath, `\nPOST\t\t/api/v1/on-covid-19/json\t\t200\t\t${apiRunTimeEnd}ms`, (err) => {
      if (err) throw err;
    });
  }
});

app.get('/api/v1/on-covid-19/xml', (req, res) => {
  const apiRunTimeStart = hrtime();
  const timeInNanoSec = 1e9;
  const apiRunTimeDifference = process.hrtime(apiRunTimeStart);

  const data = {};
  data.region = {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  };
  data.periodType = 'days';
  data.timeToElapse = 58;
  data.reportedCases = 674;
  data.population = 66622705;
  data.totalHospitalBeds = 1380614;

  const estimation = covid19ImpactEstimator(data);
  const builder = new Xml2js.Builder();
  res.header('Content-Type', 'application/xml; charset=UTF-8');
  const requestApi = res.status(200).send(builder.buildObject(estimation));

  const apiRunTimeEnd = Math.trunc((apiRunTimeDifference[0]
     * timeInNanoSec + apiRunTimeDifference[1]) / 500);

  if (requestApi) {
    fs.appendFile(logsFilePath, `\nGET\t\t/api/v1/on-covid-19/xml\t\t200\t\t${apiRunTimeEnd}ms`, (err) => {
      if (err) throw err;
    });
  }
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
  const apiRunTimeStart = hrtime();
  const timeInNanoSec = 1e9;
  const apiRunTimeDifference = process.hrtime(apiRunTimeStart);

  const data = req.body;

  const estimation = covid19ImpactEstimator(data);
  const builder = new Xml2js.Builder();
  res.header('Content-Type', 'application/xml; charset=UTF-8');
  const sendApiRequest = res.status(200).send(builder.buildObject(estimation));

  const apiRunTimeEnd = Math.trunc((apiRunTimeDifference[0]
     * timeInNanoSec + apiRunTimeDifference[1]) / 500);

  if (sendApiRequest) {
    fs.appendFile(logsFilePath, `\nPOST\t\t/api/v1/on-covid-19/xml\t\t200\t\t${apiRunTimeEnd}ms`, (err) => {
      if (err) throw err;
    });
  }
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  res.header('Content-Type', 'text/plain; charset=UTF-8');

  const apiRunTimeStart = hrtime();
  const timeInNanoSec = 1e9;
  const apiRunTimeDifference = process.hrtime(apiRunTimeStart);

  fs.readFile(logsFilePath, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    if (!err) {
      res.status(200).send(`${data}`);
      const apiRunTimeEnd = Math.trunc((apiRunTimeDifference[0]
         * timeInNanoSec + apiRunTimeDifference[1]) / 500);

      fs.appendFile(logsFilePath, `\nGET\t\t/api/v1/on-covid-19/logs\t\t200\t\t${apiRunTimeEnd}ms`, (fsErr) => {
        if (fsErr) throw err;
      });
    }
  });
});

app.delete('/api/v1/on-covid-19/logs', (req, res) => {
  fs.writeFile(logsFilePath, '', (fsErr) => {
    if (fsErr) {
      res.status(505).json({
        success: false,
        message: 'We encoutered an error deleting the logs, try again...'
      });
    }

    res.status(201).json({
      success: true,
      message: 'API response(s) logs deleted successfully'
    });
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server Running On port ${port}`);
});

const routes = app;

module.exports = routes;
