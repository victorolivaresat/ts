<template>
    <apexchart :options="chartOptions" :series="series" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import merge from 'lodash/merge';

// Props
const props = defineProps({
    seriesData: {
        type: Array,
        required: true,
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
        type: 'area',
    },
    dataLabels: {
        formatter: (val) => {
            if (val >= 1000) {
                return 'S/ ' + (val / 1000).toFixed(1) + 'k';
            }
            return 'S/ ' + val.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        },
        offsetX: 40,
        style: {
            fontSize: '9px',
            colors: ['#767fb4'],
        },
    },
    legend: {
        show: false,
    },
    forecastDataPoints: {
        count: 7
    },
    stroke: {
        width: 5,
        curve: 'smooth'
    },
    markers: {
        size: 8,
    },
    yaxis: {
        labels: {
            formatter: function (val) {
                return (val.toFixed(0));
            },
        },
    },
    xaxis: {},
    fill: {
        type: 'gradient',
        gradient: {
            type: 'vertical',
            opacityFrom: 0.9,
            opacityTo: 0.9,
        },
    },
    tooltip: {
        y: {
            formatter: (val) => {
                if (val >= 1000) {
                    return 'S/ ' + (val / 1000).toFixed(1) + 'k';
                }
                return 'S/ ' + val.toFixed(2);
            },
        },
    },
};

// Reactive variables
const chartOptions = ref(merge({}, defaultChartOptions, props.chartOptions));
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
        merge(chartOptions.value, newVal);
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