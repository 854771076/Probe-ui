import App from './App.vue'
import propsConfig from './components/thorui/tui-config/index.js'
import api from './api/index.js'
import Vuex from 'vuex';
import store from './store/index.js'





uni.$version='V1.0.0'
//全局组件配置，其中$tui 为约定值，不可修改。
uni.$tui = propsConfig
uni.$api = api
let env='dev1'
if(env=='dev'){
	uni.$apiServer='http://127.0.0.1:8000'
	uni.$Server='http://127.0.0.1:8080'
}else{
	uni.$apiServer=''
	uni.$Server=''
}



// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'


App.mpType = 'app'
const app = new Vue({
	store,
	...App,
	el: "#app",
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	return {
		app
	}
}
// #endif