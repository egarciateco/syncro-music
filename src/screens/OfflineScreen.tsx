import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import MiniPlayer from '../components/MiniPlayer';
import { JamendoTrack, formatDuration } from '../services/jamendo';
import { usePlayerStore } from '../store/playerStore';
import { useUserStore } from '../store/userStore';

type Props = { navigation: any };

export default function OfflineScreen({ navigation }: Props) {
  const { isPremium } = useUserStore();
  const { playTrack, currentTrack, isPlaying, pauseTrack, resumeTrack } = usePlayerStore();
  const [downloadedTracks] = useState<JamendoTrack[]>([]);

  if (!isPremium) {
    return (
      <View style={styles.container}>
        <AppHeader title="Modo Offline" onBack={() => navigation.goBack()} />
        <View style={styles.premiumGate}>
          <View style={styles.offlineIcon}>
            <Ionicons name="cloud-offline" size={70} color={COLORS.primary} />
          </View>
          <Text style={styles.premiumTitle}>Modo Offline Premium</Text>
          <Text style={styles.premiumText}>
            Descarga tus temas favoritos y escúchalos sin conexión a internet. Solo para usuarios Premium.
          </Text>
          <TouchableOpacity style={styles.premiumBtn} onPress={() => navigation.navigate('Premium')}>
            <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.premiumBtnGradient}>
              <Ionicons name="star" size={20} color="#000" />
              <Text style={styles.premiumBtnText}>¡Hazte Premium!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <AppFooter onPremiumPress={() => navigation.navigate('Premium')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Modo Offline" onBack={() => navigation.goBack()} />

      <LinearGradient colors={['#2D1B69', '#0A0A1F']} style={styles.headerBanner}>
        <View style={styles.offlineIndicator}>
          <Ionicons name="cloud-offline" size={32} color={COLORS.primary} />
          <View style={styles.offlineDot} />
        </View>
        <Text style={styles.bannerTitle}>Modo Offline</Text>
        <Text style={styles.bannerSub}>{downloadedTracks.length} temas descargados</Text>
      </LinearGradient>

      {downloadedTracks.length === 0 ? (
        <View style={styles.empty}>
          <LinearGradient colors={['#2D1B69', '#0A0A1F']} style={styles.emptyIllustration}>
            <Ionicons name="musical-notes" size={60} color={COLORS.primary} />
            <View style={styles.emptyWaves}>
              {[20, 32, 16, 28, 12, 36, 20].map((h, i) => (
                <View key={i} style={[styles.emptyWaveBar, { height: h }]} />
              ))}
            </View>
          </LinearGradient>
          <Text style={styles.emptyTitle}>Sin descargas aún</Text>
          <Text style={styles.emptyText}>
            Descarga temas desde la pantalla principal o el reproductor para escucharlos sin internet
          </Text>
          <TouchableOpacity style={styles.goHomeBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.goHomeBtnText}>Explorar y descargar música</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={downloadedTracks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isActive = currentTrack?.id === item.id;
            const playing = isActive && isPlaying;
            return (
              <View style={[styles.trackRow, isActive && styles.trackRowActive]}>
                <Image source={{ uri: item.image }} style={styles.trackImage} />
                <View style={styles.trackInfo}>
                  <Text style={[styles.trackName, isActive && { color: COLORS.primary }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.trackArtist}>{item.artist_name}</Text>
                  <Text style={styles.trackDuration}>{formatDuration(item.duration)}</Text>
                </View>
                <View style={styles.offlineBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                  <Text style={styles.offlineBadgeText}>Offline</Text>
                </View>
                <TouchableOpacity onPress={() => isActive ? (isPlaying ? pauseTrack() : resumeTrack()) : playTrack(item, downloadedTracks)}>
                  <Ionicons name={playing ? 'pause-circle' : 'play-circle'} size={38} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      <MiniPlayer onPress={() => navigation.navigate('Player')} />
      <AppFooter onPremiumPress={() => navigation.navigate('Premium')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerBanner: { alignItems: 'center', padding: 20, gap: 8 },
  offlineIndicator: { position: 'relative' },
  offlineDot: { position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.background },
  bannerTitle: { fontSize: 24, fontWeight: '900', color: COLORS.white },
  bannerSub: { fontSize: 13, color: COLORS.textSecondary },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 32 },
  emptyIllustration: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 8 },
  emptyWaves: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  emptyWaveBar: { width: 4, backgroundColor: COLORS.accent, borderRadius: 2 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  emptyText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  goHomeBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, backgroundColor: COLORS.primary, marginTop: 8 },
  goHomeBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  list: { padding: 16, gap: 8 },
  trackRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, padding: 10, gap: 10, borderWidth: 1, borderColor: COLORS.cardBorder },
  trackRowActive: { borderColor: COLORS.primary },
  trackImage: { width: 50, height: 50, borderRadius: 12 },
  trackInfo: { flex: 1 },
  trackName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  trackArtist: { fontSize: 12, color: COLORS.textSecondary },
  trackDuration: { fontSize: 11, color: COLORS.textMuted },
  offlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${COLORS.success}20`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  offlineBadgeText: { fontSize: 10, color: COLORS.success, fontWeight: '700' },
  premiumGate: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 32 },
  premiumTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text },
  premiumText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  premiumBtn: { marginTop: 8, borderRadius: 24, overflow: 'hidden' },
  premiumBtnGradient: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 32, paddingVertical: 14 },
  premiumBtnText: { color: '#000', fontWeight: '900', fontSize: 16 },
  offlineIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.primaryGlow, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary },
});
