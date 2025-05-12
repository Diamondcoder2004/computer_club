import { createApp } from 'vue'
import App from './App.vue'
import components from "@/components/UI"
import './assets/global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import router from '@/routes/index'; // Импортируем маршрутизатор
const app =  createApp(App);

app.use(router); // Подключаем маршрутизатор

components.forEach(component => {
  app.component(component.name,component)
});
app.mount('#app');
