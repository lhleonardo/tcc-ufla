module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@config': './src/config',
          '@controllers': './src/controllers',
          '@services': './src/services',
          '@errors': './src/errors',
          '@models': './src/models',
          '@schemas': './src/schemas',
          '@repositories': './src/repositories',
          '@middlewares': './src/middlewares',
          '@providers': './src/providers',
          '@routes': './src/routes',
          '@database': './src/database',
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
  ],
};
