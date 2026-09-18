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
import { RootStackParamList } from '../../../navigation/types';
import Colors from '../../../theme/colors';
import { CustomText } from '../../../components/customText';
import { CustomButton } from '../../../components/customButton';
import { Input } from '../../../components/input';
import { Header } from '../../../components/header';
import { RoleSelector } from '../../../components/roleSelector';
import { useAuthStore } from '../../../store/useAuthStore';
import { UserRole } from '../../../constants/globalConstants';
import axios from '../../../utils/axios';
import { API } from '../../../constants/api';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [role, setRole] = useState<UserRole>(UserRole.REGULAR_USER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, Email, and Password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post<{ accessToken: string; user: any }>(API.REGISTER, {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
      });

      setAuth(res.accessToken, res.user);
    } catch (err: any) {
      console.log('Register error:', err?.message, err?.response?.data);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to create account. Please check your information.';
      setError(Array.isArray(message) ? message[0] : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header onBackPress={() => navigation.goBack()} title="Create Account" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <CustomText variant="h2" weight="bold" color={Colors.charcoal} style={styles.title}>
              Join Cravo
            </CustomText>
            <CustomText variant="body" color={Colors.textMuted} style={styles.subtitle}>
              {role === UserRole.RESTAURANT_OWNER
                ? 'Register as a Restaurant Owner to manage meals & orders'
                : 'Register as a Regular User to order from top restaurants'}
            </CustomText>
          </View>

          <View style={styles.formCard}>
            {error && (
              <View style={styles.errorBanner}>
                <CustomText variant="caption" color={Colors.error} weight="500">
                  {error}
                </CustomText>
              </View>
            )}

            {/* Two Roles Selector */}
            <RoleSelector selectedRole={role} onSelectRole={setRole} />

            <Input
              label={role === UserRole.RESTAURANT_OWNER ? 'Owner / Business Name *' : 'Full Name *'}
              placeholder={role === UserRole.RESTAURANT_OWNER ? 'e.g. John Doe (Tasty Bites)' : 'e.g. John Doe'}
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError(null);
              }}
            />

            <Input
              label="Email Address *"
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
              label="Password (min 6 chars) *"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError(null);
              }}
              isPassword
            />

            <Input
              label="Phone Number"
              placeholder="+92 300 1234567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Input
              label={role === UserRole.RESTAURANT_OWNER ? 'Restaurant Address' : 'Delivery Address'}
              placeholder="House/Shop, Street, Area, City"
              value={address}
              onChangeText={setAddress}
            />

            <CustomButton
              title={role === UserRole.RESTAURANT_OWNER ? 'Register as Restaurant Owner' : 'Create Customer Account'}
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
            />
          </View>

          <View style={styles.footer}>
            <CustomText variant="body" color={Colors.textMuted} style={styles.footerText}>
              Already have an account?{' '}
            </CustomText>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <CustomText variant="body" color={Colors.primary} weight="bold" style={styles.signInLink}>
                Sign In
              </CustomText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
