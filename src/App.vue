<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { onMounted } from 'vue'
import AppDesktop from '@/components/AppDesktop.vue'
import AppMobile from '@/components/AppMobile.vue'
import Layout from '@/components/Layout.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { useToggleColorTheme } from '@/composables/useToggleColorTheme'
import { useDatabaseStore } from '@/stores/database'

const { isMobile } = useIsMobile()
const database = useDatabaseStore()
const colorTheme = useStorage('theme', 'theme-foreground')

onMounted(() => {
  database.init_database()
  useToggleColorTheme(colorTheme.value)
})
</script>

<template>
  <Layout>
    <AppDesktop v-if="!isMobile" />
    <AppMobile v-else />
  </Layout>
</template>
