import { ComponentTokens, InkrTheme } from '@/constants/Theme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface InkrButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export function InkrButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  haptic = true,
}: InkrButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8, { duration: InkrTheme.animation.timing.fast });
    
    if (haptic && !disabled) {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1, { duration: InkrTheme.animation.timing.fast });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      ...styles.base,
      ...styles[size],
      ...styles[variant],
    };

    if (disabled) {
      return { ...baseStyle, ...styles.disabled };
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle = {
      ...styles.text,
      ...styles[`${size}Text` as keyof typeof styles],
      ...styles[`${variant}Text` as keyof typeof styles],
    };

    if (disabled) {
      return { ...baseTextStyle, ...styles.disabledText };
    }

    return baseTextStyle;
  };

  return (
    <AnimatedTouchable
      style={[animatedStyle, getButtonStyle(), style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? InkrTheme.colors.text.inverse : InkrTheme.colors.primary} 
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  // Base Styles
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: InkrTheme.borderRadius.lg,
    paddingHorizontal: ComponentTokens.button.padding.horizontal,
    ...InkrTheme.shadows.sm,
  },

  // Size Variants
  sm: {
    height: ComponentTokens.button.height.sm,
    paddingHorizontal: InkrTheme.spacing.md,
  },
  md: {
    height: ComponentTokens.button.height.md,
  },
  lg: {
    height: ComponentTokens.button.height.lg,
    paddingHorizontal: InkrTheme.spacing.xl,
  },

  // Style Variants
  primary: {
    backgroundColor: InkrTheme.colors.primary,
    shadowColor: InkrTheme.colors.shadow,
  },
  secondary: {
    backgroundColor: InkrTheme.colors.surface,
    shadowColor: InkrTheme.colors.shadow,
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: InkrTheme.colors.primary,
    shadowOpacity: 0,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
  },

  // Disabled State
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
  },

  // Text Styles
  text: {
    fontWeight: InkrTheme.typography.weights.semibold,
    textAlign: 'center',
  },
  smText: {
    fontSize: InkrTheme.typography.sizes.sm,
  },
  mdText: {
    fontSize: InkrTheme.typography.sizes.base,
  },
  lgText: {
    fontSize: InkrTheme.typography.sizes.lg,
  },

  // Text Variants
  primaryText: {
    color: InkrTheme.colors.text.inverse,
  },
  secondaryText: {
    color: InkrTheme.colors.text.main,
  },
  outlineText: {
    color: InkrTheme.colors.primary,
  },
  ghostText: {
    color: InkrTheme.colors.primary,
  },
  disabledText: {
    color: InkrTheme.colors.disabled,
  },
});
