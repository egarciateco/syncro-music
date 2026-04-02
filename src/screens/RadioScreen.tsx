import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Image, TextInput, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayerStore } from '../store/playerStore';
import { useUserStore } from '../store/userStore';
import {
  getArgentineRadios, getForeignRadios, searchRadios, RadioStation
} from '../services/radioService';

// Video para la pantalla de Podcast/Radio (Cloudinary)
const RADIO_VIDEO_URL = 'https://drive.google.com/uc?export=download&id=16enx0IMGzkuYZpDLH-nnb6WFhoUkkoRS';

type Tab = 'argentina' | 'foreign' | 'search';
type Props = { navigation: any };

export default function RadioScreen({ navigation }: Props) {
  const { isPremium } = useUserStore();
  const { playTrack, currentTrack, isPlaying, pauseTrack, resumeTrack, sound } = usePlayerStore();
  const [tab, setTab] = useState<Tab>('argentina');
  const [radios, setRadios] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingRadio, setPlayingRadio] = useState<string | null>(null);
  const [radioSound, setRadioSound] = useState<any>(null);

  useEffect(() => {
    if (tab === 'argentina') loadArgentina();
    else if (tab === 'foreign') loadForeign();
  }, [tab]);

  const loadArgentina = async () => {
    setLoading(true);
    const data = await getArgentineRadios(50);
    setRadios(data);
    setLoading(false);
  };

  const loadForeign = async () => {
    setLoading(true);
    const data = await getForeignRadios(50);
    setRadios(data);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    const data = await searchRadios(searchQuery);
    setRadios(data);
    setLoading(false);
  };

  const playRadio = async (station: RadioStation) => {
    try {
      const { Audio } = require('expo-av');

      // Detener radio anterior
      if (radioSound) {
        await radioSound.stopAsync();
        await radioSound.unloadAsync();
      }

      setPlayingRadio(station.stationuuid);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: station.url_resolved || station.url },
        { shouldPlay: true }
      );
      setRadioSound(newSound);
    } catch (e) {
      console.error('Error reproduciendo radio:', e);
      setPlayingRadio(null);
    }
  };

  const stopRadio = async () => {
    if (radioSound) {
      await radioSound.stopAsync();
      await radioSound.unloadAsync();
      setRadioSound(null);
    }
    setPlayingRadio(null);
  };

  if (!isPremium) {
    return (
      <View style={styles.container}>
        <AppHeader title="Radios en Vivo" onBack={() => navigation.goBack()} />
        <LinearGradient colors={['#2D1B69', '#0A0A1F']} style={styles.premiumGateBg}>
          <View style={styles.premiumGate}>
            <View style={styles.radioIcon}>
              <Ionicons name="radio" size={60} color={COLORS.secondary} />
            </View>
            <Text style={styles.premiumTitle}>Radios · Solo Premium</Text>
            <Text style={styles.premiumText}>
              Accede a cientos de radios nacionales e internacionales en vivo
            </Text>
            <TouchableOpacity style={styles.premiumBtn} onPress={() => navigation.navigate('Premium')}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.premiumBtnGradient}>
                <Ionicons name="star" size={18} color="#000" />
                <Text style={styles.premiumBtnText}>¡Hazte Premium!</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <AppFooter onPremiumPress={() => navigation.navigate('Premium')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Radios en Vivo" onBack={() => navigation.goBack()} />

      {/* Hero */}
      <LinearGradient colors={['#1A0A2E', '#0A0A1F']} style={styles.hero}>
        <Ionicons name="radio" size={24} color={COLORS.secondary} />
        <Text style={styles.heroTitle}>Radios en Vivo</Text>
        <Text style={styles.heroSub}>Todas las radios del mundo, en tu bolsillo</Text>
        {playingRadio && (
          <View style={styles.nowPlayingBanner}>
            <View style={styles.liveDot} />
            <Text style={styles.nowPlayingText}>EN VIVO</Text>
            <TouchableOpacity onPress={stopRadio} style={styles.stopRadioBtn}>
              <Ionicons name="stop-circle" size={20} color={COLORS.error} />
              <Text style={styles.stopRadioText}>Detener</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        {([
          { key: 'argentina', label: '🇦🇷 Nacionales', icon: 'flag' },
          { key: 'foreign', label: '🌍 Extranjeras', icon: 'globe' },
          { key: 'search', label: '🔍 Buscar', icon: 'search' },
        ] as const).map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search bar */}
      {tab === 'search' && (
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar radio por nombre..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            color={COLORS.text}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearch}>
            <Text style={styles.searchBtn}>Buscar</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={styles.loaderText}>Cargando radios...</Text>
        </View>
      ) : (
        <FlatList
          data={radios}
          keyExtractor={(item) => item.stationuuid}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isActive = playingRadio === item.stationuuid;
            return (
              <View style={[styles.radioCard, isActive && styles.radioCardActive]}>
                {/* Favicon */}
                <View style={styles.radioFavicon}>
                  {item.favicon ? (
                    <Image source={{ uri: item.favicon }} style={styles.faviconImg} />
                  ) : (
                    <Ionicons name="radio" size={26} color={COLORS.secondary} />
                  )}
                </View>

                {/* Info */}
                <View style={styles.radioInfo}>
                  <Text style={[styles.radioName, isActive && { color: COLORS.secondary }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.radioMeta} numberOfLines={1}>
                    {item.country}{item.language ? ` · ${item.language}` : ''}
                    {item.bitrate > 0 ? ` · ${item.bitrate}kbps` : ''}
                  </Text>
                  {item.tags && (
                    <Text style={styles.radioTags} numberOfLines={1}>{item.tags.split(',').slice(0,3).join(' · ')}</Text>
                  )}
                </View>

                {/* Live badge + Play */}
                <View style={styles.radioActions}>
                  {isActive && (
                    <View style={styles.liveBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>VIVO</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => isActive ? stopRadio() : playRadio(item)}
                    style={styles.playRadio}
                  >
                    <LinearGradient
                      colors={isActive ? ['#EC4899', '#BE185D'] : ['#1E1E3F', '#12122A']}
                      style={styles.playRadioGradient}
                    >
                      <Ionicons
                        name={isActive ? 'stop' : 'play'}
                        size={20}
                        color={COLORS.white}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.empty}>
                <Ionicons name="radio-outline" size={70} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>No se encontraron radios</Text>
              </View>
            ) : null
          }
        />
      )}

      <MiniPlayer onPress={() => navigation.navigate('Player')} />
      <AppFooter onPremiumPress={() => navigation.navigate('Premium')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: { alignItems: 'center', padding: 16, gap: 4 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: COLORS.white },
  heroSub: { fontSize: 13, color: COLORS.textSecondary },
  nowPlayingBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, backgroundColor: `${COLORS.secondary}20`, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: COLORS.secondary },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  nowPlayingText: { color: COLORS.secondary, fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  stopRadioBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 8 },
  stopRadioText: { color: COLORS.error, fontSize: 12, fontWeight: '700' },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.secondary },
  tabText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  tabTextActive: { color: COLORS.secondary, fontWeight: '800' },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: 12, backgroundColor: COLORS.surfaceLight, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, gap: 8, borderWidth: 1, borderColor: COLORS.cardBorder },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },
  searchBtn: { color: COLORS.secondary, fontWeight: '700', fontSize: 13 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loaderText: { color: COLORS.textSecondary, fontSize: 14 },
  list: { padding: 12, gap: 8 },
  radioCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, padding: 12, gap: 10, borderWidth: 1, borderColor: COLORS.cardBorder },
  radioCardActive: { borderColor: COLORS.secondary, backgroundColor: COLORS.surfaceLight },
  radioFavicon: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  faviconImg: { width: 48, height: 48 },
  radioInfo: { flex: 1 },
  radioName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  radioMeta: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 1 },
  radioTags: { fontSize: 10, color: COLORS.textMuted },
  radioActions: { alignItems: 'center', gap: 6 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#EF444420', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  liveText: { fontSize: 9, color: '#EF4444', fontWeight: '800', letterSpacing: 0.5 },
  playRadio: { borderRadius: 14, overflow: 'hidden' },
  playRadioGradient: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 15, color: COLORS.textMuted },
  premiumGateBg: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  premiumGate: { alignItems: 'center', gap: 16, padding: 32 },
  radioIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: `${COLORS.secondary}20`, borderWidth: 2, borderColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center' },
  premiumTitle: { fontSize: 24, fontWeight: '900', color: COLORS.white },
  premiumText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  premiumBtn: { marginTop: 8, borderRadius: 24, overflow: 'hidden' },
  premiumBtnGradient: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 32, paddingVertical: 14 },
  premiumBtnText: { color: '#000', fontWeight: '900', fontSize: 16 },
});
