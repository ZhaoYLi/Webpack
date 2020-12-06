import avatar from './md.jpg'
import './index.scss'
var img = new Image()
img.src = avatar
img.classList.add('avatar')
document.body.appendChild(img)

/**
 * 学习prefetch和preload，以及通过提高js利用率来提高页面第一次加载速度，即提高性能
 * 把交互代码放到click.js中，在index中按需异步引入
 * click.js被打包到里单独的文件中
 */

document.addEventListener('click', () => {
    import(/*webpackPrefetch: true*/'./click').then(({ default: func }) => {
        func()
    })
})


// document.addEventListener('click', () => {
//     let el = document.createElement('div')
//     el.innerHTML = 'hello world'
//     document.body.appendChild(el)
// })

