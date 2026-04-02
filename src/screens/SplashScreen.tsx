import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useUserStore } from '../store/userStore';

const { width, height } = Dimensions.get('window');

// ======================================================
// INSTRUCCIÓN: Reemplaza esta URL con tu video real.
// Pasos:
//  1. Descarga el video desde Meta AI
//  2. Súbelo a Google Drive como archivo público
//  3. La URL directa tiene este formato:
//     https://drive.google.com/uc?export=download&id=TU_ID
//  O usa Cloudinary:
//     https://res.cloudinary.com/TU_CUENTA/video/upload/splash_video.mp4
// ======================================================
const SPLASH_VIDEO_URL = 'https://drive.google.com/uc?export=download&id=1nngVSYefHbkLfdAz8SZ8rq1QNP2-5CAL';

type Props = { navigation: any };

export default function SplashScreen({ navigation }: Props) {
  const { loadUserState } = useUserStore();
  const videoRef = useRef<Video>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    loadUserState();

    // Animar logo encima del video
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ]).start();
    }, 300);

    // Navegar al Home después de 3 segundos
    const timer = setTimeout(() => {
      Animated.timing(overlayOpacity, {
        toValue: 1, duration: 500, useNativeDriver: true
      }).start(() => {
        navigation.replace('Home');
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Video de fondo */}
      {!videoError ? (
        <Video
          ref={videoRef}
          source={{ uri: SPLASH_VIDEO_URL }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          isMuted={false}
          onError={() => setVideoError(true)}
        />
      ) : (
        // Fallback animado si el video no carga
        <LinearGradient
          colors={['#0A0A1F', '#2D1B69', '#0A0A1F']}
          style={StyleSheet.absoluteFill}
        >
          {/* Estrellas decorativas */}
          {Array.from({ length: 30 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.star,
                {
                  left: `${(i * 37) % 100}%` as any,
                  top: `${(i * 53) % 100}%` as any,
                  width: (i % 3) + 1,
                  height: (i % 3) + 1,
                  opacity: 0.3 + (i % 5) * 0.1,
                },
              ]}
            />
          ))}
        </LinearGradient>
      )}

      {/* Overlay oscuro gradiente (para legibilidad del texto) */}
      <LinearGradient
        colors={['rgba(10,10,31,0.3)', 'rgba(10,10,31,0.6)', 'rgba(10,10,31,0.85)']}
        style={StyleSheet.absoluteFill}
      />

      {/* Logo y nombre animados encima del video */}
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] }
        ]}
      >
        {/* Emblema */}
        <View style={styles.emblem}>
          <View style={styles.outerRing}>
            <View style={styles.innerCircle}>
              <Ionicons name="musical-notes" size={52} color={COLORS.white} />
            </View>
          </View>
          {/* Onda animada */}
          <View style={styles.waveRow}>
            {[16, 28, 20, 36, 16, 28, 18].map((h, i) => (
              <Animated.View
                key={i}
                style={[styles.waveBar, {
                  height: h,
                  backgroundColor: i % 2 === 0 ? COLORS.primary : COLORS.accent,
                }]}
              />
            ))}
          </View>
        </View>

        {/* Texto */}
        <Text style={styles.appName}>Syncro</Text>
        <Text style={styles.appSub}>MUSIC</Text>
        <Text style={styles.tagline}>Tu música. Sin límites.</Text>
      </Animated.View>

      {/* Overlay fade-out al navegar */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.fadeOverlay, { opacity: overlayOpacity }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },
  star: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 4,
  },
  emblem: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  outerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: `${COLORS.primary}60`,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 40,
  },
  waveBar: {
    width: 5,
    borderRadius: 3,
  },
  appName: {
    fontSize: 56,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -1,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginTop: 4,
  },
  appSub: {
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.accent,
    letterSpacing: 10,
    marginTop: -8,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
    marginTop: 8,
  },
  fadeOverlay: {
    backgroundColor: COLORS.background,
  },
});
