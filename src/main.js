import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import Multiselect from 'vue-multiselect'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSync)
Vue.component('a-icon', FontAwesomeIcon)

Vue.use(BootstrapVue)

window.axios = axios.create()

Vue.use(BootstrapVue)

Vue.component('v-multiselect', Multiselect)

Vue.config.productionTip = false

Vue.prototype.log = (...args) => {
  console.log(...args)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
