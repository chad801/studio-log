import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { PhotoAsset, StudioBackup } from "../domain/models";
import { exportAllData, replaceAllData } from "./database";
import { readPhotoBase64, restorePhotoFromBase64 } from "./photoStore";

export async function exportBackupFile(): Promise<string> {
  const { records, photos } = await exportAllData();
  const photosWithData = [];
  for (const photo of photos) {
    photosWithData.push({ ...photo, base64: await readPhotoBase64(photo.uri) });
  }
  const backup: StudioBackup = {
    app: "Studio Log",
    version: 1,
    exportedAt: new Date().toISOString(),
    records,
    photos: photosWithData
  };
  const fileUri = `${FileSystem.documentDirectory}studio-log-backup-${new Date().toISOString().slice(0, 10)}.json`;
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backup));
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: "application/json",
      dialogTitle: "Export Studio Log backup"
    });
  }
  return fileUri;
}

export async function importBackupFile(): Promise<void> {
  const picked = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true
  });
  if (picked.canceled || !picked.assets[0]) {
    return;
  }
  const raw = await FileSystem.readAsStringAsync(picked.assets[0].uri);
  const backup = JSON.parse(raw) as StudioBackup;
  if (backup.app !== "Studio Log" || !Array.isArray(backup.records)) {
    throw new Error("Invalid Studio Log backup");
  }
  const restoredPhotos: PhotoAsset[] = [];
  for (const photo of backup.photos ?? []) {
    const restoredUri = await restorePhotoFromBase64(photo.id, photo.base64);
    restoredPhotos.push({
      ...photo,
      uri: restoredUri ?? photo.uri
    });
  }
  await replaceAllData(backup.records, restoredPhotos);
}
