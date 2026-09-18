import { StyleSheet } from 'react-native';
import Colors from '../../../theme/colors';
import Fonts from '../../../theme/fonts';
import { hp, wp } from '../../../theme/responsive';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(5.5),
    paddingVertical: hp(3.5),
  },
  header: {
    alignItems: 'center',
    marginBottom: hp(3.5),
  },
  logoBadge: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.2),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoEmoji: {
    fontSize: Fonts.normalize(30),
  },
  title: {
    marginBottom: hp(0.6),
    letterSpacing: -0.5,
    fontSize: Fonts.normalize(26),
  },
  subtitle: {
    fontSize: Fonts.normalize(13),
  },
  formCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: wp(5),
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorBanner: {
    backgroundColor: Colors.errorLight,
    padding: wp(2.5),
    borderRadius: 8,
    marginBottom: hp(1.5),
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  signInButton: {
    marginTop: hp(1),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(3),
  },
  footerText: {
    fontSize: Fonts.normalize(13),
  },
  signUpLink: {
    fontSize: Fonts.normalize(13),
  },
});
