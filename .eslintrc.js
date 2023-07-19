module.exports = {
  extends: ["taro", "taro/react", "plugin:prettier/recommended"],
  plugins: ["simple-import-sort"],
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-shadow": "off",
    "jsx-quotes": ["error", "prefer-double"],
    "import/no-commonjs": [0],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "off",
  },
};
