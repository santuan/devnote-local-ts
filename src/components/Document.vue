<script setup lang='ts'>
import DocumentEditor from '@/components/DocumentEditor.vue'
import SplashScreen from '@/components/SplashScreen.vue'
import DeleteDocument from '@/components/ui/ButtonDeleteDocument.vue'
import AlertUnsavedChanges from '@/components/ui/Dialogs/AlertUnsavedChanges.vue'
import SplitterGroup from '@/components/ui/SplitterGroup.vue'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
const database = useDatabaseStore()
</script>

<template>
  <div
    class="Document w-full min-h-screen bg-background motion-safe:duration-1000 z-10"
  >
    <SplitterGroup>
      <DocumentEditor />
    </SplitterGroup>
    <DeleteDocument />
    <AlertUnsavedChanges />
  </div>
  <SplashScreen v-if="database.loaded_id === '' && document.content_editable === false" />
</template>
