module.exports = {
  "extends": ["airbnb"],
  parser: 'babel-eslint',
  "env": {
    "browser": true,
    "node": true,
    jest: true
  },
  "rules": {
    "no-console": "off",
    "comma-dangle": "off",
    "react/jsx-filename-extension": "off",
    'padded-blocks': [0],
    'prefer-template': 'warn',
    indent: ['error', 4, { SwitchCase: 1 }],
  }
}
