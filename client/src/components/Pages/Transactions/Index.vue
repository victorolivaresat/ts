<template>
  <!-- Transactions Table -->
  <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
    <li class="me-2">
      <a href="#" @click.prevent="selectTab('BCP')"
        :class="{ 'text-orange-600 bg-gray-100 rounded-t-lg border-2 border-b-orange-500': selectedTab === 'BCP' }"
        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">BCP</a>
    </li>
    <li class="me-2">
      <a href="#" @click.prevent="selectTab('Interbank')"
        :class="{ 'text-green-600 bg-gray-100 rounded-t-lg border-2 border-b-green-500': selectedTab === 'Interbank' }"
        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">Interbank</a>
    </li>
    <li class="me-2">
      <a href="#" @click.prevent="selectTab('ApuestaTotal')"
        :class="{ 'text-red-600 bg-gray-100 rounded-t-lg border-2 border-b-red-500': selectedTab === 'ApuestaTotal' }"
        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">ApuestaTotal</a>
    </li>
  </ul>

  <!-- Componentes según la pestaña seleccionada -->
  <div v-if="selectedTab === 'BCP'">
    <Bcp />
  </div>
  <div v-if="selectedTab === 'Interbank'">
    <Ibk />
  </div>
  <div v-if="selectedTab === 'ApuestaTotal'">
    <At />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Bcp from './Bcp.vue';
import Ibk from './Ibk.vue';
import At from './At.vue';

const selectedTab = ref('BCP');

const selectTab = (tab) => {
  selectedTab.value = tab;
};
</script>

<style scoped>

</style>