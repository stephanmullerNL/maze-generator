const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        app: ['./app.js', './app.css']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js',
    },
    module: {
        rules: [{
            test: /\.css$/,
            loader:  ExtractTextPlugin.extract({
                loader: 'css-loader?importLoaders=1',
            }),
        }, {
            test: /\.js$/,
            include: path.resolve(__dirname, 'src'),
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', { modules: false }]
                    ]
                }
            }]
        }],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].bundle.css',
            allChunks: true,
        }),
    ],
};