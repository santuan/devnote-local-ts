<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui'
import Debug from '@/components/ui/Debug/Debug.vue'
import DocumentDebug from '@/components/ui/Debug/DocumentDebug.vue'
import { useDocumentStore } from '@/stores/document'
import { useMagicKeysStore } from '@/stores/magic-keys'

useMagicKeysStore()
const document = useDocumentStore()
const { sidebar_splitter_ref } = storeToRefs(document)
</script>

<template>
  <TabsRoot default-value="tab1">
    <TabsList
      class="sticky top-0 z-10 bg-background shrink-0 mb-2 flex border-b border-secondary"
      aria-label="Manage your account"
    >
      <TabsTrigger
        class="py-3 flex-1 flex items-center justify-center text-xs border-b border-secondary leading-none text-foreground select-none hover:text-primary data-[state=active]:text-primary data-[state=active]:border-b-primary duration-300 outline-none"
        value="tab1"
      >
        Document
      </TabsTrigger>
      <TabsTrigger
        class="py-3 flex-1 flex items-center justify-center text-xs border-b border-secondary leading-none text-foreground select-none hover:text-primary data-[state=active]:text-primary data-[state=active]:border-b-primary duration-300 outline-none"
        value="tab2"
      >
        Settings
      </TabsTrigger>
    </TabsList>
    <TabsContent class="px-2 pt-0.5" value="tab1">
      <DocumentDebug />
    </TabsContent>
    <TabsContent class="px-2 pt-0.5" value="tab2">
      <Debug :panel-ref="sidebar_splitter_ref" />
    </TabsContent>
  </TabsRoot>
</template>
