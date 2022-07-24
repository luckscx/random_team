import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import './plugins/element.js'

Vue.config.productionTip = false

Vue.use(VueRouter)

import Home from './components/HelloWorld.vue'
import Set from './components/Set.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/set', component: Set },
]

const router = new VueRouter({
  routes, // `routes: routes` 的缩写
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
