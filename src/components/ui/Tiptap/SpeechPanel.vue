<script setup lang="ts">
import { useDraggable, useElementBounding, useElementSize } from '@vueuse/core'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronDown,
  Lock,
  PanelRightClose,
  Unlock,
  X,
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  Toggle,
} from 'reka-ui'
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  unref,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useFloatingPanels } from '@/composables/useFloatingPanels'
import { useDatabaseStore } from '@/stores/database'
import { useEditorStore } from '@/stores/editor'
import { useFocusStore } from '@/stores/focus'
import { useSettingsStore } from '@/stores/settings'
import Tooltip from '../Tooltip.vue'
import Speech from './Speech.vue'

const database = useDatabaseStore()
const settings = useSettingsStore()
const focus_store = useFocusStore()
const editor_store = useEditorStore()
const { isActivePanel, setActivePanel } = useFloatingPanels()
const { t } = useI18n()

const moveStep = 5
const adjustedLeft = ref(50)
const adjustedTop = ref(300)
const adjustedBottom = ref<number | undefined>(undefined)
const adjustedRight = ref<number | undefined>(undefined)
const draggableRef = ref<HTMLElement | null>(null)
const el = ref<HTMLElement | null>(null)
const isFocusedInSlot = ref(false)

const { containerInbound } = storeToRefs(database)
const { focus_debug } = storeToRefs(focus_store)
const { speech, speech_attach, speech_collapse }
  = storeToRefs(settings)
const { editor } = storeToRefs(editor_store)

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
    setActivePanel('speech')
  },
  onEnd() {
    isDraggingTouch.value = false
  },
  preventDefault: true,
})

const style = computed(() => ({
  left: adjustedRight.value === undefined ? `${adjustedLeft.value}px` : undefined,
  top: adjustedBottom.value === undefined ? `${adjustedTop.value}px` : undefined,
  right: adjustedRight.value !== undefined ? `${adjustedRight.value}px` : undefined,
  bottom: adjustedBottom.value !== undefined ? `${adjustedBottom.value}px` : undefined,
}))

const isFocused = ref(false)

function handleKeyDown(e: KeyboardEvent) {
  if (!isFocused.value || !speech.value || isFocusedInSlot.value)
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
    if (!speech_attach.value) {
      nextTick(() => {
        checkAndResetPosition()
      })
    }
  },
  { flush: 'post' },
)

watch(draggableHeight, () => {
  if (!speech_attach.value) {
    nextTick(() => {
      checkAndResetPosition()
    })
  }
})

watch(speech_attach, (value) => {
  if (value === true) {
    speech_collapse.value = true
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
    v-show="speech"
    ref="draggableRef"
    :style="style"
    tabindex="0"
    class="text-xs w-72 outline-secondary outline-2 text-left"
    :class="[
      !speech_attach
        ? 'absolute shadow shadow-secondary'
        : 'absolute top-auto! left-auto! right-0! bottom-0! lg:fixed lg:left-auto! lg:top-auto! ring ring-secondary ',
      isActivePanel('speech') ? 'z-200' : 'z-110',
      speech_attach ? 'z-201' : '',
    ]"
    @focusin="isFocused = true; setActivePanel('speech')"
    @focus="isFocused = true; setActivePanel('speech')"
    @blur="isFocused = false"
  >
    <div class="w-72">
      <div
        ref="el"
        class="px-2 py-1 h-10 flex  items-center justify-between group "
        :class="[
          !speech_attach ? 'cursor-grab active:cursor-grabbing bg-primary text-primary-foreground!' : 'bg-secondary',
          isDraggingTouch ? 'touch-none select-none' : '',
        ]"
        :style="!speech_attach ? 'touch-action: none' : ''"
      >
        <div
          :ref="(el) => { focus_debug = el as HTMLElement | null }"
          tabIndex="-1"
          class="w-56 flex justify-start items-center gap-1"
        >
          <button
            class="cursor-default inline-flex items-center  hover:opacity-100 focus-visible:ring focus-visible:ring-primary opacity-60 gap-1 justify-start"
            @click="speech_collapse = !speech_collapse"
          >
            <span class="size-5 flex justify-center items-center">
              <ChevronDown
                class="h-3 w-3 duration-300"
                :class="speech_collapse ? '' : '-rotate-90'"
              />
            </span>
          </button>
          <span class=" select-none uppercase">{{
            t("speech.readAloud")
          }}</span>
          <div v-if="!speech_attach" id="SpeechPortal" />
        </div>
        <div class="flex justify-end w-44 items-center">
          <Tooltip
            :name="speech_attach ? 'Unfix panel' : 'Fix panel'"
            side="bottom"
          >
            <button
              aria-label="Toggle attach leva"
              class="flex items-center justify-center hover:border hover:bg-secondary/10 border-secondary size-8"
              @click="speech_attach = !speech_attach"
            >
              <ArrowRightToLine
                v-if="!speech_attach"
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
            name="Close speech"
            side="bottom"
            shortcut="ctrl + alt + shift + S + C"
          >
            <Toggle
              v-model="speech"
              aria-label="Toggle speech"
              class="flex items-center justify-center hover:border hover:bg-secondary/10 border-secondary size-8"
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
      <div
        v-show="speech_collapse"
        class="CollapsibleContent select-none bg-background"
        :class="speech_attach ? '' : 'not-attach'"
      >
        <Speech :editor="editor" />
      </div>
    </div>
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
