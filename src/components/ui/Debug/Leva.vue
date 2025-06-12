<script setup lang="ts">
import { isClient, useDraggable } from '@vueuse/core'
import { ChevronDown, GripHorizontal, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger, Toggle } from 'reka-ui'
import { ref, useTemplateRef } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const el = useTemplateRef<HTMLElement>('el')
const innerWidth = isClient ? window.innerWidth : 200
const { style } = useDraggable(el, {
  initialValue: { x: innerWidth / 4.2, y: 80 },
  preventDefault: true,
  draggingElement: window,
})

const settings = useSettingsStore()
const { leva } = storeToRefs(settings)
const open = ref(false)
</script>

<template>
  <transition>
    <div v-show="leva" ref="el" :style="style" style="position: fixed" class="text-xs group z-[110] cursor-grab active:cursor-grabbing bg-secondary outline outline-secondary text-left">
      <CollapsibleRoot
        v-model:open="open"
        class="w-64 "
      >
        <div
          class="p-2 flex items-center justify-between "
        >
          <div class="flex gap-1 items-center justify-start">
            <CollapsibleTrigger
              class="cursor-default rounded-full h-5 w-5 inline-flex items-center justify-center text-foreground outline-none  hover:opacity-100 opacity-80"
            >
              <ChevronDown
                class="h-3.5 w-3.5 duration-300"
                :class="open ? '' : '-rotate-90'"
              />
            </CollapsibleTrigger>
            <span class="text-foreground uppercase">Debug</span>
          </div>
          <GripHorizontal
            class="h-3.5 w-3.5 text-foreground opacity-50 group-hover:opacity-90"
          />
          <Toggle
            v-model="leva"
            aria-label="Toggle leva"
            class="flex items-center justify-center  border hover:bg-secondary/80 border-secondary size-6"
          >
            <X class="size-3.5" />
          </Toggle>
        </div>

        <!-- <div class="bg-secondary rounded-lg mt-[10px] p-[10px] border">
        <span class="text-grass11 leading-[25px]">@unovue/reka-ui</span>
      </div> -->
        <CollapsibleContent class="CollapsibleContent bg-background  overflow-hidden">
          <div class="px-3 text-xs ">
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
