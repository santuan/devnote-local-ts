<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { motion } from 'motion-v'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle, TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { computed, ref, shallowRef, watch } from 'vue'
import Document from '@/components/Document.vue'
import Sidebar from '@/components/Sidebar.vue'
import { useDocumentStore } from '@/stores/document'
import { useMagicKeysStore } from '@/stores/magic-keys'
import { useSettingsStore } from '@/stores/settings'
import ToggleSidebarLogo from './ToggleSidebarLogo.vue'
import Debug from './ui/Debug/Debug.vue'
import DocumentDebug from './ui/Debug/DocumentDebug.vue'
import Leva from './ui/Debug/Leva.vue'
import DialogCommandMenu from './ui/Dialogs/DialogCommandMenu.vue'
import DialogInfo from './ui/Dialogs/DialogInfo.vue'
import DialogSettings from './ui/Settings/DialogSettings.vue'
import ToggleFontSize from './ui/ToggleFontSize.vue'
import ToggleLeva from './ui/ToggleLeva.vue'
import ToggleTheme from './ui/ToggleTheme.vue'

useMagicKeysStore()
const panelRef = ref()

function expandAllScreen() {
  panelRef.value.resize(50)
}
const settings = useSettingsStore()
const document = useDocumentStore()
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

watch(() => document.show_sidebar_documents, (showSidebar) => {
  if (!showSidebar) {
    panelRef.value?.collapse()
  }
  else {
    if (panelRef.value.isCollapsed) {
      panelRef.value.resize(resizeTo.value)
    }
  }
})

watch(() => resize.value, (resize) => {
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
}, { immediate: true })
</script>

<template>
  <div class="flex w-full print:h-auto! print:overflow-y-auto! h-screen overflow-y-hidden">
    <ToggleSidebarLogo v-if="panelRef?.isCollapsed" />
    <template v-if="settings.desktop_show_icons_sidebar_collapse">
      <motion.div
        v-if="panelRef?.isCollapsed" class="fixed! top-11! left-1! flex flex-col gap-1 z-[81]!" :initial="{
          x: -10,
          opacity: 0,
          transition: {
            default: { type: 'spring' },
            opacity: { ease: 'linear' },
          },
        }" :animate="{
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
        <ToggleFontSize />
        <ToggleTheme />
        <ToggleLeva />
      </motion.div>
    </template>

    <SplitterGroup id="splitter-group-1" direction="horizontal" auto-save-id="app-desktop" @layout="layout = $event">
      <SplitterPanel
        id="splitter-group-1-panel-1" ref="panelRef" :min-size="10" :max-size="50" collapsible
        :collapsed-size="5" class="min-w-10 items-center justify-center " :class="[
          document.show_sidebar_documents ? 'fixed md:relative min-w-80 md:min-w-auto flex z-[71]' : 'hidden lg:flex',
          panelRef?.isCollapsed ? 'max-w-10!' : '',
        ]" @resize="resize = $event"
      >
        <div
          v-show="!panelRef?.isCollapsed" class="w-full " :class="[
            document.show_sidebar_documents ? 'relative z-[71]' : '',

          ]"
        >
          <Sidebar class="min-w-80" />
        </div>
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-1"
        class="hidden print:hidden! w-0.5 lg:flex group justify-center items-center bg-secondary relative border-secondary/10 data-[state=hover]:border-primary/90 data-[state=drag]:bg-primary/90 data-[state=hover]:delay-700 data-[state=hover]:bg-primary duration-100 focus:ring-primary focus:ring-1 outline-hidden"
        @dblclick="expandAllScreen()"
      />
      <SplitterPanel id="splitter-group-1-panel-2" :min-size="50">
        <button
          v-if="document.show_sidebar_documents"
          class="fixed inset-0 print:hidden z-[70] bg-background/90 border-0! ring-0! md:hidden outline-hidden!"
          @click="document.show_sidebar_documents = !document.show_sidebar_documents"
        />
        <Document />
      </SplitterPanel>
    </SplitterGroup>
    <Leva>
      <TabsRoot
        default-value="tab1"
      >
        <TabsList
          class="sticky top-0 z-10 bg-background shrink-0 mb-2 flex border-b border-secondary"
          aria-label="Manage your account"
        >
          <TabsTrigger
            class="py-3 flex-1 flex items-center justify-center text-xs border-b border-secondary  leading-none text-foreground  select-none   hover:text-primary data-[state=active]:text-primary data-[state=active]:border-b-primary duration-300  outline-none "
            value="tab1"
          >
            Document
          </TabsTrigger>
          <TabsTrigger
            class="py-3 flex-1 flex items-center justify-center text-xs border-b border-secondary  leading-none text-foreground  select-none  hover:text-primary data-[state=active]:text-primary data-[state=active]:border-b-primary duration-300 outline-none "
            value="tab2"
          >
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent
          class=""
          value="tab1"
        >
          <DocumentDebug />
        </TabsContent>
        <TabsContent
          class=""
          value="tab2"
        >
          <Debug :panel-ref />
        </TabsContent>
      </TabsRoot>
    </Leva>
  </div>
</template>
