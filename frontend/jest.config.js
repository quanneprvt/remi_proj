const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  moduleDirectories: ["node_modules", "src"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": ["<rootDir>/src/$1"],
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
};

module.exports = createJestConfig(customJestConfig);
