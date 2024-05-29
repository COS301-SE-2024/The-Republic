// eslint.config.mjs

import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
});
