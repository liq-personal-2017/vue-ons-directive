function getRealEl(el, selector) {
    let realEl = el.querySelector(selector)
    return realEl
}
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
    el.__ons_event = arg
    el.__ons_handler = handler
}

function on(realEl, eventName, handler) {
    realEl.addEventListener(eventName, handler)
}

function off(realEl, eventName, handler) {
    if (handler) {
        realEl.removeEventListener(eventName, handler)
    }
}

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
