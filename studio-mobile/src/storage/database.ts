import * as SQLite from "expo-sqlite";
import { EntityType, PhotoAsset, searchableText, StudioRecord } from "../domain/models";
import { seedRecords } from "../domain/seed";

const DATABASE_NAME = "studio-log.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return dbPromise;
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      search_text TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_records_type ON records(type);
    CREATE INDEX IF NOT EXISTS idx_records_updated ON records(updated_at);
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY NOT NULL,
      owner_id TEXT NOT NULL,
      owner_type TEXT NOT NULL,
      uri TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_photos_owner ON photos(owner_id, owner_type);
  `);

  const existing = await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM records");
  if (!existing || existing.count === 0) {
    for (const record of seedRecords) {
      await saveRecord(record);
    }
  }
}

export async function listRecords(type?: EntityType, query?: string): Promise<StudioRecord[]> {
  const db = await getDb();
  const normalizedQuery = query?.trim().toLowerCase();
  const rows = type
    ? await db.getAllAsync<{ payload: string }>(
        normalizedQuery
          ? "SELECT payload FROM records WHERE type = ? AND search_text LIKE ? ORDER BY updated_at DESC"
          : "SELECT payload FROM records WHERE type = ? ORDER BY updated_at DESC",
        ...(normalizedQuery ? [type, `%${normalizedQuery}%`] : [type])
      )
    : await db.getAllAsync<{ payload: string }>(
        normalizedQuery
          ? "SELECT payload FROM records WHERE search_text LIKE ? ORDER BY updated_at DESC"
          : "SELECT payload FROM records ORDER BY updated_at DESC",
        ...(normalizedQuery ? [`%${normalizedQuery}%`] : [])
      );

  return rows.map((row) => JSON.parse(row.payload) as StudioRecord);
}

export async function saveRecord(record: StudioRecord): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO records (id, type, title, payload, updated_at, search_text)
     VALUES (?, ?, ?, ?, ?, ?)`,
    record.id,
    record.type,
    record.title,
    JSON.stringify(record),
    record.updatedAt,
    searchableText(record)
  );
}

export async function deleteRecord(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM photos WHERE owner_id = ?", id);
  await db.runAsync("DELETE FROM records WHERE id = ?", id);
}

export async function listPhotos(ownerId?: string): Promise<PhotoAsset[]> {
  const db = await getDb();
  const rows = ownerId
    ? await db.getAllAsync<{ payload: string }>("SELECT payload FROM photos WHERE owner_id = ? ORDER BY created_at DESC", ownerId)
    : await db.getAllAsync<{ payload: string }>("SELECT payload FROM photos ORDER BY created_at DESC");
  return rows.map((row) => JSON.parse(row.payload) as PhotoAsset);
}

export async function savePhoto(photo: PhotoAsset): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO photos (id, owner_id, owner_type, uri, payload, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    photo.id,
    photo.ownerId,
    photo.ownerType,
    photo.uri,
    JSON.stringify(photo),
    photo.createdAt
  );
}

export async function replaceAllData(records: StudioRecord[], photos: PhotoAsset[]): Promise<void> {
  const db = await getDb();
  await db.execAsync("DELETE FROM photos; DELETE FROM records;");
  for (const record of records) {
    await saveRecord(record);
  }
  for (const photo of photos) {
    await savePhoto(photo);
  }
}

export async function exportAllData(): Promise<{ records: StudioRecord[]; photos: PhotoAsset[] }> {
  return {
    records: await listRecords(),
    photos: await listPhotos()
  };
}
