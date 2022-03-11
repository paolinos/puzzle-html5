/*
module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "./dist/bundle.js"
    },
    watch: true
};
*/


const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/index.js',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Puzzle Game',
            template: './public/index.html',
            hash: true,
            inject: 'body'
        })
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',

    },
    devServer: {
        static: {
          directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        hot: true,
        port: 8080,
      }
};