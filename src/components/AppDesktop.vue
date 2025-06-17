<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import {
  SplitterGroup,
  SplitterPanel,
  SplitterResizeHandle,

} from 'reka-ui'
import { computed, shallowRef, watch } from 'vue'
import Document from '@/components/Document.vue'
import Sidebar from '@/components/Sidebar.vue'
import SidebarDesktopIcons from '@/components/SidebarDesktopIcons.vue'
import ToggleSidebarLogo from '@/components/ToggleSidebarLogo.vue'
import Leva from '@/components/ui/Debug/Leva.vue'
import LevaTabs from '@/components/ui/Debug/LevaTabs.vue'
import { useDocumentStore } from '@/stores/document'
import { useMagicKeysStore } from '@/stores/magic-keys'
import { useSettingsStore } from '@/stores/settings'

useMagicKeysStore()
const settings = useSettingsStore()
const document = useDocumentStore()
const { sidebar_splitter_ref } = storeToRefs(document)

const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')
const layout = shallowRef<number[]>([0, 0])
const resize = shallowRef(0)

const resizeTo = computed(() => {
  if (largerThanLg.value === true) {
    return 30
  }
  else {
    return 50
  }
})

watch(
  () => document.show_sidebar_documents,
  (showSidebar) => {
    if (!showSidebar) {
      sidebar_splitter_ref.value?.collapse()
    }
    else {
      if (sidebar_splitter_ref.value.isCollapsed) {
        sidebar_splitter_ref.value.resize(resizeTo.value)
      }
    }
  },
)

watch(
  () => resize.value,
  (resize) => {
    if (!resize)
      return
    if (resize >= 10) {
      document.show_sidebar_documents = true
      return true
    }
    if (resize <= 9) {
      document.show_sidebar_documents = false
      return true
    }
    return false
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="flex w-full print:h-auto! print:overflow-y-auto! h-screen overflow-y-hidden"
  >
    <ToggleSidebarLogo v-if="sidebar_splitter_ref?.isCollapsed" />
    <SidebarDesktopIcons
      v-if="settings.desktop_show_icons_sidebar_collapse"
      :is-collapsed="sidebar_splitter_ref?.isCollapsed"
    />
    <SplitterGroup
      id="splitter-group-1"
      direction="horizontal"
      auto-save-id="app-desktop"
      @layout="layout = $event"
    >
      <SplitterPanel
        id="splitter-group-1-panel-1"
        ref="sidebar_splitter_ref"
        :min-size="10"
        :max-size="50"
        collapsible
        :collapsed-size="5"
        class="min-w-10 items-center justify-center"
        :class="[
          document.show_sidebar_documents
            ? 'fixed md:relative min-w-80 md:min-w-auto flex z-[71]'
            : 'hidden lg:flex',
          sidebar_splitter_ref?.isCollapsed ? 'max-w-10!' : '',
        ]"
        @resize="resize = $event"
      >
        <div
          v-show="!sidebar_splitter_ref?.isCollapsed"
          class="w-full"
          :class="[document.show_sidebar_documents ? 'relative z-[71]' : '']"
        >
          <Sidebar class="min-w-80" />
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-1"
        class="hidden print:hidden! w-0.5 lg:flex group justify-center items-center bg-secondary relative border-secondary/10 data-[state=hover]:border-primary/90 data-[state=drag]:bg-primary/90 data-[state=hover]:delay-700 data-[state=hover]:bg-primary duration-100 focus:ring-primary focus:ring-1 outline-hidden"
      />
      <SplitterPanel id="splitter-group-1-panel-2" :min-size="50">
        <button
          v-if="document.show_sidebar_documents"
          class="fixed inset-0 print:hidden z-[70] bg-background/90 border-0! ring-0! md:hidden outline-hidden!"
          @click="
            document.show_sidebar_documents = !document.show_sidebar_documents
          "
        />
        <Document />
      </SplitterPanel>
    </SplitterGroup>
    <Leva>
      <LevaTabs />
    </Leva>
  </div>
</template>
