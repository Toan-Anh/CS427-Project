const webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './public/scripts/index.js',
    output: {
        path: path.resolve(__dirname, "public/bin"),
        publicPath: "/bin/",
        filename: 'index.bundle.js'
    },
    module: {
        noParse: /node_modules\/json-schema\/lib\/validate\.js/,
        preLoaders: [
            { test: /\.json$/, loader: 'json' },
        ],
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: { compact: false },
        }]
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js']
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
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': '"development"',
        //     'global': {}, // bizarre lodash(?) webpack workaround
        //     'global.GENTLY': false // superagent client fix
        // })
    ],
    node: {
        fs: "empty",
        net: "empty",
        tls: "empty",
    }
};