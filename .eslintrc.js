module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'airbnb'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'error',
    'prefer-destructuring': 0,
    'linebreak-style': 0,
    'no-param-reassign': 'off',
    'no-return-assign': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
  },
  overrides: [
    {
      files: [
        '**/*.spec.js',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
