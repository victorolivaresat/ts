<template>
  <header class="flex items-center justify-between px-6 py-4 bg-gray-50 border-b-4 border-red-800">
    <div class="flex items-center">
      <button class="text-gray-500 focus:outline-none lg:hidden" @click="isOpen = true">
        </button>
    </div>

    <div class="flex items-center">
      <div class="relative">
        <button class="relative z-10 block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none" @click="dropdownOpen = !dropdownOpen">
          <img class="object-cover w-full h-full" src="https://picsum.photos/200" alt="Your avatar">
        </button>

        <div v-if="dropdownOpen" class="fixed inset-0 z-10 w-full h-full" @click="dropdownOpen = false" /> 

        <transition 
          enter-active-class="transition duration-150 ease-out transform"
          enter-from-class="scale-95 opacity-0" 
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in transform" 
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div v-if="dropdownOpen" class="absolute right-0 z-20 w-48 py-2 mt-2 bg-white rounded-md shadow-xl">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">Profile</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">Products</a>
            <router-link to="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">
              Log out
            </router-link>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue';
import { useSidebar } from '../../composables/useSidebar.js';

export default {
  setup() {
    const dropdownOpen = ref(false);
    const { isOpen } = useSidebar();

    return { dropdownOpen, isOpen }; 
  }
};
</script>