<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

import { storeToRefs } from 'pinia'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  ToolbarButton,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'
import { useEditorStore } from '@/stores/editor'

const document = useEditorStore()
const { editor } = storeToRefs(document)
const { t } = useI18n()
</script>

<template>
  <DropdownMenuRoot>
    <ToolbarButton as-child>
      <DropdownMenuTrigger class="headingSelector interactive">
        <template v-if="editor.isActive('heading', { level: 1 })">
          {{ t("toolbar.heading1") }}
        </template>
        <template v-else-if="editor.isActive('heading', { level: 2 })">
          {{ t("toolbar.heading2") }}
        </template>
        <template v-else-if="editor.isActive('heading', { level: 3 })">
          {{ t("toolbar.heading3") }}
        </template>
        <template v-else-if="editor.isActive('heading', { level: 4 })">
          {{ t("toolbar.heading4") }}
        </template>
        <template v-else-if="editor.isActive('heading', { level: 5 })">
          {{ t("toolbar.heading5") }}
        </template>
        <template v-else-if="editor.isActive('heading', { level: 6 })">
          {{ t("toolbar.heading6") }}
        </template>
        <template v-else>
          {{ t("toolbar.paragraph") }}
        </template>
        <ChevronDown class="size-4 shrink-0" />
      </DropdownMenuTrigger>
    </ToolbarButton>
    <DropdownMenuContent
      align="start"
      side="bottom"
      :side-offset="7"
      class="z-10 grid text-xs border w-44 bg-background border-primary"
    >
      <DropdownMenuItem
        :class="{ 'is-active': editor.isActive('paragraph') }"
        class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
      >
        {{ t("toolbar.paragraph") }}
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        {{ t("toolbar.heading1") }}
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        {{ t("toolbar.heading2") }}
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        {{ t("toolbar.heading3") }}
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
      >
        {{ t("toolbar.heading4") }}
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
      >
        {{ t("toolbar.heading5") }}
      </DropdownMenuItem>
      <DropdownMenuItem
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        class="flex items-center justify-between gap-2 p-2 pr-3 cursor-pointer hover:bg-primary/20"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
      >
        {{ t("toolbar.heading6") }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenuRoot>
</template>

<style scoped>
@reference "@/assets/main.css";

.headingSelector {
  /* grid-column: 1 / 8; */
  @apply flex items-center text-xs! justify-between! bg-background px-2;
  @apply min-w-40! max-w-40! w-full hover:z-10;
}
</style>
