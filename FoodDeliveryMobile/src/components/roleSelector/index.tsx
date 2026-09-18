import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { User, Store } from 'lucide-react-native';
import Colors from '../../theme/colors';
import { CustomText } from '../customText';
import { UserRole } from '../../constants/globalConstants';
import { styles } from './styles';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  const isRegular = selectedRole === UserRole.REGULAR_USER;
  const isOwner = selectedRole === UserRole.RESTAURANT_OWNER;

  return (
    <View style={styles.container}>
      <CustomText variant="caption" weight="600" color={Colors.textMuted} style={styles.label}>
        Account Type *
      </CustomText>

      <View style={styles.rolesContainer}>
        {/* Regular User Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectRole(UserRole.REGULAR_USER)}
          style={[styles.roleCard, isRegular && styles.activeRoleCard]}
        >
          <View style={{ marginBottom: 6 }}>
            <User
              size={22}
              color={isRegular ? Colors.primary : Colors.textMuted}
              strokeWidth={2}
            />
          </View>
          <CustomText
            variant="title"
            weight="bold"
            color={isRegular ? Colors.primary : Colors.charcoal}
            style={styles.roleTitle}
          >
            Regular User
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted}>
            Customer Account
          </CustomText>
        </TouchableOpacity>

        {/* Restaurant Owner Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectRole(UserRole.RESTAURANT_OWNER)}
          style={[styles.roleCard, isOwner && styles.activeOwnerCard]}
        >
          <View style={{ marginBottom: 6 }}>
            <Store
              size={22}
              color={isOwner ? Colors.ownerBadge : Colors.textMuted}
              strokeWidth={2}
            />
          </View>
          <CustomText
            variant="title"
            weight="bold"
            color={isOwner ? Colors.ownerBadge : Colors.charcoal}
            style={styles.roleTitle}
          >
            Restaurant Owner
          </CustomText>
          <CustomText variant="caption" color={Colors.textMuted}>
            Business Account
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RoleSelector;
