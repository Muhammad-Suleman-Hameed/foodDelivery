import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Utensils } from 'lucide-react-native';
import { RootStackParamList } from '../../../navigation/types';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { CustomButton } from '../../../components/customButton';
import { Input } from '../../../components/input';
import { useAuthStore } from '../../../store/useAuthStore';
import axios from '../../../utils/axios';
import { API } from '../../../constants/api';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<{ accessToken: string; user: any }>(API.LOGIN, {
        email: email.trim(),
        password,
      });

      setAuth(res.accessToken, res.user);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to log in. Please check your credentials.';
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Utensils size={28} color={Colors.white} strokeWidth={2.2} />
            </View>
            <CustomText variant="h1" weight="bold" color={Colors.primary} style={styles.title}>
              Cravo
            </CustomText>
            <CustomText variant="body" color={Colors.textMuted} align="center" style={styles.subtitle}>
              Food delivery and restaurant management
            </CustomText>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {error && (
              <View style={styles.errorBanner}>
                <CustomText variant="caption" color={Colors.error} weight="500">
                  {error}
                </CustomText>
              </View>
            )}

            <Input
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError(null);
              }}
              isPassword
            />

            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.signInButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <CustomText variant="body" color={Colors.textMuted} style={styles.footerText}>
              Don't have an account?{' '}
            </CustomText>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <CustomText variant="body" color={Colors.primary} weight="bold" style={styles.signUpLink}>
                Sign Up
              </CustomText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
