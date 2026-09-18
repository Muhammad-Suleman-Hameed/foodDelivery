import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import { hp, wp } from '../../theme/responsive';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(3.5),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  leftContent: {
    flex: 1,
    paddingRight: wp(3),
    justifyContent: 'space-between',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: 6,
    backgroundColor: Colors.chipBackground,
    marginBottom: hp(0.5),
  },
  categoryText: {
    fontSize: Fonts.normalize(10),
    fontWeight: '700',
    color: Colors.textMuted,
  },
  title: {
    fontSize: Fonts.normalize(15),
    marginBottom: hp(0.4),
  },
  description: {
    fontSize: Fonts.normalize(12),
    lineHeight: Fonts.normalize(16),
    marginBottom: hp(1),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  price: {
    fontSize: Fonts.normalize(15),
  },
  soldOutTag: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: 6,
  },
  soldOutText: {
    color: Colors.error,
    fontSize: Fonts.normalize(10),
    fontWeight: '700',
  },
  rightContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: wp(24),
    height: wp(24),
    borderRadius: 14,
    backgroundColor: Colors.surfaceGray,
  },
  addButton: {
    position: 'absolute',
    bottom: -hp(0.8),
    right: -wp(1),
    backgroundColor: Colors.primary,
    width: wp(8.5),
    height: wp(8.5),
    borderRadius: wp(4.25),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  addIcon: {
    color: Colors.white,
    fontSize: Fonts.normalize(18),
    fontWeight: '700',
    lineHeight: Fonts.normalize(20),
  },
});
