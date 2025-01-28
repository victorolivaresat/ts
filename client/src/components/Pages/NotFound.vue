<template>
  <div class="flex items-center justify-center h-screen bg-gray-200">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-700">404</h1>
      <p class="text-2xl text-gray-600">Page Not Found</p>
      <router-link to="/" class="mt-4 text-indigo-600 hover:underline">Go to Home</router-link>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'NotFound',
});
</script>
