/*
 * Copyright (c) 2022, JOHU AB
 */
const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = () => {
  // Setup paths
  const baseDir = path.join(__dirname, '..');
  const nodeModulesPath = path.join(baseDir, 'node_modules');
  const srcPath = path.join(baseDir, 'src/main/js');
  const assetsPath = path.join(baseDir, 'src/main/assets');
  const destPath = path.join(baseDir, 'build/webpack/js');

  const entry = {
    main: [
      'babel-polyfill',
      path.join(srcPath, "main.tsx"),
    ],
  };

  const babelLoader = {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
    },
  };

  const module = {
    rules: [
      {
        test: /\.js?$/,
        // Ignore node_modules and the minified rollbar file
        exclude: /(node_modules)/,
        use: [
          babelLoader,
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          babelLoader,
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        // Process source maps included in transpiled ts-files
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  };

  module.rules.push(
    {
      test: /\.css$/,
      exclude: /\.module\.css$/,
      use: [
        {loader: 'css-loader'},
      ],
    },
    {
      test: /\.module\.css$/,
      use: [
        {loader: 'css-loader', options: {modules: { localIdentName: "[name]__[local]__[hash:base64:5]" }, importLoaders: 0}},
      ],
    },
    {
      test: /\.less$/,
      exclude: /\.module\.less$/,
      use: [
        'style-loader',
        {loader: 'css-loader'},
        {loader: 'less-loader'},
      ],
    },
    {
      test: /\.module\.less$/,
      use: [
        'style-loader',
        {loader: 'css-loader', options: {modules: {localIdentName: "[name]__[local]__[hash:base64:5]"}, importLoaders: 1}},
        {loader: 'less-loader'},
      ],
    },
    {
      test: /\.(png|jpg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 128, // inline base64 URLs for <=128byte images, direct URLs for the rest
        },
      },
    },
  );

  const webpackPluginFilename = "index.html";

  const plugins = [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(srcPath, 'index.html'),
      filename: webpackPluginFilename,
    }),
    new ForkTsCheckerPlugin(),
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
  }),
  ];

  const optimization = {
    splitChunks: {
      chunks: "all",
    },
  };

  return {
    target: 'web',
    mode: 'development',
    entry: entry,
    resolve: {
      extensions: ['.js', '.tsx', '.ts'],
      modules: [srcPath, nodeModulesPath, 'src/main/js'],
      fallback: {
        process: require.resolve("process/browser"),
        zlib: require.resolve("browserify-zlib"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        buffer: require.resolve("buffer"),
        asset: require.resolve("assert"),
      },
    },
    resolveLoader: {
      modules: [nodeModulesPath],
    },
    output: {
      path: destPath,
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[name].js',
    },
    module: module,
    plugins: plugins,
    // Devtool defaults are: prod-none dev-eval - Eval is REALLY fast, but shows transpiled code.
    devtool: 'source-map',
    optimization: optimization,
    performance: {
      // Performance hints emit a warning during build which leads to a failed build-x-y step
      hints: undefined,
    },
  };
};
