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
    fontSize: Fonts.normalize(18),
  },
  refreshBtn: {
    padding: wp(2),
  },
  scrollContent: {
    padding: wp(4),
    paddingBottom: hp(16),
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  restaurantName: {
    fontSize: Fonts.normalize(15),
    marginBottom: hp(0.2),
  },
  orderDate: {
    fontSize: Fonts.normalize(11),
  },
  statusBadge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: Fonts.normalize(11),
    fontWeight: '700',
  },
  itemsList: {
    paddingVertical: hp(0.8),
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginVertical: hp(0.5),
  },
  itemText: {
    fontSize: Fonts.normalize(12),
    lineHeight: Fonts.normalize(18),
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  trackAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  trackText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: Fonts.normalize(12),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(14),
  },
  emptyIconContainer: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    backgroundColor: Colors.surfaceGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1.5),
  },
  emptyTitle: {
    fontSize: Fonts.normalize(17),
    marginBottom: hp(0.5),
  },
  emptyDesc: {
    fontSize: Fonts.normalize(13),
    textAlign: 'center',
    paddingHorizontal: wp(8),
    marginBottom: hp(2.5),
  },
});
