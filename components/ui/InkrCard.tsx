import { ComponentTokens, InkrTheme } from '@/constants/Theme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface InkrCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  haptic?: boolean;
  disabled?: boolean;
}

export function InkrCard({
  children,
  onPress,
  style,
  variant = 'default',
  haptic = true,
  disabled = false,
}: InkrCardProps) {
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.1);

  const handlePressIn = () => {
    if (!disabled && onPress) {
      scale.value = withSpring(0.98);
      shadowOpacity.value = withTiming(0.2, { duration: InkrTheme.animation.timing.fast });
      
      if (haptic) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handlePressOut = () => {
    if (!disabled && onPress) {
      scale.value = withSpring(1);
      shadowOpacity.value = withTiming(0.1, { duration: InkrTheme.animation.timing.fast });
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      if (haptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const cardStyles = [
    styles.base,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const CardComponent = onPress ? AnimatedTouchable : Animated.View;

  const touchableProps = onPress ? {
    onPress: handlePress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    disabled: disabled,
    activeOpacity: 1,
  } : {};

  return (
    <CardComponent
      style={[animatedStyle, cardStyles]}
      {...touchableProps}
    >
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: InkrTheme.borderRadius.card,
    padding: ComponentTokens.card.padding,
    margin: ComponentTokens.card.margin,
    backgroundColor: InkrTheme.colors.surface,
  },

  default: {
    ...InkrTheme.shadows.sm,
  },

  elevated: {
    ...InkrTheme.shadows.md,
  },

  outlined: {
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },

  disabled: {
    opacity: 0.5,
  },
});
