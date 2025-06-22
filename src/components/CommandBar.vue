<script lang="ts" setup>
defineProps<{
  scope: string;
  connected: boolean;
  status: string;
}>();

defineEmits<{
  (e: "connect"): void;
  (e: "disconnect"): void;
}>();
</script>

<template>
  <div class="flex flex-row border-2 p-1 m-1 items-center justify-between">
    <span><strong>{{ scope }}</strong></span>
    <span class="ml-1 grow">{{ status }}</span>
    <button v-if="!connected" class="btn btn-xs btn-success" @click="$emit('connect')">Connect</button>
    <button v-else class="btn btn-xs btn-danger" @click="$emit('disconnect')">Disconnect</button>
  </div>
</template>

<style scoped>

</style>