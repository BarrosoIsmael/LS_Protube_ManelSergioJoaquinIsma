import type { Config } from 'jest';

const config: Config = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  transform: {
    '^.+\\.tsx?$': 'babel-jest',  // Use babel-jest to transform TypeScript files
    '^.+\\.jsx?$': 'babel-jest',  // Use babel-jest for JavaScript/JSX files
    '^.+\\.css$': 'jest-transform-stub',  // Handle CSS imports
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'jest-transform-stub',  // Mock CSS files in tests
  },
  transformIgnorePatterns: [
    "/node_modules/(?!your-package-to-transform)"  // Optional, for transforming specific node_modules packages
  ],
};

export default config;
