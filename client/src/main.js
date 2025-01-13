import { createApp } from 'vue';
import App from './App.vue';
import router from './routes/router'; // Asegúrate de que este es el archivo correcto para tus rutas

// Importa los componentes de diseño
import DefaultLayout from './components/Layout/DefaultLayout.vue';
import EmptyLayout from './components/Layout/EmptyLayout.vue';

// Crea la instancia de la aplicación
const app = createApp(App);

// Registra los componentes de diseño globalmente
app.component('DefaultLayout', DefaultLayout);
app.component('EmptyLayout', EmptyLayout);

// Usa el enrutador
app.use(router);

// Monta la aplicación en el elemento HTML con id 'app'
app.mount('#app');
