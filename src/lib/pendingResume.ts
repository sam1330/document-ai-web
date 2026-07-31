/**
 * Holds the PDF a visitor graded on the landing page so it survives the trip
 * through /register or /login and can be uploaded once they have a token.
 *
 * IndexedDB rather than sessionStorage: the grader accepts files up to 10MB and
 * base64 in web storage would blow the quota. Every helper degrades to a no-op
 * when IndexedDB is unavailable (SSR, private mode) — the funnel then just asks
 * the user to upload the file again on /resumes.
 */

const DB_NAME = 'haku'
const STORE_NAME = 'pending'
const RECORD_KEY = 'resume'
const MAX_AGE_MS = 60 * 60 * 1000 // 1 hour

interface PendingRecord {
  file: File
  createdAt: number
}

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null)
      return
    }
    try {
      const request = indexedDB.open(DB_NAME, 1)
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) {
          request.result.createObjectStore(STORE_NAME)
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
      request.onblocked = () => resolve(null)
    } catch {
      resolve(null)
    }
  })
}

function runTransaction<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T | null> {
  return openDb().then(
    (db) =>
      new Promise<T | null>((resolve) => {
        if (!db) {
          resolve(null)
          return
        }
        try {
          const tx = db.transaction(STORE_NAME, mode)
          const request = action(tx.objectStore(STORE_NAME))
          request.onsuccess = () => resolve(request.result)
          request.onerror = () => resolve(null)
          tx.oncomplete = () => db.close()
        } catch {
          db.close()
          resolve(null)
        }
      }),
  )
}

export async function savePendingResume(file: File): Promise<void> {
  const record: PendingRecord = { file, createdAt: Date.now() }
  await runTransaction('readwrite', (store) => store.put(record, RECORD_KEY))
}

export async function clearPendingResume(): Promise<void> {
  await runTransaction('readwrite', (store) => store.delete(RECORD_KEY))
}

export async function getPendingResume(): Promise<File | null> {
  const record = await runTransaction<PendingRecord | undefined>(
    'readonly',
    (store) => store.get(RECORD_KEY),
  )

  if (!record?.file) return null

  if (Date.now() - record.createdAt > MAX_AGE_MS) {
    await clearPendingResume()
    return null
  }

  return record.file
}
