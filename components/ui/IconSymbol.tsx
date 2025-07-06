// Using Ionicons for modern, clean icon design.

import Ionicons from '@expo/vector-icons/Ionicons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<string, ComponentProps<typeof Ionicons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your custom icon mappings here using Ionicons.
 * - see Ionicons in the [Icons Directory](https://icons.expo.fyi/Index/Ionicons).
 * - Ionicons provides clean, modern icon designs perfect for mobile apps.
 */
const MAPPING = {
  // Navigation icons
  'house.fill': 'home',
  'message.fill': 'chatbubble',
  'brain.fill': 'library',
  'gearshape.fill': 'settings',
  'chart.bar.fill': 'bar-chart',
  
  // UI icons
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code-slash',
  'chevron.right': 'chevron-forward',
  'chevron.left': 'chevron-back',
  'plus': 'add',
  'minus': 'remove',
  'search': 'search',
  'filter': 'filter',
  'calendar': 'calendar',
  'pin.fill': 'bookmark',
  'pin': 'bookmark-outline',
  
  // Stats/Activity icons
  'brain.head.profile': 'library',
  'lightbulb.fill': 'bulb',
  'sparkles': 'sparkles',
  'bell.fill': 'notifications',
  'hand.tap.fill': 'finger-print',
  'icloud.fill': 'cloud',
  'shield.fill': 'shield',
  'person.circle.fill': 'person-circle',
  'creditcard.fill': 'card',
  'trash.fill': 'trash',
  'exclamationmark.triangle.fill': 'warning',
  'questionmark.circle.fill': 'help-circle',
  'envelope.fill': 'mail',
  'info.circle.fill': 'information-circle',
} as IconMapping;

/**
 * An icon component that uses Ionicons for clean, modern icon design.
 * This ensures a consistent look across platforms with beautiful, professional icons.
 * Icon `name`s are mapped to appropriate Ionicons equivalents.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <Ionicons color={color} size={size} name={MAPPING[name]} style={style} />;
}
