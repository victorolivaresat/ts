<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-sm">
    <div :class="['bg-white rounded-lg shadow-lg z-50', modalSizeClass]">
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button @click="closeModal"
          class="text-red-500 hover:text-gray-700 text-xl font-bold px-3 rounded-md bg-gray-100">&times;</button>
      </div>
      <div class="p-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Modal Title'
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => {
      return ['sm', 'md', 'lg'].includes(value);
    }
  }
});

const emits = defineEmits(['update:modelValue']);

const isVisible = ref(props.modelValue);

const closeModal = () => {
  isVisible.value = false;
  emits('update:modelValue', false);
};

const modalSizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-1/4';
    case 'lg':
      return 'max-w-2xl w-full';
    case 'md':
    default:
      return 'w-1/3';
  }
});

watch(() => props.modelValue, (newVal) => {
  isVisible.value = newVal;
});
</script>