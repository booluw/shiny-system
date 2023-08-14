<script lang="ts" setup>
import { useSiteStore } from "@/store/site.ts";
import { computed } from "vue";

const site = useSiteStore();

const loading = computed(() => {
  return site.loading;
})
</script>
<template>
  <loading-modal v-if="loading" />
  <router-view />
</template>
