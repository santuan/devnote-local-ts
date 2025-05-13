import { useModalStore } from '@/stores/modal'
import { mergeAttributes, Node } from '@tiptap/core'

export interface IframeOptions {
  allowFullscreen: boolean
  HTMLAttributes: {
    [key: string]: any
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    iframe: {
      setIframe: (options: { src: string }) => ReturnType
      updateIframe: (src: string) => ReturnType
    }
  }
}

export default Node.create<IframeOptions>({
  name: 'iframe',
  group: 'block',
  atom: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: 'iframe-wrapper',
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', this.options.HTMLAttributes, ['iframe', mergeAttributes(HTMLAttributes)]]
  },

  addNodeView() {
    return ({ editor, node }) => {
      const container = document.createElement('div')
      container.className = 'iframeContainer'

      const iframe = document.createElement('iframe')
      iframe.src = node.attrs.src

      if (editor.isEditable) {
        const title = document.createElement('span')
        title.className = 'iframeTitle' // Add a class for styling
        title.textContent = node.attrs.src // Set the text content to the iframe src
        const editButton = document.createElement('button')
        editButton.className = 'iframeEditButton'
        editButton.textContent = 'Edit URL'
        editButton.onclick = () => {
          const modal = useModalStore()
          modal.show_iframe_url_dialog = true
          modal.editing_iframe_pos = editor.state.selection.from
        }
        container.appendChild(title)
        container.appendChild(editButton)
      }
      container.appendChild(iframe)
      return { dom: container }
    }
  },

  addCommands() {
    return {
      setIframe:
        options =>
          ({ tr, dispatch }) => {
            const { selection } = tr
            const node = this.type.create(options)

            if (dispatch) {
              tr.replaceRangeWith(selection.from, selection.to, node)
            }

            return true
          },
      updateIframe:
        src =>
          ({ tr, dispatch }) => {
            const { selection } = tr
            if (dispatch) {
              tr.setNodeMarkup(selection.from, undefined, { src })
            }
            return true
          },
    }
  },
})
