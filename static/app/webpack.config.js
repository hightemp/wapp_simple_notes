// const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './lib.index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'lib.client.js',
        library: "libclient",
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.ttf$/,
            use: ['file-loader']
        }]
    },
    plugins: [
        
    ]
};