import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../theme/colors';
import { CustomText } from '../customText';
import { styles } from './styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  isPassword,
  secureTextEntry,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <CustomText variant="caption" weight="600" color={Colors.textMuted} style={styles.label}>
          {label}
        </CustomText>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error ? styles.errorInput : {},
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          placeholderTextColor={Colors.textLight}
          style={[styles.input, style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          autoCapitalize="none"
          {...props}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIcon}
          >
            <CustomText variant="caption" color={Colors.primary} weight="600">
              {showPassword ? 'Hide' : 'Show'}
            </CustomText>
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>

      {error && (
        <CustomText variant="caption" color={Colors.error} style={styles.errorText}>
          {error}
        </CustomText>
      )}
    </View>
  );
};

export default Input;
