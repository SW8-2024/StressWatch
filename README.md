# StressWatch
SW8 semester project

## Setup
1. Install dependencies
```bash
npm install
```
For the native module to work you need the following:
Install JDK 17 and update JAVA_HOME
Install android APK and update ANDROID_HOME (the license also needs to be accepted)
An Android phone needs to be connected via usb or wifi with USB debugging activated
UsageStats permissions needs to be given to the Stressanalyzer app on your phone

2. Build modules
```bash
npx expo prebuild
```
Alternatively if something is not working:
```bash
npx expo prebuild --clean
```
3. Run project
```bash
npx expo run:android
```

If you do not want to use the native module,
```bash
npx expo start
```
can still be used but any references to the native module will cause errors.
