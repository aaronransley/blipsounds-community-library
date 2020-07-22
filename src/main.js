import Vue from "vue"
import Vuetify from "vuetify"
import App from "./App"
import "vuetify/dist/vuetify.css"

Vue.use(Vuetify)
// Vue.config.productionTip = false;

new Vue({
  vuetify: new Vuetify({}),
  render: h => h(App)
}).$mount("#app")
