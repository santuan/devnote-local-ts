<script lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import { useElementSize } from '@vueuse/core'
import { Clipboard, ClipboardCheck, FoldVertical, UnfoldVertical } from 'lucide-vue-next'
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'
import { bundledLanguages } from 'shiki/bundle/web'
import { shallowRef } from 'vue'
import RadixVirtual from '@/components/ui/Tiptap/RadixVirtual.vue'

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent,
    RadixVirtual,
    Clipboard,
    ClipboardCheck,
    UnfoldVertical,
    FoldVertical,
    ScrollAreaRoot,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
  },

  props: nodeViewProps,

  setup() {
    const codeHeight = shallowRef(null)
    const { width, height } = useElementSize(codeHeight)
    return {
      codeHeight,
      width,
      height,
    }
  },

  data() {
    return {
      languages: Object.keys(bundledLanguages),
      copyText: 'Copy',
      copyTextError: false,
      showFullCode: false,
    }
  },

  computed: {
    selectedLanguage: {
      get() {
        return this.node.attrs.language
      },
      set(language: any) {
        this.updateAttributes({ language })
      },
    },
  },
  methods: {
    copyToClipboard(successful = () => null, failure = () => null) {
      if (this.node.content.size === 0) {
        this.copyTextError = true
        setTimeout(() => {
          this.copyTextError = false
        }, 3000)
        return
      }
      const clipboard = navigator.clipboard
      const value = this.node.content.content[0].text || ''
      if (clipboard !== undefined) {
        navigator.clipboard.writeText(value).then(successful, failure)
        this.copyText = 'Copied'
      }
      else {
        if (document.execCommand) {
          const el = document.createElement('textarea')
          el.value = value
          document.body.append(el)
          el.select()
          el.setSelectionRange(0, value.length)
          if (document.execCommand('copy')) {
            this.copyText = 'Copied' // popper?
          }
          el.remove()
        }
        else {
          this.copyText = 'Error!'
        }
      }
      setTimeout(() => {
        this.copyText = 'copy'
      }, 1000)
    },
  },
}
</script>

<template>
  <NodeViewWrapper class="code-block group" spellcheck="false">
    <ScrollAreaRoot class="w-full h-full" style="--scrollbar-size: 10px">
      <ScrollAreaViewport class="w-full" :class="showFullCode ? 'h-full' : 'max-h-[400px]'">
        <div ref="codeHeight" spellcheck="false">
          <pre><code class="text-xs leading-6 break-all"><NodeViewContent /></code></pre>
        </div>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar
        class="flex select-none z-20 touch-none p-0.5 ease-out data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollAreaThumb
          class="flex-1 bg-secondary-foreground/30 ease-out hover:bg-primary/90 transition-colors rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
        />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
    <div
      class="absolute top-0 right-0 z-40 flex items-center justify-end gap-1 -translate-x-1 translate-y-1"
    >
      <Transition mode="out-in">
        <span v-if="copyTextError" class="flex items-center justify-center duration-100 font-mono h-6 shrink-0 text-xs px-2 bg-primary/80 text-primary-foreground">
          No text detected
        </span>
      </Transition>
      <RadixVirtual v-model="selectedLanguage" :items="languages" />
      <button
        class="print:hidden flex items-center justify-center size-6 bg-secondary shrink-0"
        :class="copyText === 'Copied' ? 'bg-primary!' : ''"
        @click="copyToClipboard()"
      >
        <ClipboardCheck v-show="copyText === 'Copied'" class="size-4 text-primary-foreground" />
        <Clipboard v-show="copyText !== 'Copied'" class="size-4" />
        <span class="sr-only">Copy to clipboard</span>
      </button>
      <button
        v-if="height > 600"
        class="flex items-center justify-center duration-100 size-6 bg-secondary shrink-0"
        @click="showFullCode = !showFullCode"
      >
        <FoldVertical v-if="showFullCode" class="size-4" />
        <UnfoldVertical v-else class="size-4" />
      </button>
    </div>
  </NodeViewWrapper>
</template>

<style>
@reference "@/assets/main.css";

.tiptap .code-block {
  position: relative;
  margin: 1rem 0;
}

.tiptap .code-block [data-reka-scroll-area-viewport] {
  @apply duration-100 border border-primary/5 outline-none;
}

.tiptap .code-block [data-reka-scroll-area-viewport]:hover {
  @apply border border-primary/50;
}

.tiptap .code-block [data-reka-scroll-area-viewport]:focus,
.tiptap .code-block [data-reka-scroll-area-viewport]:focus-within {
  @apply ring-2 ring-primary;
}

.tiptap .code-block pre {
  @apply rounded-none;
}

.tiptap .code-block pre code div {
  @apply pt-4 p-3;
}

.tiptap .code-block pre code * {
  @apply !select-text;
}

.is-preview * {
  @apply !select-text;
}

@media print {
  .tiptap .code-block {
    @apply !ml-[0.1125rem];
  }

  .tiptap .code-block pre code div {
    @apply p-0;
  }

  .tiptap .code-block [data-reka-scroll-area-viewport] {
    @apply border! ring-0! border-foreground/20! !outline-none;
  }
  .tiptap .code-block span {
    filter: brightness(0.5);
  }
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
