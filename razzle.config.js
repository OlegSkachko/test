'use strict';

const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  plugins: ['scss'],
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    // Use the same detection code from `createConfigAsync` to ensure that this example is using version 4
    const devserverPkg = require('webpack-dev-server/package.json');
    const devServerMajorVersion = parseInt(devserverPkg.version[0]);
    if (devServerMajorVersion < 4) {
      throw new Error(`This should be webpack-dev-server version 4, got ${devServerMajorVersion} instead`);
    }

    config.resolve.plugins = [
      ...config.resolve.plugins,
      new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }),
    ];

    return config;
  },
  modifyWebpackOptions({
   env: {
     target, // the target 'node' or 'web'
     dev, // is this a development build? true or false
   },
   options: {
     webpackOptions, // the default options that will be used to configure webpack/ webpack loaders and plugins
   }
  }) {
    webpackOptions.notNodeExternalResMatch = (request, context) => {
      return /@garpix\/garpix-web-components-react|@garpix\/garpix-web-components|@garpix\/base-api|@garpix\/fetcher/.test(request)
    };
    webpackOptions.babelRule.include = webpackOptions.babelRule.include.concat([
      /@garpix\/garpix-web-components-react/,
      /@garpix\/garpix-web-components/,
      /@garpix\/base-api/,
      /@garpix\/fetcher/
    ]);
    return webpackOptions;
  }
};
