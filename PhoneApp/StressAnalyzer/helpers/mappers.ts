import { valueToColor } from "./graphHelpers";

export function mapAppAnalysisData(data: RemoteAppUsageAnalysis): AppAnalysisData {
  return {
    name: data.name,
    averageStress: data.averageStress,
    referenceStress: data.referenceStress,
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

export function mapAppAnalysisPerDate(data: RemoteAppAnalysisByDate): AppAnalysisByDateData {

  let usageParsed = data.totalUsage.match(/^([0-9]+):([0-9]+):([0-9]+)\.[0-9]+$/);
  if (usageParsed?.length != 4) {
    console.log(usageParsed?.length)
    throw new Error("Could not parse appAnalysisByDate data, got: " + JSON.stringify(usageParsed));
  }
  return {
    date: new Date(Date.parse(data.dateTime)),
    averageStress: data.dayAverageStress,
    referenceStress: data.dayReferenceStress,
    usageHours: Number(usageParsed[1]),
    usageMinutes: Number(usageParsed[2]),
    usageSeconds: Number(usageParsed[3]),
  }
}

export function mapRemoteGraphToInternal(data: RemoteGraphDataForAppAndDate): GraphDataForAppAndDate {
  let stress = data.averageStress;
  let label = "";
  let date = new Date(Date.parse(data.dateTime));
  //We get data in 15 minute intervals so this finds the first interval of every fourth hour
  if (date.getHours() % 4 == 0 && date.getMinutes() <= 15){
    label = date.getHours().toString();
    if (label.length == 1){
      label = "0" + label;
    }
  }
  return {
    value: stress ?? 0,
    label: label,
    cap: data.appOpen,
    frontColor: valueToColor(stress),
  }
}

export function mapAppAnalysisByDateAndApp(data: RemoteAppAnalysisByDayAndApp): AppAnalysisByDayAndApp {
  let usageParsed = data.usage.match(/^([0-9]+):([0-9]+):([0-9]+)\.[0-9]+$/);
  if (usageParsed?.length != 4) {
    throw new Error("Could not parse appAnalysisByDate data, got: " + JSON.stringify(usageParsed));
  }

  return {
    startTime: new Date(Date.parse(data.startTime)),
    averageStress: data.averageStress,
    referenceStress: data.referenceStress,
    usageHours: Number(usageParsed[1]),
    usageMinutes: Number(usageParsed[2]),
    usageSeconds: Number(usageParsed[3]),
  }
}