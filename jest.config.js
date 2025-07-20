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
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/client/**/__tests__/**/*.test.ts?(x)"],
      rootDir: ".",
      transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
      },
    },
  ],
};
