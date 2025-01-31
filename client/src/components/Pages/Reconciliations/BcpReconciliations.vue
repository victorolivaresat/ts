<template>
    <div class="flex justify-between items-center my-4">
        <input v-model="searchTerm" type="text" placeholder="Buscar por beneficiario"
            class="w-1/4 px-3 py-2 border border-gray-300 rounded-md" @input="fetchFilteredData" />

        <div class="flex items-center space-x-4">
            <input v-model="startDate" type="date" class="px-3 py-2 border border-gray-300 rounded-md"
                @input="fetchFilteredData" />
            <input v-model="endDate" type="date" class="px-3 py-2 border border-gray-300 rounded-md"
                @input="fetchFilteredData" />
            <button class="bg-indigo-600 px-3 py-2 text-white rounded-md hover:bg-indigo-700" @click="resetFilters">
                <BxRefresh class="text-2xl" />
            </button>
        </div>
    </div>

    <TableLite :is-slot-mode="true" :isLoading="tableConfig.isLoading" :title="'Bcp Reconciliations'"
        :columns="tableConfig.columns" :rows="filterRows" :pageSize="tableConfig.itemsPerPage"
        :total="tableConfig.totalItems" :page="tableConfig.currentPage" :messages="tableConfig.messages"
        @do-search="handleSearch">
        <template v-slot:score="data">
            <div class="flex items-center justify-center">
                <span class="text-center me-2">{{ data.value.score }}%</span>
                <span :class="scoreClass(data.value.score)">
                    <component :is="scoreIcon(data.value.score)" />
                </span>
            </div>
        </template>
        <template v-slot:beneficiary="data">
            {{ data.value.bcp.beneficiary }}
        </template>
        <template v-slot:operation="data">
            {{ data.value.at.operation_number }}
        </template>
        <template v-slot:date="data">
            {{ formatDateTime(data.value.at.payment_date) }}
        </template>
        <template v-slot:account="data">
            {{ data.value.at.account_number }}
        </template>
        <template v-slot:amount="data">
            {{ data.value.bcp.amount }}
        </template>
        <template v-slot:created="data">
            {{ formatDateTime(data.value.created_at) }}
        </template>
        <!-- Slot para acciones -->
        <template v-slot:actions="data">
            <button class="px-2 py-1" @click="openModal(data.value.id)">
                <FaEye class="text-lg text-blue-700" />
            </button>
        </template>
    </TableLite>

    <!-- Modal -->
    <Modal v-model="isModalVisible" :title="'Details'" :size="'lg'">
        <div v-if="currentReconciliation" class="space-y-6">
            <!-- Reconciliation Score -->
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-indigo-600">#Operación: {{ currentReconciliation.at.operation_number
                    }}</h2>
                <ProgressCircle :score="currentReconciliation.score" size="sm" />
            </div>

            <div class="grid grid-cols-1 gap-4">
                <!-- Bcp Details -->
                <div class="card p-4 bg-orange-200 text-blue-900 shadow-md rounded-lg">
                    <div class="space-y-2">
                        <img :src="bcpLogo" alt="Bcp Logo" class="w-28" />
                        <h3 class="font-bold text-xl">{{ currentReconciliation.bcp.beneficiary }}</h3>
                        <p class="font-bold text-lg text-blue-800">Monto: {{ currentReconciliation.bcp.amount }}</p>
                        <p><strong>Date Time:</strong> {{ formatDateTime(currentReconciliation.bcp.date_time) }}</p>
                        <p><strong>Account Destination:</strong> {{ currentReconciliation.bcp.account_destination }}</p>
                    </div>
                </div>

                <!-- AT Details -->
                <div class="card p-4 bg-slate-100 shadow-md rounded-lg">
                    <div class="space-y-2">
                        <img :src="atLogo" alt="AT Logo" class="w-32" />
                        <h3 class="font-bold text-xl text-indigo-800 uppercase">
                            {{ `${currentReconciliation.at.last_name} ${currentReconciliation.at.first_name}` }}
                        </h3>
                        <p class="text-lg font-bold text-slate-800">Monto: {{ currentReconciliation.at.amount }}</p>
                        <p><strong>Fecha de pago:</strong> {{ formatDateTime(currentReconciliation.at.payment_date) }}
                        </p>
                        <p><strong>Número de cuenta:</strong> {{ currentReconciliation.at.account_number }}</p>
                    </div>
                </div>
            </div>
        </div>
    </Modal>


</template>

<script setup>
import { getBcpReconciliations, getBcpReconciliation } from "../../../api/reconciliationApi";
import ProgressCircle from "../../Shared/ProgressCircle.vue";
import { formatDateTime } from "../../../utils/dateFormatter";
import { FaEye, FaArrowDown, FaArrowUp, FaMinus } from '@kalimahapps/vue-icons';
import { useTable } from "../../../composables/useTable";
import { BxRefresh } from '@kalimahapps/vue-icons';
import TableLite from "../../Shared/TableLite.vue";
import { ref, computed, onMounted } from "vue";
import Modal from "../../Shared/Modal.vue";

import bcpLogo from "../../../assets/logos/bcp_logo.svg";
import atLogo from "../../../assets/logos/at_logo.svg";


const initialColumns = [
    { label: "ID", field: "id", sortable: true, width: "5%" },
    { label: "Score", field: "score", sortable: true, width: "5%", columnClasses: ["text-center"] },
    { label: "#Operation", field: "operation", sortable: true, width: "5%", columnClasses: ["text-center"] },
    { label: "Beneficiary", field: "beneficiary", sortable: true, width: "25%", columnClasses: ["text-indigo-700"] },
    { label: "Date", field: "date", sortable: true, width: "15%" },
    { label: "Account", field: "account", sortable: true, width: "15%" },
    { label: "Created", field: "created", width: "15%", columnClasses: ["text-center"] },
    { label: "Amount", field: "amount", sortable: true, width: "5%", columnClasses: ["text-right"] },
    { label: "Actions", field: "actions", width: "10%", columnClasses: ["text-center"] },
];

const { tableConfig, fetchTableData } = useTable(getBcpReconciliations, initialColumns);
const searchTerm = ref("");
const startDate = ref("");
const endDate = ref("");
const isModalVisible = ref(false);
const currentBcpId = ref(null);
const currentReconciliation = ref(null);

const openModal = async (id) => {
    currentBcpId.value = id;
    const response = await getBcpReconciliation(id);
    currentReconciliation.value = response;
    isModalVisible.value = true;
};

const scoreClass = (score) => {
    if (score > 90) return "text-green-500";
    if (score >= 60 && score <= 89) return "text-yellow-500";
    return "text-red-500";
};

const scoreIcon = (score) => {
    if (score > 90) return FaArrowUp;
    if (score >= 60 && score <= 89) return FaMinus;
    return FaArrowDown;
};

const filterRows = computed(() => {
    return tableConfig.rows.filter(x => x.bcp.beneficiary.toLowerCase().includes(searchTerm.value.toLowerCase()));
});

const resetFilters = () => {
    searchTerm.value = "";
    startDate.value = "";
    endDate.value = "";
    fetchTableData();
};

const handleSearch = async (offset, limit, sort, order) => {
    await fetchTableData({
        page: offset / limit + 1,
        limit,
        sort,
        order,
        startDate: startDate.value,
        endDate: endDate.value
    });
};

const fetchFilteredData = async () => {
    await fetchTableData({ page: 1, limit: tableConfig.itemsPerPage, search: searchTerm.value, startDate: startDate.value, endDate: endDate.value });
};

onMounted(fetchTableData);

</script>