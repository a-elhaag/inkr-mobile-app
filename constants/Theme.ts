/**
 * Inkr Design System - Design Tokens
 * Component-driven, token-based design system for Inkr AI memory assistant
 */

// Base Design Tokens
export const DesignTokens = {
  // Spacing System
  spacing: {
    base: 8,
    get sm() { return this.base; },           // 8
    get md() { return this.base * 2; },       // 16
    get lg() { return this.base * 3; },       // 24
    get xl() { return this.base * 4; },       // 32
    get xxl() { return this.base * 5; },      // 40
    get section() { return this.base * 4; },  // 32
  },

  // Border Radius System
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    card: 24,
    full: 9999,
  },

  // Typography Scale
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      title: 28,
      display: 32,
    },
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  // Shadow System
  shadows: {
    sm: {
      shadowColor: '#FF4500',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#FF4500',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#FF4500',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  // Animation Timing
  animation: {
    timing: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      spring: { tension: 100, friction: 8 },
      ease: 'easeInOut',
    },
  },
};

// Color Tokens
export const ColorTokens = {
  // Core Brand Colors
  primary: '#1A73E8',
  shadow: '#FF4500',
  
  // Background Colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  
  // Text Colors
  text: {
    main: '#2C2E33',
    muted: '#737373',
    inverse: '#FFFFFF',
  },
  
  // UI Colors
  border: '#B0B7C3',
  divider: '#E5E7EB',
  
  // State Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Opacity Variants
  overlay: 'rgba(44, 46, 51, 0.8)',
  disabled: 'rgba(115, 115, 115, 0.5)',
};

// Complete Theme Object
export const InkrTheme = {
  colors: ColorTokens,
  spacing: DesignTokens.spacing,
  borderRadius: DesignTokens.borderRadius,
  typography: DesignTokens.typography,
  shadows: DesignTokens.shadows,
  animation: DesignTokens.animation,
};

// Component-specific tokens
export const ComponentTokens = {
  button: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    padding: {
      horizontal: DesignTokens.spacing.lg,
      vertical: DesignTokens.spacing.md,
    },
  },
  
  input: {
    height: 48,
    padding: {
      horizontal: DesignTokens.spacing.md,
      vertical: DesignTokens.spacing.sm,
    },
  },
  
  card: {
    padding: DesignTokens.spacing.lg,
    margin: DesignTokens.spacing.md,
  },
  
  tabBar: {
    height: 80,
    paddingBottom: 20,
  },
};

export type ThemeType = typeof InkrTheme;
