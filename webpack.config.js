var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var node_modules_dir = __dirname + '/node_modules';

var defaultConfig = {
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
            // Extract css files
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!autoprefixer-loader!less-loader?sourceMap")
            },
            // bootflat
            {test: /\.(png)$/, loader: 'url-loader?limit=100000'},
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
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("app.css", {allChunks: true}),
        // fix bootflat's broken url request
        new webpack.NormalModuleReplacementPlugin(
            /bootflat\/img\/check_flat\/default\.png$/,
            node_modules_dir + '/bootflat/bootflat/img/check_flat/default.png'
        )
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};

if (process.env.NODE_ENV !== 'production') {
    console.log('webpack in dev mode');

    defaultConfig.devtool = '#eval-source-map';
    //defaultConfig.devtool = 'source-map';
    defaultConfig.debug = true;

    // additional entries
    defaultConfig.entry.push('webpack-dev-server/client?http://localhost:3000');// WebpackDevServer host and port
    defaultConfig.entry.push('webpack/hot/only-dev-server');

    // additional plugin
    defaultConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    defaultConfig.module.loaders[0].loaders = ['react-hot', 'babel'];

    // dev Server settings
    defaultConfig.devServer = {
        contentBase: "./public",
        noInfo: true, //  --no-info option
        hot: true,
        inline: true,
        port: 3000,
        colors: true,
        historyApiFallback: true
    };

    // public path
    defaultConfig.output.publicPath = 'http://localhost:3000/';

}

module.exports = defaultConfig;
