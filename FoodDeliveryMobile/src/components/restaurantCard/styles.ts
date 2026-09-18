import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import { hp, wp } from '../../theme/responsive';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    height: hp(18),
    width: '100%',
    backgroundColor: Colors.surfaceGray,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dealBadge: {
    position: 'absolute',
    top: hp(1.2),
    left: wp(3),
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dealText: {
    fontSize: Fonts.normalize(11),
    color: Colors.white,
    fontWeight: '700',
  },
  deliveryTimePill: {
    position: 'absolute',
    bottom: hp(1.2),
    right: wp(3),
    backgroundColor: Colors.white,
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  deliveryTimeText: {
    fontSize: Fonts.normalize(11),
    fontWeight: '600',
    color: Colors.charcoal,
  },
  content: {
    padding: wp(3.5),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(0.5),
  },
  name: {
    fontSize: Fonts.normalize(16),
    flex: 1,
    marginRight: wp(2),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningLight,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: 6,
  },
  ratingText: {
    fontSize: Fonts.normalize(12),
    marginLeft: wp(1),
  },
  cuisine: {
    fontSize: Fonts.normalize(12),
    marginBottom: hp(0.8),
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp(0.8),
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  feeText: {
    fontSize: Fonts.normalize(12),
  },
  freeFeeText: {
    color: Colors.success,
    fontWeight: '700',
  },
  locationText: {
    fontSize: Fonts.normalize(11),
    maxWidth: wp(45),
  },
});
