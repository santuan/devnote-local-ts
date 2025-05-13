import type { EntityTable } from 'dexie'
import Dexie from 'dexie'

interface Filename {
  id?: string
  date?: string
  name?: string | undefined | null
}

interface Documents {
  id?: string
  date?: string
  document_data?: DocumentData
}

interface DocumentData {
  name?: string
  body?: string
  checked?: boolean
  fixed?: boolean
  date_created?: string
}

const db = new Dexie('DB') as Dexie & {
  filename: EntityTable<Filename, 'id'>
  documents: EntityTable<Documents, 'id'>
}

db.version(1).stores({
  filename: '++id, date, name',
  documents: '++id, date',
})

export type { DocumentData, Documents }
export { db }
