<template>
  <div class="flex items-center justify-center p-6 min-h-screen bg-indigo-800">
    <div class="w-full max-w-md p-6">
      <form class="mt-8 bg-white rounded-lg shadow-xl overflow-hidden" @submit.prevent="handleLogin">
        <div class="px-10 py-12">
          <h1 class="text-center text-3xl font-bold">apuestatotal</h1>
          <div class="my-8 mx-auto w-24 border-b-2" />
          <div class="mb-4">
            <label class="block">
              <span class="text-sm text-gray-700">Email</span>
              <input v-model="email" type="email"
                class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
            </label>
          </div>
          <div class="mb-4">
            <label class="block mt-3">
              <span class="text-sm text-gray-700">Password</span>
              <input v-model="password" type="password"
                class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
            </label>
          </div>
          <div class="flex items-center justify-between mt-4">
            <div>
              <label class="inline-flex items-center">
                <input type="checkbox"
                  class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500">
                <span class="mx-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>
          </div>
        </div>
        <div class="flex px-10 py-4 bg-gray-100 border-t border-gray-100 justify-end">
            <button type="submit"
              class="w-1/2 px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500">
              Login
            </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../../composables/useAuth";

const router = useRouter();
const email = ref("prevencion@apuestatotal.com");
const password = ref("password");
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login(email.value, password.value);
    console.log("Login ok");
    router.push("/");
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    alert("Correo o contraseña incorrectos");
  }
};
</script>
