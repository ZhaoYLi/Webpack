const path = require('path')
const webpack = require('webpack')

module.exports = {
    mode: 'production',
    entry: {
        vendors: ['react', 'react-dom', 'lodash']
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, '../dll'),
        library: '[name]' // 对应entry里的name
    },
    // 使用插件来分析库文件，把库文件中第三方模块的映射关系放到manifest文件中
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: path.resolve(__dirname, '../dll/[name].manifest.json')
        })
    ]
}