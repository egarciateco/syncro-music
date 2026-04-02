import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import AppHeader from '../../components/AppHeader';
import { useAdminStore } from '../../store/adminStore';
import { useUserStore } from '../../store/userStore';
import { addAccessCode, getAccessCodes } from '../../services/storageService';
import { sendCodeViaWhatsApp } from '../../services/shareService';

type Props = { navigation: any };

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function AdminDashboard({ navigation }: Props) {
  const { config, loadConfig, updateConfig } = useAdminStore();
  const { setAdmin } = useUserStore();
  const [price, setPrice] = useState('');
  const [preferenceId, setPreferenceId] = useState('');
  const [description, setDescription] = useState('');
  const [codes, setCodes] = useState<string[]>([]);
  const [newCode, setNewCode] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig().then(() => {
      setPrice(config.premiumPrice);
      setPreferenceId(config.preferenceId);
      setDescription(config.appDescription);
    });
    loadCodes();
  }, []);

  useEffect(() => {
    setPrice(config.premiumPrice);
    setPreferenceId(config.preferenceId);
    setDescription(config.appDescription);
  }, [config.premiumPrice, config.preferenceId, config.appDescription]);

  const loadCodes = async () => {
    const c = await getAccessCodes();
    setCodes(c);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateConfig({ premiumPrice: price, preferenceId, appDescription: description });
    setSaving(false);
    Alert.alert('✓ Guardado', 'Configuración actualizada correctamente');
  };

  const handleGenerateCode = async () => {
    const code = generateCode();
    setNewCode(code);
    await addAccessCode(code);
    loadCodes();
  };

  const handleSendCode = async (code: string) => {
    await sendCodeViaWhatsApp(code);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Panel Admin" onBack={() => navigation.replace('Home')} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Admin */}
        <LinearGradient colors={['#1A0A2E', '#2D1B69']} style={styles.adminHeader}>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.premium} />
          </View>
          <Text style={styles.adminTitle}>Panel de Control</Text>
          <Text style={styles.adminSub}>Administrador · Syncro Music</Text>
        </LinearGradient>

        {/* --- Precio Premium --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="card" size={20} color={COLORS.premium} />
            <Text style={styles.sectionTitle}>Precio Premium</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Precio (USD/mes)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.textMuted}
              placeholder="ej: 2.99"
            />
          </View>
        </View>

        {/* --- MercadoPago --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="logo-usd" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Configuración de Pagos</Text>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>MercadoPago Preference ID</Text>
            <TextInput
              style={[styles.input, styles.inputMonospace]}
              value={preferenceId}
              onChangeText={setPreferenceId}
              placeholderTextColor={COLORS.textMuted}
              multiline
              autoCorrect={false}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Descripción del producto</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
          <Text style={styles.helpText}>
            📌 Para cambiar el precio, actualiza el Preference ID en tu panel de MercadoPago y pega el nuevo ID aquí.
          </Text>
        </View>

        {/* Botón guardar */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.saveBtnGradient}>
            <Ionicons name={saving ? 'hourglass' : 'save'} size={20} color={COLORS.white} />
            <Text style={styles.saveBtnText}>{saving ? 'Guardando...' : 'Guardar Configuración'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* --- Códigos de Acceso --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="key" size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Códigos de Acceso</Text>
          </View>
          <Text style={styles.helpText}>
            Genera códigos para invitar nuevos usuarios. Envíalos por WhatsApp desde aquí.
          </Text>

          <TouchableOpacity style={styles.generateBtn} onPress={handleGenerateCode}>
            <Ionicons name="add-circle" size={20} color={COLORS.accent} />
            <Text style={styles.generateBtnText}>Generar nuevo código</Text>
          </TouchableOpacity>

          {newCode !== '' && (
            <View style={styles.newCodeBanner}>
              <Text style={styles.newCodeLabel}>Nuevo código generado:</Text>
              <Text style={styles.newCodeValue}>{newCode}</Text>
              <TouchableOpacity style={styles.sendCodeBtn} onPress={() => handleSendCode(newCode)}>
                <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                <Text style={styles.sendCodeText}>Enviar por WhatsApp</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.codesListTitle}>Códigos generados ({codes.length}):</Text>
          {codes.map((code, idx) => (
            <View key={idx} style={styles.codeRow}>
              <Text style={styles.codeText}>{code}</Text>
              <TouchableOpacity onPress={() => handleSendCode(code)}>
                <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* --- Info de la App --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color={COLORS.secondary} />
            <Text style={styles.sectionTitle}>Información de la App</Text>
          </View>
          {[
            ['Versión', '1.0.0'],
            ['API Música', 'Jamendo (Creative Commons)'],
            ['API Radios', 'Radio Browser (Gratuita)'],
            ['Pagos', 'MercadoPago'],
            ['Código Admin', '5753'],
          ].map(([label, value]) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Salir del admin */}
        <TouchableOpacity
          style={styles.exitAdminBtn}
          onPress={() => {
            setAdmin(false);
            navigation.replace('Home');
          }}
        >
          <Ionicons name="log-out" size={20} color={COLORS.error} />
          <Text style={styles.exitAdminText}>Salir del Panel Admin</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  adminHeader: { alignItems: 'center', padding: 24, gap: 8 },
  adminBadge: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.premiumGlow,
    borderWidth: 2, borderColor: COLORS.premium,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 4,
  },
  adminTitle: { fontSize: 24, fontWeight: '900', color: COLORS.white },
  adminSub: { fontSize: 13, color: COLORS.premium },
  section: {
    margin: 16, marginBottom: 0,
    backgroundColor: COLORS.card, borderRadius: 20,
    padding: 16, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  inputRow: { marginBottom: 12 },
  inputLabel: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: COLORS.surfaceLight, borderRadius: 12,
    padding: 12, fontSize: 14,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    color: COLORS.text,
  },
  inputMonospace: { fontFamily: 'monospace', fontSize: 12 },
  helpText: { fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic', lineHeight: 18, marginTop: 4 },
  saveBtn: { margin: 16, borderRadius: 16, overflow: 'hidden' },
  saveBtnGradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 16,
  },
  saveBtnText: { color: COLORS.white, fontWeight: '800', fontSize: 16 },
  generateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 12, backgroundColor: COLORS.accentGlow,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.accent, marginVertical: 10,
  },
  generateBtnText: { color: COLORS.accent, fontWeight: '700' },
  newCodeBanner: {
    backgroundColor: `${COLORS.success}15`, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: COLORS.success,
    marginBottom: 12, gap: 8,
  },
  newCodeLabel: { fontSize: 12, color: COLORS.textSecondary },
  newCodeValue: { fontSize: 32, fontWeight: '900', color: COLORS.success, letterSpacing: 8 },
  sendCodeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#25D36620', paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 12, borderWidth: 1,
    borderColor: '#25D366', alignSelf: 'flex-start',
  },
  sendCodeText: { color: '#25D366', fontWeight: '700', fontSize: 13 },
  codesListTitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8, fontWeight: '600', marginTop: 4 },
  codeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8, paddingHorizontal: 10,
    backgroundColor: COLORS.surfaceLight, borderRadius: 10, marginBottom: 6,
  },
  codeText: { fontSize: 22, fontWeight: '800', color: COLORS.text, letterSpacing: 6 },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder,
  },
  infoLabel: { fontSize: 13, color: COLORS.textSecondary },
  infoValue: { fontSize: 13, color: COLORS.text, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 8 },
  exitAdminBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    margin: 16, padding: 14, borderRadius: 16,
    backgroundColor: `${COLORS.error}15`, borderWidth: 1, borderColor: COLORS.error,
    marginBottom: 40,
  },
  exitAdminText: { color: COLORS.error, fontWeight: '700', fontSize: 15 },
});
