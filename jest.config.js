// export default {
//   moduleNameMapper: {
//     "^@/(.*)$": "<rootDir>/src/$1",
//   },
//   testEnvironment: "jest-environment-jsdom",
//   // setupFiles: ["<rootDir>/jest.setup.js"],
//   transform: {
//     "^.+\\.[t|j]sx?$": "babel-jest",
//   },
// };

export default {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jest-environment-jsdom", // JSDOM simulates a browser environment
  setupFiles: ["<rootDir>/jest.setup.js"], // Ensure setup file is included
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
};
