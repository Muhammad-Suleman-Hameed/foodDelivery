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
  ownerBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2.5),
  },
  ownerTitle: {
    fontSize: Fonts.normalize(15),
  },
  badge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: 6,
    backgroundColor: Colors.ownerBadgeLight,
    alignSelf: 'flex-start',
    marginTop: hp(0.3),
  },
  badgeText: {
    fontSize: Fonts.normalize(10),
  },
  logoutPill: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
  },
  scrollContent: {
    padding: wp(4),
    paddingBottom: hp(16),
  },
  banner: {
    backgroundColor: Colors.charcoal,
    borderRadius: 16,
    padding: wp(5),
    marginBottom: hp(2.5),
  },
  bannerSubtitle: {
    marginTop: hp(0.8),
    opacity: 0.85,
    fontSize: Fonts.normalize(13),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  sectionTitle: {
    fontSize: Fonts.normalize(16),
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 10,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: Fonts.normalize(12),
    fontWeight: '700',
  },
  restaurantCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(4),
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: hp(1.8),
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(0.6),
  },
  restaurantName: {
    fontSize: Fonts.normalize(16),
    flex: 1,
    marginRight: wp(2),
  },
  cuisineTag: {
    fontSize: Fonts.normalize(12),
    marginBottom: hp(0.5),
  },
  addressText: {
    fontSize: Fonts.normalize(11),
    marginBottom: hp(1),
  },
  statsRow: {
    flexDirection: 'row',
    gap: wp(3),
    paddingVertical: hp(0.8),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
    marginVertical: hp(0.8),
  },
  statText: {
    fontSize: Fonts.normalize(11),
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: wp(2),
    marginTop: hp(0.8),
  },
  menuBtn: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 8,
    backgroundColor: Colors.ownerBadgeLight,
  },
  menuBtnText: {
    color: Colors.ownerBadge,
    fontSize: Fonts.normalize(11),
    fontWeight: '700',
  },
  editBtn: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editBtnText: {
    color: Colors.primary,
    fontSize: Fonts.normalize(11),
    fontWeight: '600',
  },
  deleteBtn: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderRadius: 8,
    backgroundColor: Colors.errorLight,
  },
  deleteBtnText: {
    color: Colors.error,
    fontSize: Fonts.normalize(11),
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(6),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    marginVertical: hp(1),
  },
  emptyEmoji: {
    fontSize: Fonts.normalize(36),
    marginBottom: hp(1),
  },
  emptyText: {
    fontSize: Fonts.normalize(14),
    marginBottom: hp(0.4),
  },
  emptySubtext: {
    fontSize: Fonts.normalize(12),
    textAlign: 'center',
    marginBottom: hp(1.5),
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: hp(85),
    padding: wp(5),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalTitle: {
    fontSize: Fonts.normalize(18),
  },
  closeBtn: {
    padding: wp(1),
  },
  closeBtnText: {
    fontSize: Fonts.normalize(18),
    color: Colors.textMuted,
  },
  modalForm: {
    paddingBottom: hp(4),
  },
  // Portal Navigation Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: wp(1),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: Fonts.normalize(11),
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tabButtonTextActive: {
    color: Colors.white,
  },
  // Order Card Styles
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  orderCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
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
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceGray,
    borderRadius: 10,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    marginVertical: hp(1),
  },
  blockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: 6,
  },
  blockButtonText: {
    color: Colors.error,
    fontSize: Fonts.normalize(11),
    fontWeight: '700',
  },
  statusActionRow: {
    flexDirection: 'row',
    gap: wp(2),
    marginTop: hp(1.5),
    flexWrap: 'wrap',
  },
  statusActionBtn: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusActionBtnText: {
    fontSize: Fonts.normalize(12),
    fontWeight: '700',
    color: Colors.white,
  },
  refreshBtn: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.6),
    borderRadius: 16,
    backgroundColor: Colors.surfaceGray,
  },
  refreshBtnText: {
    fontSize: Fonts.normalize(12),
    color: Colors.charcoal,
    fontWeight: '600',
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  toggleBtn: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleBtnActive: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success,
  },
  toggleBtnInactive: {
    backgroundColor: Colors.surfaceGray,
    borderColor: Colors.border,
  },
  toggleBtnText: {
    fontSize: Fonts.normalize(11),
    fontWeight: '700',
  },
  toggleBtnTextActive: {
    color: Colors.success,
  },
  toggleBtnTextInactive: {
    color: Colors.textMuted,
  },
  mealDeleteBtn: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
  },
  mealDeleteBtnText: {
    color: Colors.error,
    fontSize: Fonts.normalize(16),
    fontWeight: '700',
  },
});


