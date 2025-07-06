<script setup lang="ts">

import {onUnmounted, reactive, ref} from "vue";
import CommandBar from "@src/components/CommandBar.vue";

const items = reactive(new Map<string, number | boolean | string[]>());
const register = async () => {
  console.log("Registering");
  status.value = "Connecting...";

  try {
    await props.board.registerBoard(boardid, 0x4098, 0xBF0F, layout);
  } catch (e) {
    console.error("Failed to register board:", e)
    status.value = `Fail: ${e}`
    return;
  }

  layout.forEach((item) => {
    if (["PMDG_NG3_Data", "CDU_SCREEN", "CDU_SCREEN_CONTENT"].indexOf(item.id) >= 0) {
      console.log(`Skipping item ${item.id} as it is not a button or LED`);
      return;
    }
    items.set(item.id, 0)
  });

  props.board.onChange(boardid, (itemId: string, value: any) => {
    items.set(itemId, value)
  });

  connected.value = true;
  status.value = `Connected (0x4098, 0xBF0F)`;
};
const unregister = () => {
  console.log("Unregistering");
  props.board.unregisterBoard('fmc');
  connected.value = false;
  status.value = "Disconnected";
};

onUnmounted(() => {
  console.info("Unregistering on unmount");
  unregister();
});

const connected = ref(false);
const status = ref("Standby -- press Connect");
</script>

<template>
  <div>
    <CommandBar scope="PAP3N Board" :connected="connected" :status="status" @connect="register" @disconnect="unregister"/>
  </div>
</template>

<style scoped>

</style>