module.exports = {
  env: {
    es2021: true,
    "react-native/react-native": true,
  },
  extends: [
    "plugin:react/recommended",
    "standard-with-typescript",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks", "react-native"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "react/prop-types": 0,
    "@typescript-eslint/strict-boolean-expressions": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-misused-promises": 0,
    "@typescript-eslint/naming-convention": 0,
    "@typescript-eslint/prefer-nullish-coalescing": 0,
    "react-native/no-color-literals": 0,
    "react-native/no-unused-styles": 2,
    "react-native/split-platform-components": 2,
    "react-native/no-inline-styles": 0,
    "react-native/no-raw-text": 2,
    "react/display-name": 0,
    "react-native/no-single-element-style-arrays": 2,
    "newline-before-return": 2,
  },
};
