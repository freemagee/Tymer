module.exports = {
  parserOptions: {
    ecmaVersion: 5
  },
  env: {
    browser: true,
    jquery: true
  },
  extends: ["eslint-config-airbnb-base", "eslint-config-jquery", "eslint-config-prettier"],
  plugins: ["eslint-plugin-import", "eslint-plugin-jquery", "eslint-plugin-prettier"],
  rules: {
    "prettier/prettier": ["error", {}],
    "no-new": 0,
    "max-len": 0,
    "linebreak-style": 0,
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    indent: ["error", 2, { SwitchCase: 1 }],
    "import/no-unresolved": 0,
    strict: 0,
    "no-unused-vars": ["error", { varsIgnorePattern: "css" }],
    "no-param-reassign": ["error", { props: false }]
  }
};
