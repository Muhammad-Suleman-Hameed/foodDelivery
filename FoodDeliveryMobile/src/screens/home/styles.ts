import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import { hp, wp } from '../../theme/responsive';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationContainer: {
    flex: 1,
    marginRight: wp(3),
  },
  deliverToLabel: {
    fontSize: Fonts.normalize(10),
  },
  locationText: {
    fontSize: Fonts.normalize(13),
  },
  logoutPill: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
  },
  searchContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    paddingBottom: hp(1),
    backgroundColor: Colors.white,
  },
  searchInputContainer: {
    height: hp(5.5),
    backgroundColor: Colors.surfaceGray,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3.5),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: Fonts.normalize(16),
    marginRight: wp(2),
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: Fonts.normalize(13),
    color: Colors.charcoal,
  },
  categoriesScroll: {
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: wp(2),
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(0.8),
    borderRadius: 20,
    backgroundColor: Colors.chipBackground,
    marginRight: wp(2),
  },
  activeCategoryChip: {
    backgroundColor: Colors.primary,
  },
  categoryEmoji: {
    fontSize: Fonts.normalize(13),
    marginRight: wp(1.5),
  },
  categoryText: {
    fontSize: Fonts.normalize(12),
    fontWeight: '600',
    color: Colors.charcoal,
  },
  activeCategoryText: {
    color: Colors.white,
  },
  scrollContent: {
    padding: wp(4),
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  feedTitle: {
    fontSize: Fonts.normalize(16),
  },
  feedCount: {
    fontSize: Fonts.normalize(12),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(8),
  },
  emptyEmoji: {
    fontSize: Fonts.normalize(48),
    marginBottom: hp(1.5),
  },
  emptyTitle: {
    fontSize: Fonts.normalize(16),
    marginBottom: hp(0.5),
  },
  emptyDesc: {
    fontSize: Fonts.normalize(13),
    textAlign: 'center',
    maxWidth: wp(70),
  },
});
