/** @type {import('jest').Config} */
module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.(test|spec).ts?(x)"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
