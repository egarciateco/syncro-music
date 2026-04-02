export const COLORS = {
  // Fondos
  background: '#0A0A1F',
  surface: '#12122A',
  surfaceLight: '#1E1E3F',
  card: '#1A1A35',
  cardBorder: '#2D2D5E',

  // Primarios
  primary: '#8B5CF6',       // Violeta eléctrico
  primaryDark: '#6D28D9',
  primaryLight: '#A78BFA',
  primaryGlow: 'rgba(139, 92, 246, 0.3)',

  // Secundario
  secondary: '#EC4899',     // Rosa coral
  secondaryDark: '#BE185D',
  secondaryGlow: 'rgba(236, 72, 153, 0.3)',

  // Acento
  accent: '#06B6D4',        // Cyan neón
  accentGlow: 'rgba(6, 182, 212, 0.3)',

  // Premium (dorado)
  premium: '#F59E0B',
  premiumLight: '#FCD34D',
  premiumGlow: 'rgba(245, 158, 11, 0.3)',

  // Estado
  success: '#10B981',
  successGlow: 'rgba(16, 185, 129, 0.4)',
  error: '#EF4444',
  errorGlow: 'rgba(239, 68, 68, 0.4)',
  warning: '#F59E0B',

  // Texto
  text: '#FFFFFF',
  textSecondary: '#B0B0D0',
  textMuted: '#6B6B9A',
  textDisabled: '#3D3D6B',

  // Otros
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.7)',
  gradientStart: '#0A0A1F',
  gradientEnd: '#1A0A2E',
};

export const GRADIENTS = {
  primary: ['#8B5CF6', '#6D28D9'] as const,
  secondary: ['#EC4899', '#BE185D'] as const,
  accent: ['#06B6D4', '#0284C7'] as const,
  premium: ['#F59E0B', '#D97706'] as const,
  background: ['#0A0A1F', '#1A0A2E'] as const,
  card: ['#1A1A35', '#12122A'] as const,
  success: ['#10B981', '#059669'] as const,
  error: ['#EF4444', '#DC2626'] as const,
  splash: ['#0A0A1F', '#2D1B69', '#0A0A1F'] as const,
};
