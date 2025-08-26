import { openDB, type IDBPDatabase} from "idb"
// TRIED IMPLEMENT INDEXEDDB FOR CACHING PROPERTY TYPES BUT THERE WHERE PERFORMANCE ISSUES AND IT WAS SLOWER THAN LOCALSTORAGE
export const IDB_NAME = "rentsafe"
export const DB_VERSION = 1;

const dbPromise = openDB(IDB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore("propertyTypes");
  },
});

export const getDB = async (): Promise<IDBPDatabase> => {
  return dbPromise;
};

export async function clearAllStores(name: string) {
  return new Promise<void>((resolve, reject) => {
    const openReq = indexedDB.open(name);

    openReq.onerror = () => reject(openReq.error);

    openReq.onsuccess = () => {
      const db = openReq.result;
      const tx = db.transaction(db.objectStoreNames, "readwrite");

      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => resolve();

      for (const storeName of db.objectStoreNames) {
        tx.objectStore(storeName).clear();
      }
    };
  });
}

export async function getItem<T>(
  db: IDBPDatabase,
  storeName: string,
  key: string
): Promise<T | undefined> {
  return db.get(storeName, key);
}

export async function setItem<T>(
  db: IDBPDatabase,
  storeName: string,
  key: string,
  value: T
): Promise<void> {
  await db.put(storeName, value, key);
}

export async function deleteItem(
  db: IDBPDatabase,
  storeName: string,
  key: string
): Promise<void> {
  await db.delete(storeName, key);
}

export async function clearStore(
  db: IDBPDatabase,
  storeName: string
): Promise<void> {
  await db.clear(storeName);
}

