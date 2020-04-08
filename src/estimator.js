const covid19ImpactEstimator = (data) => {
  const reportedCases = data;
  const impactCurrentlyInfected = reportedCases * 10;
  const severeImpactcurrentlyInfected = reportedCases * 50;
  const impactInfectionsByRequestedTime = impactCurrentlyInfected * 512;
  const severeImpactInfectionsByRequestedTime = severeImpactcurrentlyInfected * 512;
  return {
    data: reportedCases,
    impact: {
      currentlyInfected: impactCurrentlyInfected,
      infectionsByRequestedTime: {
        days: impactInfectionsByRequestedTime
      }
    },
    severeImpact: {
      currentlyInfected: severeImpactcurrentlyInfected,
      infectionsByRequestedTime: {
        days: severeImpactInfectionsByRequestedTime
      }
    }
  };
};
export default covid19ImpactEstimator;
