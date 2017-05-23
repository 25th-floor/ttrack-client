var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var node_modules_dir = __dirname + '/node_modules';

const PORT = 3000;
const SERVER_URL = 'http://localhost:' + PORT;

module.exports = {
    devtool: '#eval-source-map',

    entry: [
        'react-hot-loader/patch',
        // activate HMR for React

        'webpack-dev-server/client?' + SERVER_URL,
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint

        'webpack/hot/only-dev-server',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates

        './src/client/app.js',
        // the entry point of our app

        //'./public/less/timetracking.less'
    ],

    module: {
        rules: [
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
                            'autoprefixer-loader',
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

    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        // If you want to generate a filename with a hash of the content (for cache-busting)
        // filename: "main-[hash].js",
        filename: 'app.js'
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true,
        }),

        new webpack.HotModuleReplacementPlugin(),

        // enable HMR globally

        new webpack.NamedModulesPlugin(),
        // prints more readable module names in the browser console on HMR updates

        new webpack.NoEmitOnErrorsPlugin(),
        // do not emit compiled assets that include errors

        new ExtractTextPlugin({ filename: "app.css", allChunks: true, disable: false }),

        // fix bootflat's broken url request
        new webpack.NormalModuleReplacementPlugin(
            /bootflat\/img\/check_flat\/default\.png$/,
            node_modules_dir + '/bootflat/bootflat/img/check_flat/default.png'
        )
    ],

    devServer: {
        port: PORT,
        contentBase: "./public",
        hot: true,
        quiet: false,
        noInfo: true,
        inline: true,
        historyApiFallback: true,
        stats: { colors: true },
    },

    // eslint: { emitWarning: true },

    resolve: {
        extensions: ['.js', '.jsx']
    }
};
