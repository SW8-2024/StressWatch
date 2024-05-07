const dataPoints = Array(30).fill({}).map((_, i) => ({
  value: Math.random() * 100,
  date: new Date(new Date().getTime() - ((30 - i) * 1000 * 60 * 60 * 24))
}));

const stressByApp = Array(30).fill({}).map((_, i) => ({
  value: Math.random() * 100,
  appName: `App ${i}`
})).sort((a, b) => b.value - a.value);

export const breakDownData = {
  stressAverage: dataPoints.reduce((p, c) => p + c.value, 0) / dataPoints.length,
  dailyStressDataPoints: dataPoints,
  stressByApp: stressByApp
}

export const screenTimeData = [
  {
    "image": require("@/assets/images/TinderImage.png"),
    "name": "Tinder",
    "averageStress": 58,
    "usage": 403
  },
  {
    "image": require("@/assets/images/TwitterImage.png"),
    "name": "Twitter",
    "averageStress": 34,
    "usage": 3163
  }
]
export const notificationData = [
  {
    "topic": "Bouldering",
    "averageStress": 81,
    "amount": 62
  },
  {
    "topic": "Dinner plans",
    "averageStress": 22,
    "amount": 11
  }
]