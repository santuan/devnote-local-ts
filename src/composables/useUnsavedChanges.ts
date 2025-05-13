import { useDatabaseStore } from '@/stores/database'

export function useUnsavedChanges() {
  const database = useDatabaseStore()

  const hasUnsavedChanges = () => {
    if (database.document_body === '<p></p>') {
      return false
    }
    return (
      database.loaded_id === '' // If no document is loaded
      && database.document_body !== '' // If project body is marked as dirty
    )
  }

  return {
    hasUnsavedChanges,
  }
}
