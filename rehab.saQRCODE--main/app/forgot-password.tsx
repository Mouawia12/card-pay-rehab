import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Colors, FontSizes, FontWeights } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Toast, ALERT_TYPE } from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_PHONE_KEY = 'REHAB_QR_LAST_PHONE';

export default function ForgotPasswordScreen() {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  // Load last used phone number
  useEffect(() => {
    loadLastPhone();
  }, []);

  const loadLastPhone = async () => {
    try {
      const lastPhone = await AsyncStorage.getItem(LAST_PHONE_KEY);
      if (lastPhone) {
        setPhone(lastPhone);
      }
    } catch (error) {
      console.error('Error loading last phone:', error);
    }
  };

  const saveLastPhone = async (phoneNumber: string) => {
    try {
      await AsyncStorage.setItem(LAST_PHONE_KEY, phoneNumber);
    } catch (error) {
      console.error('Error saving last phone:', error);
    }
  };

  const handleSendResetCode = async () => {
    if (!phone) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: t('auth.forgotPassword.errorPhone'),
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(async () => {
      setIsLoading(false);
      
      // Save last used phone
      await saveLastPhone(phone);
      
      // Navigate to verify OTP screen with phone number
      router.push({
        pathname: '/verify-otp',
        params: { phone },
      });
    }, 1500);
  };

  const handleBackToLogin = () => {
    router.back();
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
          <TouchableOpacity onPress={handleBackToLogin} style={styles.backButtonHeader}>
            <MaterialCommunityIcons name="arrow-right" size={24} color={Colors.light.foreground} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="lock-reset" size={60} color={Colors.light.primary} />
            </View>
            <Text style={styles.title}>{t('auth.forgotPassword.title')}</Text>
            <Text style={styles.subtitle}>
              {t('auth.forgotPassword.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label={t('auth.forgotPassword.phone')}
              placeholder={t('auth.forgotPassword.phonePlaceholder')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              leftIcon={<MaterialCommunityIcons name="phone-outline" size={20} color={Colors.light.mutedForeground} />}
            />

            <Button
              onPress={handleSendResetCode}
              size="lg"
              style={styles.resetButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.light.primaryForeground} />
              ) : (
                t('auth.forgotPassword.sendCode')
              )}
            </Button>

            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color={Colors.light.primary}
              />
              <Text style={styles.infoText}>
                {t('auth.forgotPassword.infoMessage')}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <TouchableOpacity onPress={handleBackToLogin} style={styles.backLink}>
            <Text style={styles.backLinkText}>{t('auth.forgotPassword.rememberPassword')}</Text>
          </TouchableOpacity>
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
  backButtonHeader: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: Colors.light.foreground,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  resetButton: {
    width: '100%',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.primary + '05',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.light.mutedForeground,
    lineHeight: 20,
    textAlign: 'right',
  },
  backLink: {
    alignSelf: 'center',
    marginTop: 32,
    padding: 8,
  },
  backLinkText: {
    fontSize: FontSizes.sm,
    color: Colors.light.primary,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
});
