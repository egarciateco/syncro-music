import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { COLORS } from '../constants/colors';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import { useUserStore } from '../store/userStore';
import { useAdminStore } from '../store/adminStore';

const { width } = Dimensions.get('window');

type Props = { navigation: any };

const BENEFITS = [
  {
    icon: 'mic',
    title: 'Podcasts',
    desc: 'Acceso ilimitado a miles de podcasts en español e inglés',
    color: '#8B5CF6',
  },
  {
    icon: 'radio',
    title: 'Radios Nacionales',
    desc: 'Todas las radios de Argentina en vivo, sin interrupciones',
    color: '#EC4899',
  },
  {
    icon: 'globe',
    title: 'Radios Extranjeras',
    desc: 'Miles de radios de todo el mundo en vivo',
    color: '#06B6D4',
  },
  {
    icon: 'document-text',
    title: 'Letras en Tiempo Real',
    desc: 'Ve la letra de cada canción sincronizada mientras escuchas',
    color: '#10B981',
  },
  {
    icon: 'videocam',
    title: 'Videos Musicales',
    desc: 'Graba y comparte videos musicales tipo TikTok dentro de Syncro',
    color: '#F59E0B',
  },
  {
    icon: 'cloud-offline',
    title: 'Modo Offline',
    desc: 'Descarga tus temas y escúchalos sin conexión a internet',
    color: '#6366F1',
  },
  {
    icon: 'folder',
    title: 'Carpetas Ilimitadas',
    desc: 'Organiza tu música en carpetas personalizadas',
    color: '#F43F5E',
  },
  {
    icon: 'cloud-download',
    title: 'Descargas Ilimitadas',
    desc: 'Descarga todos los temas que quieras a tu dispositivo',
    color: '#A855F7',
  },
];

const MP_BUTTON_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; }
  .mp-wrapper { display: flex; justify-content: center; padding: 10px; }
</style>
</head>
<body>
<div class="mp-wrapper">
  <script src="https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js"
    data-preference-id="2993211976-7e998a4f-4658-41bb-94d0-4340e2d43561"
    data-source="button">
  </script>
</div>
</body>
</html>
`;

export default function PremiumScreen({ navigation }: Props) {
  const { isPremium, activatePremium } = useUserStore();
  const { config } = useAdminStore();

  return (
    <View style={styles.container}>
      <AppHeader title="Premium" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#F59E0B', '#D97706', '#1A0A2E']} style={styles.hero}>
          <Ionicons name="star" size={48} color="#000" />
          <Text style={styles.heroTitle}>Syncro Music Premium</Text>
          <Text style={styles.heroPrice}>
            Solo <Text style={styles.priceAmount}>${config.premiumPrice} USD</Text> / mes
          </Text>
          {isPremium && (
            <View style={styles.activeBadge}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.activeBadgeText}>¡Ya eres Usuario Premium!</Text>
            </View>
          )}
        </LinearGradient>

        {/* Beneficios */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>¿Qué incluye Premium?</Text>
          <View style={styles.benefitsGrid}>
            {BENEFITS.map((benefit) => (
              <View key={benefit.icon} style={styles.benefitCard}>
                <View style={[styles.benefitIcon, { backgroundColor: `${benefit.color}20`, borderColor: benefit.color }]}>
                  <Ionicons name={benefit.icon as any} size={28} color={benefit.color} />
                </View>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDesc}>{benefit.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pago con MercadoPago */}
        {!isPremium && (
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>💳 Pagar con MercadoPago</Text>
            <Text style={styles.paymentSubtitle}>Acepta todos los medios de pago de Argentina</Text>

            {/* MercadoPago Button via WebView */}
            <View style={styles.mpWebView}>
              <WebView
                source={{ html: MP_BUTTON_HTML }}
                style={{ height: 80 }}
                backgroundColor="transparent"
                scrollEnabled={false}
                onNavigationStateChange={(state) => {
                  // Detectar cuando MercadoPago confirma el pago
                  if (state.url?.includes('success') || state.url?.includes('approved')) {
                    activatePremium();
                    navigation.goBack();
                  }
                }}
              />
            </View>

            {/* Botón demo (activa Premium localmente para pruebas) */}
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => {
                activatePremium();
                navigation.goBack();
              }}
            >
              <Text style={styles.demoBtnText}>🧪 Activar modo demo Premium (prueba)</Text>
            </TouchableOpacity>

            <View style={styles.paymentMethods}>
              <Text style={styles.paymentMethodsTitle}>Medios de pago aceptados:</Text>
              <View style={styles.paymentIcons}>
                {['Tarjeta de Crédito', 'Tarjeta de Débito', 'Efectivo', 'Transferencia', 'Billetera Virtual'].map(m => (
                  <View key={m} style={styles.paymentIcon}>
                    <Text style={styles.paymentIconText}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {isPremium && (
          <View style={styles.premiumActive}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.premiumActiveBanner}>
              <Ionicons name="checkmark-circle" size={32} color={COLORS.white} />
              <Text style={styles.premiumActiveText}>¡Disfrutás de todos los beneficios Premium!</Text>
            </LinearGradient>
          </View>
        )}

        {/* CTA Premium features */}
        <TouchableOpacity style={styles.offlineBtn} onPress={() => navigation.navigate('Offline')}>
          <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.offlineBtnGradient}>
            <Ionicons name="cloud-offline" size={24} color={COLORS.white} />
            <Text style={styles.offlineBtnText}>Ir al Modo Offline</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <AppFooter onPremiumPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  hero: { alignItems: 'center', padding: 32, gap: 8 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#000', textAlign: 'center' },
  heroPrice: { fontSize: 16, color: '#1A0A2E', fontWeight: '600' },
  priceAmount: { fontSize: 24, fontWeight: '900', color: '#1A0A2E' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, backgroundColor: '#10B98130', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  activeBadgeText: { color: COLORS.success, fontWeight: '700', fontSize: 14 },
  benefitsSection: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text, marginBottom: 16 },
  benefitsGrid: { gap: 12 },
  benefitCard: { backgroundColor: COLORS.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.cardBorder, flexDirection: 'row', alignItems: 'center', gap: 14 },
  benefitIcon: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, flexShrink: 0 },
  benefitTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 2 },
  benefitDesc: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
  paymentSection: { padding: 20, paddingTop: 4 },
  paymentTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text, marginBottom: 6 },
  paymentSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 16 },
  mpWebView: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.cardBorder, backgroundColor: COLORS.surface, marginBottom: 12 },
  demoBtn: { alignItems: 'center', padding: 12, backgroundColor: COLORS.surfaceLight, borderRadius: 12, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 16 },
  demoBtnText: { color: COLORS.textMuted, fontSize: 12 },
  paymentMethods: { marginTop: 8 },
  paymentMethodsTitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 10, fontWeight: '600' },
  paymentIcons: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  paymentIcon: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: COLORS.surfaceLight, borderWidth: 1, borderColor: COLORS.cardBorder },
  paymentIconText: { fontSize: 11, color: COLORS.textSecondary },
  premiumActive: { padding: 20 },
  premiumActiveBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, borderRadius: 20 },
  premiumActiveText: { color: COLORS.white, fontWeight: '800', fontSize: 16, flex: 1 },
  offlineBtn: { margin: 20, borderRadius: 20, overflow: 'hidden' },
  offlineBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 },
  offlineBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
});
