const path=require('path');

module.exports = {
    entry:'./src/index.ts',
    devtool: "inline-source-map",
    node: { module: "empty", net: "empty", fs: "empty" },
    output:
    {
        filename:'bundle.js',
        path:path.resolve(__dirname,'docs'),
        hotUpdateChunkFilename: 'hot/hot-update.js',
        hotUpdateMainFilename: 'hot/hot-update.json'
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
    },
};