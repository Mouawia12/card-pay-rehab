import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, FontSizes, FontWeights } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import { getTextStyle } from '@/utils/textDirection';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useTranslation();

  // Dynamic text styles based on content
  const titleStyle = getTextStyle(t('auth.login.title'));
  const subtitleStyle = getTextStyle(t('auth.login.subtitle'));
  const forgotPasswordStyle = getTextStyle(t('auth.login.forgotPassword'));
  const footerTextStyle = getTextStyle(t('auth.login.contactHelp'));
  const contactTextStyle = getTextStyle(t('auth.login.contactUs'));

  const handleLogin = async () => {
    if (!phone || !password) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: t('auth.login.errorPhonePassword'),
      });
      return;
    }

    setIsLoading(true);
    const success = await login(phone, password);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: t('auth.login.errorInvalid'),
      });
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/Logo.svg')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>
            <Text style={[styles.title, titleStyle]}>{t('auth.login.title')}</Text>
            <Text style={[styles.subtitle, subtitleStyle]}>{t('auth.login.subtitle')}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label={t('auth.login.phone')}
              placeholder={t('auth.login.phonePlaceholder')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              leftIcon={<MaterialCommunityIcons name="phone-outline" size={20} color={Colors.light.mutedForeground} />}
            />

            <Input
              label={t('auth.login.password')}
              placeholder={t('auth.login.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="password"
              leftIcon={<MaterialCommunityIcons name="lock-outline" size={20} color={Colors.light.mutedForeground} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.light.mutedForeground}
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, forgotPasswordStyle]}>{t('auth.login.forgotPassword')}</Text>
            </TouchableOpacity>

            <Button
              onPress={handleLogin}
              size="lg"
              style={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.light.primaryForeground} />
              ) : (
                t('auth.login.loginButton')
              )}
            </Button>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, footerTextStyle]}>{t('auth.login.contactHelp')}</Text>
            <TouchableOpacity onPress={() => router.push('/contact-us')}>
              <Text style={[styles.contactText, contactTextStyle]}>{t('auth.login.contactUs')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoContainer: {
    width: 200,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  logo: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
    color: Colors.light.foreground,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.base,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: FontSizes.sm,
    color: Colors.light.primary,
    fontWeight: FontWeights.normal,
  },
  loginButton: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.light.mutedForeground,
  },
  contactText: {
    fontSize: FontSizes.sm,
    color: Colors.light.primary,
    fontWeight: FontWeights.bold,
  },
});
