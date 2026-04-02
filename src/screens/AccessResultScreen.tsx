import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

type Props = {
  navigation: any;
  route: any;
};

export default function AccessResultScreen({ navigation, route }: Props) {
  const { isAdmin, isSuccess } = route.params || { isAdmin: false, isSuccess: false };
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  const isSuccess_ = isAdmin || isSuccess;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.5, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Si es admin, ir a dashboard. Si no es correcta, volver automáticamente.
    const timer = setTimeout(() => {
      if (isAdmin) {
        navigation.replace('AdminDashboard');
      } else {
        navigation.goBack();
      }
    }, isSuccess_ ? 2000 : 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={isSuccess_ ? ['#064E3B', '#065F46', '#022C22'] : ['#7F1D1D', '#991B1B', '#450A0A']}
      style={styles.container}
    >
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Icono */}
        <Animated.View style={[styles.iconCircle, {
          backgroundColor: isSuccess_
            ? COLORS.successGlow
            : COLORS.errorGlow,
          borderColor: isSuccess_ ? COLORS.success : COLORS.error,
          opacity: glowAnim,
        }]}>
          <Ionicons
            name={isSuccess_ ? 'shield-checkmark' : 'shield-outline'}
            size={80}
            color={isSuccess_ ? COLORS.success : COLORS.error}
          />
        </Animated.View>

        {/* Mensaje */}
        <Text style={[styles.message, { color: isSuccess_ ? COLORS.success : COLORS.error }]}>
          {isSuccess_ ? 'Acceso Permitido' : 'Ingreso No Permitido'}
        </Text>

        <Text style={styles.subMessage}>
          {isAdmin
            ? 'Bienvenido, Administrador'
            : isSuccess_
            ? 'Acceso concedido'
            : 'Código incorrecto. Intente nuevamente.'}
        </Text>

        {/* Líneas decorativas */}
        <View style={styles.decorLines}>
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.line,
                { backgroundColor: isSuccess_ ? COLORS.success : COLORS.error, opacity: 1 - i * 0.3 }
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* Botón volver (solo si error) */}
      {!isSuccess_ && (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Intentar de nuevo</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 8,
  },
  message: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subMessage: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  decorLines: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  line: {
    width: 40,
    height: 3,
    borderRadius: 2,
  },
  backBtn: {
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
