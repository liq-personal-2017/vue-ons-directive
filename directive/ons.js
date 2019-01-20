// 找到我们要七搞八搞的实际元素
function getRealEl(el, selector) {
    let realEl = el.querySelector(selector)
    return realEl
}
// 实际的绑一下事件
function doBinding(el, binding) {
    const { arg, value, oldValue } = binding
    const { handler } = value
    const realEl = getRealEl(el, value.selector)
    if (!realEl) {
        return
    }
    el.__ons_realEl = realEl
    if (oldValue) {
        const { hanlder: oldHandler } = oldValue
        off(realEl, arg, oldHandler)
    }
    off(realEl, arg, handler)
    on(realEl, arg, handler)
    // 每次都更新一下， 避免当前层级元素组件把子元素干掉了（v-if指令之类的）， 元素会发生变化
    el.__ons_event = arg
    el.__ons_handler = handler
}
// 辅助函数
function on(realEl, eventName, handler) {
    realEl.addEventListener(eventName, handler)
}
// 辅助函数
function off(realEl, eventName, handler) {
    realEl.removeEventListener(eventName, handler)
}
// 提供一个 install 函数给 vue.use 调用
function install(Vue) {
    Vue.directive('ons', {
        bind(el, binding) {
            let value = binding.value
            let realEl = getRealEl(el, value.selector)
            el.__ons_realEl = realEl
        },
        inserted(el, binding) {
            return doBinding(el, binding)
        },
        componentUpdated(el, binding) {
            return doBinding(el, binding)
        },
        unbind(el) {
            const event = el.__ons_event
            const handler = el.__ons_handler
            el.__ons_realEl.removeEventListender(event, handler)
        }
    })
}
export default { install }
