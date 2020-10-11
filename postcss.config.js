
module.exports = {
    plugins: [
        //单纯使用这个会无法添加前缀，需在package.json中配置browserslist
        require('autoprefixer')]
}