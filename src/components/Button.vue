<script lang="ts" setup>
const props = defineProps<{
  value?: string;
  type?: "square" | "circle" | "rectangle" | "rectangle-sm";
  clicked?: boolean;
  registered?: boolean | null;
}>()
const emit = defineEmits<{
  (e: "click", value: string): void;
}>()
const handleClick = () => {
  if (props.value) {
    emit("click", props.value);
  }
}
</script>

<template>
  <button
      :class="[`btn--${props.type}`, props.clicked ? 'btn--clicked' : '', props.registered === false ? 'btn--unregistered' : '']"
      class="btn cursor-pointer"
      @click="handleClick">
    {{ props.value || " " }}
  </button>
</template>

<style scoped>
.btn {
  background: black;
  color: white;
  text-align: center;
  line-height: 1;
}

.btn--square {
  width: 32px;
  height: 32px;
}

.btn--circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.btn--rectangle {
  width: 64px;
  height: 32px;
}

.btn--rectangle-sm {
  width: 48px;
  height: 24px;
  padding: 0;
}

.btn--clicked {
  background: green;
  color: white;
}

.btn--unregistered {
  background: gray;
  color: white;
}

</style>
