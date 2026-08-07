module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: [
    ".next",
    ".eslintrc.cjs",
    "next-env.d.ts",
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    "no-empty": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
