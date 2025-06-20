<script lang="ts" setup>
import {Pixel} from "./fmc.types.ts";

const props = defineProps<{
  grid: Pixel[][]
}>();
</script>

<template>
  <div class="bg-gray-600 p-1">
    <div class="grid grid-cols-24 grid-rows-14 gap-1">
      <template v-for="(row, rowIndex) in props.grid" :key="rowIndex">
        <div v-for="(pixel, colIndex) in row" :key="rowIndex.toString() + colIndex.toString()" class="cell">
          {{ pixel.char }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cell {
  width: 14px;
  height: 14px;
  font-family: monospace;
  font-size: 12px;
  text-align: center;
}
</style>
