import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { EntityType, PhotoAsset, StudioRecord, createRecord, nowIso } from "../domain/models";
import { capturePhoto, pickPhoto } from "../storage/photoStore";
import { deleteRecord, initDatabase, listPhotos, listRecords, savePhoto, saveRecord } from "../storage/database";
import { exportBackupFile, importBackupFile } from "../storage/backup";

interface StudioContextValue {
  ready: boolean;
  error: string;
  records: StudioRecord[];
  photos: PhotoAsset[];
  recordsByType: (type: EntityType) => StudioRecord[];
  photosFor: (ownerId: string) => PhotoAsset[];
  createStudioRecord: (type: EntityType, input: Partial<StudioRecord>) => Promise<void>;
  updateStudioRecord: (record: StudioRecord) => Promise<void>;
  removeStudioRecord: (id: string) => Promise<void>;
  addPhotoFromCamera: (record: StudioRecord, role?: PhotoAsset["role"]) => Promise<void>;
  addPhotoFromLibrary: (record: StudioRecord, role?: PhotoAsset["role"]) => Promise<void>;
  exportBackup: () => Promise<void>;
  importBackup: () => Promise<void>;
  reload: () => Promise<void>;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function StudioProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [records, setRecords] = useState<StudioRecord[]>([]);
  const [photos, setPhotos] = useState<PhotoAsset[]>([]);

  const reload = useCallback(async () => {
    const [nextRecords, nextPhotos] = await Promise.all([listRecords(), listPhotos()]);
    setRecords(nextRecords);
    setPhotos(nextPhotos);
  }, []);

  useEffect(() => {
    let mounted = true;
    initDatabase()
      .then(reload)
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch((err: unknown) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unable to open local studio database.");
          setReady(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [reload]);

  const recordsByType = useCallback(
    (type: EntityType) => records.filter((record) => record.type === type && !record.archivedAt),
    [records]
  );

  const photosFor = useCallback(
    (ownerId: string) => photos.filter((photo) => photo.ownerId === ownerId),
    [photos]
  );

  const createStudioRecord = useCallback(
    async (type: EntityType, input: Partial<StudioRecord>) => {
      const record = createRecord(type, input);
      await saveRecord(record);
      await reload();
    },
    [reload]
  );

  const updateStudioRecord = useCallback(
    async (record: StudioRecord) => {
      await saveRecord({ ...record, updatedAt: nowIso() });
      await reload();
    },
    [reload]
  );

  const removeStudioRecord = useCallback(
    async (id: string) => {
      await deleteRecord(id);
      await reload();
    },
    [reload]
  );

  const persistPhoto = useCallback(
    async (photo: PhotoAsset | null) => {
      if (!photo) {
        Alert.alert("Photo not added", "Camera or photo library permission was not granted, or no photo was selected.");
        return;
      }
      await savePhoto(photo);
      await reload();
    },
    [reload]
  );

  const addPhotoFromCamera = useCallback(
    async (record: StudioRecord, role: PhotoAsset["role"] = "process") => {
      await persistPhoto(await capturePhoto(record.id, record.type, role));
    },
    [persistPhoto]
  );

  const addPhotoFromLibrary = useCallback(
    async (record: StudioRecord, role: PhotoAsset["role"] = "reference") => {
      await persistPhoto(await pickPhoto(record.id, record.type, role));
    },
    [persistPhoto]
  );

  const exportBackup = useCallback(async () => {
    try {
      await exportBackupFile();
    } catch (err) {
      Alert.alert("Export failed", err instanceof Error ? err.message : "Unable to export backup.");
    }
  }, []);

  const importBackup = useCallback(async () => {
    try {
      await importBackupFile();
      await reload();
    } catch (err) {
      Alert.alert("Import failed", err instanceof Error ? err.message : "Unable to import backup.");
    }
  }, [reload]);

  const value = useMemo<StudioContextValue>(
    () => ({
      ready,
      error,
      records,
      photos,
      recordsByType,
      photosFor,
      createStudioRecord,
      updateStudioRecord,
      removeStudioRecord,
      addPhotoFromCamera,
      addPhotoFromLibrary,
      exportBackup,
      importBackup,
      reload
    }),
    [
      ready,
      error,
      records,
      photos,
      recordsByType,
      photosFor,
      createStudioRecord,
      updateStudioRecord,
      removeStudioRecord,
      addPhotoFromCamera,
      addPhotoFromLibrary,
      exportBackup,
      importBackup,
      reload
    ]
  );

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioContextValue {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error("useStudio must be used within StudioProvider");
  }
  return context;
}
