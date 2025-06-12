<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints, useStorage } from '@vueuse/core'
import { motion } from 'motion-v'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { computed, ref, shallowRef, watch } from 'vue'
import Document from '@/components/Document.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useDatabaseStore } from '@/stores/database'
import { useDocumentStore } from '@/stores/document'
import { useMagicKeysStore } from '@/stores/magic-keys'
import ToggleSidebarLogo from './ToggleSidebarLogo.vue'
import Leva from './ui/Debug/Leva.vue'
import DialogCommandMenu from './ui/Dialogs/DialogCommandMenu.vue'
import DialogInfo from './ui/Dialogs/DialogInfo.vue'
import DialogSettings from './ui/Settings/DialogSettings.vue'
import ToggleFontSize from './ui/ToggleFontSize.vue'
import ToggleLeva from './ui/ToggleLeva.vue'
import ToggleTheme from './ui/ToggleTheme.vue'

const database = useDatabaseStore()

useMagicKeysStore()
const colorTheme = useStorage('theme', 'theme-foreground')
const appFontSize = useStorage('appFontSize', 'app-font-size-md')

const panelRef = ref()

function expandAllScreen() {
  if (panelRef.value?.isCollapsed) {
    panelRef.value?.expand()
  }
  else {
    panelRef.value?.collapse()
  }
}
const document = useDocumentStore()
const breakpoints = useBreakpoints(breakpointsTailwind)
const largerThanLg = breakpoints.greater('lg')
const layout = shallowRef<number[]>([0, 0]) // Initialize as an array
const resize = shallowRef(0) // Declare resize variable

watch(() => document.show_sidebar_documents, (isOpen) => {
  if (isOpen === true) {
    if (largerThanLg.value === true) {
      panelRef.value.resize(30)
    }
    else {
      panelRef.value.resize(100)
    }
  }
  else {
    panelRef.value?.collapse()
  }
})

const appSizeResult = computed(() => {
  if (!resize.value)
    return
  if (resize.value >= 6) {
    showMenu()
    return true
  }
  if (resize.value <= 5) {
    hideMenu()
    return true
  }
  return false
})

function hideMenu() {
  document.show_sidebar_documents = false
}
function showMenu() {
  document.show_sidebar_documents = true
}
</script>

<template>
  <div class="flex w-full print:h-auto! print:overflow-y-auto! h-screen overflow-y-hidden">
    <ToggleSidebarLogo
      v-if="panelRef?.isCollapsed"
    />
    <motion.div
      v-if="panelRef?.isCollapsed" class="fixed! top-11! left-1! flex flex-col gap-1 z-[81]!"
      :initial="{
        x: -10,
        opacity: 0,
        transition: {
          default: { type: 'spring' },
          opacity: { ease: 'linear' },
        },
      }"
      :animate="{
        x: 0,
        opacity: 1,
        transition: {
          default: { type: 'spring' },
          opacity: { ease: 'linear' },
        },
      }"
    >
      <DialogInfo />
      <DialogSettings />
      <DialogCommandMenu />
      <ToggleTheme />
      <ToggleFontSize />
      <ToggleLeva />
    </motion.div>

    <SplitterGroup id="splitter-group-1" direction="horizontal" auto-save-id="app-desktop" @layout="layout = $event">
      <SplitterPanel
        id="splitter-group-1-panel-1"
        ref="panelRef"
        :min-size="5"
        :max-size="50"
        collapsible
        :collapsed-size="5"
        class="  items-center justify-center "
        :class="[
          document.show_sidebar_documents ? 'fixed md:relative min-w-80 md:min-w-auto flex z-[71]' : 'hidden  lg:flex',
          panelRef?.isCollapsed ? '!max-w-10' : '',
        ]"
        @resize="resize = $event"
      >
        <transition>
          <div
            v-show="!panelRef?.isCollapsed"
            class="w-full "
            :class="[
              document.show_sidebar_documents ? 'relative z-[71]' : '',
            ]"
          >
            <Sidebar class="min-w-80" />
          </div>
        </transition>
      </SplitterPanel>
      <SplitterResizeHandle id="splitter-group-1-resize-handle-1" class="hidden print:hidden! w-0.5 lg:flex group justify-center items-center bg-secondary relative border-secondary/10 data-[state=hover]:border-primary/90 data-[state=drag]:bg-primary/90 data-[state=hover]:delay-700 data-[state=hover]:bg-primary duration-100 focus:ring-primary focus:ring-1 outline-hidden" @dblclick="expandAllScreen()" />
      <SplitterPanel id="splitter-group-1-panel-2" :min-size="50">
        <button
          v-if="document.show_sidebar_documents"
          class="fixed inset-0 print:hidden z-[70] bg-background/90 border-0! ring-0! lg:hidden outline-hidden!"
          @click="document.show_sidebar_documents = !document.show_sidebar_documents"
        />
        <Document />
      </SplitterPanel>
    </SplitterGroup>
    <Leva>
      <div class="text-foreground flex justify-between items-center border-b border-background py-2">
        <p>Sidebar</p>
        <span>{{ document.show_sidebar_documents }}</span>
      </div>
      <div class="text-foreground flex justify-between items-center border-b border-background py-2">
        <p>Sidebar.isCollapsed</p>
        <span>{{ panelRef.isCollapsed }}</span>
      </div>
      <div class="text-foreground flex justify-between items-center border-b border-background py-2">
        <p>Sidebar.isExpanded</p>
        <span>{{ panelRef.isExpanded }}</span>
      </div>
      <div class="text-foreground flex justify-between items-center border-b border-background py-2">
        <p>Loaded id</p>
        <span>{{ database.loaded_id }}</span>
      </div>
      <div class="text-foreground flex justify-between items-center border-b border-background py-2">
        <p>Preview</p>
        <span>{{ !document.content_editable }}</span>
      </div>
      <div class="text-foreground flex justify-between items-center border-b border-background py-2">
        <p>Status</p>
        <span>{{ database.status }}</span>
      </div>
      <div class="text-foreground flex justify-between items-center border-b border-background py-2">
        <div class="flex flex-col  gap-1">
          <p class="text-primary">
            Theme
          </p>
          <span class="text-secondary-foreground">{{ colorTheme }}</span>
        </div>
        <ToggleTheme />
      </div>
      <div class="text-foreground flex justify-between items-center border-b border-background py-2">
        <div class="grid gap-1">
          <p>App Size</p>
          <span class="text-secondary-foreground">{{ appFontSize }}</span>
        </div>
        <ToggleFontSize />
      </div>
    </Leva>
  </div>
</template>
