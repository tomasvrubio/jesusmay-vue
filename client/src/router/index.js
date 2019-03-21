import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Works from '@/components/Works/Index'
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
      path: '/works',
      name: 'works',
      component: Works
    },
    {
      path: '/works/:datePicked/:workId',
      name: 'work',
      component: ViewWork
    },
    {
      path: '/works/create',
      name: 'works-create',
      component: CreateWork
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
