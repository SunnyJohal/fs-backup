module.exports = {
  parser: 'babel-eslint',
  root: true,
  extends: 'eslint:recommended',
  globals: {
    wp: true
  },
  env: {
    node: true,
    es6: true,
    amd: true,
    browser: true,
    jquery: true
  },
  parserOptions: {
    ecmaFeatures: {
      globalReturn: true,
      generators: false,
      objectLiteralDuplicateProperties: false,
      experimentalObjectRestSpread: true,
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['import', 'babel', 'react'],
  settings: {
    'import/core-modules': [],
    'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$']
  },
  rules: {
    'react/jsx-uses-vars': 1,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0
    // "comma-dangle": [
    //   "error",
    //   {
    //     "arrays": "always-multiline",
    //     "objects": "always-multiline",
    //     "imports": "always-multiline",
    //     "exports": "always-multiline",
    //     "functions": "ignore"
    //   }
    // ]
  }
};