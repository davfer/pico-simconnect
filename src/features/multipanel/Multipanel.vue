<script lang="ts" setup>

import CommandBar from "@src/components/CommandBar.vue";
import {onUnmounted, reactive, ref} from "vue";
import FrontBoard from "@shared/adapters/front-board.ts";
import {MULTIPANEL_LAYOUT} from "@src/features/multipanel/multipanel.layout.ts";
import Widget from "@src/features/boards/Widget.vue";

const props = defineProps<{
  board: FrontBoard
}>();

const boardid = 'multipanel';
const layout = MULTIPANEL_LAYOUT

const items = reactive(new Map<string, number | boolean | string[]>());
const register = async () => {
  console.log("Registering");
  status.value = "Connecting...";

  try {
    await props.board.registerBoard(boardid, 0xCafe, 0x4004, layout);
  } catch (e) {
    console.error("Failed to register board:", e)
    status.value = `Fail: ${e}`
    return;
  }

  layout.forEach((item) => {
    if (["PMDG_NG3_Data"].indexOf(item.id) >= 0) {
      console.log(`Skipping item ${item.id} as it is not a button or LED`);
      return;
    }
    items.set(item.id, 0)
  });

  props.board.onChange(boardid, (itemId: string, value: any) => {
    if (["PMDG_NG3_Data"].indexOf(itemId) < 0 && value.hasOwnProperty("length")) {
      items.set(itemId, value[0] ? 1 : 0)
      return
    }
    items.set(itemId, value)
  });

  connected.value = true;
  status.value = `Connected (0xCafe, 0x4005)`;
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
    <CommandBar :connected="connected" :status="status" scope="MP Board" @connect="register" @disconnect="unregister"/>
  </div>
  <div class="bg-gray-700 text-white p-4 rounded-lg shadow-lg">
    <div class="grid grid-cols-6 gap-0 grid-rows-1">
      <Widget v-for="i in layout.slice(0,4)" :key="i.id" :item="i" :registered="items.has(i.id)"
              :value="items.get(i.id)" class="m-2"/>

      <Widget v-for="i in layout.slice(4,5)" :key="i.id" :item="i" :value="items.get(i.id)"/>
    </div>
    <div>

    </div>
  </div>
</template>

<style scoped>

</style>