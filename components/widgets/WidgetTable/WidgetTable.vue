<script setup lang="ts">
import type { TableProps } from "~/types/agent";

const props = defineProps<TableProps>();

const getColumnKeys = (): string[] => {
  if (props.data.length === 0) return [];
  return Object.keys(props.data[0]);
};

const formatValue = (value: string | number): string => {
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  return String(value);
};
</script>

<template>
  <div class="w-full h-full p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">{{ title }}</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="key in getColumnKeys()"
              :key="key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ key }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in data"
            :key="index"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="key in getColumnKeys()"
              :key="key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              {{ formatValue(row[key]) }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="data.length === 0" class="text-center py-8 text-gray-500">
        No data available
      </div>
    </div>
  </div>
</template>
