const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        // loadash: './src/lodash.js',
        main: './src/index.js',
        // sub: './src/index.js'
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

        // 打包字体文件
        {
            test: /\.(eot||ttf||svg||woff)$/,
            use: {
                loader: 'file-loader'
            }
        }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        // new CleanWebpackPlugin(),
        // 和上一行效果一样，删除之前打包对文件
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*']
        }),
        new BundleAnalyzerPlugin()
    ],

    /**
     * 代码分割 
     * 分割同步代码，比如：import _ from 'lodash'
     * 但是配置项对同步异步打包都有影响
     *  
   */
    optimization: {
        /**
         * 此配置为了兼容老版本webpack做缓存：
         * 打包后会多出一个runtime文件
         * main里放的是业务逻辑代码，vendors中放的是库，在webpack中，业务逻辑和库代码之间的关联叫做
         * manifest。manifest默认是既存在main里，也存在于vendors里，在打包的时候，在旧版的webpack中，
         * 可能会有差异，这就导致打包时即便没改变代码，contenthash也会变
         */
        runtimeChunk: {
            name: 'runtime'
        },
        /**
    * test tree shaking
    * 在开发环境模式下需要配置下面这个，生产环境不用，只用配sideEffects 
    * usedExports: true释义：在使用tree-shaking的时候，webpack会对所有模块使用tree-shaking，
    * 但是实际项目中，有的模块不需要摇晃，所以开启这个属性，再在package.json文件中列出不摇晃的模块。
    * 开启tree-shaking会导致js中引入但是没实际使用的css代码无法打包到一个单独文件中，所以需要在package.json中修改
    * 使用下面这个配置，就是告诉webpack有些模块不要用tree-shaking
    * */
        usedExports: true,
        splitChunks: {
            // all 对同步异步代码都进行分割, 但是要实现对同步代码分割的话还需要结合cacheGroup配置（参照官网or下方vendor配置）
            chunks: 'all',
            cacheGroups: {
                // vendors: false, // 打包后对lodash文件名去掉前缀vendor
                vendors: {
                    test: /[\\/]node_modules[\\/]/, // 分割同步代码的时候，检测到属于node_modules里到就分割打包到vendors文件里
                    priority: -10,
                    filename: 'vendors.js'
                },
                default: false
            }
        }
    },

    output: {
        // filename: 'bundle.js',
        // publicPath: 'http://cdn.com',
        // __dirname:当前index.js文件所在目录
        path: path.resolve(__dirname, '../dist')
    }
}