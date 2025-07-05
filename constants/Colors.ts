/**
 * Inkr Colors - Light mode first design with clean, rounded aesthetic
 * Based on the Inkr design system tokens
 */

import { ColorTokens } from './Theme';

export const Colors = {
  light: {
    text: ColorTokens.text.main,
    background: ColorTokens.background,
    surface: ColorTokens.surface,
    tint: ColorTokens.primary,
    icon: ColorTokens.text.muted,
    tabIconDefault: ColorTokens.text.muted,
    tabIconSelected: ColorTokens.primary,
    border: ColorTokens.border,
    shadow: ColorTokens.shadow,
  },
  // Future dark mode support
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    surface: '#1F2937',
    tint: ColorTokens.primary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: ColorTokens.primary,
    border: '#374151',
    shadow: ColorTokens.shadow,
  },
};
