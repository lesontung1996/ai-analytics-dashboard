<script setup lang="ts">
import { ref, useTemplateRef, onMounted, nextTick } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import type { ChartProps } from "~/types/agent";

const props = defineProps<ChartProps>();

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const chartCanvas = useTemplateRef("chartCanvas");
const chartInstance = ref<ChartJS | null>(null);

const createChart = async () => {
  if (!chartCanvas.value) return;

  await nextTick();

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  chartInstance.value = new ChartJS(ctx, {
    type: "bar",
    data: {
      labels: props.data.map((_, index) => `Period ${index + 1}`),
      datasets: [
        {
          label: props.title,
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
          data: props.data,
          ...props.chartConfig,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(() => {
  createChart();
});
</script>

<template>
  <div class="w-full h-full p-6 bg-white rounded-lg shadow-lg flex flex-col">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">{{ title }}</h2>
    <div class="flex-1">
      <canvas ref="chartCanvas" class="w-full h-full" />
    </div>
  </div>
</template>
