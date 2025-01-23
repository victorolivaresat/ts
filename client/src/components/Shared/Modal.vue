<template>
    <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-lg w-1/3 z-50">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <button @click="closeModal" class="text-red-500 hover:text-gray-700 text-xl font-bold px-3 rounded-md bg-gray-100">&times;</button>
        </div>
        <div class="p-4">
          <slot></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      default: 'Modal Title'
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  });
  
  const emits = defineEmits(['update:modelValue']);
  
  const isVisible = ref(props.modelValue);
  
  const closeModal = () => {
    isVisible.value = false;
    emits('update:modelValue', false);
  };
  
  watch(() => props.modelValue, (newVal) => {
    isVisible.value = newVal;
  });
  </script>