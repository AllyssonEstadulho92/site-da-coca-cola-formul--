(() => {
  'use strict';

  const DB_NAME = 'registoAvariasDB';
  const DB_VERSION = 2;
  const SNAPSHOT_LIMIT = 5;
  let dbPromise;

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('records')) {
          const store = db.createObjectStore('records', { keyPath: 'id' });
          store.createIndex('displayId', 'displayId', { unique: true });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('equipmentReference', 'equipmentReference', { unique: false });
        }
        if (!db.objectStoreNames.contains('activities')) {
          const store = db.createObjectStore('activities', { keyPath: 'id' });
          store.createIndex('recordId', 'recordId', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('profiles')) db.createObjectStore('profiles', { keyPath: 'email' });
        if (!db.objectStoreNames.contains('snapshots')) {
          const store = db.createObjectStore('snapshots', { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }

  async function put(storeName, value) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).put(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function get(storeName, key) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getAll(storeName) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const req = tx.objectStore(storeName).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async function remove(storeName, key) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async function clear(storeName) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const req = tx.objectStore(storeName).clear();
      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }

  async function exportAll() {
    const [records, activities, settings, profiles] = await Promise.all([
      getAll('records'), getAll('activities'), getAll('settings'), getAll('profiles')
    ]);
    return {
      schemaVersion: 2,
      appVersion: '3.0.0',
      exportedAt: new Date().toISOString(),
      records,
      activities,
      settings,
      profiles,
    };
  }

  function validateBackup(payload) {
    if (!payload || ![1, 2].includes(Number(payload.schemaVersion))) throw new Error('Formato de backup incompatível.');
    for (const key of ['records', 'activities', 'settings', 'profiles']) {
      if (payload[key] != null && !Array.isArray(payload[key])) throw new Error(`Estrutura inválida: ${key}.`);
    }

    const ids = new Set();
    const displayIds = new Set();
    for (const record of payload.records || []) {
      if (!record?.id) throw new Error('Existe um registo sem identificador técnico.');
      if (ids.has(record.id)) throw new Error('O backup contém identificadores técnicos duplicados.');
      ids.add(record.id);
      if (record.displayId) {
        if (displayIds.has(record.displayId)) throw new Error('O backup contém IDs de registo apresentados em duplicado.');
        displayIds.add(record.displayId);
      }
    }
    return true;
  }

  async function importAll(payload) {
    validateBackup(payload);
    const db = await open();
    const stores = ['records', 'activities', 'settings', 'profiles'];
    return new Promise((resolve, reject) => {
      const tx = db.transaction(stores, 'readwrite');
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error || new Error('Falha ao importar o backup.'));
      tx.onabort = () => reject(tx.error || new Error('O restauro foi cancelado pela base de dados.'));

      for (const storeName of stores) tx.objectStore(storeName).clear();
      for (const record of payload.records || []) tx.objectStore('records').put(record);
      for (const activity of payload.activities || []) tx.objectStore('activities').put(activity);
      for (const setting of payload.settings || []) tx.objectStore('settings').put(setting);
      for (const profile of payload.profiles || []) tx.objectStore('profiles').put(profile);
    });
  }

  async function createSnapshot(label = 'Snapshot local') {
    const payload = await exportAll();
    const snapshot = {
      id: crypto.randomUUID(),
      label,
      createdAt: new Date().toISOString(),
      payload,
    };
    await put('snapshots', snapshot);
    const snapshots = (await getAll('snapshots')).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    for (const old of snapshots.slice(SNAPSHOT_LIMIT)) await remove('snapshots', old.id);
    return snapshot;
  }

  async function getSnapshots() {
    return (await getAll('snapshots')).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async function restoreSnapshot(id) {
    const snapshot = await get('snapshots', id);
    if (!snapshot?.payload) throw new Error('Snapshot local não encontrado.');
    await importAll(snapshot.payload);
    return snapshot;
  }

  async function ensureDailySnapshot() {
    const snapshots = await getSnapshots();
    const today = new Date().toISOString().slice(0, 10);
    if (snapshots.some((item) => String(item.createdAt || '').slice(0, 10) === today)) return null;
    return createSnapshot('Snapshot diário automático');
  }

  window.AppDB = {
    open,
    put,
    get,
    getAll,
    remove,
    clear,
    exportAll,
    validateBackup,
    importAll,
    createSnapshot,
    getSnapshots,
    restoreSnapshot,
    ensureDailySnapshot,
  };
})();
