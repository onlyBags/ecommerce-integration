import type { Config } from 'jest';

const config: Config = {
  displayName: 'ecommerce-server',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
};

export default config;
