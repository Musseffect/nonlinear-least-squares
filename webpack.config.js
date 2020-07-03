const path=require('path');
const webpack = require('webpack');

module.exports = {
    entry:'./src/index.js',
    devtool: "inline-source-map",
    devServer: {
        contentBase: './docs',
        hot: true,
        historyApiFallback: true
    },
    node: { module: "empty", net: "empty", fs: "empty" },
    watch: false,
    watchOptions: {
    ignored: /node_modules/,
    },
    plugins:
    [
	    new webpack.HotModuleReplacementPlugin(),
    ],
    output:
    {
        filename:'bundle.js',
        path:path.resolve(__dirname,'docs')
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.js']
    },
    module: {
        rules: [{
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            } 
        ]
    },
};