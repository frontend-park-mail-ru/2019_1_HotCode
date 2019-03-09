const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminSvgo = require('imagemin-svgo');
const imageminPngquant = require('imagemin-pngquant');
const imageminGiflossy = require('imagemin-giflossy');
const TerserPlugin = require('terser-webpack-plugin');

(async () => {
    await imagemin(['public/img/*.{jpg,svg,png,gif}'], 'dist/img', {
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
            }),
            imageminPngquant({
                plugins: [
                    {lossy: 80}
                ]
            }),
            imageminGiflossy({
                plugins: [
                    {lossy: 80}
                ]
            })
        ]
    });
    await imagemin(['./*.{ico}'], 'dist', {});
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
                use: ["babel-loader"]
            },
            {
                test: /.pug$/,
                use: {
                    loader: 'pug-loader',
                    query: {}
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
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img'
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin('dist', {} ),
        new ExtractTextPlugin({filename: 'style.[hash].css'}),
        new HtmlWebpackPlugin({
            title: 'WarScript',
            favicon: './favicon.ico',
            meta: {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'}
        }),
        new WebpackMd5Hash()
    ],
    optimization: {
        minimizer: [new TerserPlugin({
            test: /\.js(\?.*)?$/i,
        }),],
    },
};