import { ComponentTokens, InkrTheme } from '@/constants/Theme';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface InkrInputProps extends TextInputProps {
  label: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  haptic?: boolean;
}

export function InkrInput({
  label,
  error,
  disabled = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  haptic = true,
  onFocus,
  onBlur,
  value,
  ...textInputProps
}: InkrInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const focusAnimation = useSharedValue(0);
  const borderAnimation = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnimation.value = withTiming(1, { duration: InkrTheme.animation.timing.normal });
    borderAnimation.value = withSpring(1);
    
    if (haptic) {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (!value) {
      focusAnimation.value = withTiming(0, { duration: InkrTheme.animation.timing.normal });
    }
    borderAnimation.value = withSpring(0);
    
    onBlur?.(e);
  };

  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            focusAnimation.value,
            [0, 1],
            [0, -24]
          ),
        },
        {
          scale: interpolate(
            focusAnimation.value,
            [0, 1],
            [1, 0.85]
          ),
        },
      ],
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: interpolate(
        borderAnimation.value,
        [0, 1],
        [0, 0.1]
      ),
      transform: [
        {
          scale: interpolate(
            borderAnimation.value,
            [0, 1],
            [1, 1.02]
          ),
        },
      ],
    };
  });

  const shouldFloatLabel = isFocused || (value && value.length > 0);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Animated.View style={[
        styles.container,
        isFocused && styles.containerFocused,
        containerAnimatedStyle
      ]}>
        <AnimatedText
          style={[
            styles.label,
            shouldFloatLabel && styles.labelFloated,
            isFocused && styles.labelFocused,
            labelAnimatedStyle,
            labelStyle,
          ]}
        >
          {label}
        </AnimatedText>
        
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            shouldFloatLabel && styles.inputWithFloatedLabel,
            disabled && styles.inputDisabled,
            inputStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          editable={!disabled}
          placeholderTextColor={InkrTheme.colors.text.muted}
          {...textInputProps}
        />
      </Animated.View>
      
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: InkrTheme.spacing.sm,
  },
  
  container: {
    position: 'relative',
    height: ComponentTokens.input.height,
    borderWidth: 1,
    borderColor: InkrTheme.colors.border,
    borderRadius: InkrTheme.borderRadius.lg,
    backgroundColor: InkrTheme.colors.surface,
    paddingHorizontal: ComponentTokens.input.padding.horizontal,
    justifyContent: 'center',
    shadowColor: InkrTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 0,
  },

  containerFocused: {
    borderColor: InkrTheme.colors.primary,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  
  label: {
    position: 'absolute',
    left: ComponentTokens.input.padding.horizontal,
    fontSize: InkrTheme.typography.sizes.base,
    fontWeight: InkrTheme.typography.weights.medium,
    backgroundColor: InkrTheme.colors.surface,
    paddingHorizontal: 4,
    color: InkrTheme.colors.text.muted,
  },
  
  labelFloated: {
    fontSize: InkrTheme.typography.sizes.sm,
    fontWeight: InkrTheme.typography.weights.semibold,
  },

  labelFocused: {
    color: InkrTheme.colors.primary,
  },
  
  input: {
    fontSize: InkrTheme.typography.sizes.base,
    color: InkrTheme.colors.text.main,
    fontWeight: InkrTheme.typography.weights.regular,
    paddingTop: 0,
    paddingBottom: 0,
  },
  
  inputWithFloatedLabel: {
    paddingTop: 8,
  },
  
  inputDisabled: {
    color: InkrTheme.colors.disabled,
  },
  
  error: {
    fontSize: InkrTheme.typography.sizes.sm,
    color: InkrTheme.colors.error,
    marginTop: InkrTheme.spacing.sm,
    marginLeft: ComponentTokens.input.padding.horizontal,
    fontWeight: InkrTheme.typography.weights.medium,
  },
});
