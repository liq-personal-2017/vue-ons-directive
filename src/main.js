import Vue from 'vue'
import App from './App.vue'
import ons from '../directive/ons'

Vue.config.productionTip = false
Vue.use(ons)
window.vm = new Vue({
    render: h => h(App)
}).$mount('#app')
