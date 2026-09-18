import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import Colors from '../../theme/colors';
import { styles } from './styles';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'title' | 'body' | 'caption' | 'button';
  color?: string;
  weight?: '400' | '500' | '600' | '700' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle | TextStyle[];
}

export const CustomText: React.FC<CustomTextProps> = ({
  children,
  variant = 'body',
  color = Colors.text,
  weight,
  align = 'left',
  style,
  ...props
}) => {
  return (
    <Text
      style={[
        styles[variant],
        { color, textAlign: align },
        weight ? { fontWeight: weight } : {},
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default CustomText;
