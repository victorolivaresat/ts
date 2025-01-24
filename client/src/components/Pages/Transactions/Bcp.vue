<template>
  <div class="flex justify-between items-center my-4">
    <!-- Campo de búsqueda -->
    <input v-model="searchTerm" type="text" placeholder="Buscar por operación o cuenta"
      class="w-1/4 px-3 py-2 border border-gray-300 rounded-md" @input="fetchFilteredData" />

    <!-- Botón para refrescar datos -->
    <button class="bg-indigo-600 px-4 py-2 text-white rounded-md hover:bg-indigo-700" @click="fetchTableData">
      Refrescar Datos
    </button>
  </div>

  <!-- Tabla de datos -->
  <TableLite 
    :is-slot-mode="true" 
    :isLoading="tableConfig.isLoading" 
    :title="'BCP Notifications'"
    :columns="tableConfig.columns" 
    :rows="filterRows" 
    :pageSize="tableConfig.itemsPerPage" 
    :total="tableConfig.totalItems"
    :page="tableConfig.currentPage" 
    :messages="tableConfig.messages"
    @do-search="handleSearch"
  >
    <!-- Slot para estado -->
    <template v-slot:status="data">
      <Switch :value="data.value.status === true" :label="data.value.status ? 'Validated' : 'Not validated'"
      @update:value="(newValue) => handleChangeStatus(data.value.id, newValue ? true : false)" />
    </template>

    <!-- Slot para acciones -->
    <template v-slot:actions="data">
      <span>Ver Detalles</span>
    </template>
  </TableLite>
</template>

<script setup>
import { useTable } from "../../../composables/useTable";
import { formatDateTime } from "../../../utils/dateFormatter";
import { getBcps, changeStatus } from "../../../api/bcpApi";
import TableLite from "../../Shared/TableLite.vue";
import { onMounted, ref, computed } from "vue";
import Switch from "../../Shared/Switch.vue";


const initialColumns = [
  { label: "ID", field: "id", sortable: true, width: "5%" },
  { label: "#Operation", field: "operation_number", sortable: true },
  { label: "Beneficiary", field: "beneficiary", sortable: true, columnClasses: ["text-orange-500"] },
  { label: "Operation Type", field: "operation_type", sortable: true },
  { label: "Date", field: "date_time", sortable: true, display: (row) => formatDateTime(row.date_time) },
  { label: "Account Charge", field: "account_charge", sortable: true },
  { label: "Account Destination", field: "account_destination", sortable: true },
  { label: "Amount", field: "amount", sortable: true, },
  { label: "Status", field: "status", columnClasses: ["text-center"] },
  { label: "Actions", field: "actions", width: "5%", columnClasses: ["text-center"] },
];

const { tableConfig, fetchTableData } = useTable(getBcps, initialColumns);

// Manejo de búsqueda
const searchTerm = ref("");

// Filtrar filas
const filterRows = computed(() => {
  return tableConfig.rows.filter((x) =>
    x.operation_type.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    x.operation_number.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    x.account_charge.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Función para manejar la paginación
const handleSearch = async (offset, limit, sort, order) => {
  const page = offset / limit + 1;
  tableConfig.currentPage = page;
  tableConfig.itemsPerPage = limit;

  await fetchTableData(page, limit, sort, order);
};

// Actualización dinámica al buscar
const fetchFilteredData = async () => {
  tableConfig.currentPage = 1;
  await fetchTableData(1, tableConfig.itemsPerPage);
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
