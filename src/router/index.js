import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import LocalUpload from '@/views/LocalUpload'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
     // redirect:"/home",
      component: Home,
    },
    {
      path: '/localupload',
     // redirect:"/home",
      component: LocalUpload,
    },

    // {
    //   path: '/home',
    //   name: 'Home',
    //   component: Home,
    //   children: [
    //     {
    //       path:'/home/home1',
    //       // 当匹配到 /foo 时，这个组件会被渲染到 Foo 组件的 <router-view> 中。
    //       // 为了简便，这里使用了一个组件的定义
    //       component: home1
    //     },
    //     {
    //       path: '/home/home2',
    //       // 当匹配到 /foo 时，这个组件会被渲染到 Foo 组件的 <router-view> 中。
    //       // 为了简便，这里使用了一个组件的定义
    //       component: home2
    //     },
    //     {
    //       path: '/home/home3',
    //       // 当匹配到 /foo 时，这个组件会被渲染到 Foo 组件的 <router-view> 中。
    //       // 为了简便，这里使用了一个组件的定义
    //       component: home3
    //     }
    //   ]
    // },



  ]
})
