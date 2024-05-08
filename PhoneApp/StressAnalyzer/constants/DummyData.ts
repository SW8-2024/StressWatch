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
    "referenceStress": 76,
    "usage": '0:45'
  },
  {
    "image": require("@/assets/images/TwitterImage.png"),
    "name": "Twitter",
    "averageStress": 34,
    "referenceStress": 55,
    "usage": '0:13'
  },
  {
    "image": require("@/assets/images/icons8-instagram-48.png"),
    "name": "Instagram",
    "averageStress": 67,
    "referenceStress": 43,
    "usage": '0:22'
  },
  {
    "image": require("@/assets/images/icons8-facebook-48.png"),
    "name": "Facebook",
    "averageStress": 45,
    "referenceStress": 45,
    "usage": '0:28'
  },
  {
    "image": require("@/assets/images/icons8-tiktok-48.png"),
    "name": "TikTok",
    "averageStress": 20,
    "referenceStress": 20,
    "usage": '0:20'
  },
  {
    "image": require("@/assets/images/icons8-youtube-48.png"),
    "name": "YouTube",
    "averageStress": 45,
    "referenceStress": 45,
    "usage": '0:45'
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
