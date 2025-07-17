<script lang="ts" setup>
import Screen from "@src/components/Screen.vue";
import Button from "@src/components/Button.vue";
import Led from "@src/components/Led.vue";
import {CduCell, CduCellColor} from "./fmc.types.ts";
import {computed, onUnmounted, reactive, ref} from "vue";
import {BoardItem} from "@shared/board.types.ts";
import FrontBoard from "@shared/adapters/front-board.ts";
import CommandBar from "@src/components/CommandBar.vue";
import {MOUSE_FLAG_LEFTSINGLE} from "@shared/definitions/PMDG_NG3_SDK.ts";
import {FMC_LAYOUT} from "@src/features/fmc/fmc.layout.ts";

const props = defineProps<{
  board: FrontBoard
}>();


const boardid = 'fmc';
const layout = FMC_LAYOUT

const screenGrid = computed<CduCell[][]>(() => {
  const columns = 24;
  const rows = 14;
  const lines = items.get("CDU_SCREEN_CONTENT") as CduCell[][] | number | undefined;
  if (!lines || !Array.isArray(lines)) {
    const initCell: CduCell = {
      symbol: ".",
      color: CduCellColor.WHITE,
      symbolNum: " ".charCodeAt(0),
      flags: 0
    };
    return Array.from({length: rows}, () => Array.from({length: columns}, () => initCell)) as CduCell[][];
  }

  const emptyCell: CduCell = {
    symbol: " ",
    color: CduCellColor.WHITE,
    symbolNum: " ".charCodeAt(0),
    flags: 0
  };
  let grid = Array.from({length: rows}, () => Array.from({length: columns}, () => emptyCell)) as CduCell[][];
  for (let row = 0; row < rows; row++) {
    const line = lines[row] || [];
    for (let i = 0; i < line.length; i++) {
      let cell = line[i];
      let char = cell.symbol || "";
      if (i >= columns) break; // Prevent overflow
      if (!char) cell.symbol = "?"; // Skip empty characters

      grid[row][i] = cell;
    }
  }

  return grid;
})

const handleClick = (btn: BoardItem) => {
  console.log(`Button clicked: ${btn.id}`);
  props.board.triggerItem(boardid, btn.id, MOUSE_FLAG_LEFTSINGLE);
};

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
    if (["PMDG_NG3_Data", "CDU_SCREEN", "CDU_SCREEN_CONTENT"].indexOf(item.id) >= 0) {
      console.log(`Skipping item ${item.id} as it is not a button or LED`);
      return;
    }
    items.set(item.id, 0)
  });

  props.board.onChange(boardid, (itemId: string, value: any) => {
    if (["PMDG_NG3_Data", "CDU_SCREEN", "CDU_SCREEN_CONTENT"].indexOf(itemId) < 0 && value.hasOwnProperty("length")) {
      items.set(itemId, value[0] ? 1 : 0)
      return
    }
    items.set(itemId, value)
  });

  connected.value = true;
  status.value = `Connected (0xCafe, 0x0001)`;
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
    <CommandBar :connected="connected" :status="status" scope="FMC Board" @connect="register" @disconnect="unregister"/>
  </div>
  <div class="bg-gray-700 text-white p-4 rounded-lg shadow-lg">
    <div class="grid grid-cols-[64px_auto_64px] gap-0 grid-rows-1">
      <div class="mt-6">
        <Button v-for="i in layout.slice(0,6)" :key="i.id" :clicked="items.get(i.id) === 1"
                :registered="items.has(i.id)" class="mb-3"
                type="rectangle-sm" value="-"
                @click="handleClick(i)"/>
      </div>
      <div>
        <Screen :grid="screenGrid"/>
      </div>
      <div class="text-right mt-6">
        <Button v-for="i in layout.slice(6,12)" :key="i.id" :clicked="items.get(i.id) === 1"
                :registered="items.has(i.id)" class="mb-3"
                type="rectangle-sm" value="-"
                @click="handleClick(i)"/>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-[32px_auto_32px] gap-6">
      <div class="flex flex-col justify-center">
        <Led :value="items.get(layout[70].id) === 1" color="white" text="CALL" type="vrectangle"/>
        <Led :value="items.get(layout[71].id) === 1" color="red" text="FAIL" type="vrectangle"/>
      </div>
      <div class="grid grid-cols-8 gap-6">
        <div class="col-span-full grid grid-cols-6 gap-5">
          <Button v-for="i in layout.slice(12, 17)" :key="i.id" :clicked="items.get(i.id) === 1"
                  :registered="items.has(i.id)"
                  :type="i.front?.style" :value="i.front?.value"
                  @click="handleClick(i)"/>
          <Led :color="'green'" :type="'rectangle-sm'" :value="items.get(layout[69].id) === 1"
               style="margin-top: 15px;margin-left: 15px"/>
        </div>
        <div class="col-span-full grid grid-cols-6 gap-5">
          <Button v-for="i in layout.slice(17, 23)" :key="i.id" :clicked="items.get(i.id) === 1"
                  :registered="items.has(i.id)"
                  :type="i.front?.style" :value="i.front?.value"
                  @click="handleClick(i)"/>
        </div>
        <div class="col-span-3">
          <div class="grid grid-cols-2 gap-5">
            <Button v-for="i in layout.slice(23, 27)" :key="i.id" :clicked="items.get(i.id) === 1"
                    :registered="items.has(i.id)"
                    :type="i.front?.style" :value="i.front?.value"
                    @click="handleClick(i)"/>
          </div>
          <div class="grid grid-cols-3 gap-2 mt-4">
            <Button v-for="i in layout.slice(27, 39)" :key="i.id" :clicked="items.get(i.id) === 1"
                    :registered="items.has(i.id)"
                    :type="i.front?.style" :value="i.front?.value"
                    @click="handleClick(i)"/>
          </div>
        </div>
        <div class="col-span-5">
          <div class="grid grid-cols-5 gap-3 mt-2">
            <Button v-for="i in layout.slice(39, 69)" :key="i.id" :clicked="items.get(i.id) === 1"
                    :registered="items.has(i.id)"
                    :type="i.front?.style" :value="i.front?.value"
                    @click="handleClick(i)"/>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-center">
        <Led :value="items.get(layout[72].id) === 1" color="yellow" text="MSG" type="vrectangle"/>
        <Led :value="items.get(layout[73].id) === 1" color="yellow" text="OFST" type="vrectangle"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
