const path = require('path');
module.exports = {
	mode: 'development', // prod와 차이 있다. 
	entry: './src/test.tsx', // 어디서 시작할지
	module: { 
		rules: [
			{
			use: 'ts-loader',
			test: /\.tsx?$/,
			exclude: /node_modules/,
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
	}
}
