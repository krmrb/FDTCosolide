import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// ✅ Import Bootstrap JS as a module
import * as bootstrap from 'bootstrap'

// Import Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
app.use(createPinia());
app.use(router)
app.mount('#app')

// ✅ Optionnel : exposer bootstrap dans la console pour debug
window.bootstrap = bootstrap
