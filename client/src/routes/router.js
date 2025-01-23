import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";

// Components
import Reconciliations from "../components/Pages/Reconciliations/Index.vue";
import Transactions from "../components/Pages/Transactions/Index.vue";
import DataLoad from "../components/Pages/DataLoad/Index.vue";
import Dashboard from "../components/Pages/Dashboard.vue";
import Users from "../components/Pages/Users/Index.vue";
import Roles from "../components/Pages/Roles/Index.vue";
import NotFound from "../components/Pages/NotFound.vue";
import Login from "../components/Pages/Auth/Login.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    meta: { requiresAuth: true },
  },
  {
    path: "/roles",
    name: "Roles",
    component: Roles,
    meta: { requiresAuth: true },
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: Transactions,
    meta: { requiresAuth: true },
  },
  {
    path: "/reconciliations",
    name: "Reconciliations",
    component: Reconciliations,
    meta: { requiresAuth: true },
  },
  {
    path: "/data-load",
    name: "DataLoad",
    component: DataLoad,
    meta: { requiresAuth: true },
  },

  // Auth
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { layout: "empty" },
  },

  // Not found
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: { layout: "empty" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  if (to.meta.requiresAuth && !token) {
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (to.name === "Login" && token) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;
