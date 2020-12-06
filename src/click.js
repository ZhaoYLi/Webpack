function handleClick() {
    let el = document.createElement('div')
    el.setAttribute('id', 'click_div')
    el.innerHTML = 'hello miss miao click me, study prefetch and preload'
    document.body.appendChild(el)
}

export default handleClick