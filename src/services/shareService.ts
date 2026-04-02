import { Linking, Share, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import { JamendoTrack } from './jamendo';
import { Folder } from './storageService';

const APP_STORE_LINK = 'https://expo.dev/@syncromusic/syncro-music';
const WHATSAPP_NUMBER = ''; // Dejar vacío para "cualquier contacto"

export async function shareApp(): Promise<void> {
  try {
    await Share.share({
      title: 'Syncro Music',
      message: `🎵 ¡Descubrí Syncro Music! La mejor app para buscar, escuchar y guardar música. Descargala gratis desde: ${APP_STORE_LINK}`,
    });
  } catch (error) {
    console.error('Error compartiendo app:', error);
  }
}

export async function shareTrackViaWhatsApp(track: JamendoTrack): Promise<void> {
  const message = encodeURIComponent(
    `🎵 Escuchá "${track.name}" de ${track.artist_name} en Syncro Music!\n${track.shareurl}`
  );
  const url = `whatsapp://send?text=${message}`;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    await Share.share({
      message: `🎵 "${track.name}" - ${track.artist_name}\n${track.shareurl}`,
    });
  }
}

export async function shareFolderViaWhatsApp(folder: Folder): Promise<void> {
  const trackList = folder.tracks.map(t => `• ${t.name} - ${t.artist_name}`).join('\n');
  const message = encodeURIComponent(
    `🎵 Te comparto la carpeta "${folder.name}" de Syncro Music:\n\n${trackList}\n\nDescargá la app: ${APP_STORE_LINK}`
  );
  const url = `whatsapp://send?text=${message}`;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    await Share.share({ message: decodeURIComponent(message) });
  }
}

export async function sendCodeViaWhatsApp(code: string): Promise<void> {
  const message = encodeURIComponent(
    `🎵 Tu código de acceso a Syncro Music es: *${code}*\n\nDescargá la app desde: ${APP_STORE_LINK}`
  );
  const url = `whatsapp://send?text=${message}`;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  } else {
    await Share.share({
      message: `Tu código de acceso a Syncro Music: ${code}`,
    });
  }
}

export async function shareTrackNative(track: JamendoTrack): Promise<void> {
  try {
    await Share.share({
      title: `${track.name} - ${track.artist_name}`,
      message: `🎵 "${track.name}" de ${track.artist_name}\nEscuchalo en Syncro Music: ${track.shareurl}`,
      url: track.shareurl,
    });
  } catch (error) {
    console.error('Error compartiendo track:', error);
  }
}

export function openAppStore(): void {
  Linking.openURL(APP_STORE_LINK).catch(console.error);
}
