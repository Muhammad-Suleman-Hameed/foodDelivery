import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Store,
  ClipboardList,
  Shield,
  Mail,
  MapPin,
} from 'lucide-react-native';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { CustomButton } from '../../../components/customButton';
import { useAuthStore } from '../../../store/useAuthStore';
import { useOwnerStore } from '../../../store/useOwnerStore';
import { styles } from '../../profile/styles';

export const OwnerProfileScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { restaurants, orders, blockedUsers } = useOwnerStore();

  const handleLogoutPrompt = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of your partner portal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.headerTitle}>
          Partner Account
        </CustomText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <User size={36} color={Colors.charcoal} strokeWidth={2} />
          </View>

          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.userName}>
            {user?.name || 'Restaurant Owner'}
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted} style={styles.userEmail}>
            {user?.email}
          </CustomText>

          <View style={[styles.roleBadge, { backgroundColor: Colors.ownerBadgeLight, flexDirection: 'row', alignItems: 'center' }]}>
            <Store size={12} color={Colors.ownerBadge} strokeWidth={2} style={{ marginRight: 4 }} />
            <CustomText style={[styles.roleText, { color: Colors.ownerBadge }]}>
              Restaurant Partner
            </CustomText>
          </View>
        </View>

        {/* Business Metrics Overview Card */}
        <View style={styles.section}>
          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.sectionTitle}>
            Business Overview
          </CustomText>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Store size={22} color={Colors.primary} strokeWidth={2} style={{ marginBottom: 4 }} />
              <CustomText variant="h2" weight="bold" color={Colors.charcoal}>
                {restaurants.length}
              </CustomText>
              <CustomText variant="caption" color={Colors.textMuted}>
                Restaurants
              </CustomText>
            </View>

            <View style={{ width: 1, backgroundColor: Colors.divider }} />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <ClipboardList size={22} color={Colors.primary} strokeWidth={2} style={{ marginBottom: 4 }} />
              <CustomText variant="h2" weight="bold" color={Colors.charcoal}>
                {orders.length}
              </CustomText>
              <CustomText variant="caption" color={Colors.textMuted}>
                Total Orders
              </CustomText>
            </View>

            <View style={{ width: 1, backgroundColor: Colors.divider }} />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Shield size={22} color={Colors.primary} strokeWidth={2} style={{ marginBottom: 4 }} />
              <CustomText variant="h2" weight="bold" color={Colors.charcoal}>
                {blockedUsers.length}
              </CustomText>
              <CustomText variant="caption" color={Colors.textMuted}>
                Blocked Users
              </CustomText>
            </View>
          </View>
        </View>

        {/* Contact Info Card */}
        <View style={styles.section}>
          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.sectionTitle}>
            Account Details
          </CustomText>

          <View style={styles.infoRow}>
            <Mail size={16} color={Colors.textMuted} />
            <View style={styles.infoContent}>
              <CustomText variant="caption" color={Colors.textMuted} style={styles.infoLabel}>
                Email Address
              </CustomText>
              <CustomText weight="600" color={Colors.charcoal} style={styles.infoValue}>
                {user?.email}
              </CustomText>
            </View>
          </View>

          {user?.address ? (
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <MapPin size={16} color={Colors.textMuted} />
              <View style={styles.infoContent}>
                <CustomText variant="caption" color={Colors.textMuted} style={styles.infoLabel}>
                  Address
                </CustomText>
                <CustomText weight="600" color={Colors.charcoal} style={styles.infoValue}>
                  {user.address}
                </CustomText>
              </View>
            </View>
          ) : null}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <CustomButton
            title="Sign Out"
            variant="secondary"
            onPress={handleLogoutPrompt}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OwnerProfileScreen;
