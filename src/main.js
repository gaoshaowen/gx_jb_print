// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios';
import VueAxios from 'vue-axios' ;
import conf from './config_cli'

console.log( conf.server)

//import _Global from './Global.vue'

// const instance = axios.create({
//   baseURL:  process.env.API_HOST,
//   timeout: 60000,
//   headers: {'X-Custom-Header': 'foobar'}
// });

Vue.prototype.conf =conf

Vue.use(VueAxios, axios)

axios.interceptors.request.use(
  request => {
    //request.baseURL = process.env.API_HOST;
    // let token =store.getters.token
    // let userName =store.getters.userName
    request.headers["content-type"]="application/json; charset=utf-8";
    //request.headers.token = token
    //request.headers.username =  encodeURI(userName)

    return request
  }
)



Vue.config.productionTip = false


import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'//这里注意具体看使用的版本是否需要引入样式，以及具体位置。
Vue.use(VueAwesomeSwiper, /* { default global options } */)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
