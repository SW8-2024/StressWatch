export type UsageDataEvent = {
  success: boolean,
  data: (string|number)[][],
  start: number,
  end: number;
};
