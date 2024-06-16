import { createApp } from 'vue'
import App from '@/App.vue'

import '@/assets/css/reset.css'
import '@/assets/css/global.css'
import '@/assets/css/home.css'
import '@/assets/css/element-plus.css'
import '@/assets/font/iconfont.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import ContextMenu from '@imengyu/vue3-context-menu'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

const app = createApp(App);

app.mount('#app');
app.use(ElementPlus);
app.use(ContextMenu);
