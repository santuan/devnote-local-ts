import type { Ref } from 'vue'
import type { Documents } from '@/db'
import { useObservable } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'
import { from } from 'rxjs'
import { db } from '@/db'

// Convert Dexie's liveQuery to an rxjs Observable using 'from'
export const allItemsTodo = useObservable(
  from(
    liveQuery(() =>
      db.documents
        .reverse()
        .toArray()
        .then(items => items.filter(item => !item.document_data?.checked)),
    ),
  ),
) as Ref<Documents[] | undefined>

export const allItemsTodoFixed = useObservable(
  from(
    liveQuery(() =>
      db.documents
        .reverse()
        .toArray()
        .then(items => items.filter(item => !item.document_data?.checked && item.document_data?.fixed)),
    ),
  ),
) as Ref<Documents[] | undefined>

export const allItemsChecked = useObservable(
  from(
    liveQuery(() =>
      db.documents
        .toArray()
        .then(items => items.filter(item => item.document_data?.checked)),
    ),
  ),
) as Ref<Documents[] | any | undefined>
