import { InkrTheme } from '@/constants/Theme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    StyleSheet,
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

interface InkrFABProps {
  onPress: () => void;
  icon: React.ReactNode;
  size?: 'md' | 'lg';
  style?: ViewStyle;
  haptic?: boolean;
  disabled?: boolean;
}

export function InkrFAB({
  onPress,
  icon,
  size = 'lg',
  style,
  haptic = true,
  disabled = false,
}: InkrFABProps) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.2);

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.9);
      shadowOpacity.value = withTiming(0.3, { duration: InkrTheme.animation.timing.fast });
      
      if (haptic) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1);
      shadowOpacity.value = withTiming(0.2, { duration: InkrTheme.animation.timing.fast });
    }
  };

  const handlePress = () => {
    if (!disabled) {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  return (
    <AnimatedTouchable
      style={[
        animatedStyle,
        styles.base,
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
    >
      {icon}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: InkrTheme.colors.primary,
    borderRadius: InkrTheme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: InkrTheme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  md: {
    width: 56,
    height: 56,
    bottom: InkrTheme.spacing.xl,
    right: InkrTheme.spacing.xl,
  },

  lg: {
    width: 64,
    height: 64,
    bottom: InkrTheme.spacing.xxl,
    right: InkrTheme.spacing.xl,
  },

  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
});
