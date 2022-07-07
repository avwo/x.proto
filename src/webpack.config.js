const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  target: ['web', 'es5'],
  entry: {
    index: './src/index.js',
  },
  externalsPresets: {
    node: true,
  },
  watchOptions: {
    ignored: ['**/node_modules', '**/dist'],
  },
  output: {
    libraryTarget: 'umd',
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.proto$/,
        use: {
          loader: path.join(__dirname, '../loader.js'),
          options: {
            url: 'http://admin.tde.woa.com/cgi-bin/external/api/values/batchSet',
            params: {
              space: 'imsdk',
              group: 'edu',
              type: 'proto',
            },
          },
        },
      },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
    ],
  },
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
};
