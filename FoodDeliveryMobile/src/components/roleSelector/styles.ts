import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import { hp, wp } from '../../theme/responsive';

export const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
  },
  label: {
    marginBottom: hp(0.8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: Fonts.normalize(11),
  },
  rolesContainer: {
    flexDirection: 'row',
    gap: wp(2.5),
  },
  roleCard: {
    flex: 1,
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(3),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeRoleCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  activeOwnerCard: {
    borderColor: Colors.ownerBadge,
    backgroundColor: Colors.ownerBadgeLight,
  },
  roleEmoji: {
    fontSize: Fonts.normalize(20),
    marginBottom: hp(0.4),
  },
  roleTitle: {
    fontSize: Fonts.normalize(13),
  },
});
