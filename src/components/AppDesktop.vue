<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { shallowRef } from 'vue'
import Document from '@/components/Document.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useDocumentStore } from '@/stores/document'
import { useMagicKeysStore } from '@/stores/magic-keys'

useMagicKeysStore()

const panelRef = shallowRef()

function expandAllScreen() {
  if (panelRef.value?.isCollapsed) {
    panelRef.value?.expand()
  }
  else {
    panelRef.value?.collapse()
  }
}
const document = useDocumentStore()
</script>

<template>
  <div class="flex w-full print:h-auto! print:overflow-y-auto! h-screen overflow-y-hidden">
    <SplitterGroup id="splitter-group-1" direction="horizontal" auto-save-id="app-desktop">
      <SplitterPanel
        v-show="document.show_sidebar_documents"
        id="splitter-group-1-panel-1"
        ref="panelRef"
        :min-size="20"
        :max-size="50"
        collapsible
        :collapsed-size="10"
        class="flex min-w-80 items-center justify-center"
      >
        <div
          :class="[
            document.show_sidebar_documents ? 'w-full relative z-[71]' : '  -translate-x-80 ',
          ]"
        >
          <Sidebar />
        </div>
      </SplitterPanel>
      <SplitterResizeHandle v-show="document.show_sidebar_documents" id="splitter-group-1-resize-handle-1" class="hidden print:hidden! w-1 lg:flex group justify-center items-center relative border-secondary/10 data-[state=hover]:border-primary/90 data-[state=drag]:bg-primary/90 data-[state=hover]:delay-700 data-[state=hover]:bg-primary duration-100 focus:ring-primary focus:ring-1 outline-hidden" @dblclick="expandAllScreen()" />
      <SplitterPanel id="splitter-group-1-panel-2" :min-size="50" >
        <button
          v-if="document.show_sidebar_documents"
          class="fixed inset-0 print:hidden z-[70] bg-background/90 border-0! ring-0! xl:hidden outline-hidden!"
          @click="document.show_sidebar_documents = !document.show_sidebar_documents"
        />
        <Document />
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
