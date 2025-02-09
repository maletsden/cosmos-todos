module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    "no-param-reassign": ["error", { "props": false }],
    "no-console": "off",
    "max-len": ["error", { "code": 120 }]
  },
};
