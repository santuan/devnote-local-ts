<script setup lang="ts">
import DocumentEditor from '@/components/DocumentEditor.vue'
import DeleteDocument from '@/components/ui/Button/ButtonDeleteDocument.vue'
import AlertUnsavedChanges from '@/components/ui/Dialogs/AlertUnsavedChanges.vue'
import SplashScreen from '@/components/ui/SplashScreen.vue'
import SplitterGroup from '@/components/ui/SplitterGroup.vue'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
const database = useDatabaseStore()
</script>

<template>
  <div class="Document">
    <SplitterGroup>
      <DocumentEditor />
    </SplitterGroup>
    <DeleteDocument />
    <AlertUnsavedChanges />
  </div>
  <SplashScreen
    v-if="database.loaded_id === '' && document.content_editable === false"
  />
</template>

<style scoped>
@reference "@/assets/main.css";

.Document {
  @apply w-full min-h-screen bg-background motion-safe:duration-1000 z-10;
}
</style>
