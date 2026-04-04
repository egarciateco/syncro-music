import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  Animated, Vibration
} from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GRADIENTS } from '../constants/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSuccess: (isAdmin: boolean) => void;
};

const ADMIN_CODE = '5753';
const MAX_DIGITS = 4;

// Frecuencias de campanitas para cada dígito (Hz)
const BELL_NOTES = [523, 587, 659, 698, 784, 880, 988, 1047, 1175, 1319];

export default function KeypadModal({ visible, onClose, onSuccess }: Props) {
  const [code, setCode] = useState('');
  const [shake] = useState(new Animated.Value(0));
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  const playBell = async (digit: string) => {
    try {
      const note = BELL_NOTES[parseInt(digit)] || BELL_NOTES[0];
      // Usamos un sonido de tick system si no hay sonido custom
      const { sound: s } = await Audio.Sound.createAsync(
        { uri: `https://actions.google.com/sounds/v1/alarms/desk_bell.ogg` },
        { shouldPlay: true, volume: 0.8 }
      );
      setSound(s);
      setTimeout(() => s.unloadAsync(), 500);
    } catch (e) {
      // Si no carga el sonido, vibrar como fallback
      Vibration.vibrate(30);
    }
  };

  const handleDigit = async (digit: string) => {
    if (code.length >= MAX_DIGITS) return;
    await playBell(digit);
    const newCode = code + digit;
    setCode(newCode);

    if (newCode.length === MAX_DIGITS) {
      setTimeout(() => {
        const isAdmin = newCode === ADMIN_CODE;
        onSuccess(isAdmin);
        setCode('');
      }, 300);
    }
  };

  const handleDelete = () => {
    setCode(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
    setCode('');
  };

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['C', '0', '⌫'],
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <LinearGradient colors={['#12122A', '#0A0A1F']} style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.lockIcon}>
              <Ionicons name="shield-checkmark" size={28} color={COLORS.premium} />
            </View>
            <Text style={styles.title}>Acceso Especial</Text>
            <Text style={styles.subtitle}>Ingrese su código de administrador</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Display código */}
          <Animated.View style={[styles.codeDisplay, { transform: [{ translateX: shake }] }]}>
            {Array.from({ length: MAX_DIGITS }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.digitBox,
                  i < code.length && styles.digitBoxFilled,
                ]}
              >
                {i < code.length ? (
                  <View style={styles.digitDot} />
                ) : null}
              </View>
            ))}
          </Animated.View>

          {/* Teclado tipo cajero */}
          <View style={styles.keypad}>
            {keys.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.keyRow}>
                {row.map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.key,
                      key === 'C' && styles.keyClear,
                      key === '⌫' && styles.keyDelete,
                    ]}
                    onPress={() => {
                      if (key === 'C') handleClear();
                      else if (key === '⌫') handleDelete();
                      else handleDigit(key);
                    }}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={
                        key === 'C'
                          ? ['#EF4444', '#DC2626']
                          : key === '⌫'
                          ? ['#374151', '#1F2937']
                          : ['#1E1E3F', '#12122A']
                      }
                      style={styles.keyGradient}
                    >
                      {key === '⌫' ? (
                        <Ionicons name="backspace" size={22} color={COLORS.textSecondary} />
                      ) : (
                        <Text style={[
                          styles.keyText,
                          key === 'C' && styles.keyTextRed
                        ]}>{key}</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <Text style={styles.hint}>Solo el administrador puede acceder a este panel</Text>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 40,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.premiumGlow,
    borderWidth: 2,
    borderColor: COLORS.premium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  digitBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryGlow,
  },
  digitDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  keypad: {
    gap: 12,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  key: {
    width: 88,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  keyClear: {
    borderColor: '#EF4444',
  },
  keyDelete: {
    borderColor: COLORS.cardBorder,
  },
  keyGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
  },
  keyTextRed: {
    color: '#fff',
    fontSize: 18,
  },
  hint: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 20,
    fontStyle: 'italic',
  },
});
