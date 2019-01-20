# 搞了个小 vue-directive ， 简单记录一下

## 说说写这玩意儿是想干啥吧

本意是因为公司他们做了一个 input 组件， 然后为了样式，功能上的控制， 在 input 元素外部套了一层 div

```html
<div class="custom-input"><input type="text" /></div>
```

这就导致我希望注册在 input 上的事件， 不好弄了

1. 要不然就得在组件内部把所有的事件都接出来，主动冒到父级
2. 要不然就得在父级上写 .native 修饰符， 这还不能直接注册在内部的 input 元素上，而是注册在 div 上，然后通过 target 过滤

效果都不好 ； （其实最好的是让他们直接改一版， 通过包装组件的形式把这些事件，属性，都释放到 input 元素上，但是让他们改，嗯。。。 ）

所以我想的是搞一个指令， 咱来试试直接通过指令来搞他的元素

起了个很挫的名字： ons

## 开始写了

一直也没玩过这东西， 先查查 api

```ts
// 几个钩子函数
Vue.directive(options:{
    inserted:Function,
    bind:Function,
    update:Function,
    componentUpdated:Function,
    unbind:Function
})
```

每个钩子函数的参数都差不多

1. el
2. binding {name,value,oldValue,arg,modifiers,expression}
3. vNode
4. oldVNode

第一个是指令直接绑定的 dom 节点， 第二个是参数， 然后是虚拟节点， 更新前的虚拟节点

四个参数不是都有， 根据生命周期， 有时候可能就没有 oldVNode

## 上代码

```js
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
```

用法

```html
<l-child v-ons:click="{handler:bindsOnclick,selector:'input'}"> </l-child>
```

试了一下， 效果马马虎虎， 可以用

## 搞不定的地方

子组件自身通过 `v-if` 把元素干掉了， 这里是收不到通知的， 因为子组件重绘并不会影响到父组件， 这里就不可能有任何反应， 所以如果真要用这个东西， 那么 `得保证子组件内被搞的元素不会通过子组件自身的状态而被干掉`

这个是原理性问题， 解决不了

不过按照我一开始的设想， 这个其实本来是要实现一个包装组件的功能， 子级的元素肯定是不能被干掉的， 所以倒也不是什么大问题。

然后我其实一开始实现的时候， 是把这个配置放在了子组件里面， 本意是想学一下 model 指令那个语法糖的做法

类似下面这样：

```js
// LChild
export default {
    ons: {
        ref: '',
        selector: ''
    }
}
```

那么我就得在 指令的钩子函数中找到这个配置， 官网是没有给这个示例的， 也不知道哪里看到的， 说是 指令应该拿来搞 html，不应该搞组件， 然后又考虑到如果这样做， 子组件肯定要改， 所以实现之后我就去掉了

那么这个指令既然肯定是作用在组件上的， 还是尝试一下把组件取出来看看吧

其实也很简单

```js
el.__vue__// 这个属性就是对应的vue component instance 
          // 通过 el.__vue__.$options 就能获取到原始的配置对象
```
因为有这个东西， 所以也就能支持 ref 来搞， ref 都支持了， 也就能搞子级组件， 离我一开始的设想越来越远了。。。

到此为止，不继续了。

一般来说 __ 开头的属性， 都是不建议访问的， 大家按照约定俗称的习惯来做就好了， 我已经把相关代码都删掉了

## 放个链接

[github](https://github.com/liq-personal-2017/vue-ons-directive)

本来也没想发布出去，所以就搞了一个实例项目玩一下就好了， 这里可以找到之前实现的版本， 用 `el.__vue__` 的那个版本