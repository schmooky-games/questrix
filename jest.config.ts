module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/**/*.test.ts'],
    moduleNameMapper: {
      '^@questrix/core$': '<rootDir>/packages/core/src'
    }
  };