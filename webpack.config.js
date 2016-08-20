const webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './public/scripts/index.js',
    output: {
        path: path.resolve(__dirname, "public/bin"),
        publicPath: "bin",
        filename: 'index.bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: { compact: false },
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]
};