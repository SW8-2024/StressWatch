import type {Config} from 'jest';

const jestPreset = require("@testing-library/react-native/jest-preset")

const config: Config = {
    preset: 'jest-expo',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
      '\\.[jt]sx?$': 'babel-jest',
    },
    setupFiles: [...jestPreset.setupFiles],
    setupFilesAfterEnv: ["./jest-async-storage-mock.ts"],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
export default config