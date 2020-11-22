module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/extensions': [
      'error',
      'always',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-unused-vars': [
      'error',
      { argsIgnorePattern: 'next' },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: 'next' },
    ],
    'no-underscore-dangle': [
      'error',
      { allow: '_id' },
    ]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
};
