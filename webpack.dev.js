const path=require('path');

module.exports = {
    entry:'./src/index.js',
    devtool: "inline-source-map",
    node: { module: "empty", net: "empty", fs: "empty" },
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