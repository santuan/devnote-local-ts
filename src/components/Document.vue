<script setup lang='ts'>
import DocumentEditor from '@/components/DocumentEditor.vue'
import AlertUnsavedChanges from '@/components/ui/AlertUnsavedChanges.vue'
import DeleteDocument from '@/components/ui/ButtonDeleteDocument.vue'
import SplashScreen from '@/components/ui/SplashScreen.vue'
import SplitterGroup from '@/components/ui/SplitterGroup.vue'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
const database = useDatabaseStore()
</script>

<template>
  <div
    class="Document w-full min-h-screen bg-background motion-safe:duration-1000 print:pl-0"
    :class="document.show_sidebar_documents ? 'xl:pl-80!' : 'md:pl-8!'"
  >
    <SplitterGroup>
      <DocumentEditor />
    </SplitterGroup>
    <DeleteDocument />
    <AlertUnsavedChanges />
  </div>
  <SplashScreen v-if="database.loaded_id === '' && document.content_editable === false" />
</template>
