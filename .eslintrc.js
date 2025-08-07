// .eslintrc.js - Following Robert C. Martin's Clean Code principles
module.exports = {
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Robert C. Martin's Clean Code principles
    'no-var': 'error', // Use const/let over var
    'prefer-const': 'error', // Prefer immutable values
    'no-unused-vars': 'error', // Remove dead code
    'no-console': 'warn', // Avoid production console logs

    // Kent Beck's Simple Design rules
    complexity: ['error', 10], // Keep functions simple
    'max-lines-per-function': ['error', 50], // Short, focused functions
    'max-params': ['error', 3], // Limit function parameters

    // Martin Fowler's refactoring practices
    'no-duplicate-code': 'off', // (requires plugin)
    'prefer-arrow-callback': 'error', // Modern syntax
    'object-shorthand': 'error', // Concise object syntax
  },
  ignorePatterns: [
    // Legacy learning projects (following Martin Fowler's evolutionary approach)
    'proyectos/**',
    'index.html',
    'offiline.html',

    // Generated or third-party files
    'node_modules/**',
    'dist/**',
    'build/**',
  ],
};
