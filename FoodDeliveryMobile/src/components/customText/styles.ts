import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';

export const styles = StyleSheet.create({
  h1: {
    fontSize: Fonts.normalize(28),
    fontWeight: '700',
    lineHeight: Fonts.normalize(34),
  },
  h2: {
    fontSize: Fonts.normalize(22),
    fontWeight: '700',
    lineHeight: Fonts.normalize(28),
  },
  h3: {
    fontSize: Fonts.normalize(18),
    fontWeight: '600',
    lineHeight: Fonts.normalize(24),
  },
  title: {
    fontSize: Fonts.normalize(16),
    fontWeight: '600',
    lineHeight: Fonts.normalize(22),
  },
  body: {
    fontSize: Fonts.normalize(14),
    fontWeight: '400',
    lineHeight: Fonts.normalize(20),
  },
  caption: {
    fontSize: Fonts.normalize(12),
    fontWeight: '400',
    lineHeight: Fonts.normalize(16),
  },
  button: {
    fontSize: Fonts.normalize(15),
    fontWeight: '600',
    lineHeight: Fonts.normalize(20),
  },
});
