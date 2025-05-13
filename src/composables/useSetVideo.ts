import { useModalStore } from '@/stores/modal'

export function useSetVideo(editor: any) {
  const modal = useModalStore()

  const setVideo = (videoSrc: string | null) => {
    if (!videoSrc) {
      modal.show_video_url_dialog = true
      return
    }

    if (videoSrc === '') {
      if (editor.value.isActive('video')) {
        editor.value.commands.deleteSelection()
      }
      return
    }

    const srcCheck = videoSrc.match(/src="(?<src>.+?)"/)
    const src = srcCheck ? srcCheck.groups?.src : videoSrc

    editor.value
      .chain()
      .focus()
      .insertContent(`<video src="${src}" width="500" height="500"></video>`)
      .run()
  }

  return { setVideo }
}
