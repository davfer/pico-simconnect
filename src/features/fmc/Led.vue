<script lang="ts" setup>
const props = defineProps<{
  value?: boolean;
  color?: "red" | "green" | "blue" | "yellow" | "white";
  type?: "square" | "circle" | "vrectangle" | "rectangle-sm";
  text?: string;
}>();
</script>

<template>
  <div :class="[props.type, props.color ? `led--${props.color}` : '']" class="led">
    <span v-if="props.value" class="text-white">●</span>
  </div>
</template>

<style scoped>
.led {
  width: 16px;
  height: 16px;
  background: black;
}

.led.square {
  border-radius: 0;
}

.led.rectangle-sm {
  border-radius: 0;
  width: 32px;
  height: 16px;
}

.led.vrectangle {
  width: 32px;
  height: 16px;
  rotate: 90deg;
}

.led--red {
  background: red;
}

.led--green {
  background: green;
}
</style>
