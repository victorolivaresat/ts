<template>
    <div class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
        <!-- Encabezado -->
        <div class="flex items-center justify-between mb-4">
            <h5 class="text-xl font-bold leading-none text-gray-700">
                Transacciones Recientes <span class="text-sm font-normal text-gray-500">- Últimos 5 días</span>
            </h5>
        </div>

        <!-- Sistema de Tabs -->
        <div>
            <!-- Tabs Headers -->
            <div class="flex border-b mb-4">
                <button v-for="(transactionsByDate, date) in transactions" :key="date" @click="activeTab = date"
                    :class="`px-4 py-2 border-b-2 ${activeTab === date ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`"
                    class="text-sm">
                    {{ date }}
                </button>
            </div>

            <!-- Tabs Content -->
            <div v-for="(transactionsByDate, date) in transactions" :key="date">
                <div v-if="activeTab === date" class="p-4">
                    <h3 class="text-lg font-semibold mb-4">Detalles del {{ date }}</h3>
                    <div class="flex flex-wrap gap-6">
                        <div v-for="transaction in transactionsByDate" :key="transaction.id"
                            class="p-3 rounded-lg shadow-lg w-52" :class="sourceClass(transaction.source)">
                            <p class="font-semibold">{{ transaction.operationDate }}</p>
                            <p class="text-lg">Fuente: {{ transaction.source }}</p>
                            <p class="text-sm">Total: {{ formatWithThousandSeparator(transaction.totalAmount) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { debounce } from "lodash";
import emitter from "../../../eventBus";
import { ref, onMounted, onUnmounted } from "vue";
import { getRecentNotificationSums } from "../../../api/uploadApi";
import { formatWithThousandSeparator } from "../../../utils/numberFormatter";

const isLoading = ref(false);
const transactions = ref({});
const activeTab = ref("");

const sourceClass = (source) => {
    
    if (source === "BCP") {
        return "bg-orange-300 text-orange-900";
    } else if (source === "IBK") {
        return "bg-green-300 text-green-900";
    } else if (source === "AT") {
        return "bg-indigo-800 text-indigo-100";
    } else {
        return "bg-gray-200";
    }
};


const fetchData = async () => {
    try {
        isLoading.value = true;
        const response = await getRecentNotificationSums();
        if (response?.data) {
            transactions.value = response.data;

            const firstDate = Object.keys(transactions.value)[0];
            if (firstDate) {
                activeTab.value = firstDate;
            }
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchData();
    emitter.on("file-uploaded", debounce(fetchData, 300));
});

onUnmounted(() => {
    emitter.off("file-uploaded", debounce(fetchData, 300));
});

</script>
