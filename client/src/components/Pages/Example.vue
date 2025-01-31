<template>
    <div class="carousel-container">
        <div class="carousel" ref="carousel">
            <div v-for="(image, index) in images" :key="index" class="carousel-item">
                <img :src="image" alt="Imagen del carrusel" class="w-full h-auto" />
            </div>
        </div>
        <button @click="prev" class="carousel-control prev">◀️</button>
        <button @click="next" class="carousel-control next">▶️</button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Lista de imágenes de ejemplo
const images = ref([
    'https://picsum.photos/1600/900?random=1',
    'https://picsum.photos/1600/900?random=2',
    'https://picsum.photos/1600/900?random=3',
    'https://picsum.photos/1600/900?random=4',
    'https://picsum.photos/1600/900?random=5',
])

const carousel = ref(null)
let currentIndex = 0

// Función para mostrar la imagen anterior
const prev = () => {
    if (currentIndex > 0) {
        currentIndex--
    } else {
        currentIndex = images.value.length - 1
    }
    updateCarousel()
}

// Función para mostrar la siguiente imagen
const next = () => {
    if (currentIndex < images.value.length - 1) {
        currentIndex++
    } else {
        currentIndex = 0
    }
    updateCarousel()
}

// Función para actualizar la posición del carrusel
const updateCarousel = () => {
    const carouselElement = carousel.value
    const offset = -currentIndex * 100
    carouselElement.style.transform = `translateX(${offset}%)`
}

// Función para iniciar el carrusel automático
const startAutoSlide = () => {
    return setInterval(() => {
        next()
    }, 5000)
}

// Función para detener el carrusel automático
const stopAutoSlide = (intervalId) => {
    clearInterval(intervalId)
}

// Iniciar el carrusel automático al montar el componente
let autoSlideInterval = null
onMounted(() => {
    autoSlideInterval = startAutoSlide()
})

// Detener el carrusel automático al desmontar el componente
onUnmounted(() => {
    stopAutoSlide(autoSlideInterval)
})
</script>

<style scoped>
.carousel-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: 800px;
    margin: auto;
}

.carousel {
    display: flex;
    transition: transform 0.5s ease-in-out;
}

.carousel-item {
    min-width: 100%;
    box-sizing: border-box;
}

.carousel-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
}

.carousel-control.prev {
    left: 10px;
}

.carousel-control.next {
    right: 10px;
}
</style>