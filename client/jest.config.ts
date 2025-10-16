import type { Config } from 'jest';
import path from 'path'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // frontend tests
  setupFilesAfterEnv: [path.resolve()+'/jest.setup.ts'],
  moduleNameMapper: {
    // adjust to your aliases
    '^@/(.*)$': path.resolve()+'/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
};

export default config;
