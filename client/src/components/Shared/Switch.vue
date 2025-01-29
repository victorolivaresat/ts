<template>
    <label :class="['inline-flex items-center cursor-pointer', labelClass]">
        <input type="checkbox" :checked="value" class="sr-only peer" @change="handleChange">
        <div :class="switchClass"></div>
        <span :class="['ms-3 text-xs font-medium', textClass]">{{ label }}</span>
    </label>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
    value: Boolean,
    label: {
        type: String,
        default: 'Toggle'
    },
    offColor: {
        type: String,
        default: 'bg-gray-200'
    },
    labelClass: {
        type: String,
        default: ''
    },
    textClass: {
        type: String,
        default: 'text-gray-600'
    }
});

const emits = defineEmits(['update:value']);

const switchClass = computed(() => `
    relative w-9 h-5 transition-colors rounded-full
    ${props.offColor} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
    peer peer-checked:bg-green-600
    after:content-[''] after:absolute after:top-[2px] after:start-[2px]
    after:bg-white after:border-gray-300 after:border after:rounded-full
    after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full
  `);

const textClass = computed(() => props.value ? 'text-green-500' : 'text-gray-400');


const handleChange = (event) => {
    emits('update:value', event.target.checked);
};
</script>
