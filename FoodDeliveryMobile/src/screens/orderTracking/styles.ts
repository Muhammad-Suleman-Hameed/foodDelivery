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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Fonts.normalize(16),
  },
  refreshButton: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 20,
    backgroundColor: Colors.surfaceGray,
  },
  refreshText: {
    fontSize: Fonts.normalize(12),
    color: Colors.charcoal,
    fontWeight: '600',
  },
  scrollContent: {
    padding: wp(4),
    paddingBottom: hp(12),
  },
  bannerCard: {
    backgroundColor: Colors.charcoal,
    borderRadius: 18,
    padding: wp(5),
    marginBottom: hp(2.5),
    alignItems: 'center',
  },
  bannerEmoji: {
    fontSize: Fonts.normalize(48),
    marginBottom: hp(1),
  },
  bannerTitle: {
    fontSize: Fonts.normalize(20),
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  bannerSubtitle: {
    textAlign: 'center',
    opacity: 0.85,
    fontSize: Fonts.normalize(13),
  },
  stepperCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(4.5),
    marginBottom: hp(2.5),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepperTitle: {
    fontSize: Fonts.normalize(15),
    marginBottom: hp(2),
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: hp(2.2),
  },
  stepIndicatorCol: {
    alignItems: 'center',
    marginRight: wp(3.5),
    width: wp(8),
  },
  stepCircle: {
    width: wp(7.5),
    height: wp(7.5),
    borderRadius: wp(3.75),
    backgroundColor: Colors.surfaceGray,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepCircleDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepIcon: {
    fontSize: Fonts.normalize(12),
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginTop: hp(0.5),
  },
  stepLineDone: {
    backgroundColor: Colors.success,
  },
  stepContent: {
    flex: 1,
    paddingTop: hp(0.3),
  },
  stepTitle: {
    fontSize: Fonts.normalize(14),
    marginBottom: hp(0.3),
  },
  stepDesc: {
    fontSize: Fonts.normalize(12),
    lineHeight: Fonts.normalize(16),
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: Fonts.normalize(15),
    marginBottom: hp(1.2),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1.2),
  },
  itemName: {
    flex: 1,
    paddingRight: wp(3),
    fontSize: Fonts.normalize(13),
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: Fonts.normalize(13),
    flexShrink: 0,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: hp(1),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    paddingBottom: hp(3),
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
