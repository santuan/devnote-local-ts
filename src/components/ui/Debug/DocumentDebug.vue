<script setup lang="ts">
// import { storeToRefs } from 'pinia'
import { useDatabaseStore } from '@/stores/database'

const database = useDatabaseStore()
</script>

<template>
  <div class="grid gap-2">
    <div>{{ database.document_name?.length === 0 ? '---' : database.document_name }}</div>
    <div>id: {{ database.loaded_id }}</div>
    <div>checked: {{ database.document_checked }}</div>
    <div>fixed: {{ database.document_fixed }}</div>
  </div>
</template>
