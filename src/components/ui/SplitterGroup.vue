<script setup lang="ts">
import { useMagicKeys, whenever } from '@vueuse/core'
import { ArrowRightToLine } from 'lucide-vue-next'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { shallowRef } from 'vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
const database = useDatabaseStore()
const panelRef = shallowRef()
const layout = shallowRef<number[]>([0, 0])
const keys = useMagicKeys()
const magic_expand_document = keys['ctrl+shift+alt+period']
const resize = shallowRef(0)

whenever(magic_expand_document, (n) => {
  if (n)
    expandAllScreen()
})

function expandAllScreen() {
  if (panelRef.value.getSize() <= 3) {
    panelRef.value.resize(25)
  }
  else {
    panelRef.value.resize(0)
  }
}
</script>

<template>
  <SplitterGroup
    class="SplitterGroup"
    direction="horizontal"
    auto-save-id="splitter"
    :keyboard-resize-by="2"
    @layout="layout = $event"
  >
    <div
      :style="`flex: ${layout[1]} 1 0px; overflow: hidden;`"
      class="hidden lg:flex"
    />
    <SplitterPanel :min-size="40" :default-size="100">
      <slot />
    </SplitterPanel>
    <SplitterResizeHandle
      class="hidden print:hidden! w-11 lg:flex group justify-center items-center relative border-l-2 border-secondary/10 data-[state=hover]:border-primary/90 data-[state=drag]:border-primary/90 data-[state=hover]:delay-700 data-[state=hover]:border-l-2 duration-100 focus:ring-primary focus:ring-1 outline-hidden"
    >
      <Tooltip
        :name="panelRef?.isCollapsed ? 'Collapse' : 'Expand'"
        :side="panelRef?.isCollapsed ? 'left' : 'right'"
        shortcut="ctrl shift alt ."
      >
        <button
          v-show="
            database.loaded_id !== '' || document.content_editable === true
          "
          class="z-40 flex items-center cursor-auto! justify-center bg-background/30 size-8"
          :class="layout[1] >= 3 ? '' : 'rotate-180'"
          @click="expandAllScreen"
          @keyup.enter="
            panelRef?.isCollapsed ? panelRef?.expand() : panelRef?.collapse()
          "
        >
          <ArrowRightToLine class="delay-75 size-4 opacity-90 cursor-auto!" />
          <span class="sr-only">{{
            panelRef?.isCollapsed ? "Collapse" : "Expand"
          }}</span>
        </button>
      </Tooltip>
    </SplitterResizeHandle>
    <SplitterPanel
      ref="panelRef"
      :max-size="40"
      :collapsed-size="0"
      collapsible
      class="hidden lg:flex"
      @resize="resize = $event"
    />
  </SplitterGroup>
</template>

<style>
@reference "@/assets/main.css";

body:has([data-resize-handle-state="drag"]) iframe {
  @apply pointer-events-none duration-300;
}
</style>
