import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image,
  TextInput, Alert, Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import MiniPlayer from '../components/MiniPlayer';
import { getFolders, createFolder, addTrackToFolder, deleteFolder, Folder } from '../services/storageService';
import { JamendoTrack } from '../services/jamendo';
import { shareFolderViaWhatsApp } from '../services/shareService';
import { useUserStore } from '../store/userStore';
import { usePlayerStore } from '../store/playerStore';

type Props = { navigation: any; route: any };

export default function SavedScreen({ navigation, route }: Props) {
  const { isPremium } = useUserStore();
  const { playTrack } = usePlayerStore();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const trackToSave: JamendoTrack | undefined = route.params?.trackToSave;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFolders);
    return unsubscribe;
  }, [navigation]);

  const loadFolders = async () => {
    const data = await getFolders();
    setFolders(data);
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    const folder = await createFolder(folderName.trim());
    if (trackToSave) {
      await addTrackToFolder(folder.id, trackToSave);
      Alert.alert('✓ Guardado', `"${trackToSave.name}" guardado en "${folderName}"`);
    }
    setFolderName('');
    setNewFolderModal(false);
    loadFolders();
  };

  const handleSaveToFolder = async (folder: Folder) => {
    if (!trackToSave) return;
    await addTrackToFolder(folder.id, trackToSave);
    Alert.alert('✓ Guardado', `"${trackToSave.name}" guardado en "${folder.name}"`);
    navigation.goBack();
  };

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    Alert.alert('Eliminar carpeta', `¿Eliminar "${folderName}" y todos sus temas?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await deleteFolder(folderId); loadFolders(); setSelectedFolder(null); } }
    ]);
  };

  if (!isPremium) {
    return (
      <View style={styles.container}>
        <AppHeader title="Temas Guardados" onBack={() => navigation.goBack()} />
        <View style={styles.premiumGate}>
          <Ionicons name="lock-closed" size={70} color={COLORS.premium} />
          <Text style={styles.premiumTitle}>Función Premium</Text>
          <Text style={styles.premiumText}>Guarda temas en carpetas y accede a ellos cuando quieras</Text>
          <TouchableOpacity style={styles.premiumBtn} onPress={() => navigation.navigate('Premium')}>
            <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.premiumBtnGradient}>
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
      <AppHeader title="Mis Carpetas" onBack={() => navigation.goBack()} />

      <LinearGradient colors={['#2D1B69', '#0A0A1F']} style={styles.headerBanner}>
        <Ionicons name="folder" size={28} color={COLORS.premium} />
        <Text style={styles.bannerTitle}>Mis Carpetas</Text>
        <Text style={styles.bannerSub}>{folders.length} carpetas guardadas</Text>
        <TouchableOpacity style={styles.newFolderBtn} onPress={() => setNewFolderModal(true)}>
          <Ionicons name="add-circle" size={18} color={COLORS.primary} />
          <Text style={styles.newFolderText}>Nueva carpeta</Text>
        </TouchableOpacity>
      </LinearGradient>

      {trackToSave && (
        <View style={styles.saveTrackBanner}>
          <Ionicons name="musical-note" size={16} color={COLORS.accent} />
          <Text style={styles.saveTrackText} numberOfLines={1}>
            Guardando: "{trackToSave.name}"
          </Text>
        </View>
      )}

      {selectedFolder ? (
        // Vista detalle de carpeta
        <View style={{ flex: 1 }}>
          <View style={styles.folderDetailHeader}>
            <TouchableOpacity onPress={() => setSelectedFolder(null)}>
              <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.folderDetailTitle}>{selectedFolder.name}</Text>
            <View style={styles.folderDetailActions}>
              <TouchableOpacity onPress={() => shareFolderViaWhatsApp(selectedFolder)}>
                <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteFolder(selectedFolder.id, selectedFolder.name)}>
                <Ionicons name="trash" size={22} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={selectedFolder.tracks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.trackRow}>
                <Image source={{ uri: item.image }} style={styles.trackImage} />
                <View style={styles.trackInfo}>
                  <Text style={styles.trackName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.trackArtist}>{item.artist_name}</Text>
                </View>
                <TouchableOpacity onPress={() => playTrack(item, selectedFolder.tracks)}>
                  <Ionicons name="play-circle" size={36} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons name="folder-open-outline" size={60} color={COLORS.textMuted} />
                <Text style={styles.emptyText}>Carpeta vacía</Text>
              </View>
            }
          />
        </View>
      ) : (
        // Lista de carpetas
        <FlatList
          data={folders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.folderCard}
              onPress={() => trackToSave ? handleSaveToFolder(item) : setSelectedFolder(item)}
            >
              <View style={styles.folderIconBox}>
                <Ionicons name="folder" size={36} color={COLORS.premium} />
              </View>
              <View style={styles.folderInfo}>
                <Text style={styles.folderName}>{item.name}</Text>
                <Text style={styles.folderCount}>{item.tracks.length} temas</Text>
              </View>
              <View style={styles.folderChevron}>
                {trackToSave ? (
                  <Ionicons name="add-circle" size={24} color={COLORS.primary} />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="folder-open-outline" size={80} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>Sin carpetas</Text>
              <Text style={styles.emptyText}>Crea tu primera carpeta para organizar tu música</Text>
            </View>
          }
        />
      )}

      {/* Modal nueva carpeta */}
      <Modal visible={newFolderModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Carpeta</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de la carpeta"
              placeholderTextColor={COLORS.textMuted}
              value={folderName}
              onChangeText={setFolderName}
              color={COLORS.text}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setNewFolderModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCreateBtn} onPress={handleCreateFolder}>
                <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.modalCreateGradient}>
                  <Text style={styles.modalCreateText}>Crear</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <MiniPlayer onPress={() => navigation.navigate('Player')} />
      <AppFooter onPremiumPress={() => navigation.navigate('Premium')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerBanner: { alignItems: 'center', padding: 20, gap: 6 },
  bannerTitle: { fontSize: 22, fontWeight: '900', color: COLORS.white },
  bannerSub: { fontSize: 13, color: COLORS.textSecondary },
  newFolderBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.primaryGlow, borderWidth: 1, borderColor: COLORS.primary },
  newFolderText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  saveTrackBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: COLORS.accentGlow, borderWidth: 1, borderColor: COLORS.accent, margin: 16, borderRadius: 12 },
  saveTrackText: { flex: 1, color: COLORS.accent, fontSize: 13, fontWeight: '600' },
  list: { padding: 16, gap: 10 },
  folderCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, padding: 14, gap: 12, borderWidth: 1, borderColor: COLORS.cardBorder },
  folderIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.premiumGlow, justifyContent: 'center', alignItems: 'center' },
  folderInfo: { flex: 1 },
  folderName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  folderCount: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  folderChevron: { padding: 4 },
  folderDetailHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  folderDetailTitle: { flex: 1, fontSize: 18, fontWeight: '800', color: COLORS.text },
  folderDetailActions: { flexDirection: 'row', gap: 16 },
  trackRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 14, padding: 10, gap: 10, borderWidth: 1, borderColor: COLORS.cardBorder },
  trackImage: { width: 48, height: 48, borderRadius: 10 },
  trackInfo: { flex: 1 },
  trackName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  trackArtist: { fontSize: 12, color: COLORS.textSecondary },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textSecondary },
  emptyText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
  premiumGate: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 32 },
  premiumTitle: { fontSize: 24, fontWeight: '900', color: COLORS.premium },
  premiumText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  premiumBtn: { marginTop: 8, borderRadius: 24, overflow: 'hidden' },
  premiumBtnGradient: { paddingHorizontal: 32, paddingVertical: 14 },
  premiumBtnText: { color: '#000', fontWeight: '900', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: COLORS.cardBorder },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  modalInput: { backgroundColor: COLORS.surfaceLight, borderRadius: 12, padding: 14, fontSize: 15, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 16 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: COLORS.surfaceLight, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
  modalCancelText: { color: COLORS.textSecondary, fontWeight: '700' },
  modalCreateBtn: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  modalCreateGradient: { padding: 14, alignItems: 'center' },
  modalCreateText: { color: COLORS.white, fontWeight: '800', fontSize: 15 },
});
