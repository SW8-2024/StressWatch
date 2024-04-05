import numpy as np
import random

testValues = [70, 72, 71, 70, 69, 70, 74, 79, 86, 85, 90, 95, 87, 85, 84, 81, 75, 74, 73, 71, 70]

def calculateStress(hrValues):
    stdHR = np.std(hrValues)
    if stdHR > 5:
        return random.randrange(1,5)
    else:
        return -1

windowSize = 5
stressLevel = 0

for i in range(len(testValues) - windowSize + 1):
    hrWindow = testValues[i:i+windowSize]
    stressLevel += calculateStress(hrWindow)
    if stressLevel < 0:
        stressLevel = 0
    elif stressLevel > 100:
        stressLevel = 100

    print("Stress Level:", stressLevel)
