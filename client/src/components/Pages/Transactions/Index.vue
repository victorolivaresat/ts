<template>
  <!-- Transactions Table -->
  <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
    <li class="me-2">
      <a href="#" @click.prevent="selectTab('BCP')"
        :class="{ 'text-orange-600 bg-gray-100 rounded-t-lg border-2 border-b-orange-500': selectedTab === 'BCP' }"
        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">
        BCP
      </a>
    </li>
    <li class="me-2">
      <a href="#" @click.prevent="selectTab('Interbank')"
        :class="{ 'text-green-600 bg-gray-100 rounded-t-lg border-2 border-b-green-500': selectedTab === 'Interbank' }"
        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">
        IBK
      </a>
    </li>
    <li class="me-2">
      <a href="#" @click.prevent="selectTab('ApuestaTotal')"
        :class="{ 'text-red-600 bg-gray-100 rounded-t-lg border-2 border-b-red-500': selectedTab === 'ApuestaTotal' }"
        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50">
        AT
      </a>
    </li>
  </ul>

  <!-- Componentes según la pestaña seleccionada -->
  <div v-if="selectedTab === 'BCP'">
    <Suspense>
      <template #default>
        <Bcp />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
  <div v-if="selectedTab === 'Interbank'">
    <Suspense>
      <template #default>
        <Ibk />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
  <div v-if="selectedTab === 'ApuestaTotal'">
    <Suspense>
      <template #default>
        <At />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';

const Bcp = defineAsyncComponent(() => import('./Bcp.vue'));
const Ibk = defineAsyncComponent(() => import('./Ibk.vue'));
const At = defineAsyncComponent(() => import('./At.vue'));
const selectedTab = ref('BCP');

const selectTab = (tab) => {
  selectedTab.value = tab;
};
</script>
