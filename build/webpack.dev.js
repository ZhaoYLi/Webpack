const webpack = require('webpack');  //test hmr
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common')

const devConfig = {
    mode: 'development', // 默认是production,打包后的js代码会被压缩，development则不会
    /**
     * cheap：是只生成行信息，不展示列信息
     * module：对loader里的代码也生成source-map
     * eval：生成source-map的方式
     */
    devtool: 'cheap-module-eval-source-map', // 开发环境使用

    devServer: {
        contentBase: '../dist',
        open: true, // 每次重启服务都会帮我们打开一个新的网页
        port: 8080,
        hot: true,
        hotOnly: true, // 当hmr（hot）不生效时也不让浏览器刷新页面
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                // css-loader:会分析各css文件之间的关系，并把css文件合并成一段css代码
                // style-loadeer：把生成的css代码挂载到head标签上
                // sass-loader: 把sass代码翻译成css代码
                // postcss-loader: 自动添加厂商前缀，需配合postcss.config.js配置文件使用
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // 通过import引入的sass文件在引入之前也要走下方最后两个loader
                            // 保证无论是在js中直接引入的sass文件还是在sass文件中引入的sass文件
                            // 都能从右到左依次执行这几个loader
                            importLoaders: 2,
                            // 开启样式模块化，就可以使用import style  classname="style.xxx"语法了
                            // module: true
                        }
                    }
                    , 'sass-loader', 'postcss-loader']
            },

            // test hmr
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
        ]
    },

    // HtmlWebpackPlugin会在打包结束后，自动生成一个html文件，并把打包生成的js引入到这个html文件中
    /**plugin可以在webpack运行到某个时刻到时候自动帮你做一些事情，有点类似于生命周期函数 */
    // CleanWebpackPlugin() 在打包之前自动删除之前打包到dist目录
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
}

module.exports = merge(commonConfig, devConfig)