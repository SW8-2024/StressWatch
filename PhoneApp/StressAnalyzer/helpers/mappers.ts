export function mapAppAnalysisData(data: RemoteAppUsageAnalysis): AppAnalysisData {
  let usageParsed = data.usage.match(/^([0-9]+):([0-9]+):([0-9]+)\.[0-9]+$/);
  if (usageParsed?.length != 4) {
    throw new Error("Could not parse app analysis data, got: " + JSON.stringify(usageParsed));
  }
  return {
    name: data.name,
    averageStress: data.averageStress,
    referenceStress: data.referenceStress,
    usageHours: Number(usageParsed[1]),
    usageMinutes: Number(usageParsed[2]),
    usageSeconds: Number(usageParsed[3])
  };
}

export function mapBreakDownDataToInternal(data: RemoteBreakDownData): BreakDownData {
  return {
    averageStress: data.averageStress,
    dailyStressDataPoints: data.dailyStressDataPoints.map(v => ({
      date: new Date(v.date),
      value: v.value
    })),
    stressByApp: data.stressByApp
  };
}
