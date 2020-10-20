const path = require('path');

module.exports = {
  entry:'./src/index.ts',
  devtool: 'source-map',//'source-map' for production
  node: { module: "empty", net: "empty", fs: "empty" },
  optimization: {
    minimize: true
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs')
  },
  resolve: {
      extensions: [".ts", ".tsx",".js"]
  },
  module: {
    rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: "ts-loader"
              }
            ]
        },
        {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        } 
    ]
}
};
