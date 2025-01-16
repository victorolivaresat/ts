import DefaultLayout from "./components/Layout/DefaultLayout.vue";
import EmptyLayout from "./components/Layout/EmptyLayout.vue";
import router from "./routes/router";
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

app.component("DefaultLayout", DefaultLayout);
app.component("EmptyLayout", EmptyLayout);
app.use(router);
app.mount("#app");
