import '@/assets/css/reset.css';
import '@/assets/css/common.css';
import '@/assets/css/global.css';
import '@/assets/css/home.css';
import '@/assets/css/element-plus.css';
import '@/assets/font/iconfont.css';
import 'element-plus/dist/index.css';
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css';

import ContextMenu from '@imengyu/vue3-context-menu';
import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';

const app = createApp(App);


app.use(ElementPlus);
app.use(createPinia());
app.use(ContextMenu);

app.mount('#app');