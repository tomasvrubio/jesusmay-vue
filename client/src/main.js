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
import Panel from '@/components/global/Panel'
// import VueCal from 'vue-cal'
// import 'vue-cal/dist/vuecal.css'

Vue.config.productionTip = false

// For validating forms. Configured in spanish.
Vue.use(Vuetify, {
  lang: {
    current: 'es'
  }
})
Vue.use(VeeValidate, {
  locale: 'es',
  dictionary: {
    es: VueValidationEs
  }
})

Vue.component('panel', Panel)
// Vue.component('vue-cal', VueCal)

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
