import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Songs from '@/components/Songs'
import Works from '@/components/Works'
import CreateWork from '@/components/CreateWork'
import ViewWork from '@/components/ViewWork'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: HelloWorld
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/songs',
      name: 'songs',
      component: Songs
    },
    {
      path: '/works',
      name: 'works',
      component: Works
    },
    {
      path: '/works/:workId',
      name: 'work',
      component: ViewWork
    },
    {
      path: '/works/create',
      name: 'works-create',
      component: CreateWork
    }
  ]
})
