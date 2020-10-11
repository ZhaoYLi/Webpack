const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');  //test hmr

const path = require('path');
module.exports = {
    mode: 'production', // 默认是production,打包后的js代码会被压缩，development则不会
    /**
     * cheap：是只生成行信息，不展示列信息
     * module：对loader里的代码也生成source-map
     * eval：生成source-map的方式
     */
    // devtool: 'cheap-module-eval-source-map', // 开发环境使用
    devtool: 'cheap-module-source-map', // 生产环境使用
    // entry: './src/index.js',
    entry: {
        main: './src/index.js',
        // sub: './src/index.js'
    },
    devServer: {
        contentBase: './dist',
        open: true, // 每次重启服务都会帮我们打开一个新的网页
        port: 8080,
        hot: true,
        hotOnly: true, // 当hmr（hot）不生效时也不让浏览器刷新页面
    },
    module: {
        rules: [{
            test: /\.(jpg||png||gif)$/,
            use: {
                // loader: 'file-loader', //把文件从src目录下移动到dist目录下
                loader: 'url-loader',
                // url-loader会把图片转化成base64的字符串，直接放到bundle.js里
                // 优点：减少http请求
                // 缺点：不适合大图片，否则会减慢第一次打开的速度
                options: {
                    // 老的名字.老的后缀
                    // name: '[name].[ext]',
                    name: '[name]__[hash].[ext]',
                    outputPath: 'images/',
                    //意思是当图片大于2048字节时，把图片打包成单独的图片文件，小于时转化为base64直接放到js里
                    limit: 2048
                }
            },
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            // 此loader作为一个桥梁，打通了webpack和babel之间的通信，要实现js代码的转化，还需要安装@babel/preset-env
            loader: 'babel-loader',

            // options对象也可以直接放到.babelrc文件中
            options: {
                /* // presets: ["@babel/preset-env"], // 把es6的代码翻译成es5的代码
                 // 只打包低端浏览器无法运行的方法到main.js里，比如map、promise之类的
                 presets: [['@babel/preset-env', {
                     targets: {
                         chrome: '67'
                     },
                     useBuiltIns: 'usage' // 按需引入polyfill,这样就只有业务代码里用到的东西才会被注入到代码里
                 }]] */

                /**
                 * 下面这个插件会以闭包的形式引入帮助组件引入内容，不会像pollify这样会污染全局环境
                 * 所以，在业务代码中可以用上面的presets配置，并引入pollify，如果是单独的ui组件或者
                 * 类库的时候就用下面这个配置，且不用引入pollify
                 */
                /*"plugins": [["@babel/plugin-transform-runtime",
                    {
                        "absoluteRuntime": false,
                        "corejs": 2,
                        "helpers": true,
                        "regenerator": true,
                        "useESModules": false,
                        "version": "7.0.0-beta.0"
                    }]]
                    */

            }
        },
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

        // 打包字体文件
        {
            test: /\.(eot||ttf||svg||woff)$/,
            use: {
                loader: 'file-loader'
            }
        }
        ]
    },

    // HtmlWebpackPlugin会在打包结束后，自动生成一个html文件，并把打包生成的js引入到这个html文件中
    /**plugin可以在webpack运行到某个时刻到时候自动帮你做一些事情，有点类似于生命周期函数 */
    // CleanWebpackPlugin() 在打包之前自动删除之前打包到dist目录
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],

    /**
     * test tree shaking
     * 在开发环境模式下需要配置下面这个，生产环境不用，只用配sideEffects */
    // optimization: {
    //     usedExports: true
    // },
    output: {
        // filename: 'bundle.js',
        // publicPath: 'http://cdn.com',
        filename: '[name].js',
        // __dirname:当前index.js文件所在目录
        path: path.resolve(__dirname, 'dist')
    }
} 