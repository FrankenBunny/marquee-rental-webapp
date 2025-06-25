const { defaults } = require('jest-config');

module.exports = {
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,js}',
    '!<rootDir>/jest.config.js',
    '!<rootDir>/coverage/**',
    '!**/*.test.{js,ts}',
    '!<rootDir>/server.js'
  ],
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    "./routes/": {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  projects: [
    {
      displayName: {
        name: 'Unit',
        color: 'blueBright',
      },
      moduleDirectories: [...defaults.moduleDirectories, 'bower_components'],
      testMatch: ['<rootDir>/__tests__/unit/**/*.test.*'],
    },
    {
      displayName: {
        name: 'Integration',
        color: 'yellowBright',
      },
      moduleDirectories: [...defaults.moduleDirectories, 'bower_components'],
      testMatch: ['<rootDir>/__tests__/integration/**/*.test.*'],
    },
    {
      displayName: {
        name: 'lint',
        color: 'magentaBright',
      },
      runner: 'jest-runner-eslint',
      testMatch: ['<rootDir>/**/*.{js,ts}'],
    },
  ],
};
