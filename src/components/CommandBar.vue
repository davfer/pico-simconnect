<script setup lang="ts">

const props = defineProps<{
  connected: boolean;
  status: string;
}>();

const emit = defineEmits<{
  (e: "connect"): void;
  (e: "disconnect"): void;
}>();
</script>

<template>
    <div class="flex flex-row border-2 p-2 m-2 items-center justify-between">
      <span><strong>Board</strong></span>
      <span class="ml-1 grow">{{ status }}</span>
      <button v-if="!connected" class="btn btn-sm btn-success" @click="$emit('connect')">Connect</button>
      <button v-else class="btn btn-sm btn-danger" @click="$emit('disconnect')">Disconnect</button>
    </div>
</template>

<style scoped>

</style>