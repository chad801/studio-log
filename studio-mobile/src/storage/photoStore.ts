import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { EntityType, PhotoAsset, createId, nowIso } from "../domain/models";

const PHOTO_DIR = `${FileSystem.documentDirectory ?? ""}studio-photos/`;

async function ensurePhotoDirectory(): Promise<void> {
  const info = await FileSystem.getInfoAsync(PHOTO_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true });
  }
}

async function persistImage(uri: string): Promise<{ uri: string; width?: number; height?: number }> {
  await ensurePhotoDirectory();
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1800 } }],
    { compress: 0.78, format: ImageManipulator.SaveFormat.JPEG }
  );
  const destination = `${PHOTO_DIR}${createId("photo")}.jpg`;
  await FileSystem.copyAsync({ from: manipulated.uri, to: destination });
  return { uri: destination, width: manipulated.width, height: manipulated.height };
}

async function requestCamera(): Promise<boolean> {
  const current = await ImagePicker.getCameraPermissionsAsync();
  if (current.granted) return true;
  const next = await ImagePicker.requestCameraPermissionsAsync();
  return next.granted;
}

async function requestLibrary(): Promise<boolean> {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (current.granted) return true;
  const next = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return next.granted;
}

export async function capturePhoto(ownerId: string, ownerType: EntityType, role: PhotoAsset["role"]): Promise<PhotoAsset | null> {
  const permitted = await requestCamera();
  if (!permitted) return null;
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.86
  });
  if (result.canceled || !result.assets[0]) return null;
  const stored = await persistImage(result.assets[0].uri);
  return {
    id: createId("asset"),
    ownerId,
    ownerType,
    uri: stored.uri,
    width: stored.width,
    height: stored.height,
    role,
    createdAt: nowIso()
  };
}

export async function pickPhoto(ownerId: string, ownerType: EntityType, role: PhotoAsset["role"]): Promise<PhotoAsset | null> {
  const permitted = await requestLibrary();
  if (!permitted) return null;
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.86
  });
  if (result.canceled || !result.assets[0]) return null;
  const stored = await persistImage(result.assets[0].uri);
  return {
    id: createId("asset"),
    ownerId,
    ownerType,
    uri: stored.uri,
    width: stored.width,
    height: stored.height,
    role,
    createdAt: nowIso()
  };
}

export async function readPhotoBase64(uri: string): Promise<string | undefined> {
  try {
    return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  } catch {
    return undefined;
  }
}

export async function restorePhotoFromBase64(id: string, base64?: string): Promise<string | null> {
  if (!base64) return null;
  await ensurePhotoDirectory();
  const destination = `${PHOTO_DIR}${id}.jpg`;
  await FileSystem.writeAsStringAsync(destination, base64, { encoding: FileSystem.EncodingType.Base64 });
  return destination;
}
