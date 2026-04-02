import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Platform, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { shareApp, openAppStore } from '../services/shareService';

// Logo real del usuario - imagen local
// Si usas Expo Snack, reemplaza con URL hospedada:
// const LOGO_URI = 'https://TU_URL/logo.png';
const LOGO_SOURCE = require('../../assets/icon.png');

type Props = {
  title?: string;
  onBack?: () => void;
  onAdmin?: () => void;
  showAdmin?: boolean;
  navigation?: any;
};

export default function AppHeader({ title, onBack, onAdmin, showAdmin = false }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Logo Syncro Music */}
      <TouchableOpacity style={styles.logoArea} activeOpacity={0.85}>
        <Image source={LOGO_SOURCE} style={styles.logoImage} resizeMode="contain" />
        <View>
          <Text style={styles.appName}>Syncro</Text>
          <Text style={styles.appSubName}>Music</Text>
        </View>
      </TouchableOpacity>

      {/* Título central */}
      {title ? (
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {/* Botones derecha */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} onPress={shareApp} accessibilityLabel="Compartir app">
          <Ionicons name="share-social" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={openAppStore} accessibilityLabel="Instalar app">
          <Ionicons name="download" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {showAdmin && onAdmin && (
          <TouchableOpacity
            style={[styles.iconBtn, styles.adminBtn]}
            onPress={onAdmin}
            accessibilityLabel="Panel administrador"
          >
            <Ionicons name="keypad" size={20} color={COLORS.premium} />
          </TouchableOpacity>
        )}
      </View>

      {/* Botón volver */}
      {onBack && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack} accessibilityLabel="Volver">
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight ?? 28) + 8,
    paddingBottom: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  appName: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
    lineHeight: 16,
  },
  appSubName: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.accent,
    lineHeight: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminBtn: {
    backgroundColor: COLORS.premiumGlow,
    borderWidth: 1,
    borderColor: COLORS.premium,
  },
  backBtn: {
    position: 'absolute',
    left: 60,
    top: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight ?? 28) + 6,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
