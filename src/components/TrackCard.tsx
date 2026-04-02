import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { JamendoTrack, formatDuration } from '../services/jamendo';
import { usePlayerStore } from '../store/playerStore';
import { useUserStore } from '../store/userStore';
import { shareTrackViaWhatsApp, shareTrackNative } from '../services/shareService';

type Props = {
  track: JamendoTrack;
  onSaveToFolder?: (track: JamendoTrack) => void;
  onDownload?: (track: JamendoTrack) => void;
  isDownloaded?: boolean;
};

export default function TrackCard({ track, onSaveToFolder, onDownload, isDownloaded }: Props) {
  const { currentTrack, isPlaying, playTrack, pauseTrack, resumeTrack, isLoading } = usePlayerStore();
  const { isPremium } = useUserStore();

  const isThisPlaying = currentTrack?.id === track.id && isPlaying;
  const isThisTrack = currentTrack?.id === track.id;
  const isThisLoading = isThisTrack && isLoading;

  const handlePlayPause = () => {
    if (isThisTrack) {
      isPlaying ? pauseTrack() : resumeTrack();
    } else {
      playTrack(track);
    }
  };

  return (
    <View style={[styles.container, isThisTrack && styles.containerActive]}>
      {/* Portada */}
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: track.image || 'https://via.placeholder.com/60' }}
          style={styles.cover}
        />
        {isThisTrack && (
          <LinearGradient
            colors={['transparent', COLORS.primaryGlow]}
            style={styles.coverOverlay}
          >
            <View style={styles.nowPlayingBadge}>
              <Ionicons name="musical-notes" size={8} color={COLORS.primary} />
            </View>
          </LinearGradient>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={[styles.trackName, isThisTrack && styles.trackNameActive]} numberOfLines={1}>
          {track.name}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>{track.artist_name}</Text>
        <Text style={styles.duration}>{formatDuration(track.duration)}</Text>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        {/* Play/Pause */}
        <TouchableOpacity style={styles.playBtn} onPress={handlePlayPause} activeOpacity={0.8}>
          <LinearGradient
            colors={isThisTrack ? ['#8B5CF6', '#6D28D9'] : ['#1E1E3F', '#12122A']}
            style={styles.playBtnGradient}
          >
            {isThisLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Ionicons
                name={isThisPlaying ? 'pause' : 'play'}
                size={18}
                color={COLORS.white}
              />
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Compartir WhatsApp */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => shareTrackViaWhatsApp(track)}
        >
          <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
        </TouchableOpacity>

        {/* Compartir nativo (incluye Bluetooth) */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => shareTrackNative(track)}
        >
          <Ionicons name="share-social" size={18} color={COLORS.accent} />
        </TouchableOpacity>

        {/* Guardar en carpeta (solo Premium) */}
        {isPremium ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onSaveToFolder?.(track)}
          >
            <Ionicons name="folder-open" size={18} color={COLORS.premium} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.iconBtn, styles.premiumLocked]}>
            <Ionicons name="lock-closed" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}

        {/* Descargar (solo Premium) */}
        {isPremium ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onDownload?.(track)}
          >
            <Ionicons
              name={isDownloaded ? 'checkmark-circle' : 'cloud-download'}
              size={18}
              color={isDownloaded ? COLORS.success : COLORS.primary}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.iconBtn, styles.premiumLocked]}>
            <Ionicons name="lock-closed" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 10,
  },
  containerActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceLight,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  coverContainer: {
    position: 'relative',
  },
  cover: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
  },
  coverOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 12,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 3,
  },
  nowPlayingBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  trackName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  trackNameActive: {
    color: COLORS.primary,
  },
  artistName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  duration: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  playBtnGradient: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  premiumLocked: {
    opacity: 0.4,
    borderColor: COLORS.textDisabled,
  },
});
