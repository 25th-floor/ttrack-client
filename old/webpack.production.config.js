const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const node_modules_dir = __dirname + '/node_modules';

module.exports = {
    module: {
        rules: [
            // disabled because of bootstrap less files, TODO after changing to css enable this again
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     exclude: /node_modules/,
            //     loader: "eslint-loader",
            //     options: {
            //         failOnError: true,
            //     }
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            // Extract css files
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
            },
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: [
                            { loader: 'css-loader', options: { sourceMap: true, modules: true, importLoader: 1 }},
                            { loader: 'autoprefixer-loader', options: { browsers: ['last 2 versions'] }},
                            { loader: 'less-loader', options: { sourceMap: true }}
                        ]
                    }
                )
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
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ compressor: { warnings: false } }),
        new ExtractTextPlugin({ filename: "app.css", allChunks: true, disable: false }),
        // fix bootflat's broken url request
        new webpack.NormalModuleReplacementPlugin(
            /bootflat\/img\/check_flat\/default\.png$/,
            node_modules_dir + '/bootflat/bootflat/img/check_flat/default.png'
        )
    ],

    resolve: {
        extensions: ['.js', '.jsx']
    }
};
