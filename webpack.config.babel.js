const { resolve } = require('path');
const webpack = require('webpack');
const { name } = require('./package.json');
const getMyIp = require('get-my-ip');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const isExample = process.env.BUILD_EXAMPLE;
const PROJECT_PATH = __dirname;
const inProject = (...args) => resolve(PROJECT_PATH, ...args);
const inSrc = inProject.bind(null, 'src');
const inTest = inProject.bind(null, 'test');
const inExample = inProject.bind(null, 'example');
const srcDir = inSrc();
const testDir = inTest();
const exampleDir = inExample();

module.exports = (webpackEnv = {}) => {
	const { minify } = webpackEnv;

	const config = {
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					include: [srcDir, testDir, exampleDir],
					loader: 'babel-loader',
					options: {
						presets: [['es2015', { modules: false }], 'react', 'stage-0'],
						cacheDirectory: true,
						babelrc: false,
					},
				},
			],
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			}),
		],
		resolve: {
			modules: [srcDir, 'node_modules'],
			extensions: ['.js'],
		},
		resolveLoader: {
			moduleExtensions: ['-loader'],
		},

		devServer: {
			port: 3000,
			host: getMyIp(),
			contentBase: exampleDir,
			// hot: true,
			quiet: false,
			noInfo: false,
			stats: 'errors-only',
			historyApiFallback: {
				disableDotRule: true,
			},
		},
	};

	if (isExample) {
		config.entry = './example';
		config.output = {
			filename: 'bundle.js',
			path: resolve(__dirname, 'example'),
		};
		config.module.rules.push(
			{
				test: /\.scss$/,
				include: exampleDir,
				use: ['style', 'css', 'postcss', 'sass'],
			},
			{
				test: /\.es$/,
				include: exampleDir,
				use: ['raw'],
			},
		);
	}
	else {
		config.entry = './src';
		config.output = {
			filename: `${name}${minify ? '.min' : ''}.js`,
			path: resolve(__dirname, 'dist'),
			library: 'ReactPanResponder',
			libraryTarget: 'umd',
		};
		config.externals = {
			react: 'React',
			'react-dom': 'ReactDom',
		};
	}

	if (minify) {
		config.plugins.push(new webpack.optimize.UglifyJsPlugin());
	}

	return config;
};
