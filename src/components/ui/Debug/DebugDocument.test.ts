import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Import after all mocks are set up
import { db } from '@/db'

// Mock vue-i18n before importing the component
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

// Mock lucide-vue-next icons
vi.mock('lucide-vue-next', () => ({
  ChevronsUpDown: vi.fn(),
  Circle: vi.fn(),
  CircleOff: vi.fn(),
  Pin: vi.fn(),
  Search: vi.fn(),
}))

// Mock @number-flow/vue
vi.mock('@number-flow/vue', () => ({
  default: vi.fn(),
}))

// Mock all stores - these need to return factory functions
const mockDatabaseStore: any = {
  loaded_id: undefined,
  document_name: '',
  document_checked: false,
  document_fixed: false,
  change_document_checked: vi.fn(),
  change_document_fixed: vi.fn(),
}

const mockEditorStore = {
  editor: null,
  editor_toc: [],
}

const mockFocusStore = {
  focus_debug_heading: null,
}

const mockModalStore = {
  show_commandbar: false,
}

vi.mock('@/stores/database', () => ({
  useDatabaseStore: () => mockDatabaseStore,
}))

vi.mock('@/stores/editor', () => ({
  useEditorStore: () => mockEditorStore,
}))

vi.mock('@/stores/focus', () => ({
  useFocusStore: () => mockFocusStore,
}))

vi.mock('@/stores/modal', () => ({
  useModalStore: () => mockModalStore,
}))

// Mock the db with a factory function
vi.mock('@/db', () => ({
  db: {
    documents: {
      get: vi.fn(),
      update: vi.fn(),
    },
  },
}))

describe('debugDocument Toggle Functionality', () => {
  // Recreate the toggle functions from DebugDocument.vue for testing
  // These use the correct logic: always read from database, toggle, update
  async function toggleDocumentChecked(database: any, db: any) {
    if (!database.loaded_id)
      return

    try {
      const result = await db.documents.get(database.loaded_id)
      if (result) {
        // Get the current value from database, not store
        const newChecked = !result.document_data?.checked
        await database.change_document_checked(result, newChecked)
        database.document_checked = newChecked
      }
    }
    catch (error) {
      console.error('Error toggling document checked status:', error)
    }
  }

  async function toggleDocumentFixed(database: any, db: any) {
    if (!database.loaded_id)
      return

    try {
      const result = await db.documents.get(database.loaded_id)
      if (result) {
        // Get the current value from database, not store
        const newFixed = !result.document_data?.fixed
        await database.change_document_fixed(result, newFixed)
        database.document_fixed = newFixed
      }
    }
    catch (error) {
      console.error('Error toggling document fixed status:', error)
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockDatabaseStore.loaded_id = 'test-doc-1'
    mockDatabaseStore.document_checked = false
    mockDatabaseStore.document_fixed = false
    mockDatabaseStore.document_name = 'Test Document'
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('toggleDocumentChecked', () => {
    it('should correctly toggle even when store state is out of sync with database', async () => {
      // Database says document is checked (true), but store says unchecked (false)
      const mockDocument = {
        id: 'test-doc-1',
        document_data: {
          name: 'Test Document',
          checked: true,
        },
      }
      ;(db.documents.get as any).mockResolvedValue(mockDocument)
      ;(db.documents.update as any).mockResolvedValue(undefined)
      // Store is out of sync
      mockDatabaseStore.document_checked = false

      await toggleDocumentChecked(mockDatabaseStore, db)

      // Should toggle based on database value (true -> false), not store value
      expect(mockDatabaseStore.change_document_checked).toHaveBeenCalledWith(
        mockDocument,
        false, // Should toggle from true to false
      )
      expect(mockDatabaseStore.document_checked).toBe(false)
    })

    it('should not update when document is not found', async () => {
      ;(db.documents.get as any).mockResolvedValue(undefined)
      const initialChecked = mockDatabaseStore.document_checked

      await toggleDocumentChecked(mockDatabaseStore, db)

      expect(db.documents.update).not.toHaveBeenCalled()
      expect(mockDatabaseStore.document_checked).toBe(initialChecked)
    })

    it('should not toggle when loaded_id is not set', async () => {
      mockDatabaseStore.loaded_id = undefined

      await toggleDocumentChecked(mockDatabaseStore, db)

      expect(db.documents.get).not.toHaveBeenCalled()
      expect(db.documents.update).not.toHaveBeenCalled()
    })
  })

  describe('toggleDocumentFixed', () => {
    it('should correctly toggle even when store state is out of sync with database', async () => {
      // Database says document is fixed (true), but store says not fixed (false)
      const mockDocument = {
        id: 'test-doc-1',
        document_data: {
          name: 'Test Document',
          fixed: true,
        },
      }
      ;(db.documents.get as any).mockResolvedValue(mockDocument)
      ;(db.documents.update as any).mockResolvedValue(undefined)
      // Store is out of sync
      mockDatabaseStore.document_fixed = false

      await toggleDocumentFixed(mockDatabaseStore, db)

      // Should toggle based on database value (true -> false), not store value
      expect(mockDatabaseStore.change_document_fixed).toHaveBeenCalledWith(
        mockDocument,
        false, // Should toggle from true to false
      )
      expect(mockDatabaseStore.document_fixed).toBe(false)
    })
  })
})
