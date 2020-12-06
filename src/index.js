import avatar from './md.jpg'
import './index.scss'
import './iconfont.scss'
// test hmr
import './HMR/style.css'
/**
 * '@babel/polyfill' 会在window环境中绑定一些全局变量，比如promise
 * 会使包变得很大,所以配置了presets
 * 使用useBuiltIns配置的时候可以不用手动引入polyfill
 */
// import '@babel/polyfill' 

var img = new Image()
img.src = avatar
img.classList.add('avatar')

var cat = document.getElementById("cat")
// cat.append(img)

// test hot-module-replacement
/* var btn = document.createElement('button')
btn.innerHTML = '新增'
document.body.appendChild(btn)

btn.onclick = function () {
    var div = document.createElement('div')
    div.innerHTML = 'item'
    document.body.appendChild(div)
}
*/
import counter from './HMR/counter'
import number from './HMR/number'
// counter()
// number()

// 如果当前项目开启了HMR
if (module.hot) {
    module.hot.accept('./HMR/number', () => {
        document.body.removeChild(document.getElementById('number'))
        // number()
    })
}

// test babel
const arr = [
    new Promise(() => { }),
    new Promise(() => { })
]

arr.map(item => {
    // console.log(item)
})

// test babel deal react code

import React, { Component } from 'react'
import ReactDom from 'react-dom'

class App extends Component {
    render() {
        return <div style={{ marginTop: 100, marginBottom: 100 }}>{_.join('hello', 'dll', 'manifest')}</div>
    }
}

ReactDom.render(<App />, document.getElementById('root'))


// test tree shaking: 
/**
 * 作用：把一个模块里没用的东西都摇晃掉，引入的东西再打包，没引入的就不打包
 * tree shaking 只支持es module引入方式（静态引入）
 * 开发环境下，需在webpack.config中配置optimization:{}，在package中配置：sideEffects: false 或 sideEffects: ['*.css']
 * sideEffects: ['*.css']-----代表css文件不采用 tree shaking方式打包
 */
import { add } from './math'
// add(1, 2)


// test code splitting
/**
 * 方法一
 * 会使lodash和业务代码一起打包到main.js文件中，会使得main.js文件非常大（假设2mb）
 * 用户首次访问页面时，需要加载main.js（2mb）
 * 当页面业务逻辑发生变化时，又要加载2mb的内容
 */
// import _ from 'lodash';
// console.log(_.join([1, 2, 3, 4, 5], '***'))

/**
 * 方法二
 * 把lodash放单独的一个lodash.js文件，并在webpack中配置入口
 * 这样在打包的时候main.js就会被拆成lodash.js（1mb）和main.js（1mb）
 * 当页面业务逻辑发生变化时，就只需要加载main.js即可(1mb),lodash.js会被缓存到浏览器中
 */
// console.log(_.join([1, 2, 3, 4, 5], '***'))

/**
 * 方法三(同步代码分割)
 * 利用webpack自带的splitChunks功能
 * 就不需要手动创建lodash文件和entry
 */
import _ from 'lodash';
// console.log(_.join([1, 2, 3, 4, 5], '***'))


/**
 * 异步代码分割 不用做任何配置
 */

// function getComponent() {
//     return import(/* webpackChunkName: 'lodash' */ 'lodash').then(({ default: _ }) => {
//         var element = document.createElement('div')
//         console.log('_________', _)
//         element.innerHTML = _.concat(['miss', 'miao'], '8888888')
//         return element
//     })
// }
/*
getComponent().then(element => {
    console.log('run getComponent')
    document.body.appendChild(element)
})*/


/**
 * 学习prefetch和preload，以及通过提高js利用率来提高页面第一次加载速度，即提高性能
 * 把交互代码放到click.js中，在index中按需异步引入
 * click.js被打包到里单独的文件中
 */

// document.addEventListener('click', () => {
//     import(/*webpackPrefetch: true*/'./click').then(({ default: func }) => {
//         func()
//     })
// })


document.addEventListener('click', () => {
    let el = document.createElement('div')
    el.setAttribute('id', 'click_div')
    el.innerHTML = 'hello world'
    document.body.appendChild(el)
})



/**
 * test css spliting
 * 使用mini-css-extract-plugin插件，把css文件单独打包到一个文件
 * 需配置loader和plugin
 * 此插件不支持hmr，所以适合在线上打包使用
 *  */

import './test_css/style.css';
import './test_css/style1.css';
// console.log('miao test css split');

// test shimming
import { ui } from './test_shimming/jquery.ui'
ui()

console.log('this---', this)
console.log(this === window)

