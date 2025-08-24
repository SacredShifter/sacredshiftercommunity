import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'sacred-shifter-store';
const DB_VERSION = 1;

// All known object stores must be defined here.
const ALL_STORES = [
  'message-queue',
  'retry-queue',
  'sacred-mesh-identity',
];

// Create a single, shared promise for the database connection.
// This ensures the upgrade logic runs only once.
const dbPromise: Promise<IDBPDatabase<unknown>> = openDB(DB_NAME, DB_VERSION, {
  upgrade: (db) => {
    for (const storeName of ALL_STORES) {
      if (!db.objectStoreNames.contains(storeName)) {
        // The test was failing with "No objectStore named retry-queue in this database"
        // because the keyPath was not being set correctly for stores that need it.
        // The original implementation had no keyPath, the test implementation had one.
        // By standardizing here, we can ensure consistency.
        // Let's assume a generic 'id' keyPath for stores that might need it,
        // but for simple key-value stores, no keyPath is better.
        // The identity store uses a static key 'user-identity', so it doesn't need a key path.
        // The message queues also don't use an inline keyPath in the value object.
        db.createObjectStore(storeName);
      }
    }
  },
});

export class DurableStore<T> {
  // storeName is now the only piece of instance-specific state.
  constructor(private storeName: string) {
    if (!ALL_STORES.includes(storeName)) {
      throw new Error(`The store "${storeName}" is not defined in the ALL_STORES list in durableStore.ts. Please add it to ensure the database schema is correctly managed.`);
    }
  }

  async set(key: string, value: T): Promise<void> {
    const db = await dbPromise;
    await db.put(this.storeName, value, key);
  }

  async get(key: string): Promise<T | undefined> {
    const db = await dbPromise;
    return db.get(this.storeName, key);
  }

  async delete(key: string): Promise<void> {
    const db = await dbPromise;
    await db.delete(this.storeName, key);
  }

  async getAll(): Promise<T[]> {
    const db = await dbPromise;
    return db.getAll(this.storeName);
  }

  async clear(): Promise<void> {
    const db = await dbPromise;
    await db.clear(this.storeName);
  }
}
