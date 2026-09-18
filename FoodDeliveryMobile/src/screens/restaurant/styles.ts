import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import { hp, wp } from '../../theme/responsive';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  headerBanner: {
    height: hp(22),
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.surfaceGray,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: hp(2),
    left: wp(4),
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backIcon: {
    fontSize: Fonts.normalize(22),
    lineHeight: Fonts.normalize(24),
    color: Colors.charcoal,
  },
  restaurantInfoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: wp(4),
    marginTop: -hp(4),
    borderRadius: 16,
    padding: wp(4),
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: hp(1.5),
  },
  restaurantName: {
    fontSize: Fonts.normalize(18),
    marginBottom: hp(0.4),
  },
  cuisineText: {
    fontSize: Fonts.normalize(12),
    marginBottom: hp(1),
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: wp(2),
    paddingTop: hp(0.8),
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: 8,
    backgroundColor: Colors.chipBackground,
  },
  pillText: {
    fontSize: Fonts.normalize(11),
    fontWeight: '600',
    color: Colors.charcoal,
  },
  ratingPill: {
    backgroundColor: Colors.warningLight,
  },
  dealPill: {
    backgroundColor: Colors.primaryLight,
  },
  dealPillText: {
    color: Colors.primary,
  },
  categoryScroll: {
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: wp(2),
  },
  categoryTab: {
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
    borderRadius: 20,
    backgroundColor: Colors.chipBackground,
    marginRight: wp(2),
  },
  activeCategoryTab: {
    backgroundColor: Colors.primary,
  },
  categoryTabText: {
    fontSize: Fonts.normalize(12),
    fontWeight: '600',
    color: Colors.charcoal,
  },
  activeCategoryTabText: {
    color: Colors.white,
  },
  scrollContent: {
    padding: wp(4),
    paddingBottom: hp(10),
  },
  sectionTitle: {
    fontSize: Fonts.normalize(16),
    marginBottom: hp(1.2),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(6),
  },
  emptyEmoji: {
    fontSize: Fonts.normalize(40),
    marginBottom: hp(1),
  },
  emptyText: {
    fontSize: Fonts.normalize(14),
    color: Colors.textMuted,
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: hp(2.5),
    left: wp(4),
    right: wp(4),
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(4.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  cartInfo: {
    justifyContent: 'center',
  },
  viewCartButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
    borderRadius: 12,
  },
  viewCartText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: Fonts.normalize(13),
  },
});

