const path=require('path');
const webpack = require('webpack');

module.exports = {
    entry:'./src/index.ts',
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
        extensions: ['.js']
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
            },{
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            } 
        ]
    },
};