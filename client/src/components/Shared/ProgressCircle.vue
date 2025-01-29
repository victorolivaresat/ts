<template>
    <div :class="['relative flex items-center justify-center', sizeClass]">
        <svg 
            :key="viewBoxSize"
            :class="['transform -rotate-90', sizeClass]" 
            :viewBox="'0 0 ' + viewBoxSize + ' ' + viewBoxSize"
        >
            <circle
                class="text-gray-700"
                :stroke-width="strokeWidth"
                stroke="currentColor"
                fill="transparent"
                :r="radius"
                :cx="center"
                :cy="center"
            />
            <circle
                class="text-blue-500 transition-all duration-500"
                :stroke-width="strokeWidth"
                stroke="currentColor"
                fill="transparent"
                :r="radius"
                :cx="center"
                :cy="center"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
            />
        </svg>
        <div :class="['absolute text-blue-500', textSizeClass]">
            {{ props.score }}%
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    score: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        default: "md",
    },
});

// Mapeo de tamaños
const sizeMap = {
    sm: 80,
    md: 145,
    lg: 200,
};

const textSizeMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
};

// Tamaño del texto
const textSizeClass = computed(() => textSizeMap[props.size] || textSizeMap.md);

// ViewBox y radio del círculo
const viewBoxSize = computed(() => sizeMap[props.size] || sizeMap.md);
const center = computed(() => viewBoxSize.value / 2);
const radius = computed(() => center.value - 10);
const strokeWidth = computed(() => viewBoxSize.value * 0.1);
const circumference = computed(() => 2 * Math.PI * radius.value);
const progressOffset = computed(() => circumference.value * (1 - props.score / 100));

// Clases de tamaño
const sizeClass = computed(() => ({
    sm: 'w-20 h-20',
    md: 'w-36 h-36',
    lg: 'w-48 h-48'
}[props.size] || 'w-36 h-36'));
</script>

<style scoped>
circle {
    transition: stroke-dashoffset 2.5s ease-out;
}
</style>
