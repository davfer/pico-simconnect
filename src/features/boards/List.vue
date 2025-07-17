<script lang="ts" setup>
import FrontBoard from "@shared/adapters/front-board.ts";
import {Board, BoardItem} from "@shared/board.types.ts";
import {onMounted, reactive} from "vue";

const props = defineProps<{
  boardService: FrontBoard
  board: Board
}>()

interface ListItem {
  item: BoardItem
  value: any
}

onMounted(() => {
  props.boardService.onChange(props.board.id, (itemId, value) => {
    const item = tableItems.find(i => i.item.id === itemId);
    if (!item) {
      console.warn(`Item with id ${itemId} not found in board ${props.board.id}`);
      return;
    }

    item.value = value
  })
  for (const item of props.board.items) {
    tableItems.push({
      item,
      value: null
    });
  }
});

const tableItems = reactive<ListItem[]>([])


</script>

<template>
  <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
    <table class="table">
      <!-- head -->
      <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Value</th>
        <th>Simulator</th>
        <th>Interface</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in tableItems" :key="index">
        <th><input class="checkbox-md" type="checkbox"/></th>
        <td>{{ item.item.id }}</td>
        <td>{{ item.value }}</td>
        <td>--</td>
        <td>--</td>
        <td>
          <button class="btn btn-sm">...</button>
        </td>
      </tr>

      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>