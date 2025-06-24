<script setup lang="ts">
import { useSwipe } from '@vueuse/core'
import { shallowRef, useTemplateRef, watch } from 'vue'
import Document from '@/components/Document.vue'
import PullToRefresh from '@/components/PullToRefresh.vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import ToggleSidebarLogo from '@/components/ui/ToggleSidebarLogo.vue'
import { useDocumentStore } from '@/stores/document'

const document = useDocumentStore()
const swipeTarget = useTemplateRef('swipeTarget')
const opacity = shallowRef(1)
const left = shallowRef('0')

watch(() => document.show_sidebar_documents, (isOpen) => {
  if (isOpen === true) {
    left.value = '0'
  }
  else {
    left.value = '-50rem'
  }
})

const { lengthX, isSwiping } = useSwipe(
  swipeTarget,
  {
    passive: false,
    onSwipe() {
      const length = Math.abs(lengthX.value) / 18
      if (swipeTarget.value) {
        left.value = `${length}rem`
        if (length > 0) {
          left.value = `${length - 18}rem`
          opacity.value = length * 3 / 100
          if (length > 16) {
            document.show_sidebar_documents = true
            left.value = '0'
            opacity.value = 1
          }
        }
      }
    },
    onSwipeEnd() {
      const length = Math.abs(lengthX.value) / 18
      if (length < 16) {
        document.show_sidebar_documents = false
        left.value = `-60rem`
        opacity.value = 1
        isSwiping.value = false
      }
    },
  },
)
</script>

<template>
  <PullToRefresh>
    <div class="flex w-full print:h-auto! print:overflow-y-auto! h-screen overflow-y-hidden">
      <ToggleSidebarLogo />
      <div ref="swipeTarget" class="top-12 z-[198] bg-background touch-pan-x text-xs bottom-12 fixed w-9" />
      <Sidebar
        class="max-w-80"
        :class="[
          isSwiping ? ' duration-0! ease-in-out! delay-0! ' : ' duration-300 ',
        ]" :style="`transform: translateX(${left}) !important; opacity: ${opacity}; position: fixed; z-index: 200`"
      />
      <transition>
        <button
          v-if="document.show_sidebar_documents"
          class="fixed inset-0 print:hidden z-[199] bg-background/90 border-0! ring-0! outline-hidden!"
          @click="document.show_sidebar_documents = !document.show_sidebar_documents"
        />
      </transition>
      <Document />
    </div>
  </PullToRefresh>
</template>
