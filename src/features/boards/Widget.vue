<script lang="ts" setup>
import {BoardItem, SwitchItem} from "@shared/board.types.ts";
import Switch from "@src/components/Switch.vue";
import Button from "@src/components/Button.vue";

const props = defineProps<{
  item: BoardItem,
  value?: any;
  registered?: boolean;
}>();


</script>

<template>
  <Switch v-if="props.item.front?.type === 'switch'"
          :layout="(props.item.front as SwitchItem).values"
          :registered="props.registered"
          :value="props.value"
          @click="$emit('click', item.id)"/>
  <Button v-if="props.item.front?.type === 'button'"
          :registered="props.registered"
          :value="props.value"
          @click="$emit('click', item.id)"
  />
</template>

<style scoped>

</style>