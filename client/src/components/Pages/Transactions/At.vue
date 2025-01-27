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
    <TableLite :is-slot-mode="true" :isLoading="tableConfig.isLoading" :title="'At Notifications'"
        :columns="tableConfig.columns" :rows="filterRows" :pageSize="tableConfig.itemsPerPage"
        :total="tableConfig.totalItems" :page="tableConfig.currentPage" :messages="tableConfig.messages"
        @do-search="handleSearch">

        <!-- Slot para Nombre -->
        <template v-slot:first_name="data">
            <span class="uppercase">{{ data.value.first_name }} {{ data.value.last_name }}</span>
        </template>

        <!-- Slot para estado -->
        <template v-slot:validated="data">
            <Switch :value="data.value.validated === true" :label="data.value.validated ? 'Validated' : 'Not validated'"
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
                    <input v-model="observations" type="text"
                        class="w-full px-3 py-2 border border-slate-200 rounded-md" required />
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
import { getAts, changeStatus, addObservations } from "../../../api/atApi";
import { BxMessageAltDetail, BxRefresh } from '@kalimahapps/vue-icons';
import { formatDateTime } from "../../../utils/dateFormatter";
import TableLite from "../../Shared/TableLite.vue";
import { onMounted, ref, computed } from "vue";
import Switch from "../../Shared/Switch.vue";
import Modal from '../../Shared/Modal.vue';
import { format, subDays } from 'date-fns';

const initialColumns = [
    { label: "ID", field: "id", sortable: true, width: "5%" },
    { label: "#Operation", field: "operation_number", sortable: true, width: "5%" },
    { label: "Name", field: "first_name", sortable: true, width: "15%", columnClasses: ["text-red-500"] },
    { label: "Account Destination", field: "account_number", sortable: true, width: "10%" },
    { label: "Date", field: "payment_date", sortable: true, width: "10%", display: (row) => formatDateTime(row.payment_date) },
    { label: "Payment Bank", field: "payment_bank", sortable: true, width: "15%" },
    { label: "Amount", field: "amount", sortable: true, width: "5%" },
    { label: "Validado", field: "validated", width: "15%", columnClasses: ["text-center"] },
    { label: "Actions", field: "actions", width: "10%", columnClasses: ["text-center"] },
];

const { tableConfig, fetchTableData } = useTable(getAts, initialColumns);

// Variables
const searchTerm = ref("");
const currentAtId = ref(null);
const observations = ref("");
const startDate = ref("");
const endDate = ref("");


// Modal
const isModalVisible = ref(false);

// Filtrar filas
const filterRows = computed(() => {
    return tableConfig.rows.filter((x) =>
        x.first_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        x.last_name.toLowerCase().includes(searchTerm.value.toLowerCase())
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
    currentAtId.value = id;

    const at = tableConfig.rows.find((row) => row.id === id);
    if (at) {
        observations.value = at.observations || '';
        console.log('observations:', observations.value);
    }
    isModalVisible.value = true;
};

const handleSubmit = async () => {
    try {
        await addObservations(currentAtId.value, observations.value);
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