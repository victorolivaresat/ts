<template>
    <apexchart :options="chartOptions" :series="series" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Props
const props = defineProps({
    seriesData: {
        type: Array,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
        default: () => [],
    },
    chartOptions: {
        type: Object,
        required: false,
        default: () => ({}),
    },
});

const apexchart = VueApexCharts;

const defaultChartOptions = {
    chart: {
        height: 350,
        type: 'bar',
        zoom: {
            enabled: false,
        },
    },
    plotOptions: {
        bar: {
            endingShape: 'rounded',
            borderRadius: 4,
            distributed: true,
            dataLabels: {
                position: 'top',
            },
        },
    },
    dataLabels: {
        formatter: (val) =>
            'S/ ' +
            val.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        offsetX: 40,
        style: {
            fontSize: '8px',
            colors: ['blue'],
        },
    },
    legend: {
        show: true,
    },
    xaxis: {
        
    },
    fill: {
        opacity: 1,
    },
    tooltip: {
        y: {
            formatter: (val) => 'S/ ' + val.toFixed(2),
        },
    },
};

// Reactive variables
const chartOptions = ref({ ...defaultChartOptions, ...props.chartOptions });
const series = ref([
    {
        name: 'Amount',
        data: props.seriesData,
    },
]);

// Watchers
watch(
    () => props.seriesData,
    (newVal) => {
        series.value[0].data = newVal;
    }
);

watch(
    () => props.chartOptions,
    (newVal) => {
        chartOptions.value = { ...defaultChartOptions, ...newVal };
    },
    { deep: true }
);

// Initialize on mount
onMounted(() => {
    series.value[0].data = props.seriesData;
    if (props.chartOptions?.xaxis?.categories) {
        chartOptions.value.xaxis.categories = props.chartOptions.xaxis.categories;
    }
});
</script>
