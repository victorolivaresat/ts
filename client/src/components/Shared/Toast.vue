<template>
  <div class="fixed z-50 top-5 right-5 space-y-2">
    <TransitionGroup name="fade">
      <div v-for="toast in notifications" :key="toast.id" @mouseenter="pauseTimeout(toast.id)"
        @mouseleave="resumeTimeout(toast.id)"
        class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-sm" role="alert">
        <div class="inline-flex items-center justify-center shrink-0 w-10 h-10 rounded-lg"
          :class="toastClasses(toast.type)">
          <template v-if="toast.type === 'success'">
            <FaCheck class="w-6 h-6" />
          </template>
          <template v-if="toast.type === 'error'">
            <FaXmark class="w-6 h-6" />
          </template>
          <template v-if="toast.type === 'warning'">
            <FaExclamation class="w-6 h-6" />
          </template>
          <span class="sr-only">{{ toast.type }} icon</span>
        </div>
        <div class="ms-3 text-sm font-normal">{{ toast.message }}</div>
        <button v-if="toast.dismissible" @click="removeToast(toast.id)"
          class="ml-6 -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-6 w-6 hover:bg-gray-100 "
          aria-label="Close">
          <span class="sr-only">Close</span>
          <svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FaCheck, FaXmark, FaExclamation } from '@kalimahapps/vue-icons';

const notifications = ref([]);
let idCounter = 0;

const toastClasses = (type) => {
  return {
    'text-green-500 bg-green-100': type === 'success',
    'text-red-500 bg-red-100': type === 'error',
    'text-orange-500 bg-orange-100': type === 'warning',
  };
};

const showToast = (message, type = 'success', options = {}) => {
  const id = idCounter++;
  const toast = {
    id,
    message,
    type,
    duration: options.duration ?? 3000,
    dismissible: options.dismissible ?? true,
    timeout: null,
  };
  notifications.value.push(toast);
  startTimeout(toast);
};

const startTimeout = (toast) => {
  toast.timeout = setTimeout(() => {
    removeToast(toast.id);
  }, toast.duration);
};

const pauseTimeout = (id) => {
  const toast = notifications.value.find(t => t.id === id);
  if (toast && toast.timeout) {
    clearTimeout(toast.timeout);
    toast.timeout = null;
  }
};

const resumeTimeout = (id) => {
  const toast = notifications.value.find(t => t.id === id);
  if (toast && !toast.timeout) {
    startTimeout(toast);
  }
};

const removeToast = (id) => {
  notifications.value = notifications.value.filter(toast => toast.id !== id);
};

defineExpose({ showToast });
</script>