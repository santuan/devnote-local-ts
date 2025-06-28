import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import './assets/main.css'
import 'vue-sonner/style.css'
import 'katex/dist/katex.min.css'
import './assets/driver.css'

const pinia = createPinia()
const app = createApp(App)

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(i18n)
app.mount('#app')
