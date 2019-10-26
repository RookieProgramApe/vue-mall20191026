module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    'no-useless-escape': 'off',
    'no-multiple-empty-lines': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': 0,
    'indent': 0,
    'semi': 'off',
    'one-var': 'off',
    'generator-star-spacing': 0,
    "no-prototype-builtins": 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "valid-jsdoc": 1,
    "space-before-function-paren": 0,
    "no-inner-declarations": 0,
    "no-extend-native": 0,
    "eqeqeq": [1, "allow-null"]
  }
}
