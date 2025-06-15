<script setup lang="ts">
const props = defineProps<{
  value?: boolean;
  color?: "red" | "green" | "blue" | "yellow" | "white";
  type?: "square" | "circle" | "vrectangle";
}>();
</script>

<template>
  <div class="led" :class="[props.type, props.color ? `led--${props.color}` : '']">
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
