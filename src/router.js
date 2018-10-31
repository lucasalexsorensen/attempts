import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
    return
  }
  const store = require('./store')

  if (to.query && to.query.token && from && from.name === null && from.path === '/') {
    console.log('CALLING LOGIN FRESH', to.query.token)
    store.default.dispatch('login', { token: to.query.token })
    next({ name: 'home', replace: true })
    return
  }
  const storedToken = localStorage.getItem('jwtToken')
  if (storedToken && storedToken.length > 0) {
    // expiry check ?
    if (!store.default.state.auth || !store.default.state.auth.user || store.default.state.auth.user.length < 1) {
      console.log('localStorage dispatched login')
      store.default.dispatch('login', { token: storedToken })
    }
    next()
    return
  }

  // fallback to login
  console.log('fallback')
  next({ name: 'login', replace: true })
})

export default router
