import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import MiniPlayer from '../components/MiniPlayer';
import { getFavorites, removeFromFavorites } from '../services/storageService';
import { JamendoTrack, formatDuration } from '../services/jamendo';
import { usePlayerStore } from '../store/playerStore';
import { shareFolderViaWhatsApp } from '../services/shareService';

type Props = { navigation: any };

export default function FavoritesScreen({ navigation }: Props) {
  const [favorites, setFavorites] = useState<JamendoTrack[]>([]);
  const { playTrack, currentTrack, isPlaying, pauseTrack, resumeTrack } = usePlayerStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const handleRemove = async (trackId: string) => {
    Alert.alert(
      'Eliminar favorito',
      '¿Deseas eliminar este tema de tus favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await removeFromFavorites(trackId);
            loadFavorites();
          }
        }
      ]
    );
  };

  const handlePlayPause = (track: JamendoTrack) => {
    if (currentTrack?.id === track.id) {
      isPlaying ? pauseTrack() : resumeTrack();
    } else {
      playTrack(track, favorites);
    }
  };

  const shareAll = async () => {
    if (favorites.length === 0) return;
    await shareFolderViaWhatsApp({
      id: 'favorites',
      name: 'Mis Favoritos',
      createdAt: new Date().toISOString(),
      tracks: favorites,
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Tus Favoritos" onBack={() => navigation.goBack()} />

      <LinearGradient colors={['#2D1B69', '#0A0A1F']} style={styles.headerBanner}>
        <Ionicons name="heart" size={28} color={COLORS.secondary} />
        <Text style={styles.bannerTitle}>Tus Favoritos</Text>
        <Text style={styles.bannerSub}>{favorites.length} temas guardados automáticamente</Text>
        {favorites.length > 0 && (
          <TouchableOpacity style={styles.shareAllBtn} onPress={shareAll}>
            <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
            <Text style={styles.shareAllText}>Compartir lista</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={80} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
          <Text style={styles.emptyText}>Al reproducir un tema se agregará automáticamente aquí</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.exploreBtnText}>Explorar música</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => {
            const isActive = currentTrack?.id === item.id;
            const playing = isActive && isPlaying;
            return (
              <View style={[styles.trackRow, isActive && styles.trackRowActive]}>
                <Text style={styles.trackIndex}>{index + 1}</Text>
                <Image
                  source={{ uri: item.image || 'https://via.placeholder.com/48' }}
                  style={styles.trackImage}
                />
                <View style={styles.trackInfo}>
                  <Text style={[styles.trackName, isActive && { color: COLORS.primary }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.trackArtist} numberOfLines={1}>{item.artist_name}</Text>
                  <Text style={styles.trackDuration}>{formatDuration(item.duration)}</Text>
                </View>
                <View style={styles.trackActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handlePlayPause(item)}>
                    <Ionicons name={playing ? 'pause-circle' : 'play-circle'} size={36} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleRemove(item.id)}>
                    <Ionicons name="heart" size={22} color={COLORS.secondary} />
                  </TouchableOpacity>
                </View>
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
  headerBanner: { alignItems: 'center', padding: 20, gap: 6 },
  bannerTitle: { fontSize: 24, fontWeight: '900', color: COLORS.white },
  bannerSub: { fontSize: 13, color: COLORS.textSecondary },
  shareAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#25D36620', borderWidth: 1, borderColor: '#25D366' },
  shareAllText: { color: '#25D366', fontWeight: '700', fontSize: 13 },
  list: { padding: 16, gap: 8 },
  trackRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, padding: 10, gap: 10, borderWidth: 1, borderColor: COLORS.cardBorder },
  trackRowActive: { borderColor: COLORS.primary, backgroundColor: COLORS.surfaceLight },
  trackIndex: { width: 20, textAlign: 'center', color: COLORS.textMuted, fontSize: 12, fontWeight: '700' },
  trackImage: { width: 48, height: 48, borderRadius: 10, backgroundColor: COLORS.surfaceLight },
  trackInfo: { flex: 1 },
  trackName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  trackArtist: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 },
  trackDuration: { fontSize: 11, color: COLORS.textMuted },
  trackActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionBtn: { padding: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textSecondary },
  emptyText: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  exploreBtn: { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, backgroundColor: COLORS.primary },
  exploreBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
});
