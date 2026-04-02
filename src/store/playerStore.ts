import { create } from 'zustand';
import { Audio } from 'expo-av';
import { JamendoTrack } from '../services/jamendo';
import { addToFavorites } from '../services/storageService';

type PlayerState = {
  currentTrack: JamendoTrack | null;
  queue: JamendoTrack[];
  isPlaying: boolean;
  isLoading: boolean;
  position: number;
  duration: number;
  sound: Audio.Sound | null;

  // Actions
  playTrack: (track: JamendoTrack, queue?: JamendoTrack[]) => Promise<void>;
  pauseTrack: () => Promise<void>;
  resumeTrack: () => Promise<void>;
  stopTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  setPosition: (position: number) => void;
  setDuration: (duration: number) => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  isLoading: false,
  position: 0,
  duration: 0,
  sound: null,

  playTrack: async (track, queue = []) => {
    try {
      const { sound: currentSound } = get();

      // Detener y descargar sonido anterior
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }

      set({ isLoading: true, currentTrack: track, queue, isPlaying: false });

      // Configurar modo de audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audio },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            set({
              position: status.positionMillis / 1000,
              duration: (status.durationMillis || 0) / 1000,
              isPlaying: status.isPlaying,
            });
            if (status.didJustFinish) {
              get().nextTrack();
            }
          }
        }
      );

      set({ sound, isPlaying: true, isLoading: false });

      // Agregar automáticamente a favoritos
      addToFavorites(track);
    } catch (error) {
      console.error('Error reproduciendo track:', error);
      set({ isLoading: false });
    }
  },

  pauseTrack: async () => {
    const { sound } = get();
    if (sound) {
      await sound.pauseAsync();
      set({ isPlaying: false });
    }
  },

  resumeTrack: async () => {
    const { sound } = get();
    if (sound) {
      await sound.playAsync();
      set({ isPlaying: true });
    }
  },

  stopTrack: async () => {
    const { sound } = get();
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      set({ sound: null, isPlaying: false, position: 0, currentTrack: null });
    }
  },

  nextTrack: async () => {
    const { queue, currentTrack } = get();
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const next = queue[idx + 1] || queue[0];
    if (next) await get().playTrack(next, queue);
  },

  prevTrack: async () => {
    const { queue, currentTrack, position } = get();
    if (!currentTrack) return;
    if (position > 3) {
      await get().seekTo(0);
      return;
    }
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const prev = queue[idx - 1] || queue[queue.length - 1];
    if (prev) await get().playTrack(prev, queue);
  },

  seekTo: async (position: number) => {
    const { sound } = get();
    if (sound) {
      await sound.setPositionAsync(position * 1000);
    }
  },

  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
}));
