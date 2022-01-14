import Vue from "vue"
import Vuetify from "vuetify"
import "vuetify/dist/vuetify.css"
import VueCookies from "vue-cookies"

import App from "./App"

Vue.use(VueCookies)
Vue.$cookies.config(Infinity, "/", "", true, "None")

Vue.use(Vuetify)
// Vue.config.productionTip = false;

new Vue({
  vuetify: new Vuetify({
    theme: {
      dark: true,
      options: { customProperties: true },
      themes: {
        dark: {
          primary: "#C44A04",
          secondary: "#251F26",
          accent: "#F2EA79",
          error: "#F2B999",
          info: "#D98484",
          success: "#590202",
          warning: "#A62103",
        },
      },
    },
  }),
  render: (h) => h(App),
}).$mount("#app")
