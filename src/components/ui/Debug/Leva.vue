<script setup lang="ts">
import { useDraggable, useElementBounding, useElementSize } from '@vueuse/core'
import {
  ChevronDown,
  GripHorizontal,
  PanelRightClose,
  X,
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
  Toggle,
} from 'reka-ui'
import { computed, nextTick, onMounted, onUnmounted, ref, unref } from 'vue'

import { useDatabaseStore } from '@/stores/database'
import { useFocusStore } from '@/stores/focus'
import { useSettingsStore } from '@/stores/settings'
import Tooltip from '../Tooltip.vue'

const focus_store = useFocusStore()
const database = useDatabaseStore()
const { containerInbound } = storeToRefs(database)
const el = ref<HTMLElement | null>(null)
const draggableRef = ref<HTMLElement | null>(null)
const { focus_debug } = storeToRefs(focus_store)
const isFocusedInSlot = ref(false)
const slotRef = ref<HTMLElement | null>(null)
const {
  top: boundsTop,
  left: boundsLeft,
  width: containerWidth,
  height: containerHeight,
} = useElementBounding(containerInbound)

const { width: draggableWidth, height: draggableHeight }
  = useElementSize(draggableRef)

const adjustedLeft = ref(50)
const adjustedTop = ref(50)

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
const { leva, attach } = storeToRefs(settings)
const open = ref(true)

const moveStep = 5
const isFocused = ref(false)
function handleKeyDown(e: KeyboardEvent) {
  if (!isFocused.value || !leva.value || isFocusedInSlot.value)
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
    if (draggableRef.value) {
      draggableRef.value.addEventListener('keydown', handleKeyDown)
    }
  })
})

onUnmounted(() => {
  if (draggableRef.value) {
    draggableRef.value.removeEventListener('keydown', handleKeyDown)
  }
})

const headerHeight = ref(0)

function calculateHeaderHeight() {
  if (el.value) {
    headerHeight.value = el.value.offsetHeight
  }
}

onMounted(() => {
  calculateHeaderHeight()
  window.addEventListener('resize', calculateHeaderHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateHeaderHeight)
})
</script>

<template>
  <transition>
    <div
      v-show="leva"
      ref="draggableRef"
      :style="style"
      tabindex="0"
      class="text-xs w-72 z-[110] outline outline-secondary text-left outline-none"
      :class="!attach ? 'absolute shadow shadow-secondary' : 'ring ring-secondary'"
      @focusin="isFocused = true"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <CollapsibleRoot v-model:open="open" class="w-72">
        <div
          ref="el"
          class="px-2 py-1 flex bg-secondary items-center justify-between group "
          :class="!attach ? 'cursor-grab active:cursor-grabbing' : ''"
        >
          <div class="w-20 flex justify-start items-center gap-1">
            <CollapsibleTrigger
              class="cursor-default inline-flex items-center text-foreground outline-none hover:opacity-100 opacity-60 gap-1 justify-start"
            >
              <button
                ref="focus_debug"
                class="size-5 flex justify-center items-center"
              >
                <ChevronDown
                  class="h-3 w-3 duration-300"
                  :class="open ? '' : '-rotate-90'"
                />
              </button>
            </CollapsibleTrigger>
            <span class="text-foreground select-none uppercase">Debug</span>
          </div>
          <GripHorizontal
            v-show="!attach"
            class="h-3.5 w-3.5 text-foreground opacity-50 group-hover:opacity-90"
          />
          <div class="flex justify-end w-20 items-center">
            <Toggle
              v-model="attach"
              aria-label="Toggle attach leva"
              class="flex items-center justify-center bg-background border hover:bg-secondary/80 border-secondary size-6"
            >
              <PanelRightClose class="size-3.5" />
            </Toggle>
            <Tooltip
              name="Close leva" side="bottom"
              shortcut="ctrl + alt + shift + d + f"
            >
              <Toggle
                v-model="leva"
                aria-label="Toggle leva"
                class="flex items-center justify-center bg-background border hover:bg-secondary/80 border-secondary size-6"
              >
                <X class="size-3.5" />
              </Toggle>
            </Tooltip>
          </div>
        </div>
        <CollapsibleContent
          class="CollapsibleContent select-none bg-background"
          :class="attach ? '' : 'not-attach'"
        >
          <ScrollAreaRoot
            class="w-full text-xs md:min-h-44 relative overflow-hidden"
            style="--scrollbar-size: 10px"
          >
            <ScrollAreaViewport
              ref="slotRef"
              class="w-full h-full"
              :class="attach ? 'min-h-full max-h-[calc(100vh-5rem)]!' : ''"
              @focusin="isFocusedInSlot = true"
              @focusout="isFocusedInSlot = false"
            >
              <slot />
            </ScrollAreaViewport>
            <ScrollAreaScrollbar
              class="flex select-none touch-none p-0.5 z-20 bg-transparent transition-colors duration-[160ms] ease-out hover:bg-secondary data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
              orientation="vertical"
            >
              <ScrollAreaThumb
                class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
              />
            </ScrollAreaScrollbar>
            <!-- <ScrollAreaScrollbar
              class="flex select-none touch-none p-0.5 bg-transparent transition-colors duration-[160ms] ease-out hover:bg-secondary data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
              orientation="horizontal"
            >
              <ScrollAreaThumb
                class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
              />
            </ScrollAreaScrollbar> -->
          </ScrollAreaRoot>
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

 .CollapsibleContent.not-attach .showOnlyHeadings {
  max-height: 12rem;
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
