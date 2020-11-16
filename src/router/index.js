import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Wavelength from '../views/Wavelength.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/wavelength/:id',
    name: 'Wavelength',
    component: Wavelength
  }
]

const router = new VueRouter({
  routes
})

export default router
