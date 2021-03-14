import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://fush.free.idcfengye.com/'
// 后台除了登录接口之外，都需要token权限验证，我们可以通过添加axios请求拦截器来添加token，以保证拥有获取数据的权限
// 在main.js中添加代码，在将axios挂载到vue原型之前添加下面的代码
// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
// axios.interceptors.request.use(config => {
//   // 为请求头对象，添加token验证的authorization字段
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   // 最后必须return config
//   return config
// })
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
