module.exports = {
  collectCoverage: true,
  // on node 14.x coverage provider v8 offers good speed and more or less good report
  coverageProvider: "v8",
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!<rootDir>/out/**",
    "!<rootDir>/.next/**",
    "!<rootDir>/*.config.js",
    "!<rootDir>/*.config.ts",
    "!<rootDir>/middleware.ts",
    "!<rootDir>/app/layout.tsx",
    "!<rootDir>/app/\\(home\\)/layout.tsx",
    "!<rootDir>/app/\\(auth\\)/layout.tsx",
    "!<rootDir>/app/layout.tsx",
    "!<rootDir>/data/**",
    "!<rootDir>/lib/types.ts",
    "!<rootDir>/lib/mock.ts",
    "!<rootDir>/lib/reports.ts",
    "!<rootDir>/cypress/**",
    "!<rootDir>/coverage/**",
  ],
  moduleNameMapper: {
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    "^.+\\.module\\.(css|less|sass|scss)$": "identity-obj-proxy",

    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i": `<rootDir>/__mocks__/fileMock.js`,

    // Handle module aliases
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/(.*)$": "<rootDir>/$1",

    // 'd3' and d3-hierarchy mock files
    "^d3$": "<rootDir>/__mocks__/d3.ts",
    "^d3-hierarchy$": "<rootDir>/__mocks__/d3-hierarchy.ts",
    // Handle @next/font
    "@next/font/(.*)": `<rootDir>/__mocks__/nextFontMock.js`,
    // Handle next/font
    "next/font/(.*)": `<rootDir>/__mocks__/nextFontMock.js`,
    // Handle uuid
    "uuid": `<rootDir>/__mocks__/uuid.ts`,
    // Disable server-only
    "server-only": `<rootDir>/__mocks__/empty.js`,
  },
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/cypress/",
  ],
  testEnvironment: "jsdom",
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  preset: "ts-jest",
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
  modulePathIgnorePatterns: [
    // Ignore d3 & d3-hierarchy module
    "<rootDir>/node_modules/d3/",
    "<rootDir>/node_modules/d3-hierarchy/",
  ],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
};
