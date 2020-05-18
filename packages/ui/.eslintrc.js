module.exports = {
  extends: [
    'airbnb',
    'prettier',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'prettier/react'
  ],
  env: {
    browser: true,
    node: true,
    jasmine: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'babel', '@typescript-eslint', 'react-hooks']
}