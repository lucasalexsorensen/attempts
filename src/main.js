import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
const axios = require('axios')

Vue.use(BootstrapVue)

window.axios = axios.create()

Vue.use(BootstrapVue)

Vue.config.productionTip = false

Vue.prototype.log = (...args) => {
  console.log(...args)
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
