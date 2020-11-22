### 文件释义

1、打包后的 vendors.js 文件里放的是 node_modules 里的代码

### 4-10 浏览器缓存

1、output 输出文件以内容 hash 值命名,这样当代码改变时，打包后的文件名就会改变，
当用户第二次访问页面时，浏览器就会加载新的 js 文件，而不是使用第一次访问时加载的缓
存文件。

### 4-11 shimming 垫片

1. 自动引入 jquery,lodash 库
2. 修改 webpack 默认打包行为，比如，使用 imports-loader 修改 this 指向，从指向模块自身-》指向 window
