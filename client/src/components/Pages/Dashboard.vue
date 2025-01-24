<template>
    <!-- Información de Resumen -->
    <div class="mt-4">
        <div class="flex flex-wrap -mx-6">
            <div v-for="(item, index) in summaryData" :key="index" class="w-full px-6 sm:w-1/2 xl:w-1/3">
                <div class="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                    <div :class="item.iconBg">
                        <component :is="item.icon" class="text-white text-2xl" />
                    </div>
                    <div class="mx-5">
                        <h4 class="text-2xl font-semibold text-gray-700">
                            S/ {{ formatWithThousandSeparator(item.amount) }}
                        </h4>
                        <div class="text-gray-500">{{ item.label }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Gráficos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div v-if="loading" class="col-span-1 md:col-span-2 text-center">
            <p class="text-gray-500">Loading data...</p>
        </div>

        <!-- Gráfico BCP -->
        <div v-if="!loading && !error" class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold mb-4 text-orange-600">BCP</h3>
            <Chart v-if="bcpSeries.length" :series-data="bcpSeries[0]?.data" :chart-options="bcpChartOptions" />
            <p v-else class="text-gray-500">No data available for BCP</p>
        </div>

        <!-- Gráfico Interbank -->
        <div v-if="!loading && !error" class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold mb-4 text-green-600">Interbank</h3>
            <Chart v-if="ibkSeries.length" :series-data="ibkSeries[0]?.data" :chart-options="ibkChartOptions" />
            <p v-else class="text-gray-500">No data available for Interbank</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="col-span-1 md:col-span-2 text-center text-red-500">
            <p>{{ error }}</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { BxMoney, BxCreditCard, BxMoneyWithdraw } from '@kalimahapps/vue-icons';
import { getMonthlyAmountSums, getBcpDailyAmountsForChart, getIbkDailyAmountsForChart } from '../../api/dashboardApi';
import { formatWithThousandSeparator } from '../../utils/numberFormatter';
import Chart from '../Shared/Chart.vue';
import merge from 'lodash/merge';


// Variables Reactivas
const summaryData = ref([]);
const bcpSeries = ref([]);
const bcpCategories = ref([]);
const ibkSeries = ref([]);
const ibkCategories = ref([]);
const bcpChartOptions = ref({});
const ibkChartOptions = ref({});
const loading = ref(true);
const error = ref(null);

// Función para obtener datos del resumen
const fetchSummaryData = async () => {
    try {
        const monthlyData = await getMonthlyAmountSums();
        summaryData.value = [
            {
                label: 'Interbank',
                amount: monthlyData?.ibkTotalAmount || 0,
                icon: BxCreditCard,
                iconBg: 'p-4 bg-green-600 rounded-full',
            },
            {
                label: 'BCP',
                amount: monthlyData?.bcpTotalAmount || 0,
                icon: BxMoney,
                iconBg: 'p-4 bg-orange-600 rounded-full',
            },
            {
                label: 'ApuestaTotal',
                amount: monthlyData?.atTotalAmount || 0,
                icon: BxMoneyWithdraw,
                iconBg: 'p-4 bg-red-600 rounded-full',
            },
        ];
    } catch (err) {
        throw new Error('Failed to fetch summary data');
    }
};

// Función para obtener datos de gráficos
const fetchChartData = async () => {
    try {
        const [bcpData, ibkData] = await Promise.all([
            getBcpDailyAmountsForChart(),
            getIbkDailyAmountsForChart(),
        ]);

        if (bcpData?.categories && bcpData?.series) {
            bcpSeries.value = bcpData.series;
            bcpCategories.value = bcpData.categories;

            // Configurar opciones del gráfico BCP
            bcpChartOptions.value = merge({}, bcpChartOptions.value, {
                xaxis: {
                    categories: bcpData.categories,
                    type: 'datetime',
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        gradientToColors: ['#ef8d41'],
                    },
                },
                markers: {
                    colors : ['#002a8d'],
                },
                colors : ['#002a8d'],
            });
        }

        if (ibkData?.categories && ibkData?.series) {
            ibkSeries.value = ibkData.series;
            ibkCategories.value = ibkData.categories;

            // Configurar opciones del gráfico Interbank
            ibkChartOptions.value = {
                xaxis: {
                    categories: ibkData.categories,
                    type: 'datetime',
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        gradientToColors: ['#22c433'],
                    },
                },
                markers: {
                    colors : ['#0039a6'],
                },
                colors : ['#0039a6'],
            };
        }
    } catch (err) {
        throw new Error('Failed to fetch chart data');
    }
};

// Función Principal para Manejar la Carga
const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
        await Promise.all([fetchSummaryData(), fetchChartData()]);
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

// Ejecutar al montar el componente
onMounted(fetchData);
</script>
