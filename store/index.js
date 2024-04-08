
// // #ifndef VUE3
// import auth from './auth.js'
// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

// const store = new Vuex.Store({
//   modules: {
//     auth: auth
// 	})
// export default store
// #endif

// #ifdef VUE3
import auth from './auth.js'

import { createStore} from 'vuex'
const store = createStore({
  modules: {
    auth: auth,

  },
})
export default store
// #endif
