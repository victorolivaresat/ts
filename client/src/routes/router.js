// router.js
import { createRouter, createWebHistory } from "vue-router";

// Routes
import Reconciliations from "../components/Pages/Reconciliations/Index.vue";
import Transactions from "../components/Pages/Transactions/Index.vue";
import DataLoad from "../components/Pages/DataLoad/Index.vue";
import Dashboard from "../components/Pages/Dashboard.vue";
import Users from "../components/Pages/Users/Index.vue";
import Roles from "../components/Pages/Roles/Index.vue";
import NotFound from "../components/Pages/NotFound.vue";
import Login from "../components/Pages/Auth/Login.vue";

const routes = [
  { path: "/", name:"Dashboard", component: Dashboard },
  { path: "/users", name: "Users", component: Users },
  { path: "/roles", name: "Roles", component: Roles },
  { path: "/transactions", name: "Transactions", component: Transactions },
  { path: "/reconciliations", name: "Reconciliations", component: Reconciliations },
  { path: "/data-load", name: "DataLoad", component: DataLoad },

  // Auth
  { path: "/login", name: "Login", component: Login, meta: { layout: "empty" } },

  // Not found
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { layout: 'empty' } },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
