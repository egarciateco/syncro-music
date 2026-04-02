import AsyncStorage from '@react-native-async-storage/async-storage';
import { JamendoTrack } from './jamendo';

const KEYS = {
  FAVORITES: 'syncro_favorites',
  FOLDERS: 'syncro_folders',
  DOWNLOADED: 'syncro_downloaded',
  IS_PREMIUM: 'syncro_is_premium',
  ADMIN_CONFIG: 'syncro_admin_config',
  ACCESS_CODES: 'syncro_access_codes',
};

export type Folder = {
  id: string;
  name: string;
  createdAt: string;
  tracks: JamendoTrack[];
};

// ---- FAVORITOS ----
export async function getFavorites(): Promise<JamendoTrack[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export async function addToFavorites(track: JamendoTrack): Promise<void> {
  try {
    const favs = await getFavorites();
    const exists = favs.some(t => t.id === track.id);
    if (!exists) {
      favs.unshift(track);
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
    }
  } catch (e) { console.error('Error guardando favorito:', e); }
}

export async function removeFromFavorites(trackId: string): Promise<void> {
  try {
    const favs = await getFavorites();
    const filtered = favs.filter(t => t.id !== trackId);
    await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(filtered));
  } catch (e) { console.error('Error removiendo favorito:', e); }
}

export async function isFavorite(trackId: string): Promise<boolean> {
  const favs = await getFavorites();
  return favs.some(t => t.id === trackId);
}

// ---- CARPETAS ----
export async function getFolders(): Promise<Folder[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.FOLDERS);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export async function createFolder(name: string): Promise<Folder> {
  const folder: Folder = {
    id: `folder_${Date.now()}`,
    name,
    createdAt: new Date().toISOString(),
    tracks: [],
  };
  const folders = await getFolders();
  folders.push(folder);
  await AsyncStorage.setItem(KEYS.FOLDERS, JSON.stringify(folders));
  return folder;
}

export async function addTrackToFolder(folderId: string, track: JamendoTrack): Promise<void> {
  const folders = await getFolders();
  const idx = folders.findIndex(f => f.id === folderId);
  if (idx >= 0) {
    const exists = folders[idx].tracks.some(t => t.id === track.id);
    if (!exists) folders[idx].tracks.push(track);
    await AsyncStorage.setItem(KEYS.FOLDERS, JSON.stringify(folders));
  }
}

export async function deleteFolder(folderId: string): Promise<void> {
  const folders = await getFolders();
  const filtered = folders.filter(f => f.id !== folderId);
  await AsyncStorage.setItem(KEYS.FOLDERS, JSON.stringify(filtered));
}

// ---- PREMIUM ----
export async function getIsPremium(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.IS_PREMIUM);
  return val === 'true';
}

export async function setIsPremium(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.IS_PREMIUM, value ? 'true' : 'false');
}

// ---- CONFIG ADMIN ----
export type AdminConfig = {
  premiumPrice: string;
  paymentUrl: string;
  preferenceId: string;
  appDescription: string;
};

const DEFAULT_CONFIG: AdminConfig = {
  premiumPrice: '2.99',
  paymentUrl: 'https://www.mercadopago.com.ar',
  preferenceId: '2993211976-7e998a4f-4658-41bb-94d0-4340e2d43561',
  appDescription: 'Syncro Music Premium - Acceso ilimitado a toda la música',
};

export async function getAdminConfig(): Promise<AdminConfig> {
  try {
    const data = await AsyncStorage.getItem(KEYS.ADMIN_CONFIG);
    return data ? { ...DEFAULT_CONFIG, ...JSON.parse(data) } : DEFAULT_CONFIG;
  } catch { return DEFAULT_CONFIG; }
}

export async function saveAdminConfig(config: Partial<AdminConfig>): Promise<void> {
  const current = await getAdminConfig();
  await AsyncStorage.setItem(KEYS.ADMIN_CONFIG, JSON.stringify({ ...current, ...config }));
}

// ---- CÓDIGOS DE ACCESO ----
export async function getAccessCodes(): Promise<string[]> {
  const data = await AsyncStorage.getItem(KEYS.ACCESS_CODES);
  return data ? JSON.parse(data) : [];
}

export async function addAccessCode(code: string): Promise<void> {
  const codes = await getAccessCodes();
  if (!codes.includes(code)) {
    codes.push(code);
    await AsyncStorage.setItem(KEYS.ACCESS_CODES, JSON.stringify(codes));
  }
}

export async function isValidCode(code: string): Promise<boolean> {
  if (code === '5753') return true; // Código maestro del admin
  const codes = await getAccessCodes();
  return codes.includes(code);
}
