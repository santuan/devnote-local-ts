import { useModalStore } from '@/stores/modal'

export function useSetLink(editor: any) {
  const modal = useModalStore()

  const setLink = (url?: string) => {
    if (!url) {
      modal.show_link_url_dialog = true
      return
    }

    if (url === '') {
      editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return { setLink }
}
