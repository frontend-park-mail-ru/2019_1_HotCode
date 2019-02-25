const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminSvgo = require('imagemin-svgo');
const TerserPlugin = require('terser-webpack-plugin');

(async () => {
    await imagemin(['public/img/*.{jpg,svg}'], 'dist/img', {
        use: [
            imageminSvgo({
                plugins: [
                    {removeViewBox: false}
                ]
            }),
            imageminMozjpeg({
                plugins: [
                    {quality: 65}
                ]
            })
        ]
    });
})();

module.exports = {
    entry: './public/src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: ['css-loader', 'postcss-loader', 'sass-loader']
                    })
            },
            {
                test: /\.(png|jpe?g|gif|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000',
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('dist', {} ),
        new ExtractTextPlugin({filename: 'style.[hash].css'}),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new WebpackMd5Hash()
    ],
    optimization: {
        minimizer: [new TerserPlugin({
            test: /\.js(\?.*)?$/i,
        }),],
    },
};