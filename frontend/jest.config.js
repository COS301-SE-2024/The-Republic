module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': '<rootDir>/styleMock.ts',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/index.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!coverage/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/',  "<rootDir>/cypress/"],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};