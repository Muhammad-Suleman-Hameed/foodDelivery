import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Colors from '../../theme/colors';
import { CustomText } from '../customText';
import { styles } from './styles';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  rightComponent,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CustomText variant="h3" color={Colors.primary} style={styles.backIcon}>
              ‹
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        {title && (
          <CustomText variant="title" weight="700" color={Colors.charcoal} align="center">
            {title}
          </CustomText>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

export default Header;
