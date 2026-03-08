<script setup lang="ts">
import { useDraggable, useElementBounding, useElementSize } from '@vueuse/core'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronDown,
  GripHorizontal,
  GripVertical,
  Lock,
  PanelRightClose,
  Unlock,
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

import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  unref,
  useTemplateRef,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import { cn } from '@/composables/twmerge'
import { useFloatingPanels } from '@/composables/useFloatingPanels'
import { useDatabaseStore } from '@/stores/database'
import { useFocusStore } from '@/stores/focus'
import { useSettingsStore } from '@/stores/settings'
import Tooltip from '../Tooltip.vue'

const database = useDatabaseStore()
const settings = useSettingsStore()
const focus_store = useFocusStore()
const { isActivePanel, setActivePanel } = useFloatingPanels()

const moveStep = 5
const adjustedLeft = ref(50)
const adjustedTop = ref(220)
const adjustedBottom = ref<number | undefined>(undefined)
const adjustedRight = ref<number | undefined>(undefined)
const draggableRef = ref<HTMLElement | null>(null)
const el = ref<HTMLElement | null>(null)
const isFocusedInSlot = ref(false)
// @ts-expect-error - used in template via ref="slotRef"
const slotRef = useTemplateRef<HTMLElement>('slotRef')
const focusDebugRef = useTemplateRef<HTMLElement>('focus-debug')

const { containerInbound } = storeToRefs(database)
const { focus_debug } = storeToRefs(focus_store)
const { leva, attach, leva_collapse, speech_collapse, speech } = storeToRefs(settings)
const { t } = useI18n()

watch(focus_debug, () => {
  focusDebugRef.value?.focus()
})

const {
  top: boundsTop,
  left: boundsLeft,
  width: containerWidth,
  height: containerHeight,
} = useElementBounding(containerInbound)

const { width: draggableWidth, height: draggableHeight }
  = useElementSize(draggableRef)

const isDraggingTouch = ref(false)

useDraggable(el, {
  onMove({ x, y }) {
    const offsetX = x - unref(boundsLeft)
    const offsetY = y - unref(boundsTop)

    adjustedBottom.value = undefined
    adjustedRight.value = undefined
    adjustedLeft.value = Math.min(
      Math.max(0, offsetX),
      containerWidth.value - draggableWidth.value,
    )
    adjustedTop.value = Math.min(
      Math.max(0, offsetY),
      containerHeight.value - draggableHeight.value,
    )
  },
  onStart() {
    isDraggingTouch.value = true

    setActivePanel('leva')
  },
  onEnd() {
    isDraggingTouch.value = false
  },
})

const style = computed(() => ({
  left: adjustedRight.value === undefined ? `${adjustedLeft.value}px` : undefined,
  top: adjustedBottom.value === undefined ? `${adjustedTop.value}px` : undefined,
  right: adjustedRight.value !== undefined ? `${adjustedRight.value}px` : undefined,
  bottom: adjustedBottom.value !== undefined ? `${adjustedBottom.value}px` : undefined,
}))

const isFocused = ref(false)

function handleKeyDown(e: KeyboardEvent) {
  if (!isFocused.value || !leva.value || isFocusedInSlot.value)
    return

  const step = e.shiftKey ? 50 : moveStep
  const maxLeft = containerWidth.value - draggableWidth.value
  const maxTop = containerHeight.value - draggableHeight.value

  adjustedBottom.value = undefined
  adjustedRight.value = undefined

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

function attach_panel() {
  attach.value = !attach.value
}

function checkAndResetPosition() {
  const maxLeft = containerWidth.value - draggableWidth.value
  const maxTop = containerHeight.value - draggableHeight.value

  if (adjustedLeft.value > maxLeft && adjustedTop.value > maxTop) {
    adjustedLeft.value = 50
    adjustedTop.value = 220
    adjustedBottom.value = 0
    adjustedRight.value = 0
  }
  else if (adjustedTop.value > maxTop) {
    adjustedTop.value = 220
    adjustedBottom.value = 0
  }
  else if (adjustedLeft.value > maxLeft) {
    adjustedLeft.value = 50
    adjustedRight.value = 0
  }
}

watch(
  [containerWidth, containerHeight],
  () => {
    if (!attach.value) {
      nextTick(() => {
        checkAndResetPosition()
      })
    }
  },
  { flush: 'post' },
)

watch(draggableHeight, () => {
  if (!attach.value) {
    nextTick(() => {
      checkAndResetPosition()
    })
  }
})

watch(attach, (value) => {
  if (value === true) {
    leva_collapse.value = true
  }
})

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
  <div
    v-show="leva"
    ref="draggableRef"
    :style="style"
    tabindex="0"
    class="text-xs w-72 outline-2 outline-secondary text-left"
    :class="[
      !attach
        ? 'absolute shadow shadow-secondary'
        : 'absolute top-auto! left-auto! right-0! bottom-0! lg:relative lg:left-auto! lg:top-auto! ring ring-secondary ',
      isActivePanel('leva') ? 'z-200' : 'z-110',
    ]"
    @focusin="isFocused = true; setActivePanel('leva')"
    @focus="isFocused = true; setActivePanel('leva')"
    @blur="isFocused = false"
  >
    <CollapsibleRoot v-model:open="leva_collapse" class="w-72">
      <div
        ref="el"
        class="px-2 py-1 h-10 flex  items-center justify-between group"
        :class="!attach ? 'cursor-grab active:cursor-grabbing bg-primary text-primary-foreground!' : 'bg-secondary'"
      >
        <div
          ref="focus-debug"
          tabIndex="-1"
          class="w-20 flex justify-start items-center gap-1"
        >
          <CollapsibleTrigger
            :class="attach ? 'lg:hidden!' : ''"
            class="cursor-default inline-flex items-center  outline-none hover:opacity-100 opacity-60 gap-1 justify-start"
          >
            <button class="size-5 flex justify-center items-center">
              <ChevronDown
                class="h-3 w-3 duration-300"
                :class="leva_collapse ? '' : '-rotate-90'"
              />
            </button>
          </CollapsibleTrigger>
          <span
            class=" select-none uppercase"
            :class="attach ? 'text-foreground' : 'text-primary-foreground!'"
          >{{ t("leva.document") }}</span>
        </div>

        <div class="flex justify-end w-20 items-center">
          <Tooltip
            :name="attach ? 'Unfix panel' : 'Fix panel'"
            side="bottom"
          >
            <button
              aria-label="Toggle attach leva"
              class="flex items-center justify-center hover:border hover:bg-secondary/10 border-secondary size-8"
              :class="attach ? ' ' : ''"
              @click="attach_panel()"
            >
              <ArrowRightToLine
                v-if="!attach"
                class="size-3"
                absolute-stroke-width
                stroke-width="2"
              />
              <ArrowLeftToLine
                v-else
                class="size-3"
                absolute-stroke-width
                stroke-width="2"
              />
            </button>
          </Tooltip>
          <Tooltip
            name="Close leva"
            side="bottom"
            shortcut="ctrl + alt + shift + D + C"
          >
            <Toggle
              v-model="leva"
              aria-label="Toggle leva"
              class="flex items-center justify-center hover:border hover:bg-secondary/20 border-secondary size-8"
            >
              <X
                class="size-5 lg:size-4"
                absolute-stroke-width
                stroke-width="2"
              />
            </Toggle>
          </Tooltip>
        </div>
      </div>
      <CollapsibleContent
        class="CollapsibleContent select-none bg-background"
        :class="attach ? '' : 'not-attach'"
      >
        <ScrollAreaRoot
          class="w-full text-xs md:min-h-44  relative overflow-hidden"
          style="--scrollbar-size: 10px"
        >
          <ScrollAreaViewport
            ref="slotRef"
            class="w-full h-full"

            :class="cn(
              'max-h-[calc(100vh-2rem)]  pr-2',
              speech_collapse && 'max-h-[calc(100vh-10rem)]',
              speech_collapse && attach && 'max-h-[calc(100vh-10rem)] pb-32!',
              !speech && 'max-h-[calc(100vh-2rem)]',
            )"
            @focusin="isFocusedInSlot = true"
            @focusout="isFocusedInSlot = false"
          >
            <slot />
          </ScrollAreaViewport>
          <ScrollAreaScrollbar
            class="flex select-none touch-none p-0.5 z-20 bg-transparent transition-colors duration-160ms ease-out hover:bg-secondary data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
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
</template>

<style>
.CollapsibleContent {
  overflow: hidden;
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
