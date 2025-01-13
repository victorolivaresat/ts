<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import './css/app.css'

const defaultLayout = 'default'
const router = useRouter()
const currentRoute = router.currentRoute

const layout = computed(() => `${currentRoute.value.meta.layout || defaultLayout}-layout`)
</script>


