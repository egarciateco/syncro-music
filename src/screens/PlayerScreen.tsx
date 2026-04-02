import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Image, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayerStore } from '../store/playerStore';
import { formatDuration } from '../services/jamendo';
import { shareTrackViaWhatsApp, shareTrackNative } from '../services/shareService';
import { useUserStore } from '../store/userStore';

const { width, height } = Dimensions.get('window');

type Props = { navigation: any };

export default function PlayerScreen({ navigation }: Props) {
  const { currentTrack, isPlaying, isLoading, position, duration,
    pauseTrack, resumeTrack, nextTrack, prevTrack, seekTo, stopTrack } = usePlayerStore();
  const { isPremium } = useUserStore();
  const progress = duration > 0 ? position / duration : 0;
  const trackWidth = width - 64;

  const handleSeek = (evt: any) => {
    const x = evt.nativeEvent.locationX;
    const seekPosition = (x / trackWidth) * duration;
    seekTo(Math.max(0, Math.min(duration, seekPosition)));
  };

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <AppHeader title="Reproductor" onBack={() => navigation.goBack()} />
        <View style={styles.emptyPlayer}>
          <Ionicons name="musical-notes-outline" size={80} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No hay ningún tema reproduciéndose</Text>
          <TouchableOpacity style={styles.goBackBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.goBackText}>← Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Reproductor" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Portada grande */}
        <LinearGradient colors={['#2D1B69', '#0A0A1F']} style={styles.coverSection}>
          <View style={styles.coverShadow}>
            <Image
              source={{ uri: currentTrack.image || 'https://via.placeholder.com/300' }}
              style={styles.coverLarge}
            />
          </View>
          {/* Waves animadas */}
          <View style={styles.wavesRow}>
            {[20, 35, 25, 40, 22, 38, 20].map((h, i) => (
              <View
                key={i}
                style={[styles.waveBar, {
                  height: isPlaying ? h : 8,
                  backgroundColor: i % 2 === 0 ? COLORS.primary : COLORS.accent,
                }]}
              />
            ))}
          </View>
        </LinearGradient>

        {/* Info del tema */}
        <View style={styles.infoSection}>
          <Text style={styles.trackName} numberOfLines={2}>{currentTrack.name}</Text>
          <Text style={styles.artistName}>{currentTrack.artist_name}</Text>
          {currentTrack.album_name && (
            <Text style={styles.albumName}>{currentTrack.album_name}</Text>
          )}
          {currentTrack.tags && (
            <View style={styles.tagRow}>
              {currentTrack.tags.split(' ').slice(0, 4).map(tag => (
                <View key={tag} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Barra de progreso */}
        <View style={styles.progressSection}>
          <TouchableOpacity
            style={styles.progressBar}
            onPress={handleSeek}
            activeOpacity={1}
          >
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              <View style={[styles.progressThumb, { left: `${progress * 100}%` }]} />
            </View>
          </TouchableOpacity>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatDuration(position)}</Text>
            <Text style={styles.timeText}>{formatDuration(duration)}</Text>
          </View>
        </View>

        {/* Controles principales */}
        <View style={styles.controls}>
          {/* Anterior */}
          <TouchableOpacity style={styles.controlBtn} onPress={prevTrack}>
            <Ionicons name="play-skip-back" size={32} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Play/Pause */}
          <TouchableOpacity onPress={isPlaying ? pauseTrack : resumeTrack} activeOpacity={0.85}>
            <LinearGradient
              colors={['#8B5CF6', '#6D28D9']}
              style={styles.playBtn}
            >
              <Ionicons
                name={isLoading ? 'hourglass' : isPlaying ? 'pause' : 'play'}
                size={38}
                color={COLORS.white}
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* Siguiente */}
          <TouchableOpacity style={styles.controlBtn} onPress={nextTrack}>
            <Ionicons name="play-skip-forward" size={32} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Botón Stop */}
        <View style={styles.stopRow}>
          <TouchableOpacity
            style={styles.stopBtn}
            onPress={() => { stopTrack(); navigation.goBack(); }}
          >
            <Ionicons name="stop-circle" size={24} color={COLORS.secondary} />
            <Text style={styles.stopText}>Detener</Text>
          </TouchableOpacity>
        </View>

        {/* Acciones */}
        <View style={styles.actionsSection}>
          <Text style={styles.actionsTitle}>Acciones</Text>
          <View style={styles.actionsGrid}>
            {/* WhatsApp */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => shareTrackViaWhatsApp(currentTrack)}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#25D36620' }]}>
                <Ionicons name="logo-whatsapp" size={26} color="#25D366" />
              </View>
              <Text style={styles.actionLabel}>WhatsApp</Text>
            </TouchableOpacity>

            {/* Bluetooth / Compartir */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => shareTrackNative(currentTrack)}
            >
              <View style={[styles.actionIcon, { backgroundColor: COLORS.accentGlow }]}>
                <Ionicons name="bluetooth" size={26} color={COLORS.accent} />
              </View>
              <Text style={styles.actionLabel}>Bluetooth</Text>
            </TouchableOpacity>

            {/* Descargar (Premium) */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => {
                if (isPremium) {
                  // Descarga real
                } else {
                  navigation.navigate('Premium');
                }
              }}
            >
              <View style={[styles.actionIcon, { backgroundColor: isPremium ? COLORS.premiumGlow : COLORS.cardBorder }]}>
                <Ionicons
                  name="cloud-download"
                  size={26}
                  color={isPremium ? COLORS.premium : COLORS.textMuted}
                />
              </View>
              <Text style={styles.actionLabel}>Descargar</Text>
              {!isPremium && <Ionicons name="lock-closed" size={10} color={COLORS.textMuted} />}
            </TouchableOpacity>

            {/* Letras (Premium) */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => !isPremium && navigation.navigate('Premium')}
            >
              <View style={[styles.actionIcon, { backgroundColor: isPremium ? COLORS.primaryGlow : COLORS.cardBorder }]}>
                <Ionicons
                  name="document-text"
                  size={26}
                  color={isPremium ? COLORS.primary : COLORS.textMuted}
                />
              </View>
              <Text style={styles.actionLabel}>Letras</Text>
              {!isPremium && <Ionicons name="lock-closed" size={10} color={COLORS.textMuted} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Licencia */}
        <View style={styles.license}>
          <Ionicons name="information-circle" size={14} color={COLORS.textMuted} />
          <Text style={styles.licenseText}>
            Licencia Creative Commons · Jamendo
          </Text>
        </View>
      </ScrollView>

      <AppFooter onPremiumPress={() => navigation.navigate('Premium')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  emptyPlayer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { color: COLORS.textSecondary, fontSize: 16, textAlign: 'center' },
  goBackBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, backgroundColor: COLORS.primaryGlow, borderWidth: 1, borderColor: COLORS.primary },
  goBackText: { color: COLORS.primary, fontWeight: '700' },
  coverSection: { alignItems: 'center', paddingVertical: 32, gap: 16 },
  coverShadow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 20,
  },
  coverLarge: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceLight,
  },
  wavesRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 44 },
  waveBar: { width: 5, borderRadius: 3, backgroundColor: COLORS.primary },
  infoSection: { padding: 24, paddingBottom: 12, alignItems: 'center' },
  trackName: { fontSize: 24, fontWeight: '900', color: COLORS.text, textAlign: 'center', marginBottom: 8 },
  artistName: { fontSize: 16, color: COLORS.primary, fontWeight: '600', marginBottom: 4 },
  albumName: { fontSize: 13, color: COLORS.textMuted, marginBottom: 12 },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'center' },
  tagBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: COLORS.primaryGlow, borderWidth: 1, borderColor: COLORS.primary },
  tagText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  progressSection: { paddingHorizontal: 32, marginBottom: 16 },
  progressBar: { paddingVertical: 12 },
  progressTrack: { height: 4, backgroundColor: COLORS.cardBorder, borderRadius: 2, position: 'relative' },
  progressFill: { height: 4, backgroundColor: COLORS.primary, borderRadius: 2 },
  progressThumb: { position: 'absolute', top: -6, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.primary, marginLeft: -8 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontSize: 12, color: COLORS.textMuted },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 12 },
  controlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 12 },
  stopRow: { alignItems: 'center', marginBottom: 16 },
  stopBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: `${COLORS.secondary}20`, borderWidth: 1, borderColor: COLORS.secondary },
  stopText: { color: COLORS.secondary, fontWeight: '700' },
  actionsSection: { padding: 16 },
  actionsTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 14 },
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  actionBtn: { alignItems: 'center', gap: 6 },
  actionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
  actionLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },
  license: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 16, paddingBottom: 24 },
  licenseText: { fontSize: 11, color: COLORS.textMuted },
});
