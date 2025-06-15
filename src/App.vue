<script lang="ts" setup>
import Fmc from "./features/fmc/Fmc.vue";
import FrontBoard from "@shared/adapters/front-board.ts";

const board = new FrontBoard(window.ipcRenderer);

</script>

<template>
  <Fmc :board="board"/>
</template>

<style scoped>
</style>
