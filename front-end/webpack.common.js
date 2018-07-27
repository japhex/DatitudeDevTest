const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "./../sql-app/public/css/main.css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: ['./src/js/app.js','./src/scss/main.scss'],
    output: {
        filename: './../sql-app/public/js/build.min.js',
        sourceMapFilename: '[file].map'
    },
    devtool: 'source-map',
    watch: (process.env.NODE_ENV !== 'staging' && process.env.NODE_ENV !== 'production') ? true : false,
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            loaders: ['babel-loader?presets[]=es2015'],
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.woff$/,
            loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
        }, {
            test: /\.woff2$/,
            loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]"
        }, {
            test: /\.(eot|ttf|svg|gif|png|jpg)$/,
            loader: "file-loader"
        }],
        rules: [{
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
                // use style-loader in development
                fallback: "style-loader"
            })
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'global.jQuery': 'jquery'
        }),
	    new CopyWebpackPlugin([
		    { from: './src/images/**/*', to: './../sql-app/public/images'}
	    ]),
        extractSass
    ],
    resolve: {
        alias: {
            'jquery-ui': 'jquery-ui-dist/jquery-ui.js'
        }
    }
};