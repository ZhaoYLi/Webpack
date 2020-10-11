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
            chunkFilename: '[name].chunk.css' // html中直接引用的不会走这
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
    },
    output: {
        filename: '[name].[contenthash].js',  //entry入口文件配置的走这个配置项
        chunkFilename: '[name].chunk.[contenthash].js', //其他模块走这个配置项（dist中index.html中 间接引入的js）
    }
}

module.exports = merge(commonConfig, prodConfig)