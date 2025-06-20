<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui'
import DebugDocument from '@/components/ui/Debug/DebugDocument.vue'
import DebugSettings from '@/components/ui/Debug/DebugSettings.vue'
import { useDocumentStore } from '@/stores/document'
import { useMagicKeysStore } from '@/stores/magic-keys'

useMagicKeysStore()

const document = useDocumentStore()
const { sidebar_splitter_ref } = storeToRefs(document)
</script>

<template>
  <TabsRoot default-value="tab2">
    <TabsList
      class="sticky top-0 z-10 bg-background shrink-0 mb-2 flex border-b outline-none! border-0!  border-secondary"
      aria-label="Manage your account"
    >
      <TabsTrigger
        class="py-3 flex-1 flex focus-visible:border focus-visible:border-foreground focus-visible:border-dashed items-center justify-center text-xs border-b border-secondary leading-none text-foreground select-none hover:text-primary data-[state=active]:text-primary data-[state=active]:border-b-primary duration-300 outline-none"
        value="tab1"
      >
        Settings
      </TabsTrigger>
      <TabsTrigger
        class="py-3 flex-1 flex focus-visible:border focus-visible:border-foreground focus-visible:border-dashed items-center justify-center text-xs border-b border-secondary leading-none text-foreground select-none hover:text-primary data-[state=active]:text-primary data-[state=active]:border-b-primary duration-300 outline-none"
        value="tab2"
      >
        Document
      </TabsTrigger>
    </TabsList>
    <TabsContent class="px-2 pt-0.5" value="tab1">
      <DebugSettings :panel-ref="sidebar_splitter_ref" />
    </TabsContent>
    <TabsContent class="px-2 pt-0.5" value="tab2">
      <DebugDocument />
    </TabsContent>
  </TabsRoot>
</template>
