const dataPoints = Array(30).fill({}).map((_, i) => ({
  value: i * 3,
  date: new Date(new Date().getTime() - ((30 - i) * 1000 * 60 * 60 * 24))
}));
export const monthlyStressData = {
  average: dataPoints.reduce((p, c) => p + c.value, 0) / dataPoints.length,
  dataPoints: dataPoints
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