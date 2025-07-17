<script lang="ts" setup>
const props = defineProps<{
  value?: boolean;
  color?: "red" | "green" | "blue" | "yellow" | "white";
  type?: "square" | "circle" | "vrectangle" | "rectangle-sm";
  text?: string;
}>();
</script>

<template>
  <div :class="[props.type, props.color ? `led--${props.color}${props.value ? '-enabled' : ''}` : '']" class="led">
    <span v-if="props.value" class="text-white">{{ text ? text : '●' }}</span>
    <span v-else class="text-gray-500">{{ text ? text : '○' }}</span>
  </div>
</template>

<style scoped>
.led {
  width: 16px;
  height: 16px;
  background: black;
  text-align: center;
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
  min-width: 20px;
  min-height: 64px;
  margin-top: 32px;

  span {
    display: block;
    rotate: 90deg;
    text-align: center;
    margin-top: 10px;
  }
}

.led--red {
  background: #3b0000;
}

.led--red-enabled {
  background: red;
}

.led--green {
  background: #002c00;
}

.led--green-enabled {
  background: green;
}

.led--white {
  background: #3a3a3a;
}

.led--white-enabled {
  background: white;
}

.led--yellow {
  background: #2c2500;
}

.led--yellow-enabled {
  background: yellow;
}
</style>
