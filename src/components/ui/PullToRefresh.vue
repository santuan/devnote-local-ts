<script setup lang='ts'>
import { usePullToRefresh } from '@/composables/usePullToRefresh'
import { ArrowDownCircle } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const containerRef = ref(null)
const { distance, isRefreshing } = usePullToRefresh(containerRef)
const { t } = useI18n()
</script>

<template>
  <div ref="containerRef" class="relative">
    <div
      v-show="distance > 0 || isRefreshing"
      class="absolute top-0 left-0 right-0 flex bg-linear-to-b from-background to-transparent items-center justify-center transition-transform py-2 px-5 duration-200 z-70"
      :style="{
        opacity: `${Math.min(distance, 150) / 100}`,
      }"
    >
      <div
        class="text-xs px-3 py-3 flex items-center shadow-lg justify-center gap-2 w-full"
        :class="
          distance > 150 && !isRefreshing
            ? 'bg-primary text-primary-foreground'
            : 'bg-background ring-1 ring-secondary'
        "
        :style="{
          transform: `translateY(${Math.min(distance, 10)}px)`,
        }"
      >
        <ArrowDownCircle
          class="size-5 transition-transform"
          :class="{
            'rotate-180': isRefreshing,
            'animate-pulse': distance > 150 && !isRefreshing,
          }"
        />
        <span v-if="!isRefreshing" class="font-bold">
          {{ t("verb.open") }} {{ t("commandBar.title") }}
        </span>
      </div>
    </div>
    <slot />
  </div>
</template>
