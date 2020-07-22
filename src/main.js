import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'

import App from './App'

Vue.use(Vuetify)
// Vue.config.productionTip = false;

new Vue({
  vuetify: new Vuetify({}),
  render: (h) => h(App)
}).$mount('#app')
