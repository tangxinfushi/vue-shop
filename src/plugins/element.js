import Vue from 'vue'
// Message弹框提示组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// message 需要进行全局挂载，挂载到vue身上
Vue.prototype.$message = Message
