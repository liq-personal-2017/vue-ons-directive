function getConf(el) {
    const vue = el.__vue__
    const ons = vue.$options.ons
    const { selector, ref } = ons
    let realEl
    if (selector) {
        realEl = el.querySelector(selector)
    } else if (ref) {
        realEl = vue.$refs[ref]
    }
    return realEl
}
function doBinding(el, binding) {
    const realEl = getConf(el)
    if (!realEl) {
        return
    }
    el.__ons_realEl = realEl
    const { arg, value, oldValue } = binding
    off(realEl, arg, oldValue)
    off(realEl, arg, value)
    on(realEl, arg, value)
    el.__ons_event = arg
    el.__ons_handler = value
}

function on(realEl, arg, value) {
    if (realEl._isVue) {
        realEl.$on(arg, value)
    } else {
        realEl.addEventListener(arg, value)
    }
}

function off(realEl, arg, value) {
    if (value) {
        if (realEl._isVue) {
            realEl.$off(arg, value)
        } else {
            realEl.removeEventListender(arg, value)
        }
    }
}

function install(Vue) {
    Vue.directive('ons', {
        bind(el, binding) {
            let realEl = getConf(el)
            el.__ons_realEl = realEl
            el._isVue = el.__vue__._isVue
            // const { arg: event, value: handler } = binding
        },
        inserted(el, binding) {
            return doBinding(el, binding)
        },
        update(el, binding) {
            return doBinding(el, binding)
        },
        componentUpdated(el, binding) {
            return doBinding(el, binding)
        },
        unbind(el) {
            const event = el.__ons_event
            const handler = el.__ons_handler
            if (!el._isVue) {
                el.__ons_realEl.removeEventListender(event, handler)
            }
        }
    })
}
export default { install }
