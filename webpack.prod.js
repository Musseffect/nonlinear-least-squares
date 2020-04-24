const path = require('path');

module.exports = {
  entry:'./src/index.js',
  devtool: '',//'source-map' for production
  node: { module: "empty", net: "empty", fs: "empty" },
  optimization: {
    minimize: true
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs')
  },
  resolve: {
      extensions: ['.js']
  },
  module: {
    rules: [
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        } 
    ]
}
};
