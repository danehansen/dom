module.exports = {
  entry: {
    app: './src/dom.js',
  },
  module: {
    rules: [
      {
        exclude: [/node_modules/],
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
        }],
      },
    ],
  },
  output: {
    filename: 'danehansen-dom.min.js',
    library: ['danehansen', 'dom'],
    libraryTarget: 'umd',
  },
  externals: [
    {
      '@danehansen/format': {
        amd: '@danehansen/format',
        commonjs: '@danehansen/format',
        commonjs2: '@danehansen/format',
        root: ['danehansen', 'format'],
      },
    },
  ],
}
