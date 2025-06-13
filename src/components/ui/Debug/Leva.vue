<script setup lang="ts">
import { useDraggable, useElementBounding, useElementSize } from '@vueuse/core'
import { ChevronDown, GripHorizontal, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
  Toggle,
} from 'reka-ui'
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  unref,
} from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { useFocusStore } from '@/stores/focus'
import { useSettingsStore } from '@/stores/settings'

const focus_store = useFocusStore()
const database = useDatabaseStore()
const { containerInbound } = storeToRefs(database)
const el = ref<HTMLElement | null>(null)
const { focus_debug } = storeToRefs(focus_store)

const {
  top: boundsTop,
  left: boundsLeft,
  width: containerWidth,
  height: containerHeight,
} = useElementBounding(containerInbound)

const { width: draggableWidth, height: draggableHeight } = useElementSize(el)

const adjustedLeft = ref(50)
const adjustedTop = ref(225)

useDraggable(el, {
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

const moveStep = 5
const isFocused = ref(false)
function handleKeyDown(e: KeyboardEvent) {
  if (!isFocused.value || !leva.value)
    return

  const step = e.shiftKey ? 50 : moveStep
  const maxLeft = containerWidth.value - draggableWidth.value
  const maxTop = containerHeight.value - draggableHeight.value

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      adjustedTop.value = Math.max(0, adjustedTop.value - step)
      break
    case 'ArrowDown':
      e.preventDefault()
      adjustedTop.value = Math.min(maxTop, adjustedTop.value + step)
      break
    case 'ArrowLeft':
      e.preventDefault()
      adjustedLeft.value = Math.max(0, adjustedLeft.value - step)
      break
    case 'ArrowRight':
      e.preventDefault()
      adjustedLeft.value = Math.min(maxLeft, adjustedLeft.value + step)
      break
  }
}

onMounted(() => {
  nextTick(() => {
    if (el.value) {
      el.value.addEventListener('keydown', handleKeyDown)
    }
  })
})

onUnmounted(() => {
  if (el.value) {
    el.value.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<template>
  <transition>
    <div
      v-show="leva"
      ref="el"
      :style="style"
      tabindex="0"
      style="position: absolute"
      class="text-xs z-[110] cursor-grab active:cursor-grabbing bg-secondary outline outline-secondary text-left outline-none"
      @focusin="isFocused = true"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <CollapsibleRoot v-model:open="open" class="w-64">
        <div class="px-2 py-1 flex items-center justify-between group">
          <div class="w-20 flex justify-start items-center gap-1">
            <CollapsibleTrigger
              class="cursor-default h-5 inline-flex items-center text-foreground outline-none hover:opacity-100 opacity-60 gap-1  justify-start"
            >
              <button ref="focus_debug">
                <ChevronDown
                  class="h-3.5 w-3.5 duration-300"
                  :class="open ? '' : '-rotate-90'"
                />
              </button>
              <span class="text-foreground uppercase">Debug</span>
            </CollapsibleTrigger>
          </div>
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
