import type { Documents } from '@/db'
import { useStorage } from '@vueuse/core'
import { exportDB } from 'dexie-export-import'
import { defineStore } from 'pinia'

import { computed, ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import { allItemsTodo } from '@/composables/queries'
import { useUnsavedChanges } from '@/composables/useUnsavedChanges'
import { db } from '@/db'
import { useDocumentStore } from '@/stores/document'
import { useModalStore } from '@/stores/modal'
import { useSettingsStore } from './settings'

export const useDatabaseStore = defineStore('database', () => {
  const { t } = useI18n()
  const show_last_open = useStorage('show_last_open', '')
  const { hasUnsavedChanges } = useUnsavedChanges()
  const document_store = useDocumentStore()
  const settings = useSettingsStore()
  const modal = useModalStore()
  const loaded_db_key = ref<string | undefined>()
  const status = ref<'LOADING' | 'READY' | 'CREATING' | 'CHANGING' | 'ERROR'>('LOADING')
  const file_name = shallowRef<string | undefined | null>('')
  const select_id = shallowRef<string | undefined>('')
  const loaded_id = shallowRef<string | undefined>('')
  const document_name = shallowRef<string | undefined>('')
  const document_body = shallowRef<string | undefined>('')
  const document_checked = shallowRef<boolean | undefined>(false)
  const document_fixed = shallowRef<boolean | undefined>(false)
  const document_date_created = shallowRef<string | undefined>('')
  const sortOption = useStorage('sortItemsBy', 'name')

  async function create_document() {
    if (document_name.value === '') {
      toast.error('Can\'t create document without title')
      return
    }
    status.value = 'CHANGING'
    try {
      const new_date = new Date().toISOString()
      const new_document_id = await db.documents.add({
        date: new_date,
        document_data: {
          body: document_body.value,
          name: document_name.value,
          checked: false,
          date_created: new_date,
        },
      })
      loaded_id.value = new_document_id
      document_date_created.value = new_date
      show_last_open.value = new_document_id
      toast.success(`document created with title: ${document_name.value}`)
    }
    catch (error) {
      handle_error('Error al crear el proyecto', error)
    }
    status.value = 'READY'
  }

  async function update_document() {
    if (!loaded_id.value || status.value !== 'READY')
      return
    try {
      await db.documents.update(loaded_id.value, {
        date: new Date().toISOString(),
        document_data: {
          body: document_body.value,
          name: document_name.value,
          checked: document_checked.value,
          fixed: document_fixed.value,
          date_created: document_date_created.value,
        },
      })
    }
    catch (error) {
      handle_error('Error al actualizar el proyecto', error)
    }
  }

  async function change_document_checked(item: Documents, isChecked: any) {
    try {
      await db.documents.update(item.id, {
        date: new Date().toISOString(),
        document_data: {
          body: item.document_data?.body,
          name: item.document_data?.name,
          checked: isChecked,
          fixed: item.document_data?.fixed,
          date_created: item.document_data?.date_created,
        },
      })

      toast(
        isChecked
          ? `"${item.document_data?.name}" ${t('message.completed')}`
          : `"${item.document_data?.name}" ${t('message.unmarked')}`,
      )
      if (isChecked) {
        if (item.id === select_id.value) {
          document_store.clear_editor()
        }
      }
    }
    catch (error) {
      handle_error('Error al marcar el proyecto', error)
    }
  }

  async function change_document_fixed(item: any, isFixed: any) {
    try {
      await db.documents.update(item.id, {
        date: new Date().toISOString(),
        document_data: {
          body: item.document_data.body,
          name: item.document_data.name,
          checked: item.document_data.checked,
          fixed: !isFixed,
          date_created: item.document_data?.date_created,
        },
      })
    }
    catch (error) {
      handle_error('Error al marcar el proyecto', error)
    }
  }

  async function set_document(id: any) {
    const set_id = id || undefined
    if (set_id === loaded_id.value)
      return
    status.value = 'CHANGING'

    try {
      const document = await db.documents.get(set_id)
      if (document) {
        document_body.value = document.document_data?.body
        document_name.value = document.document_data?.name
        document_checked.value = document.document_data?.checked
        document_fixed.value = document.document_data?.fixed
        if (document.document_data?.date_created === undefined) {
          document_date_created.value = document.date
        }
        else {
          document_date_created.value = document.document_data?.date_created
        }
      }
      else {
        document_store.clear_editor()
        console.error('Selected document not found')
      }
      loaded_id.value = set_id
      show_last_open.value = set_id
    }
    catch (error) {
      handle_error('Error al seleccionar el proyecto', error)
    }
    status.value = 'READY'
  }

  async function delete_document() {
    try {
      await db.documents.delete(loaded_id.value)
      document_store.clear_editor()

      // After deleting, try to load the first available document
      const firstDoc = await db.documents.orderBy('date').first()
      if (firstDoc) {
        set_document(firstDoc.id)
      }
    }
    catch (error) {
      handle_error('Error al eliminar el proyecto', error)
    }
  }

  function auto_save() {
    if (document_name.value === '')
      return
    if (status.value !== 'READY')
      return
    update_document()
  }

  async function clear_database() {
    await db.documents.clear()
    await db.filename.clear()
    file_name.value = null
    document_store.clear_editor()
  }

  async function init_database() {
    try {
      const count = await db.filename.count()
      if (count === 0) {
        await db.filename.add({
          name: file_name.value,
        })
        const dbFile = await db.filename.toArray()
        loaded_db_key.value = dbFile[0].id
      }
      else {
        // Get existing DB name and set it as file_name
        const dbFile = await db.filename.toArray()
        loaded_db_key.value = dbFile[0].id
        if (dbFile && dbFile[0].name) {
          file_name.value = dbFile[0].name
        }
      }
      if (show_last_open.value !== '') {
        set_document(Number(show_last_open.value))
      }
    }
    catch (error) {
      handle_error('Error al configurar la base de datos', error)
    }
    status.value = 'READY'
  }

  async function export_database(filename: any) {
    try {
      await db.open()
      const blob = await exportDB(db)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename || file_name.value}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      return blob
    }
    catch (error) {
      toast.error('Error al exportar la base de datos')
      handle_error('Error al exportar la base de datos', error)
    }
  }

  async function import_database(file: any) {
    const replace_file_name = file.name.replace('.json', '')

    try {
    // Create a backup of the current database before attempting import
      const backup = await db.export()

      try {
      // Clear and import the new data
        await db.import(file, {
          clearTablesBeforeImport: true,
          acceptMissingTables: true,
          acceptVersionDiff: true,
          acceptNameDiff: true,
          overwriteValues: true,
        })

        // If we reach here, import was successful
        update_database(replace_file_name)
        document_store.clear_editor()
        toast.success(t('message.databaseImported'))
        modal.show_import_db = false
      }
      catch (importError) {
      // Import failed, restore from backup

        await db.import(backup, {
          clearTablesBeforeImport: true,
          acceptMissingTables: true,
          acceptVersionDiff: true,
          acceptNameDiff: true,
          overwriteValues: true,
        })

        // Re-throw the original import error
        throw importError
      }
    }
    catch (error) {
      toast.error('Error al importar la base de datos')
      handle_error('Error al importar la base de datos', error)
    }
  }

  async function update_database(name: any) {
    try {
      file_name.value = name
      await db.filename.update(loaded_db_key.value, {
        name,
      })
    }
    catch (error) {
      handle_error('Error al actualizar la base de datos', error)
    }
  }

  const results = computed(() => {
    if (!Array.isArray(allItemsTodo.value)) {
      return []
    }

    let filteredItems = [...allItemsTodo.value]
    if (settings.show_favorites) {
      filteredItems = filteredItems.filter(
        item => item.document_data?.fixed === true,
      )
    }

    // Then sort the filtered items
    const sortedItems = filteredItems.sort((a: any, b: any) => {
      const aFixed = a.document_data?.fixed ?? false
      const bFixed = b.document_data?.fixed ?? false

      // Keep favorite items at the top
      if (aFixed !== bFixed) {
        return aFixed ? -1 : 1 // Fixed items come first
      }

      // Sorting logic based on sortOption
      if (sortOption.value === 'name_asc') {
      // Handle potential null or undefined names
        const nameA = a.document_data?.name || ''
        const nameB = b.document_data?.name || ''
        return nameA.localeCompare(nameB)
      }
      if (sortOption.value === 'name_desc') {
      // Handle potential null or undefined names
        const nameA = a.document_data?.name || ''
        const nameB = b.document_data?.name || ''
        return nameB.localeCompare(nameA)
      }
      if (sortOption.value === 'date_asc') {
      // Convert date strings to Date objects for comparison
        const dateA = a.document_data?.date_created
          ? new Date(a.document_data.date_created)
          : null
        const dateB = b.document_data?.date_created
          ? new Date(b.document_data.date_created)
          : null

        // Handle cases where dates might be missing
        if (!dateA && !dateB)
          return 0
        if (!dateA)
          return 1 // b comes first if a has no date
        if (!dateB)
          return -1 // a comes first if b has no date

        return dateA.getTime() - dateB.getTime() // Compare timestamps
      }
      if (sortOption.value === 'date_desc') {
      // Convert date strings to Date objects for comparison
        const dateA = a.document_data?.date_created
          ? new Date(a.document_data.date_created)
          : null
        const dateB = b.document_data?.date_created
          ? new Date(b.document_data.date_created)
          : null

        // Handle cases where dates might be missing
        if (!dateA && !dateB)
          return 0
        if (!dateA)
          return 1 // b comes first if a has no date
        if (!dateB)
          return -1 // a comes first if b has no date

        return dateB.getTime() - dateA.getTime() // Compare timestamps
      }

      // If no sorting option is matched, maintain original order (or apply another default)
      return 0
    })

    return sortedItems
  })

  async function navigate_document(direction: 'prev' | 'next') {
    if (!results.value || results.value.length <= 1)
      return

    const currentIndex = results.value.findIndex(item => item.id === loaded_id.value)
    let nextIndex

    if (direction === 'next') {
      nextIndex = currentIndex + 1
      if (nextIndex >= results.value.length) {
        nextIndex = 0 // Loop back to start
      }
    }
    else {
      nextIndex = currentIndex - 1
      if (nextIndex < 0) {
        nextIndex = results.value.length - 1 // Loop to end
      }
    }

    const nextDoc = results.value[nextIndex]
    if (nextDoc) {
      if (hasUnsavedChanges()) {
        select_id.value = nextDoc.id
        modal.show_alert_unsaved_changes = true
        return
      }
      set_document(nextDoc.id)
    }
  }

  function handle_error(message: string, error: unknown) {
    console.error(message, error)
    status.value = 'ERROR'
  }

  return {
    auto_save,
    change_document_checked,
    change_document_fixed,
    clear_database,
    create_document,
    delete_document,
    loaded_id,
    init_database,
    export_database,
    import_database,
    navigate_document,
    update_database,
    document_body,
    document_checked,
    document_fixed,
    document_name,
    select_id,
    file_name,
    set_document,
    results,
    status,
    update_document,
  }
})
