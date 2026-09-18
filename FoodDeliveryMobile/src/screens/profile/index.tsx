import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, MapPin, Phone, LogOut } from 'lucide-react-native';
import Colors from '../../theme/colors';
import { CustomText } from '../../components/customText';
import { CustomButton } from '../../components/customButton';
import { useAuthStore } from '../../store/useAuthStore';
import { styles } from './styles';

export const ProfileScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.headerTitle}>
          My Account
        </CustomText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Summary Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <User size={36} color={Colors.charcoal} />
          </View>
          <CustomText variant="title" weight="bold" color={Colors.charcoal} style={styles.userName}>
            {user?.name || 'Customer'}
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted} style={styles.userEmail}>
            {user?.email}
          </CustomText>
          <View style={styles.roleBadge}>
            <CustomText style={styles.roleText}>
              {user?.role === 'RESTAURANT_OWNER' ? 'Restaurant Partner' : 'Customer Account'}
            </CustomText>
          </View>
        </View>

        {/* Account Details Section */}
        <View style={styles.section}>
          <CustomText variant="caption" weight="bold" color={Colors.textMuted} style={styles.sectionTitle}>
            PERSONAL INFORMATION
          </CustomText>

          <View style={styles.infoRow}>
            <Mail size={18} color={Colors.textMuted} />
            <View style={styles.infoContent}>
              <CustomText color={Colors.textLight} style={styles.infoLabel}>
                Email Address
              </CustomText>
              <CustomText weight="bold" color={Colors.charcoal} style={styles.infoValue}>
                {user?.email}
              </CustomText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={18} color={Colors.textMuted} />
            <View style={styles.infoContent}>
              <CustomText color={Colors.textLight} style={styles.infoLabel}>
                Delivery Address
              </CustomText>
              <CustomText weight="bold" color={Colors.charcoal} style={styles.infoValue}>
                {user?.address || 'No address provided'}
              </CustomText>
            </View>
          </View>

          <View style={[styles.infoRow, styles.infoRowLast]}>
            <Phone size={18} color={Colors.textMuted} />
            <View style={styles.infoContent}>
              <CustomText color={Colors.textLight} style={styles.infoLabel}>
                Phone Number
              </CustomText>
              <CustomText weight="bold" color={Colors.charcoal} style={styles.infoValue}>
                {user?.phone || 'No phone number provided'}
              </CustomText>
            </View>
          </View>
        </View>

        {/* Logout Action */}
        <View style={styles.logoutSection}>
          <CustomButton
            title="Log Out"
            variant="secondary"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
