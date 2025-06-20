import type { Editor } from '@tiptap/core'
import type { HeadingOptions } from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/core'
import { Heading } from '@tiptap/extension-heading'
import { computed } from 'vue'

import slugify from '@/composables/slugify'

export type HeadingWithAnchorOptions = HeadingOptions & {
  /**
   * If true, checks whether the current URL hash string indicates we should be
   * anchored to a specific heading, and if so, scrolls to that heading after
   * rendering editor content. Since Tiptap's editor does not add content to the
   * DOM on initial/server render, this must be set to true in order to scroll
   * after mounting.
   *
   * You may want to set this to `false` if you are using the Collaboration
   * extension and the Y.Doc hasn't yet synced, since the collaboration document
   * won't have content still on mount. In that case, you can handle scrolling
   * to an anchor separately via the collaboration sync callback, using the
   * exported scrollToCurrentAnchor function.
   */
  scrollToAnchorOnMount: boolean
}

/**
 * A modified version of Tiptap’s `Heading` extension
 * (https://tiptap.dev/api/nodes/heading), with dynamic GitHub-like anchor links
 * for every heading you add. An anchor link button appears to the left of each
 * heading when you hovering over it, when the `editor` has `editable` set to
 * `false`. This allows users to share links and jump to specific headings
 * within your rendered editor content. It can also accommodate building a table
 * of contents or outline more easily.
 */
const HeadingWithAnchor = Heading.extend<HeadingWithAnchorOptions>({
  addOptions() {
    return {
      // Tiptap claims this.parent can be undefined, so disable this eslint rule
      // https://tiptap.dev/guide/custom-extensions/#extend-existing-attributes
      ...this.parent?.(),
      scrollToAnchorOnMount: true,
    }
  },

  onCreate() {
    // It seems that when `onCreate` is called via this extension `onCreate`
    // definition, our content and HeadingWithAnchor React node-views have yet
    // to be rendered. (Also notably, react renderers are async so don't appear
    // even when the rest of the document HTML first shows up, as mentioned in
    // https://github.com/ueberdosis/tiptap/issues/1527#issuecomment-888380206.)
    // Delaying until the end of the event loop with setTimeout should do the
    // trick.
    if (this.options.scrollToAnchorOnMount) {
      setTimeout(() => {
        scrollToCurrentHeadingAnchor(this.editor)
      })
    }
  },

  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level)

    const headingId = computed(() =>
      slugify(node.content.content[0].text),
    )

    const level = hasLevel ? node.attrs.level : this.options.levels[0]

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        id: headingId.value, // Add the computed headingId as an id attribute
      }),
      0,
    ]
  },
})

export default HeadingWithAnchor

/**
 * If there's a URL hash string indicating we should be anchored to a specific
 * heading, this function scrolls to that heading.
 *
 * We have to do this manually/programmatically after first render using this
 * function, since when the page first loads, the editor content will not be
 * mounted/rendered, so the browser doesn't move to the anchor automatically
 * just from having the anchor in the URL. Note that we only want to do this
 * once on mount/create.
 */
export function scrollToCurrentHeadingAnchor(editor: Editor) {
  if (editor.isDestroyed || !('heading' in editor.storage)) {
    // If the editor is already removed/destroyed, or the heading extension
    // isn't enabled, we can stop
    return
  }

  const currentHash = window.location.hash
  const elementId = currentHash.slice(1)
  if (!elementId) {
    return
  }

  const elementForHash = window.document.getElementById(elementId)

  // We'll only scroll if the given hash points to an element that's part of our
  // editor content (i.e., ignore external anchors)
  if (elementForHash && editor.options.element.contains(elementForHash)) {
    elementForHash.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  }
}
