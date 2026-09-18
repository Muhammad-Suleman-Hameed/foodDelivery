import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import { hp, wp } from '../../theme/responsive';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Fonts.normalize(18),
  },
  scrollContent: {
    padding: wp(4),
    paddingBottom: hp(16),
  },
  avatarCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(5),
    alignItems: 'center',
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarCircle: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: Colors.surfaceGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.2),
  },
  userName: {
    fontSize: Fonts.normalize(17),
    marginBottom: hp(0.3),
  },
  userEmail: {
    fontSize: Fonts.normalize(13),
    marginBottom: hp(1),
  },
  roleBadge: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.4),
    borderRadius: 8,
    backgroundColor: Colors.userBadgeLight,
  },
  roleText: {
    fontSize: Fonts.normalize(11),
    fontWeight: '700',
    color: Colors.userBadge,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: Fonts.normalize(14),
    marginBottom: hp(1.5),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: wp(3),
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Fonts.normalize(11),
    marginBottom: hp(0.2),
  },
  infoValue: {
    fontSize: Fonts.normalize(13),
  },
  logoutSection: {
    marginTop: hp(1),
  },
});
