<script lang="ts" setup>
import {CduCell, CduCellColor} from "./fmc.types.ts";
import {computed} from "vue";

const props = defineProps<{
  grid: CduCell[][]
}>();

const classNames = computed(() => {
  return (cell: CduCell) => {
    const classes = ['cell'];
    if (cell.flags & 0x01) classes.push('cell--small');
    if (cell.flags & 0x02) classes.push('cell--unused');
    switch (cell.color) {
      case CduCellColor.WHITE:
        classes.push('cell--color-white');
        break;
      case CduCellColor.MAGENTA:
        classes.push('cell--color-magenta');
        break;
      case CduCellColor.AMBER:
        classes.push('cell--color-amber');
        break;
      case CduCellColor.CYAN:
        classes.push('cell--color-cyan');
        break;
      case CduCellColor.GREEN:
        classes.push('cell--color-green');
        break;
      case CduCellColor.RED:
        classes.push('cell--color-red');
        break;
    }
    return classes
  }
})
</script>

<template>
  <div class="bg-gray-600 p-1">
    <div class="grid grid-cols-24 grid-rows-14 gap-1">
      <template v-for="(row, rowIndex) in props.grid" :key="rowIndex">
        <div v-for="(pixel, colIndex) in row" :key="rowIndex.toString() + colIndex.toString()" :class="classNames(pixel)">
          {{ pixel.symbol }}
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
.cell--small {
  font-size: 10px;
}
.cell--unused {
  color: #555;
}
.cell--color-white {
  color: white;
}
.cell--color-magenta {
  color: magenta;
}
.cell--color-cyan {
  color: cyan;
}
.cell--color-green {
  color: green;
}
.cell--color-red {
  color: red;
}

</style>
