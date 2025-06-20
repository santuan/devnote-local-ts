<script setup lang="ts">
import SidebarDocuments from '@/components/Sidebar/SidebarDocuments.vue'
import SidebarTop from '@/components/Sidebar/SidebarTop.vue'
import SidebarMiddle from './SidebarMiddle.vue'
</script>

<template>
  <header
    class="print:hidden relative z-30 select-none! flex flex-col justify-start motion-safe:duration-[.4s] transition-transform h-screen border-r bg-background focus-within:ring-1 border-secondary! focus-within:ring-primary/50 focus-visible:outline-dashed min-w-80 w-full "
  >
    <SidebarTop />
    <SidebarMiddle />
    <SidebarDocuments />
  </header>
</template>
