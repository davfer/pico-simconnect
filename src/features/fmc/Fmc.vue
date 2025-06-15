<script setup lang="ts">
import Screen from "./Screen.vue";
import Button from "./Button.vue";
import Led from "./Led.vue";
import {Pixel} from "./fmt.types.ts";
import {reactive, ref} from "vue";
import {BoardInterfaceType} from "@shared/board.types.ts";
import {
  EVT_CDU_L_CLR,
  EVT_CDU_L_DEL, EVT_CDU_L_L, EVT_CDU_L_M, EVT_CDU_L_N, EVT_CDU_L_O, EVT_CDU_L_Q, EVT_CDU_L_R, EVT_CDU_L_S,
  EVT_CDU_L_SLASH,
  EVT_CDU_L_SPACE, EVT_CDU_L_T,
  EVT_CDU_L_V, EVT_CDU_L_W, EVT_CDU_L_X, EVT_CDU_L_Y
} from "@shared/definitions/PMDG_NGX_SDK.ts";
import FrontBoard, {BoardItem, BoardItemRef} from "@shared/adapters/front-board.ts";
import CommandBar from "@src/components/CommandBar.vue";

const props = defineProps<{
  board: FrontBoard
}>();

const layout = [
  {id: "CDU_L1", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_L2", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_L3", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_L4", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_L5", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_L6", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R1", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R2", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R3", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R4", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R5", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R6", type: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_INIT", type: {style: "rectangle", value: "INIT"}},
  {id: "CDU_RTE", type: {style: "rectangle", value: "RTE"}},
  {id: "CDU_CLB", type: {style: "rectangle", value: "CLB"}},
  {id: "CDU_CRZ", type: {style: "rectangle", value: "CRZ"}},
  {id: "CDU_DES", type: {style: "rectangle", value: "DES"}},
  {id: "CDU_MENU", type: {style: "rectangle", value: "MENU"}},
  {id: "CDU_LEGS", type: {style: "rectangle", value: "LEGS"}},
  {id: "CDU_DEP ARR", type: {style: "rectangle", value: "DEP ARR"}},
  {id: "CDU_HOLD", type: {style: "rectangle", value: "HOLD"}},
  {id: "CDU_PROG", type: {style: "rectangle", value: "PROG"}},
  {id: "CDU_EXEC", type: {style: "rectangle", value: "EXEC"}},
  {id: "CDU_N1", type: {style: "rectangle", value: "N1"}},
  {id: "CDU_FIX", type: {style: "rectangle", value: "FIX"}},
  {id: "CDU_PREV", type: {style: "rectangle", value: "PREV"}},
  {id: "CDU_NEXT", type: {style: "rectangle", value: "NEXT"}},
  {id: "CDU_1", type: {style: "circle", value: "1"}},
  {id: "CDU_2", type: {style: "circle", value: "2"}},
  {id: "CDU_3", type: {style: "circle", value: "3"}},
  {id: "CDU_4", type: {style: "circle", value: "4"}},
  {id: "CDU_5", type: {style: "circle", value: "5"}},
  {id: "CDU_6", type: {style: "circle", value: "6"}},
  {id: "CDU_7", type: {style: "circle", value: "7"}},
  {id: "CDU_8", type: {style: "circle", value: "8"}},
  {id: "CDU_9", type: {style: "circle", value: "9"}},
  {id: "CDU_.", type: {style: "circle", value: "."}},
  {id: "CDU_0", type: {style: "circle", value: "0"}},
  {id: "CDU_+-", type: {style: "circle", value: "+/-"}},
  {id: "CDU_A", type: {style: "square", value: "A"}},
  {id: "CDU_B", type: {style: "square", value: "B"}},
  {id: "CDU_C", type: {style: "square", value: "C"}},
  {id: "CDU_D", type: {style: "square", value: "D"}},
  {id: "CDU_E", type: {style: "square", value: "E"}},
  {id: "CDU_F", type: {style: "square", value: "F"}},
  {id: "CDU_G", type: {style: "square", value: "G"}},
  {id: "CDU_H", type: {style: "square", value: "H"}},
  {id: "CDU_I", type: {style: "square", value: "I"}},
  {id: "CDU_J", type: {style: "square", value: "J"}},
  {id: "CDU_K", type: {style: "square", value: "K"}},
  {
    id: "CDU_L",
    type: {style: "square", value: "L"},
    iface: {id: 'b_l', type: BoardInterfaceType.BUTTON, offset: 3},
    sim: {offset: EVT_CDU_L_L}
  },
  {
    id: "CDU_M",
    type: {style: "square", value: "M"},
    iface: {id: 'b_m', type: BoardInterfaceType.BUTTON, offset: 2},
    sim: {offset: EVT_CDU_L_M}
  },
  {
    id: "CDU_N",
    type: {style: "square", value: "N"},
    iface: {id: 'b_n', type: BoardInterfaceType.BUTTON, offset: 1},
    sim: {offset: EVT_CDU_L_N}
  },
  {
    id: "CDU_O",
    type: {style: "square", value: "O"},
    iface: {id: 'b_o', type: BoardInterfaceType.BUTTON, offset: 0},
    sim: {offset: EVT_CDU_L_O}
  },
  {id: "CDU_P", type: {style: "square", value: "P"}},
  {
    id: "CDU_Q",
    type: {style: "square", value: "Q"},
    iface: {id: 'b_q', type: BoardInterfaceType.BUTTON, offset: 11},
    sim: {offset: EVT_CDU_L_Q}
  },
  {
    id: "CDU_R",
    type: {style: "square", value: "R"},
    iface: {id: 'b_r', type: BoardInterfaceType.BUTTON, offset: 10},
    sim: {offset: EVT_CDU_L_R}
  },
  {
    id: "CDU_S",
    type: {style: "square", value: "S"},
    iface: {id: 'b_s', type: BoardInterfaceType.BUTTON, offset: 9},
    sim: {offset: EVT_CDU_L_S}
  },
  {
    id: "CDU_T",
    type: {style: "square", value: "T"},
    iface: {id: 'b_t', type: BoardInterfaceType.BUTTON, offset: 8},
    sim: {offset: EVT_CDU_L_T}
  },
  {id: "CDU_U", type: {style: "square", value: "U"}},
  {
    id: "CDU_V",
    type: {style: "square", value: "V"},
    iface: {id: 'b_v', type: BoardInterfaceType.BUTTON, offset: 15},
    sim: {offset: EVT_CDU_L_V}
  },
  {
    id: "CDU_W",
    type: {style: "square", value: "W"},
    iface: {id: 'b_w', type: BoardInterfaceType.BUTTON, offset: 14},
    sim: {offset: EVT_CDU_L_W}
  },
  {
    id: "CDU_X",
    type: {style: "square", value: "X"},
    iface: {id: 'b_x', type: BoardInterfaceType.BUTTON, offset: 13},
    sim: {offset: EVT_CDU_L_X}
  },
  {
    id: "CDU_Y",
    type: {style: "square", value: "Y"},
    iface: {id: 'b_y', type: BoardInterfaceType.BUTTON, offset: 12},
    sim: {offset: EVT_CDU_L_Y}
  },
  {id: "CDU_Z", type: {style: "square", value: "Z"}},
  {
    id: "CDU_SP",
    type: {style: "square", value: "SP"},
    iface: {id: 'b_sp', type: BoardInterfaceType.BUTTON, offset: 4},
    sim: {offset: EVT_CDU_L_SPACE}
  },
  {
    id: "CDU_DEL",
    type: {style: "square", value: "DEL"},
    iface: {id: 'b_del', type: BoardInterfaceType.BUTTON, offset: 5},
    sim: {offset: EVT_CDU_L_DEL}
  },
  {
    id: "CDU_/",
    type: {style: "square", value: "/"},
    iface: {id: 'b_slash', type: BoardInterfaceType.BUTTON, offset: 6},
    sim: {offset: EVT_CDU_L_SLASH}
  },
  {
    id: "CDU_CLR",
    type: {style: "square", value: "CLR"},
    iface: {id: 'b_clr', type: BoardInterfaceType.BUTTON, offset: 7},
    sim: {offset: EVT_CDU_L_CLR}
  },
] as BoardItem[]

const screenGrid = reactive(Array.from({length: 14}, () =>
    Array.from({length: 24}, () => ({char: "A", color: "white"}))
) as Pixel[][]);

const handleClick = (btn: BoardItem) => {
  console.log(`Button clicked: ${btn.name}`);
  props.board.trigger(btn.id, 1);
};

const handleRelease = (btn: BoardItem) => {
  console.log(`Button released: ${btn.name}`);
  props.board.trigger(btn.id, 0);
};

const items = reactive(new Map<string, number>());
const register = () => {
  console.log("Registering");
  status.value = "Connecting...";

  try {
    props.board.registerBoard('fmc', 0xCafe, 0x4004, layout);
  } catch (e) {
    console.error("Failed to register board:", e);
    status.value = `Fail: ${e}`;
    return;
  }

  layout.forEach((item) => {
    items.set(item.id, 0)
    props.board.onUpdate(item.id, (value: BoardItemRef) => {
      items.set(item.id, value.value)
    });
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

import {onUnmounted} from "vue";
onUnmounted(() => {
  console.log("Unregistering on unmount");
  unregister();
});

const connected = ref(false);
const status = ref("Standby -- press Connect");

</script>

<template>
  <div>
    <CommandBar @connect="register" :connected="connected" :status="status"/>
  </div>
  <div class="bg-gray-700 text-white p-4 rounded-lg shadow-lg">
    <div class="grid grid-cols-[64px_auto_64px] gap-0 grid-rows-1">
      <div class="mt-6">
        <Button class="mb-3" v-for="i in layout.slice(0,6)" :key="i.name" type="rectangle-sm" value="-"
                @click="handleClick(i) && handleRelease(i)" :clicked="items.get(i.id) === 1"
                :registered="items.has(i.id)"/>
      </div>
      <div>
        <Screen :grid="screenGrid"/>
      </div>
      <div class="text-right mt-6">
        <Button class="mb-3" v-for="i in layout.slice(6,12)" :key="i.name" type="rectangle-sm" value="-"
                @click="handleClick(i) && handleRelease(i)" :clicked="items.get(i.id) === 1"
                :registered="items.has(i.id)"/>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-[32px_auto_32px] gap-6">
      <div class="flex flex-col justify-center">
        <Led type="vrectangle"/>
        <Led type="vrectangle"/>
      </div>
      <div class="grid grid-cols-8 gap-6">
        <div class="col-span-full grid grid-cols-6 gap-5">
          <Button v-for="i in layout.slice(12, 17)" :key="i.name" :type="i.type?.style" :value="i.type?.value"
                  @click="handleClick(i) && handleRelease(i)" :clicked="items.get(i.id) === 1"
                  :registered="items.has(i.id)"/>
        </div>
        <div class="col-span-full grid grid-cols-6 gap-5">
          <Button v-for="i in layout.slice(17, 23)" :key="i.name" :type="i.type?.style" :value="i.type?.value"
                  @click="handleClick(i) && handleRelease(i)" :clicked="items.get(i.id) === 1"
                  :registered="items.has(i.id)"/>
        </div>
        <div class="col-span-3">
          <div class="grid grid-cols-2 gap-5">
            <Button v-for="i in layout.slice(23, 27)" :key="i.name" :type="i.type?.style" :value="i.type?.value"
                    @click="handleClick(i) && handleRelease(i)" :clicked="items.get(i.id) === 1"
                    :registered="items.has(i.id)"/>
          </div>
          <div class="grid grid-cols-3 gap-2 mt-4">
            <Button v-for="i in layout.slice(27, 39)" :key="i.name" :type="i.type?.style" :value="i.type?.value"
                    @click="handleClick(i) && handleRelease(i)" :clicked="items.get(i.id) === 1"
                    :registered="items.has(i.id)"/>
          </div>
        </div>
        <div class="col-span-5">
          <div class="grid grid-cols-5 gap-3 mt-2">
            <Button v-for="i in layout.slice(39, 69)" :key="i.name" :type="i.type?.style" :value="i.type?.value"
                    @click="handleClick(i) && handleRelease(i)" :clicked="items.get(i.id) === 1"
                    :registered="items.has(i.id)"/>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-center">
        <Led type="vrectangle"/>
        <Led type="vrectangle"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
