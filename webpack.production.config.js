'use strict';

const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const node_modules_dir = __dirname + '/node_modules';
const xt = ExtractTextPlugin.extract.bind(ExtractTextPlugin);

module.exports = {
    module: {
        // preLoaders: [
        //     { test: /\.js$/, loader: 'eslint', exclude: /node_modules/ },
        // ],
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
            // Extract css files
            { test: /\.css$/, loader: xt("style-loader", "css-loader") },
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.less$/,
                loader: xt("style-loader", "css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer-loader!less-loader?sourceMap")
            },
            // bootflat
            { test: /\.(png)$/, loader: 'url-loader?limit=100000' },
            // font awesome
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
                loader: 'file-loader?name=fonts/[name].[ext]?[hash]'
            }
        ]
    },
    entry: [
        './src/client/app.js'
        //'./public/less/timetracking.less'
    ],
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        // If you want to generate a filename with a hash of the content (for cache-busting)
        // filename: "main-[hash].js",
        filename: 'app.js'
    },
    plugins: [
        new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false } }),
        new ExtractTextPlugin("app.css", { allChunks: true }),
        // fix bootflat's broken url request
        new webpack.NormalModuleReplacementPlugin(
            /bootflat\/img\/check_flat\/default\.png$/,
            node_modules_dir + '/bootflat/bootflat/img/check_flat/default.png'
        )
    ],
    postcss: () => [autoprefixer({ browsers: ['last 2 versions'] })],

    eslint: { failOnError: true },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
