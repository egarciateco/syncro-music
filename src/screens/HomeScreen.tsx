import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import MiniPlayer from '../components/MiniPlayer';
import TrackCard from '../components/TrackCard';
import FilterGrid from '../components/FilterGrid';
import FilterOptions from '../components/FilterOptions';
import KeypadModal from '../components/KeypadModal';
import { FILTER_CATEGORIES, FilterCategory, FilterOption } from '../constants/filters';
import { searchTracks, getPopularTracks, JamendoTrack } from '../services/jamendo';
import { useUserStore } from '../store/userStore';
import { getFolders, addTrackToFolder, createFolder } from '../services/storageService';

type Props = { navigation: any };

export default function HomeScreen({ navigation }: Props) {
  const { isPremium, isAdmin, setAdmin } = useUserStore();
  const [tracks, setTracks] = useState<JamendoTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ category: FilterCategory; options: string[] }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory | null>(null);
  const [keypadVisible, setKeypadVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [artistText, setArtistText] = useState('');

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    setLoading(true);
    const results = await getPopularTracks(30);
    setTracks(results);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTracks();
    setRefreshing(false);
  };

  const applyFilters = useCallback(async () => {
    if (activeFilters.length === 0 && !searchText && !artistText) {
      return loadTracks();
    }

    setLoading(true);
    try {
      let tags: string[] = [];
      let datebetween: string | undefined;
      let name: string | undefined = searchText || undefined;
      let artist: string | undefined = artistText || undefined;

      for (const { category, options } of activeFilters) {
        for (const optId of options) {
          const opt = category.options.find(o => o.id === optId);
          if (opt) {
            if (opt.paramKey === 'tags') tags.push(opt.value);
            if (opt.paramKey === 'datebetween') datebetween = opt.value;
          }
        }
      }

      const results = await searchTracks({
        tags: tags.length > 0 ? tags.join('+') : undefined,
        datebetween,
        name,
        artist,
        limit: 40,
      });
      setTracks(results);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [activeFilters, searchText, artistText]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSelectCategory = (category: FilterCategory) => {
    if (category.id === 'name' || category.id === 'artist') {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(prev => prev?.id === category.id ? null : category);
    }
  };

  const handleToggleOption = (option: FilterOption) => {
    if (!selectedCategory) return;
    setActiveFilters(prev => {
      const existing = prev.find(f => f.category.id === selectedCategory.id);
      if (existing) {
        const newOptions = existing.options.includes(option.id)
          ? existing.options.filter(o => o !== option.id)
          : [...existing.options, option.id];
        if (newOptions.length === 0) return prev.filter(f => f.category.id !== selectedCategory.id);
        return prev.map(f => f.category.id === selectedCategory.id ? { ...f, options: newOptions } : f);
      } else {
        return [...prev, { category: selectedCategory, options: [option.id] }];
      }
    });
  };

  const clearCategoryFilter = () => {
    if (selectedCategory) {
      setActiveFilters(prev => prev.filter(f => f.category.id !== selectedCategory.id));
    }
  };

  const handleKeypadSuccess = (isAdminCode: boolean) => {
    setKeypadVisible(false);
    setAdmin(isAdminCode);
    navigation.navigate('AccessResult', { isAdmin: isAdminCode, isSuccess: true });
  };

  const handleKeypadFailure = () => {
    setKeypadVisible(false);
    navigation.navigate('AccessResult', { isAdmin: false, isSuccess: false });
  };

  const handleSaveToFolder = async (track: JamendoTrack) => {
    const folders = await getFolders();
    if (folders.length === 0) {
      const newFolder = await createFolder('Mis Favoritos');
      await addTrackToFolder(newFolder.id, track);
    } else {
      navigation.navigate('Saved', { trackToSave: track });
    }
  };

  const totalActiveFilters = activeFilters.reduce((sum, f) => sum + f.options.length, 0);

  return (
    <View style={styles.container}>
      <AppHeader
        showAdmin={true}
        onAdmin={() => setKeypadVisible(true)}
      />

      <ScrollView
        style={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <LinearGradient colors={['#2D1B69', '#0A0A1F']} style={styles.hero}>
          <Text style={styles.heroTitle}>🎵 Syncro Music</Text>
          <Text style={styles.heroSubtitle}>Millones de canciones, todas legales y gratuitas</Text>
          {totalActiveFilters > 0 && (
            <TouchableOpacity
              style={styles.clearAllBtn}
              onPress={() => {
                setActiveFilters([]);
                setSearchText('');
                setArtistText('');
                setSelectedCategory(null);
              }}
            >
              <Text style={styles.clearAllText}>✕ Limpiar {totalActiveFilters} filtro{totalActiveFilters > 1 ? 's' : ''}</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Grid de filtros */}
        <FilterGrid onSelectFilter={handleSelectCategory} />

        {/* Opciones del filtro seleccionado */}
        {selectedCategory && (
          <View style={styles.filterOptionsContainer}>
            <FilterOptions
              category={selectedCategory}
              selectedOptions={activeFilters.find(f => f.category.id === selectedCategory.id)?.options || []}
              onToggleOption={handleToggleOption}
              onTextSearch={selectedCategory.id === 'name' ? setSearchText : setArtistText}
              searchText={selectedCategory.id === 'name' ? searchText : artistText}
              onClearAll={clearCategoryFilter}
            />
          </View>
        )}

        {/* Chips de filtros activos */}
        {activeFilters.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFilters} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
            {activeFilters.map(({ category, options }) =>
              options.map(optId => {
                const opt = category.options.find(o => o.id === optId);
                return opt ? (
                  <View key={`${category.id}_${optId}`} style={[styles.chip, { borderColor: category.color }]}>
                    <Text style={[styles.chipText, { color: category.color }]}>{opt.label}</Text>
                    <TouchableOpacity onPress={() => handleToggleOption(opt)}>
                      <Ionicons name="close-circle" size={14} color={category.color} />
                    </TouchableOpacity>
                  </View>
                ) : null;
              })
            )}
          </ScrollView>
        )}

        {/* Lista de temas */}
        <View style={styles.tracksSection}>
          <View style={styles.tracksSectionHeader}>
            <Text style={styles.sectionTitle}>
              {totalActiveFilters > 0 ? '🎯 Resultados filtrados' : '🔥 Populares ahora'}
            </Text>
            <Text style={styles.trackCount}>{tracks.length} temas</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Buscando en Jamendo...</Text>
            </View>
          ) : tracks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="musical-notes-outline" size={60} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No se encontraron temas</Text>
              <Text style={styles.emptySubText}>Intenta con otros filtros</Text>
            </View>
          ) : (
            tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onSaveToFolder={handleSaveToFolder}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Mini Player */}
      <MiniPlayer onPress={() => navigation.navigate('Player')} />

      {/* Footer */}
      <AppFooter onPremiumPress={() => navigation.navigate('Premium')} />

      {/* Keypad Modal */}
      <KeypadModal
        visible={keypadVisible}
        onClose={() => setKeypadVisible(false)}
        onSuccess={handleKeypadSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  hero: {
    padding: 20,
    paddingTop: 24,
    marginBottom: 8,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  clearAllBtn: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: `${COLORS.secondary}30`,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  clearAllText: { color: COLORS.secondary, fontSize: 13, fontWeight: '700' },
  filterOptionsContainer: { paddingHorizontal: 16, marginTop: 8 },
  activeFilters: { marginVertical: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: '600' },
  tracksSection: { padding: 16, paddingTop: 8 },
  tracksSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  trackCount: { fontSize: 13, color: COLORS.textMuted },
  loadingContainer: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingText: { color: COLORS.textSecondary, fontSize: 14 },
  emptyContainer: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '700', color: COLORS.textSecondary },
  emptySubText: { fontSize: 13, color: COLORS.textMuted },
});
