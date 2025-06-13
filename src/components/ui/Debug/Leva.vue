<script setup lang="ts">
import { isClient, useDraggable, useElementBounding, useElementSize } from '@vueuse/core'
import { ChevronDown, GripHorizontal, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger, Toggle } from 'reka-ui'
import { computed, ref, unref } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useSettingsStore } from '@/stores/settings'

const database = useDatabaseStore()
const { containerInbound } = storeToRefs(database)
const innerWidth = isClient ? window.innerWidth : 200
const el = ref<HTMLElement | null>(null)

const {
  top: boundsTop,
  left: boundsLeft,
  width: containerWidth,
  height: containerHeight,
} = useElementBounding(containerInbound)

const { width: draggableWidth, height: draggableHeight } = useElementSize(el)

const adjustedLeft = ref(0)
const adjustedTop = ref(0)

useDraggable(el, {
  initialValue: { x: innerWidth / 4.2, y: 80 },
  onMove({ x, y }) {
    const offsetX = x - unref(boundsLeft)
    const offsetY = y - unref(boundsTop)

    adjustedLeft.value = Math.min(
      Math.max(0, offsetX),
      containerWidth.value - draggableWidth.value,
    )
    adjustedTop.value = Math.min(
      Math.max(0, offsetY),
      containerHeight.value - draggableHeight.value,
    )
  },
})

const style = computed(() => ({
  left: `${adjustedLeft.value}px`,
  top: `${adjustedTop.value}px`,
}))

const settings = useSettingsStore()
const { leva } = storeToRefs(settings)
const open = ref(false)
</script>

<template>
  <transition>
    <div
      v-show="leva"
      ref="el"
      :style="style"
      style="position: absolute"
      class="text-xs  z-[110] cursor-grab active:cursor-grabbing bg-secondary outline outline-secondary text-left"
    >
      <CollapsibleRoot v-model:open="open" class="w-64 ">
        <div class="px-2 py-1 flex items-center justify-between group">
          <CollapsibleTrigger
            class="cursor-default size-5 inline-flex items-center text-foreground outline-none hover:bg-background hover:opacity-100 opacity-80 gap-1 w-20 justify-start"
          >
            <ChevronDown
              class="h-3.5 w-3.5 duration-300"
              :class="open ? '' : '-rotate-90'"
            />
            <span class="text-foreground uppercase">Debug</span>
          </CollapsibleTrigger>

          <GripHorizontal
            class="h-3.5 w-3.5 text-foreground opacity-50 group-hover:opacity-90"
          />

          <div class="w-20 flex justify-end items-center">
            <Toggle
              v-model="leva"
              aria-label="Toggle leva"
              class="flex items-center justify-center bg-background border hover:bg-secondary/80 border-secondary size-6"
            >
              <X class="size-3.5" />
            </Toggle>
          </div>
        </div>

        <CollapsibleContent class="CollapsibleContent bg-background overflow-hidden">
          <div class="px-3 text-xs">
            <slot />
          </div>
        </CollapsibleContent>
      </CollapsibleRoot>
    </div>
  </transition>
</template>

<style>
.CollapsibleContent {
  overflow: hidden;
}
.CollapsibleContent[data-state="open"] {
  animation: slideDown 300ms ease-out;
}
.CollapsibleContent[data-state="closed"] {
  animation: slideUp 300ms ease-out;
}

@keyframes slideDown {
  from {
    height: 0;
  }
  to {
    height: var(--reka-collapsible-content-height);
  }
}

@keyframes slideUp {
  from {
    height: var(--reka-collapsible-content-height);
  }
  to {
    height: 0;
  }
}
</style>
