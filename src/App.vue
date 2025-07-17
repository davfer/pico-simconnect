<script lang="ts" setup>
import Fmc from "./features/fmc/Fmc.vue";
import FrontBoard from "@shared/adapters/front-board.ts";
import CommandBar from "@src/components/CommandBar.vue";
import {reactive, ref} from "vue";
import List from "@src/features/boards/List.vue";
import {Board} from "@shared/board.types.ts";
import Multipanel from "@src/features/multipanel/Multipanel.vue";

const board = new FrontBoard(window.ipcRenderer);
const boards = reactive<Board[]>([])

board.onRegisterBoard((board) => {
  console.log("Board registered:", board.id)
  boards.push(board)
})
board.onUnregisterBoard((board) => {
  console.log("Board unregistered:", board.id)
  const index = boards.findIndex(b => b.id === board.id)
  if (index !== -1) {
    boards.splice(index, 1)
  }
})

const simconnected = ref(false);
const simstatus = ref("Disconnected");
const simconnect = () => {
  if (simconnected.value) {
    board.disconnectFromSimulator();
    simconnected.value = false;
    simstatus.value = "Disconnected";
  } else {
    board.connectToSimulator().then(() => {
      simconnected.value = true;
      simstatus.value = "Connected";
    }).catch((error) => {
      console.error("Connection failed:", error);
      simstatus.value = "Connection Failed: " + error;
    });
  }
};

const disconnect = () => {
  board.disconnectFromSimulator();
  simconnected.value = false;
  simstatus.value = "Disconnected";
};

</script>

<template>
  <div>
    <CommandBar :connected="simconnected" :status="simstatus" scope="Simulator" @connect="simconnect"
                @disconnect="disconnect"/>
  </div>
  <div>
    <div class="tabs tabs-lift">
      <template v-for="(b, index) in boards" :key="index">
        <input :aria-label="b.id" class="tab" name="my_tabs_3" type="radio"/>
        <div class="tab-content bg-base-100 border-base-300 p-6">
          <List :board="b" :board-service="board"/>
        </div>
      </template>
      <input aria-label="FMC Front" class="tab" name="my_tabs_3" type="radio"/>
      <div class="tab-content bg-base-100 border-base-300 p-6">
        <Fmc :board="board"/>
      </div>

      <input aria-label="MP Front" class="tab" name="my_tabs_3" type="radio"/>
      <div class="tab-content bg-base-100 border-base-300 p-6">
        <Multipanel :board="board"/>
      </div>
      <!--      <input type="radio" name="my_tabs_3" class="tab" aria-label="Tab 2" checked="checked" />-->
      <!--      <div class="tab-content bg-base-100 border-base-300 p-6">Tab content 2</div>-->

      <!--      <input type="radio" name="my_tabs_3" class="tab" aria-label="Tab 3" />-->
      <!--      <div class="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>-->
    </div>
  </div>
  <!--  <Fmc :board="board"/>-->


</template>

<style scoped>
</style>
