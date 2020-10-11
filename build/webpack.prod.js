const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common')

const prodConfig = {
    mode: 'production', // 默认是production,打包后的js代码会被压缩，development则不会
    devtool: 'cheap-module-source-map', // 生产环境使用

    // 把css文件进行合并，压缩，变成一行
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],
    },
    //使用此插件就不用使用style-loader
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].chunk.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {

                            importLoaders: 2,

                        }
                    }
                    , 'sass-loader', 'postcss-loader']
            },

            // test hmr
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
        ]
    }
}

module.exports = merge(commonConfig, prodConfig)