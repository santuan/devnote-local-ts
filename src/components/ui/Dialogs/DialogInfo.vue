<script setup lang="ts">
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
import Tooltip from '@/components/ui/Tooltip.vue'
import { useIsMobile } from '@/composables/useIsMobile'
import { useModalStore } from '@/stores/modal'

const { isMobile } = useIsMobile()

const modal = useModalStore()
const { t, locale } = useI18n()
</script>

<template>
  <DialogRoot v-model:open="modal.show_info">
    <Tooltip :name="t('sidebar.about')" side="bottom">
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
        class="font-mono fixed top-6 md:top-[50%] left-[50%] border border-secondary max-h-[85vh] w-[90vw] max-w-[850px] translate-x-[-50%] md:translate-y-[-50%] bg-background rounded p-4 focus:outline-hidden z-99"
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
                  class="inline-block p-3 mt-3 mb-3 text-sm leading-relaxed rounded text-foreground border border-primary"
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
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl M</code> Colapsar el menú
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt N</code> Crear nuevo documento
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt P</code> Alternar entre modo editar o previsualizar
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt O</code> Activar barra de comandos para navegar documentos
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Shift Delete</code> Eliminar documento en curso
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift +</code> Incrementar tamaño app. Solo teclado númerico
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift -</code> Disminuir tamaño app. Solo teclado númerico
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt .</code> Expande el editor de texto a todo el ancho
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt S</code> Mostrar configuraciones
                      </p>
                    </li>

                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt T</code> Mostrar u ocultar barra de herramientas
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt G</code> Saltar a la barra de herramientas
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Ctrl Shift Alt &larr;</code> Saltar al menú
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Ctrl Shift Alt &rarr;</code> Saltar al
                        titulo actual
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                      >
                        <!-- Icon from TDesign Icons by TDesign - https://github.com/Tencent/tdesign-icons/blob/main/LICENSE -->
                        <path
                          fill="currentColor"
                          d="m5.222 3.222l.707-.707l-1.414-1.414l-.707.707c-4.541 4.54-5.02 11.605-1.44 16.678H.499v2h5.7V15.5h-2v2.1C.958 13.29 1.3 7.144 5.222 3.222m2.752 1.416a2.26 2.26 0 0 0-.827 3.087l4.032 6.983l-2.583.88c-.719.246-1.22.9-1.268 1.658l-.11 1.71l6.518 2.692c.792.327 1.69.268 2.431-.16l6.137-3.543a2.76 2.76 0 0 0 1.322-2.94l-1.132-5.526a2.76 2.76 0 0 0-2.687-2.203l-4.197-.02a2.76 2.76 0 0 0-1.392.37l-1.432.826l-1.725-2.987a2.26 2.26 0 0 0-3.087-.827"
                        />
                      </svg>
                      <p
                        class="flex justify-between text-center items-center w-full flex-col gap-2"
                      >
                        <code class="break-words">Deslizar hacia abajo en barra de herramientas</code>
                        Muestra barra de comandos.
                      </p>
                    </li>
                  </ul>
                </template>
              </article>
            </template>
            <template v-else-if="locale === 'de'">
              <article
                class="max-w-full p-3 mx-auto prose prose-ul:list-none prose-ul:pl-0 dark:prose-invert"
              >
                <DialogDescription
                  class="inline-block p-3 mt-3 mb-3 text-sm leading-relaxed rounded text-foreground border border-primary"
                >
                  Dies ist eine Beta-Version; verwenden Sie sie nur zu Testzwecken. Derzeit wird
                  die Anpassung an die gute Zusammenarbeit mit
                  <a href="https://nvda.es/">NVDA</a> vorgenommen.
                </DialogDescription>
                <p class="mt-3 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  Diese Anwendung verwendet die
                  <a
                    href="https://developer.mozilla.org/en/docs/Web/API/IndexedDB_API/Using_IndexedDB"
                    class="underline underline-offset-2"
                  >IndexedDB</a>-Technologie in Browsern, um Daten zu speichern. Diese Daten werden in der
                  Sitzung dieses Browsers gespeichert (sie gehen beim Löschen der Browserdaten
                  verloren).
                </p>
                <p class="mt-2 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  Sie können die IndexedDB im JSON-Format exportieren und importieren, um die
                  Datenbank lokal zu halten.
                </p>
                <template v-if="!isMobile">
                  <h3 class="text-lg">
                    Tastaturkürzel
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg M</code> Menü einklappen
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg Alt N</code> Neues Dokument erstellen
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg Alt P</code> Zwischen Bearbeitungs- oder Vorschau-Modus
                        wechseln
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg Alt O</code> Befehlsleiste zum Navigieren von Dokumenten
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Umschalt Entf</code> Aktuelles Dokument löschen
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Strg Umschalt &uarr;</code> Vorheriges
                        Dokument auswählen.
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Strg Umschalt &darr;</code> Nächstes
                        Dokument auswählen.
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg Umschalt +</code> App-Größe erhöhen. Nur Ziffernblock
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg Umschalt -</code> App-Größe verringern. Nur Ziffernblock
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg Umschalt Alt .</code> Bearbeitungsbereich erweitern/einklappen
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg Umschalt Alt S</code> Einstellungen anzeigen
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg Umschalt Alt T</code> Symbolleiste ein-/ausblenden
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg Umschalt Alt G</code> Fokus auf Symbolleiste
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Strg Umschalt Alt &larr;</code> Fokus auf
                        Seitenleiste
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Strg Umschalt Alt &rarr;</code> Fokus auf
                        Titel
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Strg Umschalt Alt U</code> Fokus auf Editor
                      </p>
                    </li>
                  </ul>
                </template>
                <template v-if="isMobile">
                  <h3 class="text-lg text-center">
                    Mobile Verknüpfung
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0 flex justify-center flex-col items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                      >
                        <!-- Icon from TDesign Icons by TDesign - https://github.com/Tencent/tdesign-icons/blob/main/LICENSE -->
                        <path
                          fill="currentColor"
                          d="m5.222 3.222l.707-.707l-1.414-1.414l-.707.707c-4.541 4.54-5.02 11.605-1.44 16.678H.499v2h5.7V15.5h-2v2.1C.958 13.29 1.3 7.144 5.222 3.222m2.752 1.416a2.26 2.26 0 0 0-.827 3.087l4.032 6.983l-2.583.88c-.719.246-1.22.9-1.268 1.658l-.11 1.71l6.518 2.692c.792.327 1.69.268 2.431-.16l6.137-3.543a2.76 2.76 0 0 0 1.322-2.94l-1.132-5.526a2.76 2.76 0 0 0-2.687-2.203l-4.197-.02a2.76 2.76 0 0 0-1.392.37l-1.432.826l-1.725-2.987a2.26 2.26 0 0 0-3.087-.827"
                        />
                      </svg>
                      <p
                        class="flex justify-between text-center items-center w-full flex-col gap-2"
                      >
                        <code class="break-words">Auf der Symbolleiste nach unten wischen</code>
                        Zeigt die Befehlsleiste an
                      </p>
                    </li>
                  </ul>
                </template>
              </article>
            </template>
            <template v-else-if="locale === 'fr'">
              <article
                class="max-w-full p-3 mx-auto prose prose-ul:list-none prose-ul:pl-0 dark:prose-invert"
              >
                <DialogDescription
                  class="inline-block p-3 mt-3 mb-3 text-sm leading-relaxed rounded text-foreground border border-primary"
                >
                  Ceci est une version bêta; utilisez-la uniquement à des fins de test.
                  Actuellement en cours d'adaptation pour bien fonctionner avec
                  <a href="https://nvda.es/">NVDA</a>.
                </DialogDescription>
                <p class="mt-3 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  Cette application utilise la technologie
                  <a
                    href="https://developer.mozilla.org/en/docs/Web/API/IndexedDB_API/Using_IndexedDB"
                    class="underline underline-offset-2"
                  >IndexedDB</a>
                  dans les navigateurs pour stocker des données. Ces données sont enregistrées dans
                  la session de ce navigateur (elles seront perdues lors de l'effacement des
                  données du navigateur).
                </p>
                <p class="mt-2 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  Vous pouvez exporter et importer la IndexedDB au format JSON pour conserver la
                  base de données localement.
                </p>
                <template v-if="!isMobile">
                  <h3 class="text-lg">
                    Raccourcis clavier
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl M</code> Réduire le menu
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt N</code> Créer un nouveau document
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt P</code> Basculer entre le mode édition et prévisualisation
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt O</code> Barre de commande pour naviguer dans les documents
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Shift Suppr</code> Supprimer le document actuel
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift +</code> Augmenter la taille de l'application. Pavé
                        numérique uniquement
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift -</code> Diminuer la taille de l'application. Pavé
                        numérique uniquement
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt .</code> Développer/Réduire la zone d'édition
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt S</code> Afficher les paramètres
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt T</code> Afficher/Masquer la barre d'outils
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt G</code> Focus sur la barre d'outils
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Ctrl Shift Alt &larr;</code> Focus sur la
                        barre latérale
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Ctrl Shift Alt &rarr;</code> Focus sur le
                        titre
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt U</code> Focus sur l'éditeur
                      </p>
                    </li>
                  </ul>
                </template>
                <template v-if="isMobile">
                  <h3 class="text-lg text-center">
                    Raccourcis mobiles
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0 flex justify-center flex-col items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                      >
                        <!-- Icon from TDesign Icons by TDesign - https://github.com/Tencent/tdesign-icons/blob/main/LICENSE -->
                        <path
                          fill="currentColor"
                          d="m5.222 3.222l.707-.707l-1.414-1.414l-.707.707c-4.541 4.54-5.02 11.605-1.44 16.678H.499v2h5.7V15.5h-2v2.1C.958 13.29 1.3 7.144 5.222 3.222m2.752 1.416a2.26 2.26 0 0 0-.827 3.087l4.032 6.983l-2.583.88c-.719.246-1.22.9-1.268 1.658l-.11 1.71l6.518 2.692c.792.327 1.69.268 2.431-.16l6.137-3.543a2.76 2.76 0 0 0 1.322-2.94l-1.132-5.526a2.76 2.76 0 0 0-2.687-2.203l-4.197-.02a2.76 2.76 0 0 0-1.392.37l-1.432.826l-1.725-2.987a2.26 2.26 0 0 0-3.087-.827"
                        />
                      </svg>
                      <p
                        class="flex justify-between text-center items-center w-full flex-col gap-2"
                      >
                        <code class="break-words">Glisser vers le bas sur la barre d'outils</code>
                        Affiche la barre de commande
                      </p>
                    </li>
                  </ul>
                </template>
              </article>
            </template>
            <template v-else-if="locale === 'ja'">
              <article
                class="max-w-full p-3 mx-auto prose prose-ul:list-none prose-ul:pl-0 dark:prose-invert"
              >
                <DialogDescription
                  class="inline-block p-3 mt-3 mb-3 text-sm leading-relaxed rounded text-foreground border border-primary"
                >
                  これはベータ版です。テスト目的でのみ使用してください。現在、<a href="https://nvda.es/">NVDA</a>との良好な連携に向けて調整中です。
                </DialogDescription>
                <p class="mt-3 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  このアプリケーションはブラウザ内の
                  <a
                    href="https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API/Using_IndexedDB"
                    class="underline underline-offset-2"
                  >IndexedDB</a>
                  技術を使用してデータを保存します。これらのデータはそのブラウザのセッションに保存されます（ブラウザのデータを消去すると失われます）。
                </p>
                <p class="mt-2 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  IndexedDBをJSON形式でエクスポートおよびインポートして、ローカルにデータベースを保持できます。
                </p>
                <template v-if="!isMobile">
                  <h3 class="text-lg">
                    キーボードショートカット
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl M</code> メニューを折りたたむ
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt N</code> 新しいドキュメントを作成
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt P</code> 編集モードとプレビューモードを切り替え
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt O</code> ドキュメントをナビゲートするコマンドバー
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Shift Delete</code> 現在のドキュメントを削除
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift +</code> アプリのサイズを拡大（テンキーのみ）
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift -</code> アプリのサイズを縮小（テンキーのみ）
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt .</code> 編集エリアを展開/折りたたみ
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt S</code> 設定を表示
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt T</code> ツールバーの表示/非表示
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt G</code> ツールバーにフォーカス
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Ctrl Shift Alt &larr;</code> サイドバーにフォーカス
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Ctrl Shift Alt &rarr;</code> タイトルにフォーカス
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt U</code> エディターにフォーカス
                      </p>
                    </li>
                  </ul>
                </template>
                <template v-if="isMobile">
                  <h3 class="text-lg text-center">
                    モバイルショートカット
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0 flex justify-center flex-col items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="m5.222 3.222l.707-.707l-1.414-1.414l-.707.707c-4.541 4.54-5.02 11.605-1.44 16.678H.499v2h5.7V15.5h-2v2.1C.958 13.29 1.3 7.144 5.222 3.222m2.752 1.416a2.26 2.26 0 0 0-.827 3.087l4.032 6.983l-2.583.88c-.719.246-1.22.9-1.268 1.658l-.11 1.71l6.518 2.692c.792.327 1.69.268 2.431-.16l6.137-3.543a2.76 2.76 0 0 0 1.322-2.94l-1.132-5.526a2.76 2.76 0 0 0-2.687-2.203l-4.197-.02a2.76 2.76 0 0 0-1.392.37l-1.432.826l-1.725-2.987a2.26 2.26 0 0 0-3.087-.827"
                        />
                      </svg>
                      <p
                        class="flex justify-between text-center items-center w-full flex-col gap-2"
                      >
                        <code class="break-words">ツールバーを下にスライド</code> コマンドバーを表示
                      </p>
                    </li>
                  </ul>
                </template>
              </article>
            </template>
            <template v-else-if="locale === 'ru'">
              <article
                class="max-w-full p-3 mx-auto prose prose-ul:list-none prose-ul:pl-0 dark:prose-invert"
              >
                <DialogDescription
                  class="inline-block p-3 mt-3 mb-3 text-sm leading-relaxed rounded text-foreground border border-primary"
                >
                  Это бета-версия; используйте её только для тестирования. В настоящее время ведётся адаптация для хорошей работы с <a href="https://nvda.es/">NVDA</a>.
                </DialogDescription>
                <p class="mt-3 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  Это приложение использует технологию
                  <a
                    href="https://developer.mozilla.org/ru/docs/Web/API/IndexedDB_API/Using_IndexedDB"
                    class="underline underline-offset-2"
                  >IndexedDB</a>
                  в браузерах для хранения данных. Эти данные сохраняются в сессии данного браузера (они будут потеряны при очистке данных браузера).
                </p>
                <p class="mt-2 mb-5 text-sm leading-relaxed text-foreground select-text!">
                  Вы можете экспортировать и импортировать IndexedDB в формате JSON, чтобы хранить базу данных локально.
                </p>
                <template v-if="!isMobile">
                  <h3 class="text-lg">
                    Горячие клавиши
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl M</code> Свернуть меню
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt N</code> Создать новый документ
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt P</code> Переключить режим редактирования или предварительного просмотра
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt O</code> Панель команд для навигации по документам
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Shift Delete</code> Удалить текущий документ
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift +</code> Увеличить размер приложения (только цифровая клавиатура)
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift -</code> Уменьшить размер приложения (только цифровая клавиатура)
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt .</code> Развернуть/свернуть область редактирования
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt S</code> Показать настройки
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt T</code> Показать/скрыть панель инструментов
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt G</code> Фокус на панели инструментов
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Ctrl Shift Alt &larr;</code> Фокус на боковой панели
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Ctrl Shift Alt &rarr;</code> Фокус на заголовке
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt U</code> Фокус на редакторе
                      </p>
                    </li>
                  </ul>
                </template>
                <template v-if="isMobile">
                  <h3 class="text-lg text-center">
                    Мобильные ярлыки
                  </h3>
                  <ul class="text-sm divide-y-[0.1125rem] pl-0 divide-secondary">
                    <li class="pl-0 flex justify-center flex-col items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="m5.222 3.222l.707-.707l-1.414-1.414l-.707.707c-4.541 4.54-5.02 11.605-1.44 16.678H.499v2h5.7V15.5h-2v2.1C.958 13.29 1.3 7.144 5.222 3.222m2.752 1.416a2.26 2.26 0 0 0-.827 3.087l4.032 6.983l-2.583.88c-.719.246-1.22.9-1.268 1.658l-.11 1.71l6.518 2.692c.792.327 1.69.268 2.431-.16l6.137-3.543a2.76 2.76 0 0 0 1.322-2.94l-1.132-5.526a2.76 2.76 0 0 0-2.687-2.203l-4.197-.02a2.76 2.76 0 0 0-1.392.37l-1.432.826l-1.725-2.987a2.26 2.26 0 0 0-3.087-.827"
                        />
                      </svg>
                      <p
                        class="flex justify-between text-center items-center w-full flex-col gap-2"
                      >
                        <code class="break-words">Сдвиньте вниз по панели инструментов</code> Показать панель команд
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
                  class="inline-block p-3 mt-3 mb-3 text-sm leading-relaxed rounded text-foreground border border-primary"
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
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl M</code> Collapse menu
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt N</code> Create new document
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt P</code> Toggle between edit or preview mode
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Alt O</code> Command bar to navigate documents
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Shift Delete</code> Delete current document
                      </p>
                    </li>

                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift +</code> Increase App size. Numbpad only
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift -</code> Decrease App size. Numbpad only
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt .</code> Expand/Collapse the editing area
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt S</code> Show settings
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt T</code> Toogle toolbar
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code>Ctrl Shift Alt G</code> Focus on toolbar
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Ctrl Shift Alt &larr;</code> Focus on
                        sidebar
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
                        <code class="inline-flex gap-1">Ctrl Shift Alt &rarr;</code> Focus on title
                      </p>
                    </li>
                    <li class="pl-0">
                      <p
                        class="flex justify-between items-center w-full flex-col sm:flex-row-reverse gap-2"
                      >
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                      >
                        <!-- Icon from TDesign Icons by TDesign - https://github.com/Tencent/tdesign-icons/blob/main/LICENSE -->
                        <path
                          fill="currentColor"
                          d="m5.222 3.222l.707-.707l-1.414-1.414l-.707.707c-4.541 4.54-5.02 11.605-1.44 16.678H.499v2h5.7V15.5h-2v2.1C.958 13.29 1.3 7.144 5.222 3.222m2.752 1.416a2.26 2.26 0 0 0-.827 3.087l4.032 6.983l-2.583.88c-.719.246-1.22.9-1.268 1.658l-.11 1.71l6.518 2.692c.792.327 1.69.268 2.431-.16l6.137-3.543a2.76 2.76 0 0 0 1.322-2.94l-1.132-5.526a2.76 2.76 0 0 0-2.687-2.203l-4.197-.02a2.76 2.76 0 0 0-1.392.37l-1.432.826l-1.725-2.987a2.26 2.26 0 0 0-3.087-.827"
                        />
                      </svg>
                      <p
                        class="flex justify-between text-center items-center w-full flex-col gap-2"
                      >
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
  @apply border border-primary break-all px-1 mx-0.5 rounded py-0.5 text-foreground ring-1 ring-primary/30 font-light text-sm;
}

code::after,
code::before {
  display: none;
}
</style>
