const config = {
  // Use ts-jest preset for testing TypeScript files with Jest
  preset: "ts-jest",

  // Set the test environment to Node.js
  testEnvironment: "node",

  // Define the setup file for Jest
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Define the root directory for tests and modules
  roots: ["<rootDir>/tests"],

  // Use ts-jest to transform TypeScript files
  transform: {
    "^.+\\.ts$": "ts-jest",
  },

  // File extensions to recognize in module resolution
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

module.exports = {
  projects: [
    {
      ...config,
      displayName: "unit",
      testMatch: ["<rootDir>/tests/unit/**/*.spec.ts"],
    },
    {
      ...config,
      displayName: "integration",
      testMatch: ["<rootDir>/tests/integration/**/*.spec.ts"],
    },
  ],
};
