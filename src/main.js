import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // 引入暗黑主题CSS变量
import router from './router'

const app = createApp(App)

// 全局注册 Element Plus 组件
app.use(ElementPlus)
// 使用路由
app.use(router)

app.mount('#app')