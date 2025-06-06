import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import './assets/main.css'
import './assets/driver.css'
import 'vue-sonner/style.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(pinia)
app.use(i18n)
app.use(autoAnimatePlugin)
app.mount('#app')
