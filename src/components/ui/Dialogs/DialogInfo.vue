<script setup lang="ts">
import Tooltip from '@/components/ui/Tooltip.vue'

import { useIsMobile } from '@/composables/useIsMobile'
import { useModalStore } from '@/stores/modal'
import { Info, X } from 'lucide-vue-next'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

const { isMobile } = useIsMobile()

const modal = useModalStore()
const { t, locale } = useI18n()
</script>

<template>
  <DialogRoot v-model:open="modal.show_info">
    <Tooltip
      :name="t('sidebar.about')"
      side="bottom"
    >
      <DialogTrigger
        class="flex items-center justify-center border interactive border-secondary hover:bg-secondary/80 bg-background size-8"
      >
        <Info class="size-4" />
        <span class="sr-only">{{ t("sidebar.about") }}</span>
      </DialogTrigger>
    </Tooltip>
    <DialogPortal>
      <DialogOverlay class="bg-background/75 fixed inset-0 z-99" />
      <DialogContent
        class="font-mono fixed top-6 md:top-[50%] left-[50%] border border-secondary max-h-[85vh] w-[90vw] max-w-[650px] translate-x-[-50%] md:translate-y-[-50%] bg-background rounded p-4 focus:outline-hidden z-99"
      >
        <DialogTitle class="text-foreground m-0 text-sm pt-1 font-semibold">
          {{ t("sidebar.about") }}
        </DialogTitle>
        <ScrollAreaRoot
          class="w-full border h-[65vh] sm:pr-6 mt-6 md:h-[68vh] border-secondary select-interactive"
          style="--scrollbar-size: 10px"
        >
          <ScrollAreaViewport class="w-full h-full">
            <template v-if="locale === 'es'">
              <article
                class="max-w-full p-3 mx-auto prose prose-ul:list-none prose-ul:pl-0 dark:prose-invert"
              >
                <DialogDescription
                  class="inline-block p-3 mt-3 mb-3 text-sm leading-relaxed rounded text-foreground bg-primary/20"
                >
                  Esto es una beta, no utilizar más que para realizar pruebas.
                </DialogDescription>
                <p class="mt-3 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  Esta aplicación usa la tecnologia
                  <a
                    href="https://developer.mozilla.org/es/docs/Web/API/IndexedDB_API/Using_IndexedDB"
                    class="underline underline-offset-2"
                  >IndexedDB</a>
                  que existe dentro en los navegadores para almacenar datos. Estos datos quedan
                  almacenados en la sesión de ese navegador (Al limpiar los datos del navegador
                  estos se perderán).
                </p>
                <p class="mt-2 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  Puede exportar e importar la IndexedDB en formato JSON y asi mantener la base de
                  datos localmente.
                </p>
                <template v-if="!isMobile">
                  <h3 class="text-lg">
                    Atajos de teclado
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl M</code> Colapsar el menú
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Alt N</code> Crear nuevo documento
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Alt P</code> Alternar entre modo editar o previsualizar
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Alt O</code> Activar barra de comandos para navegar documentos
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Shift Delete</code> Eliminar documento en curso
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code class="inline-flex gap-1">Ctrl Shift &uarr;</code>
                        Seleccionar documento anterior.
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code class="inline-flex gap-1">Ctrl Shift &darr; </code>
                        Seleccionar documento siguiente.
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift +</code> Incrementar tamaño app. Solo teclado númerico
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift -</code> Disminuir tamaño app. Solo teclado númerico
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt .</code> Expande el editor de texto a todo el ancho
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt S</code> Mostrar configuraciones
                      </p>
                    </li>

                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt T</code> Mostrar u ocultar barra de herramientas
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt G</code> Saltar a la barra de herramientas
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt &larr;</code> Saltar al menú
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt &rarr;</code> Saltar al titulo actual
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt U</code> Saltar al editor de texto
                      </p>
                    </li>
                  </ul>
                </template>
                <template v-if="isMobile">
                  <h3 class="text-lg text-center">
                    Gestos
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0 flex justify-center flex-col items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from TDesign Icons by TDesign - https://github.com/Tencent/tdesign-icons/blob/main/LICENSE --><path fill="currentColor" d="m5.222 3.222l.707-.707l-1.414-1.414l-.707.707c-4.541 4.54-5.02 11.605-1.44 16.678H.499v2h5.7V15.5h-2v2.1C.958 13.29 1.3 7.144 5.222 3.222m2.752 1.416a2.26 2.26 0 0 0-.827 3.087l4.032 6.983l-2.583.88c-.719.246-1.22.9-1.268 1.658l-.11 1.71l6.518 2.692c.792.327 1.69.268 2.431-.16l6.137-3.543a2.76 2.76 0 0 0 1.322-2.94l-1.132-5.526a2.76 2.76 0 0 0-2.687-2.203l-4.197-.02a2.76 2.76 0 0 0-1.392.37l-1.432.826l-1.725-2.987a2.26 2.26 0 0 0-3.087-.827" /></svg>
                      <p class="flex justify-between text-center items-center w-full flex-col  gap-2">
                        <code class="break-words">Deslizar hacia abajo en barra de herramientas</code> Muestra barra de comandos.
                      </p>
                    </li>
                  </ul>
                </template>
              </article>
            </template>
            <template v-else>
              <article
                class="max-w-full p-3 mx-auto prose prose-ul:list-none prose-ul:pl-0 dark:prose-invert"
              >
                <DialogDescription
                  class="inline-block p-3 mt-3 mb-3 leading-relaxed text-sm rounded text-foreground bg-primary/20"
                >
                  This is an beta version; use it only for testing purposes. Currently adapting to
                  work well with <a href="https://nvda.es/">NVDA</a>.
                </DialogDescription>
                <p class="mt-3 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  This application uses
                  <a
                    href="https://developer.mozilla.org/en/docs/Web/API/IndexedDB_API/Using_IndexedDB"
                    class="underline underline-offset-2"
                  >IndexedDB</a>
                  technology within browsers to store data. These data are saved in the session of
                  that browser (they will be lost when clearing the browser data).
                </p>
                <p class="mt-2 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  You can export and import the IndexedDB in JSON format to keep the database
                  locally.
                </p>
                <template v-if="!isMobile">
                  <h3 class="text-lg">
                    Keyboard Shortcuts
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl M</code> Collapse menu
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Alt N</code> Create new document
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Alt P</code> Toggle between edit or preview mode
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Alt O</code> Command bar to navigate documents
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Shift Delete</code> Delete current document
                      </p>
                    </li>

                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code class="inline-flex gap-1">Ctrl Shift &uarr;</code> Select previous
                        document.
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code class="inline-flex gap-1">Ctrl Shift &darr;</code>
                        Select next document.
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift +</code> Increase App size. Numbpad only
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift -</code> Decrease App size. Numbpad only
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt .</code> Expand/Collapse the editing area
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt S</code> Show settings
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt T</code> Toogle toolbar
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt G</code> Focus on toolbar
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt &larr;</code> Focus on sidebar
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt &rarr;</code> Focus on title
                      </p>
                    </li>
                    <li class="pl-0">
                      <p class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2">
                        <code>Ctrl Shift Alt U</code> Focus on editor
                      </p>
                    </li>
                  </ul>
                </template>
                <template v-if="isMobile">
                  <h3 class="text-lg text-center">
                    Mobile Shortcut
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0 flex justify-center flex-col items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from TDesign Icons by TDesign - https://github.com/Tencent/tdesign-icons/blob/main/LICENSE --><path fill="currentColor" d="m5.222 3.222l.707-.707l-1.414-1.414l-.707.707c-4.541 4.54-5.02 11.605-1.44 16.678H.499v2h5.7V15.5h-2v2.1C.958 13.29 1.3 7.144 5.222 3.222m2.752 1.416a2.26 2.26 0 0 0-.827 3.087l4.032 6.983l-2.583.88c-.719.246-1.22.9-1.268 1.658l-.11 1.71l6.518 2.692c.792.327 1.69.268 2.431-.16l6.137-3.543a2.76 2.76 0 0 0 1.322-2.94l-1.132-5.526a2.76 2.76 0 0 0-2.687-2.203l-4.197-.02a2.76 2.76 0 0 0-1.392.37l-1.432.826l-1.725-2.987a2.26 2.26 0 0 0-3.087-.827" /></svg>
                      <p class="flex justify-between text-center items-center w-full flex-col  gap-2">
                        <code class="break-words">Slide down on toolbar</code> Shows command bar
                      </p>
                    </li>
                  </ul>
                </template>
              </article>
            </template>
          </ScrollAreaViewport>
          <ScrollAreaScrollbar
            class="flex select-none touch-none p-0.5 bg-secondary ease-out hover:bg-background data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
            orientation="vertical"
          >
            <ScrollAreaThumb
              class="flex-1 bg-primary rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
            />
          </ScrollAreaScrollbar>
        </ScrollAreaRoot>
        <DialogClose
          class="absolute inline-flex items-center justify-center appearance-none top-4 text-foreground hover:bg-secondary/80 right-3 size-7 focus:shadow-sm focus:outline-hidden focus-visible:ring-1 focus-visible:ring-primary focus-visible:text-primary"
        >
          <X />
          <span class="sr-only">{{ t("verb.close") }}</span>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
@reference "@/assets/main.css";

code {
  @apply bg-primary/20 break-all px-1 mx-0.5 rounded py-0.5 text-foreground ring-1 ring-primary/30 font-light text-sm;
}

code::after,
code::before {
  display: none;
}
</style>
