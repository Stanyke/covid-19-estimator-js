const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  let numberOfDays;
  if (data.periodType === 'days') {
    numberOfDays = data.timeToElapse;
  }
  if (data.periodType === 'weeks') {
    numberOfDays = 7 * data.timeToElapse;
  }
  if (data.periodType === 'months') {
    numberOfDays = 30 * data.timeToElapse;
  }

  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;

  const exponent = Math.floor(numberOfDays / 3);

  impact.infectionsByRequestedTime = Math.floor(
    impact.currentlyInfected * 2 ** exponent
  );
  severeImpact.infectionsByRequestedTime = Math.floor(
    severeImpact.currentlyInfected * 2 ** exponent
  );

  impact.severeCasesByRequestedTime = Math.floor(0.15 * impact.infectionsByRequestedTime);

  const sCBRT = Math.floor(0.15 * severeImpact.infectionsByRequestedTime);

  severeImpact.severeCasesByRequestedTime = sCBRT;

  const bedAvailability = Math.floor(0.35 * data.totalHospitalBeds);

  const hBBRT = Math.floor(bedAvailability - impact.severeCasesByRequestedTime);

  impact.hospitalBedsByRequestedTime = hBBRT;

  severeImpact.hospitalBedsByRequestedTime = Math.floor(bedAvailability
    - severeImpact.severeCasesByRequestedTime);

  const result = {
    data,
    impact,
    severeImpact
  };
  return result;
};

export default covid19ImpactEstimator;
