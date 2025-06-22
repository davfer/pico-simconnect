<script lang="ts" setup>
import Fmc from "./features/fmc/Fmc.vue";
import FrontBoard from "@shared/adapters/front-board.ts";
import CommandBar from "@src/components/CommandBar.vue";
import {ref} from "vue";

const board = new FrontBoard(window.ipcRenderer);

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

</script>

<template>
  <CommandBar scope="Simulator" :connected="simconnected" :status="simstatus" @connect="simconnect"/>
  <Fmc :board="board"/>
</template>

<style scoped>
</style>
