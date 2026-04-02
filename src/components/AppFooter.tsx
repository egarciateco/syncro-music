import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS } from '../constants/colors';

type Props = {
  onPremiumPress: () => void;
};

export default function AppFooter({ onPremiumPress }: Props) {
  return (
    <View style={styles.container}>
      {/* Banner decorativo */}
      <LinearGradient
        colors={['#0A0A1F', '#1A0A2E', '#0A0A1F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.banner}
      >
        <View style={styles.bannerContent}>
          <Ionicons name="musical-notes" size={14} color={COLORS.primary} />
          <Text style={styles.bannerText}>Syncro Music</Text>
          <Ionicons name="radio" size={12} color={COLORS.accent} />
          <Text style={styles.bannerSub}>Tu música, sin límites</Text>
          <Ionicons name="musical-note" size={14} color={COLORS.secondary} />
        </View>
      </LinearGradient>

      {/* Botón Premium */}
      <TouchableOpacity onPress={onPremiumPress} activeOpacity={0.85} style={styles.premiumWrapper}>
        <LinearGradient
          colors={['#F59E0B', '#D97706', '#B45309']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.premiumBtn}
        >
          <Ionicons name="star" size={18} color="#000" />
          <Text style={styles.premiumText}>¡¡Conviértete en Usuario PREMIUM!!</Text>
          <Ionicons name="arrow-forward" size={16} color="#000" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  banner: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  bannerSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  premiumWrapper: {
    marginHorizontal: 12,
    marginBottom: 8,
    marginTop: 4,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: COLORS.premium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  premiumBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.3,
    flex: 1,
    textAlign: 'center',
  },
});
