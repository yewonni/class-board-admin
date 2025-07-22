module.exports = {
  projects: [
    {
      displayName: "server",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/server/**/__tests__/**/*.test.ts"],
      rootDir: ".",
      globals: {
        "ts-jest": {
          tsconfig: "server/tsconfig.json",
        },
      },
    },
    {
      displayName: "client",
      preset: "ts-jest",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/client/**/__tests__/**/*.test.ts?(x)"],
      rootDir: ".",
      globals: {
        "ts-jest": {
          tsconfig: "client/tsconfig.json",
        },
      },
    },
  ],
};
