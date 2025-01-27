<template>
  <div class="flex justify-between items-center my-4">
    <!-- Campo de búsqueda -->
    <input v-model="searchTerm" type="text" placeholder="Buscar por beneficiario"
      class="w-1/4 px-3 py-2 border border-gray-300 rounded-md" @input="fetchFilteredData" />

    <div class="flex items-center space-x-4">
      <!-- Campo para la fecha de inicio -->
      <input v-model="startDate" type="date" placeholder="Fecha de inicio"
        class="px-3 py-2 border border-gray-300 rounded-md" @input="fetchFilteredData" />

      <!-- Campo para la fecha de fin -->
      <input v-model="endDate" type="date" placeholder="Fecha de fin"
        class="px-3 py-2 border border-gray-300 rounded-md" @input="fetchFilteredData" />

      <!-- Botón para refrescar datos -->
      <button class="bg-indigo-600 px-3 py-2 text-white rounded-md hover:bg-indigo-700"
        @click="() => { resetForm(); fetchTableData(); }">
        <BxRefresh class="text-2xl" />
      </button>
    </div>

  </div>

  <!-- Tabla de datos -->
  <TableLite :is-slot-mode="true" :isLoading="tableConfig.isLoading" :title="'Ibk Notifications'"
    :columns="tableConfig.columns" :rows="filterRows" :pageSize="tableConfig.itemsPerPage"
    :total="tableConfig.totalItems" :page="tableConfig.currentPage" :messages="tableConfig.messages"
    @do-search="handleSearch">
    
    <!-- Slot para estado -->
    <template v-slot:status="data">
      <Switch :value="data.value.status === true" :label="data.value.status ? 'Validated' : 'Not validated'"
        @update:value="(newValue) => handleChangeStatus(data.value.id, newValue ? true : false)" />
    </template>

    <!-- Slot para acciones -->
    <template v-slot:actions="data">
      <button class="px-2 py-1" @click="openModal(data.value.id)">
        <BxMessageAltDetail
          :class="{ 'text-gray-500': !data.value.observations, 'text-yellow-500': data.value.observations }"
          class="text-lg" />
      </button>
    </template>
  </TableLite>


  <!-- Modal -->
  <Modal v-model="isModalVisible" :title="'Add Observations'">
    <form @submit.prevent="handleSubmit">
      <div class="grid">
        <div class="mb-4">
          <label class="block mb-1 text-sm font-medium">Observations</label>
          <input v-model="observations" type="text" class="w-full px-3 py-2 border border-slate-200 rounded-md"
            required />
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { useTable } from "../../../composables/useTable";
import { getIbks, changeStatus, addObservations } from "../../../api/ibkApi";
import { BxMessageAltDetail, BxRefresh } from '@kalimahapps/vue-icons';
import { formatDateTime } from "../../../utils/dateFormatter";
import TableLite from "../../Shared/TableLite.vue";
import { onMounted, ref, computed } from "vue";
import Switch from "../../Shared/Switch.vue";
import Modal from '../../Shared/Modal.vue';

const initialColumns = [
  { label: "ID", field: "id", sortable: true, width: "5%" },
  { label: "#Operation", field: "number_application", sortable: true, width: "10%" },
  { label: "Beneficiary", field: "beneficiary", sortable: true, width: "25%", columnClasses: ["text-green-500"] },
  { label: "Date", field: "date_time", sortable: true, width: "10%", display: (row) => formatDateTime(row.date_time) },
  { label: "Account Charge", field: "account_charge", sortable: true, width: "10%" },
  { label: "Account Destination", field: "account_destination", width: "10%", sortable: true },
  { label: "Amount", field: "amount", sortable: true, width: "5%" },
  { label: "Status", field: "status", width: "15%", columnClasses: ["text-center"] },
  { label: "Actions", field: "actions", width: "10%", columnClasses: ["text-center"] },
];


const { tableConfig, fetchTableData } = useTable(getIbks, initialColumns);

// Variables
const searchTerm = ref("");
const currentIbkId = ref(null);
const observations = ref("");
const startDate = ref("");
const endDate = ref("");


// Modal
const isModalVisible = ref(false);

// Filtrar filas
const filterRows = computed(() => {
  return tableConfig.rows.filter((x) =>
    x.beneficiary.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Resetear los campos del formulario
const resetForm = () => {
  searchTerm.value = "";
  startDate.value = "";
  endDate.value = "";
};

// Función para manejar la paginación
const handleSearch = async (offset, limit, sort, order) => {
  const page = offset / limit + 1;

  // Actualiza el estado en tableConfig
  tableConfig.currentPage = page;
  tableConfig.itemsPerPage = limit;
  tableConfig.sortable.order = order || tableConfig.sortable.order;
  tableConfig.sortable.column = sort || tableConfig.sortable.column;

  console.log('Parametros enviados en búsqueda:', {
    page,
    limit,
    sort: tableConfig.sortable.column,
    order: tableConfig.sortable.order,
    startDate: startDate.value || undefined,
    endDate: endDate.value || undefined,
  });

  await fetchTableData({
    page,
    limit,
    sort: tableConfig.sortable.column,
    order: tableConfig.sortable.order,
    startDate: startDate.value || undefined,
    endDate: endDate.value || undefined,
  });
};

// Actualización dinámica al buscar
const fetchFilteredData = async () => {

  if (startDate.value && endDate.value && new Date(startDate.value) > new Date(endDate.value)) {
    console.error("La fecha de inicio no puede ser mayor que la fecha de fin.");
    return;
  }

  const params = {
    page: 1,
    limit: tableConfig.itemsPerPage,
    sort: tableConfig.sortable.column,
    order: tableConfig.sortable.order,
    search: searchTerm.value,
    startDate: startDate.value || undefined,
    endDate: endDate.value || undefined,
  };

  tableConfig.currentPage = 1;
  console.log("Parámetros enviados:", params);

  await fetchTableData(params);
};

// Modal functions
const openModal = (id = null) => {
  currentIbkId.value = id;

  const ibk = tableConfig.rows.find((row) => row.id === id);
  if (ibk) {
    observations.value = ibk.observations || '';
    console.log('observations:', observations.value);
  }
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await addObservations(currentIbkId.value, observations.value);
    isModalVisible.value = false;
    await fetchTableData(tableConfig.currentPage, tableConfig.itemsPerPage);
  } catch (error) {
    console.error('Error adding observations:', error);
  }
};

// Change status
const handleChangeStatus = async (id, newStatus) => {
  try {
    await changeStatus(id, newStatus);
    await fetchTableData(tableConfig.currentPage, tableConfig.itemsPerPage);
  } catch (error) {
    console.error('Error changing user status:', error);
  }
};

// Carga inicial de datos
onMounted(() => {
  fetchTableData();
});
</script>