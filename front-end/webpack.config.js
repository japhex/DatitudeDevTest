const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: ['./src/js/app.js','./src/scss/main.scss'],
	output: {
		filename: './../app/public/js/build.min.js',
		sourceMapFilename: '[file].map'
	},
	devtool: 'source-map',
	watch: (process.env.NODE_ENV !== 'staging' && process.env.NODE_ENV !== 'production') ? true : false,
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}, {
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract('css-loader!sass-loader')
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
			{ from: './src/images', to: './../app/public/images'}
		]),
		new ExtractTextPlugin('./../app/public/css/main.css', {
			allChunks: true
		})
	],
	resolve: {
		alias: {
			'jquery-ui': 'jquery-ui-dist/jquery-ui.js',
			'moment': 'moment/min/moment.min.js',
			'choices': 'choices.js/assets/scripts/choices.js'
		}
	}
};
