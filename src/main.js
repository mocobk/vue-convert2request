// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Resource from 'vue-resource'
import VueClipboard from 'vue-clipboard2'
import RegistryToast from './components/RegistryToast'


Vue.use(Resource)
Vue.use(VueClipboard)

// 这里也可以直接执行 RegistryToast()
Vue.use(RegistryToast)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
