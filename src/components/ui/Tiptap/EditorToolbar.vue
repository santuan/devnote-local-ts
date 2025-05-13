<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import { useFocusStore } from '@/stores/focus'
import { storeToRefs } from 'pinia'
import { ToolbarRoot, ToolbarSeparator } from 'reka-ui'
import ToolbarCharacters from './toolbar/ToolbarCharacters.vue'
import ToolbarClear from './toolbar/ToolbarClear.vue'
import ToolbarCodeBlock from './toolbar/ToolbarCodeBlock.vue'
import ToolbarHeadingSelector from './toolbar/ToolbarHeadingSelector.vue'
import ToolbarInlineCode from './toolbar/ToolbarInlineCode.vue'
import ToolbarLinks from './toolbar/ToolbarLinks.vue'
import ToolbarList from './toolbar/ToolbarList.vue'
import ToolbarMedia from './toolbar/ToolbarMedia.vue'
import ToolbarQuote from './toolbar/ToolbarQuote.vue'
import ToolbarRedo from './toolbar/ToolbarRedo.vue'
import ToolbarTextSeparator from './toolbar/ToolbarSeparator.vue'
import ToolbarTable from './toolbar/ToolbarTable.vue'
import ToolbarTaskList from './toolbar/ToolbarTaskList.vue'
import ToolbarTextAlign from './toolbar/ToolbarTextAlign.vue'
import ToolbarUndo from './toolbar/ToolbarUndo.vue'
import ToolbarWebFrame from './toolbar/ToolbarWebFrame.vue'

const focus_store = useFocusStore()
const { focus_toolbar } = storeToRefs(focus_store)

const editor_store = useEditorStore()
const { editor } = storeToRefs(editor_store)
</script>

<template>
  <div v-if="editor" class="py-1 z-10 relative bg-background print:hidden">
    <div class="relative grid w-full max-w-full mx-auto control-group focus-visible:ring-2 focus-visible:ring-primary">
      <span ref="focus_toolbar" class="sr-only" tabindex="-1"> Toolbar </span>
      <ToolbarRoot
        class="flex gap-0.5 pr-12 lg:pr-0 gap-y-1 justify-start select-none button-group items-center md:w-auto focus-visible:outline! focus-visible:outline-1! focus-visible:outline-primary/10! focus-visible:outline-offset-[1.5px]!"
      >
        <ToolbarUndo />
        <ToolbarRedo />
        <ToolbarCodeBlock />
        <ToolbarHeadingSelector />
        <ToolbarSeparator class="border-x border-foreground/10 h-8 mx-1 w-1" />
        <ToolbarCharacters />
        <ToolbarInlineCode />
        <ToolbarTextAlign />
        <ToolbarSeparator class="border-x border-foreground/10 h-8 mx-1 w-1" />
        <ToolbarTaskList />
        <ToolbarList />
        <ToolbarQuote />
        <ToolbarTextSeparator />
        <ToolbarTable />
        <ToolbarSeparator class="border-x border-foreground/10 h-8 mx-1 w-1" />
        <ToolbarLinks />
        <ToolbarSeparator class="border-x border-foreground/10 h-8 mx-1 w-1" />
        <ToolbarMedia />
        <ToolbarWebFrame />
        <ToolbarSeparator class="border-x border-foreground/10 h-8 mx-1 w-1" />
        <ToolbarClear />
      </ToolbarRoot>
    </div>
  </div>
</template>

<style>
@reference "@/assets/main.css";
.button-group {
  @apply bg-background flex flex-wrap w-full;
}

.button-group button {
  @apply border border-secondary focus-within:border-primary outline-hidden h-[2.1rem] min-w-9 max-w-10 xl:max-w-full text-sm focus-visible:border-primary hover:border-primary! flex justify-center items-center;
  /* @apply @sm:bg-blue-600 @xs:bg-purple-600 @md:bg-yellow-600 @lg:bg-pink-600 @3xl:bg-gray-600 @xl:bg-red-600 @2xl:bg-green-600 @4xl:bg-red-600 @5xl:bg-emerald-600 */
  /* flex: 1; */
}

.control-group button {
  @apply disabled:text-foreground/30 disabled:pointer-events-none;
}

.button-group button.is-active {
  @apply bg-primary text-primary-foreground;
}

.button-group button svg {
  @apply size-3.5;
}

body:has(.cursor_pointer) label {
  cursor: pointer;
}
</style>
