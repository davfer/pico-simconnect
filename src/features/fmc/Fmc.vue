<script lang="ts" setup>
import Screen from "./Screen.vue";
import Button from "./Button.vue";
import Led from "./Led.vue";
import {Pixel} from "./fmc.types.ts";
import {onUnmounted, reactive, ref} from "vue";
import {BoardInterfaceType, BoardItem} from "@shared/board.types.ts";
import {
  EVT_CDU_L_CLR,
  EVT_CDU_L_DEL,
  EVT_CDU_L_L,
  EVT_CDU_L_M,
  EVT_CDU_L_N,
  EVT_CDU_L_O,
  EVT_CDU_L_Q,
  EVT_CDU_L_R,
  EVT_CDU_L_S,
  EVT_CDU_L_SLASH,
  EVT_CDU_L_SPACE,
  EVT_CDU_L_T,
  EVT_CDU_L_V,
  EVT_CDU_L_W,
  EVT_CDU_L_X,
  EVT_CDU_L_Y
} from "@shared/definitions/PMDG_NGX_SDK.ts";
import FrontBoard from "@shared/adapters/front-board.ts";
import CommandBar from "@src/components/CommandBar.vue";
import {CduDescriptor, Descriptor, EventCallback, OnSimReadEventCallback} from "@shared/sim.types.ts";
import {PMDG_NG3_CDU_0_DEFINITION, PMDG_NG3_CDU_0_ID, PMDG_NG3_CDU_0_NAME} from "@shared/definitions/PMDG_NG3_SDK.ts";
import {registerCallback} from "@shared/callback-registry.ts";

const props = defineProps<{
  board: FrontBoard
}>();

const layout = [
  {id: "CDU_L1", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_L2", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_L3", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_L4", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_L5", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_L6", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R1", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R2", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R3", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R4", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R5", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_R6", front: {style: "rectangle-sm", value: "-"}},
  {id: "CDU_INIT", front: {style: "rectangle", value: "INIT"}},
  {id: "CDU_RTE", front: {style: "rectangle", value: "RTE"}},
  {id: "CDU_CLB", front: {style: "rectangle", value: "CLB"}},
  {id: "CDU_CRZ", front: {style: "rectangle", value: "CRZ"}},
  {id: "CDU_DES", front: {style: "rectangle", value: "DES"}},
  {id: "CDU_MENU", front: {style: "rectangle", value: "MENU"}},
  {id: "CDU_LEGS", front: {style: "rectangle", value: "LEGS"}},
  {id: "CDU_DEP ARR", front: {style: "rectangle", value: "DEP ARR"}},
  {id: "CDU_HOLD", front: {style: "rectangle", value: "HOLD"}},
  {id: "CDU_PROG", front: {style: "rectangle", value: "PROG"}},
  {id: "CDU_EXEC", front: {style: "rectangle", value: "EXEC"}},
  {id: "CDU_N1", front: {style: "rectangle", value: "N1"}},
  {id: "CDU_FIX", front: {style: "rectangle", value: "FIX"}},
  {id: "CDU_PREV", front: {style: "rectangle", value: "PREV"}},
  {id: "CDU_NEXT", front: {style: "rectangle", value: "NEXT"}},
  {id: "CDU_1", front: {style: "circle", value: "1"}},
  {id: "CDU_2", front: {style: "circle", value: "2"}},
  {id: "CDU_3", front: {style: "circle", value: "3"}},
  {id: "CDU_4", front: {style: "circle", value: "4"}},
  {id: "CDU_5", front: {style: "circle", value: "5"}},
  {id: "CDU_6", front: {style: "circle", value: "6"}},
  {id: "CDU_7", front: {style: "circle", value: "7"}},
  {id: "CDU_8", front: {style: "circle", value: "8"}},
  {id: "CDU_9", front: {style: "circle", value: "9"}},
  {id: "CDU_.", front: {style: "circle", value: "."}},
  {id: "CDU_0", front: {style: "circle", value: "0"}},
  {id: "CDU_+-", front: {style: "circle", value: "+/-"}},
  {id: "CDU_A", front: {style: "square", value: "A"}},
  {id: "CDU_B", front: {style: "square", value: "B"}},
  {id: "CDU_C", front: {style: "square", value: "C"}},
  {id: "CDU_D", front: {style: "square", value: "D"}},
  {id: "CDU_E", front: {style: "square", value: "E"}},
  {id: "CDU_F", front: {style: "square", value: "F"}},
  {id: "CDU_G", front: {style: "square", value: "G"}},
  {id: "CDU_H", front: {style: "square", value: "H"}},
  {id: "CDU_I", front: {style: "square", value: "I"}},
  {id: "CDU_J", front: {style: "square", value: "J"}},
  {id: "CDU_K", front: {style: "square", value: "K"}},
  {
    id: "CDU_L",
    front: {style: "square", value: "L"},
    iface: {id: 'b_l', type: BoardInterfaceType.BUTTON, offset: 3},
    sim: {offset: EVT_CDU_L_L, type: "write"}
  },
  {
    id: "CDU_M",
    front: {style: "square", value: "M"},
    iface: {id: 'b_m', type: BoardInterfaceType.BUTTON, offset: 2},
    sim: {offset: EVT_CDU_L_M, type: "write"}
  },
  {
    id: "CDU_N",
    front: {style: "square", value: "N"},
    iface: {id: 'b_n', type: BoardInterfaceType.BUTTON, offset: 1},
    sim: {offset: EVT_CDU_L_N, type: "write"}
  },
  {
    id: "CDU_O",
    front: {style: "square", value: "O"},
    iface: {id: 'b_o', type: BoardInterfaceType.BUTTON, offset: 0},
    sim: {offset: EVT_CDU_L_O, type: "write"}
  },
  {id: "CDU_P", front: {style: "square", value: "P"}},
  {
    id: "CDU_Q",
    front: {style: "square", value: "Q"},
    iface: {id: 'b_q', type: BoardInterfaceType.BUTTON, offset: 11},
    sim: {offset: EVT_CDU_L_Q, type: "write"}
  },
  {
    id: "CDU_R",
    front: {style: "square", value: "R"},
    iface: {id: 'b_r', type: BoardInterfaceType.BUTTON, offset: 10},
    sim: {offset: EVT_CDU_L_R, type: "write"}
  },
  {
    id: "CDU_S",
    front: {style: "square", value: "S"},
    iface: {id: 'b_s', type: BoardInterfaceType.BUTTON, offset: 9},
    sim: {offset: EVT_CDU_L_S, type: "write"}
  },
  {
    id: "CDU_T",
    front: {style: "square", value: "T"},
    iface: {id: 'b_t', type: BoardInterfaceType.BUTTON, offset: 8},
    sim: {offset: EVT_CDU_L_T, type: "write"}
  },
  {id: "CDU_U", front: {style: "square", value: "U"}},
  {
    id: "CDU_V",
    front: {style: "square", value: "V"},
    iface: {id: 'b_v', type: BoardInterfaceType.BUTTON, offset: 15},
    sim: {offset: EVT_CDU_L_V, type: "write"}
  },
  {
    id: "CDU_W",
    front: {style: "square", value: "W"},
    iface: {id: 'b_w', type: BoardInterfaceType.BUTTON, offset: 14},
    sim: {offset: EVT_CDU_L_W, type: "write"}
  },
  {
    id: "CDU_X",
    front: {style: "square", value: "X"},
    iface: {id: 'b_x', type: BoardInterfaceType.BUTTON, offset: 13},
    sim: {offset: EVT_CDU_L_X, type: "write"}
  },
  {
    id: "CDU_Y",
    front: {style: "square", value: "Y"},
    iface: {id: 'b_y', type: BoardInterfaceType.BUTTON, offset: 12},
    sim: {offset: EVT_CDU_L_Y, type: "write"}
  },
  {id: "CDU_Z", front: {style: "square", value: "Z"}},
  {
    id: "CDU_SP",
    front: {style: "square", value: "SP"},
    iface: {id: 'b_sp', type: BoardInterfaceType.BUTTON, offset: 4},
    sim: {offset: EVT_CDU_L_SPACE, type: "write"}
  },
  {
    id: "CDU_DEL",
    front: {style: "square", value: "DEL"},
    iface: {id: 'b_del', type: BoardInterfaceType.BUTTON, offset: 5},
    sim: {offset: EVT_CDU_L_DEL, type: "write"}
  },
  {
    id: "CDU_/",
    front: {style: "square", value: "/"},
    iface: {id: 'b_slash', type: BoardInterfaceType.BUTTON, offset: 6},
    sim: {offset: EVT_CDU_L_SLASH, type: "write"}
  },
  {
    id: "CDU_CLR",
    front: {style: "square", value: "CLR"},
    iface: {id: 'b_clr', type: BoardInterfaceType.BUTTON, offset: 7},
    sim: {offset: EVT_CDU_L_CLR, type: "write"}
  },
  {
    id: "CDU_SCREEN",
    onSimReadFnName: "CDU_SCREEN_READ",
    front: {},
    iface: {},
    sim: {
      id: "PMDG_NG3_CDU_0",
      type: "cdu",
      size: (() => {
        const CDU_COLUMNS = 24;
        const CDU_ROWS = 14;
        return CDU_COLUMNS * CDU_ROWS * (1 + 1 + 1) + 1;
      })(),
      dataName: PMDG_NG3_CDU_0_NAME,
      dataId: PMDG_NG3_CDU_0_ID,
      dataDefinition: PMDG_NG3_CDU_0_DEFINITION,
    } as CduDescriptor
  }
] as BoardItem[]

function CduScreenReadFn(descriptor: Descriptor, value: any) {
  console.log(descriptor, value)
}
registerCallback<OnSimReadEventCallback>("CDU_SCREEN_READ", CduScreenReadFn);


const screenGrid = reactive(Array.from({length: 14}, () =>
    Array.from({length: 24}, () => ({char: "A", color: "white"}))
) as Pixel[][]);

const handleClick = (btn: BoardItem) => {
  console.log(`Button clicked: ${btn.id}`);
  props.board.triggerItem('fmc', btn.id, 1);
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
    props.board.onChange(item.id, (_: string, value: number) => {
      items.set(item.id, value)
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

onUnmounted(() => {
  console.log("Unregistering on unmount");
  unregister();
});

const connected = ref(false);
const status = ref("Standby -- press Connect");

</script>

<template>
  <div>
    <CommandBar :connected="connected" :status="status" @connect="register"/>
  </div>
  <div class="bg-gray-700 text-white p-4 rounded-lg shadow-lg">
    <div class="grid grid-cols-[64px_auto_64px] gap-0 grid-rows-1">
      <div class="mt-6">
        <Button v-for="i in layout.slice(0,6)" :key="i.id" :clicked="items.get(i.id) === 1" :registered="items.has(i.id)" class="mb-3"
                type="rectangle-sm" value="-"
                @click="handleClick(i)"/>
      </div>
      <div>
        <Screen :grid="screenGrid"/>
      </div>
      <div class="text-right mt-6">
        <Button v-for="i in layout.slice(6,12)" :key="i.id" :clicked="items.get(i.id) === 1" :registered="items.has(i.id)" class="mb-3"
                type="rectangle-sm" value="-"
                @click="handleClick(i)"/>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-[32px_auto_32px] gap-6">
      <div class="flex flex-col justify-center">
        <Led type="vrectangle"/>
        <Led type="vrectangle"/>
      </div>
      <div class="grid grid-cols-8 gap-6">
        <div class="col-span-full grid grid-cols-6 gap-5">
          <Button v-for="i in layout.slice(12, 17)" :key="i.id" :clicked="items.get(i.id) === 1" :registered="items.has(i.id)"
                  :type="i.front?.style" :value="i.front?.value"
                  @click="handleClick(i)"/>
        </div>
        <div class="col-span-full grid grid-cols-6 gap-5">
          <Button v-for="i in layout.slice(17, 23)" :key="i.id" :clicked="items.get(i.id) === 1" :registered="items.has(i.id)"
                  :type="i.front?.style" :value="i.front?.value"
                  @click="handleClick(i)"/>
        </div>
        <div class="col-span-3">
          <div class="grid grid-cols-2 gap-5">
            <Button v-for="i in layout.slice(23, 27)" :key="i.id" :clicked="items.get(i.id) === 1" :registered="items.has(i.id)"
                    :type="i.front?.style" :value="i.front?.value"
                    @click="handleClick(i)"/>
          </div>
          <div class="grid grid-cols-3 gap-2 mt-4">
            <Button v-for="i in layout.slice(27, 39)" :key="i.id" :clicked="items.get(i.id) === 1" :registered="items.has(i.id)"
                    :type="i.front?.style" :value="i.front?.value"
                    @click="handleClick(i)"/>
          </div>
        </div>
        <div class="col-span-5">
          <div class="grid grid-cols-5 gap-3 mt-2">
            <Button v-for="i in layout.slice(39, 69)" :key="i.id" :clicked="items.get(i.id) === 1" :registered="items.has(i.id)"
                    :type="i.front?.style" :value="i.front?.value"
                    @click="handleClick(i)"/>
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
