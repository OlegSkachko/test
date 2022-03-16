module.exports = {
  roots: ['<rootDir>/../'],
  transformIgnorePatterns: [
    "node_modules/(?!(@garpix/fetcher|@garpix/garpix-web-components-react|@garpix/garpix-web-components)/)"
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.tsx?$': 'ts-jest',
    "node_modules/@garpix/fetcher/.+\\.(j|t)sx?$": "ts-jest",
    "node_modules/@garpix/garpix-web-components-react/.+\\.(j|t)sx?$": "ts-jest",
    "node_modules/@garpix/garpix-web-components/.+\\.(j|t)sx?$": "ts-jest",
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/fileTransformer.js',
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform"
  },
  testRegex: [
    "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  clearMocks: true,
  // collectCoverage: true,
  // coverageDirectory: "coverage",
};
