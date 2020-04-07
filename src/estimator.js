const covid19ImpactEstimator = (data) => {
    const reportedCases = data;

    return {
        data: reportedCases,
        impact: {
            currentlyInfected: reportedCases * 10,
            infectionsByRequestedTime: currentlyInfected * 512
        },
        severeImpact: {
            currentlyInfected: reportedCases * 50,
            infectionsByRequestedTime: currentlyInfected * 512
        }
    }
}

export default covid19ImpactEstimator;
