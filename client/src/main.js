// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import { sync } from 'vuex-router-sync'
import 'vuetify/dist/vuetify.min.css'
import store from '@/store/store'
import VeeValidate from 'vee-validate'
import VueValidationEs from 'vee-validate/dist/locale/es'

Vue.config.productionTip = false

// For validating forms. Configured in spanish.
Vue.use(Vuetify)
Vue.use(VeeValidate, {
  locale: 'es',
  dictionary: {
    es: VueValidationEs
  }
})

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
