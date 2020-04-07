const covid19ImpactEstimator = (data) => {
  const reportedCases = data;
  return {
    data: reportedCases,
    impact: {
      currentlyInfected: reportedCases * 10,
      infectionsByRequestedTime: reportedCases * 10 * 512
    },
    severeImpact: {
      currentlyInfected: reportedCases * 50,
      infectionsByRequestedTime: reportedCases * 50 * 512
    }
  };
};
export default covid19ImpactEstimator;
