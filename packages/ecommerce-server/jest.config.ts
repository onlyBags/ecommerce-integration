import { type JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  displayName: 'ecommerce-server',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'html'],
  // transform: {
  //   '^.+\\.[tj]s$': [
  //     'ts-jest',
  //     {
  //       tsconfig: '<rootDir>/tsconfig.spec.json',
  //       useESM: true,
  //     },
  //   ],
  // },
  transform: {},
  transformIgnorePatterns: ['node_modules/(?!@dg-live)'],
  coverageDirectory: '../../coverage/packages/ecommerce-server',
};

export default jestConfig;
