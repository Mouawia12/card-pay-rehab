import React, { useState } from 'react';
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
import { getTextStyle } from '@/utils/textDirection';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  // Dynamic text styles based on content
  const infoTextStyle = getTextStyle(t('auth.resetPassword.infoMessage'));

  const handleResetPassword = async () => {
    // Validate passwords
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: t('auth.resetPassword.errorPasswordRequired'),
      });
      return;
    }

    if (newPassword.length < 8) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: t('auth.resetPassword.errorPasswordWeak'),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: t('auth.resetPassword.errorPasswordMismatch'),
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);

    // Show success message
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: t('common.success'),
      textBody: t('auth.resetPassword.successReset'),
    });

    // Navigate to login after delay
    setTimeout(() => {
      router.replace('/login');
    }, 1500);
  };

  const handleBack = () => {
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
          <TouchableOpacity onPress={handleBack} style={styles.backButtonHeader}>
            <MaterialCommunityIcons name="arrow-right" size={24} color={Colors.light.foreground} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="lock-reset" size={60} color={Colors.light.primary} />
            </View>
            <Text style={styles.title}>{t('auth.resetPassword.title')}</Text>
            <Text style={styles.subtitle}>
              {t('auth.resetPassword.subtitle')}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label={t('auth.resetPassword.newPassword')}
              placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              autoComplete="new-password"
              leftIcon={<MaterialCommunityIcons name="lock-outline" size={20} color={Colors.light.mutedForeground} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <MaterialCommunityIcons
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.light.mutedForeground}
                  />
                </TouchableOpacity>
              }
            />

            <Input
              label={t('auth.resetPassword.confirmPassword')}
              placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoComplete="new-password"
              leftIcon={<MaterialCommunityIcons name="lock-check-outline" size={20} color={Colors.light.mutedForeground} />}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.light.mutedForeground}
                  />
                </TouchableOpacity>
              }
            />

            <Button
              onPress={handleResetPassword}
              size="lg"
              style={styles.resetButton}
              disabled={isLoading}
              loading={isLoading}
            >
              {t('auth.resetPassword.resetButton')}
            </Button>

            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={20}
                color={Colors.light.primary}
              />
              <Text style={[styles.infoText, infoTextStyle]}>
                {t('auth.resetPassword.infoMessage')}
              </Text>
            </View>
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
    marginTop: 8,
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
  },
});

