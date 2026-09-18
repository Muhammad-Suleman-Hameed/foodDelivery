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
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),
  },
  header: {
    marginBottom: hp(2.5),
  },
  title: {
    marginBottom: hp(0.5),
    fontSize: Fonts.normalize(22),
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
  button: {
    marginTop: hp(1),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(2.5),
    marginBottom: hp(2),
  },
  footerText: {
    fontSize: Fonts.normalize(13),
  },
  signInLink: {
    fontSize: Fonts.normalize(13),
  },
});
