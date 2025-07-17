<script lang="ts" setup>
const props = defineProps<{
  value?: number;
  layout?: {
    value: number;
    name: string;
  }[];
  registered?: boolean | null;
}>();
const emit = defineEmits<{
  (e: "click", value: string): void;
}>();
const handleClick = (pos: number) => {

};
</script>

<template>
  <div class="flex flex-col">
    <span v-for="(item, i) in props.layout" :key="i"
          :class="{
            'switch-item--unregistered': props.registered === false,
            'switch-item--active': item.value === props.value,
          }"
          class="switch-item btn btn-xs"
          @click="handleClick(i)">
      {{ item.name }}
    </span>
  </div>
</template>

<style scoped>
.switch-item {
  background: gray;
  font-size: 0.25em;
  background: black;
  color: white;
}

.switch-item--unregistered {
  background: gray;
  color: white;
}

.switch-item--active {
  background: green;
  color: white;
}
</style>
