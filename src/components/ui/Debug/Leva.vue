<script setup lang="ts">
import { isClient, useDraggable } from '@vueuse/core'
import { ChevronDown, GripHorizontal } from 'lucide-vue-next'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import { ref, useTemplateRef } from 'vue'

const el = useTemplateRef<HTMLElement>('el')
const innerWidth = isClient ? window.innerWidth : 200
const { style } = useDraggable(el, {
  initialValue: { x: innerWidth / 4.2, y: 80 },
  draggingElement: window,
})

const open = ref(false)
</script>

<template>
  <div ref="el" :style="style" style="position: fixed" class="text-xs group z-[110] cursor-grab active:cursor-grabbing rounded bg-secondary outline outline-primary text-left  whitespace-pre-wrap">
    <CollapsibleRoot
      v-model:open="open"
      class="w-64 "
    >
      <div
        style="display: flex; align-items: center; justify-content: space-between"
        class="p-2  "
      >
        <GripHorizontal
          class="h-3.5 w-3.5 text-foreground opacity-50 group-hover:opacity-90"
        />

        <span class="text-foreground uppercase">Leva</span>
        <CollapsibleTrigger
          class="cursor-default rounded-full h-5 w-5 inline-flex items-center justify-center text-foreground outline-none data-[state=closed]:bg-secondary data-[state=open]:bg-primary hover:text-primary"
        >
          <ChevronDown
            class="h-3.5 w-3.5 "
            :class="open ? 'rotate-180 text-primary-foreground' : ''"
          />
        </CollapsibleTrigger>
      </div>

      <!-- <div class="bg-secondary rounded-lg mt-[10px] p-[10px] border">
        <span class="text-grass11 leading-[25px]">@unovue/reka-ui</span>
      </div> -->
      <CollapsibleContent class="CollapsibleContent bg-background  overflow-hidden">
        <div class="p-6">
          {{ innerWidth }}
          <slot />
        </div>
      </CollapsibleContent>
    </CollapsibleRoot>
  </div>
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
