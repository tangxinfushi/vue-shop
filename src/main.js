import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入第三方插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入副文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入副文本编辑器对应的样式
// require styles
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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

// 注册为全局可用组件
Vue.component('tree-table', TreeTable)
// 将文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
// 全局定义，格式化时间的过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  // 月份 是从零开始 需要+1
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '')

  const hh = (dt.getHours() + '').padStart(2, '')
  const mm = (dt.getMinutes() + '').padStart(2, '')
  const ss = (dt.getSeconds() + '').padStart(2, '')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
