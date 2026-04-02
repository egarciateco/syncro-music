import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { usePlayerStore } from '../store/playerStore';
import { formatDuration } from '../services/jamendo';

type Props = {
  onPress: () => void;
};

export default function MiniPlayer({ onPress }: Props) {
  const { currentTrack, isPlaying, pauseTrack, resumeTrack, nextTrack, position, duration } = usePlayerStore();

  if (!currentTrack) return null;

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={['#1E1E3F', '#12122A']}
        style={styles.container}
      >
        {/* Barra de progreso */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <View style={styles.content}>
          {/* Portada */}
          <Image
            source={{ uri: currentTrack.image || 'https://via.placeholder.com/44' }}
            style={styles.cover}
          />

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.trackName} numberOfLines={1}>{currentTrack.name}</Text>
            <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist_name}</Text>
          </View>

          {/* Tiempo */}
          <Text style={styles.time}>{formatDuration(position)}</Text>

          {/* Prev */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={(e) => {
              e.stopPropagation();
              usePlayerStore.getState().prevTrack();
            }}
          >
            <Ionicons name="play-skip-back" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Play/Pause */}
          <TouchableOpacity
            style={styles.playBtn}
            onPress={(e) => {
              e.stopPropagation();
              isPlaying ? pauseTrack() : resumeTrack();
            }}
          >
            <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.playGradient}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Next */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
          >
            <Ionicons name="play-skip-forward" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.cardBorder,
  },
  progressFill: {
    height: 2,
    backgroundColor: COLORS.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLight,
  },
  info: {
    flex: 1,
  },
  trackName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  artist: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  time: {
    fontSize: 11,
    color: COLORS.textMuted,
    minWidth: 36,
    textAlign: 'right',
  },
  controlBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  playGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
