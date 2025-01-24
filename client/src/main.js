import DefaultLayout from "./components/Layout/DefaultLayout.vue";
import EmptyLayout from "./components/Layout/EmptyLayout.vue";
import VueApexCharts from "vue3-apexcharts";
import router from "./routes/router";
import { createApp } from "vue";
import App from "./App.vue";

// Create the app
const app = createApp(App);

// Register the layout components
app.component("DefaultLayout", DefaultLayout);
app.component("EmptyLayout", EmptyLayout);

// Register the plugins
app.use(router);
app.use(VueApexCharts);

// Mount the app
app.mount("#app");