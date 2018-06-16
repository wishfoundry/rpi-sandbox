module.exports = {
  plugins: [
    '@babel/plugin-transform-react-display-name',
    'babel-plugin-add-react-displayname',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-decorators', { legacy: true }]
  ],
  env: {
    development: {
        presets: [
            [
                '@babel/preset-env',
                {
                    modules: false
                }
            ],
            '@babel/react'
        ],
    },
    test: {
        presets: [['@babel/env'], '@babel/react'],
    },
    production: {
        presets: [['@babel/env'], '@babel/react'],
    }
}
}
