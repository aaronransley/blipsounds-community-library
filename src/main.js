import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueCookies from 'vue-cookies'

import App from './App'

Vue.use(VueCookies)
Vue.$cookies.config(Infinity, null, null, true, 'None')

Vue.use(Vuetify)
// Vue.config.productionTip = false;

new Vue({
  vuetify: new Vuetify({}),
  render: (h) => h(App)
}).$mount('#app')
