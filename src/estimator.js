const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  
  const numberOfDays;
  
  if (data.periodType === 'days')
  {
    numberOfDays = data.timeToElapse;
  }
  else if (data.periodType === 'weeks')
  {
    numberOfDays = 7 * data.timeToElapse;
  }
  if (data.periodType === 'months')
  {
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
  
  const result = {
    data,
    impact,
    severeImpact
  };

  return result;
};

export default covid19ImpactEstimator;
