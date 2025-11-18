import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, FontSizes, FontWeights } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { getTextStyle } from '@/utils/textDirection';

export default function SettingsScreen() {
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  // Dynamic text styles based on content
  const titleStyle = getTextStyle(t('settings.title'));
  const accountInfoStyle = getTextStyle(t('settings.accountInfo'));
  const accountNameStyle = getTextStyle(user?.name || t('records.unknown'));
  const accountPhoneStyle = getTextStyle(user?.phone || t('records.unknown'));
  const languageStyle = getTextStyle(t('settings.language'));
  const arabicButtonStyle = getTextStyle(t('settings.arabic'));
  const englishButtonStyle = getTextStyle(t('settings.english'));
  const versionLabelStyle = getTextStyle(t('settings.version'));

  const handleLogout = () => {
    // استخدام تأكيد بسيط على الويب لأن Dialog لا يعمل دائماً في المتصفح
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(t('auth.logout.confirmMessage'));
      if (confirmed) {
        logout().catch((err) => console.error('Logout error', err)).finally(() => {
          router.replace('/login');
        });
      }
      return;
    }

    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: t('auth.logout.confirmTitle'),
      textBody: t('auth.logout.confirmMessage'),
      button: t('auth.logout.logoutButton'),
      onPressButton: async () => {
        Dialog.hide();
        await logout();
        router.replace('/login');
      },
      autoClose: false,
    });
  };

  const handleLanguageChange = async (lang: 'ar' | 'en') => {
    await setLanguage(lang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, titleStyle]}>{t('settings.title')}</Text>
      </View>

      <View style={styles.content}>
        {/* Account Info Section */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="account-outline"
              size={20}
              color={Colors.light.mutedForeground}
            />
            <Text style={[styles.sectionTitle, accountInfoStyle]}>{t('settings.accountInfo')}</Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={[styles.accountName, accountNameStyle]}>{user?.name || t('records.unknown')}</Text>
            <Text style={[styles.accountPhone, accountPhoneStyle]}>
              {user?.phone || t('records.unknown')}
            </Text>
          </View>
        </Card>

        {/* Language Section */}
        <Card style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="web"
              size={20}
              color={Colors.light.mutedForeground}
            />
            <Text style={[styles.sectionTitle, languageStyle]}>{t('settings.language')}</Text>
          </View>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              onPress={() => handleLanguageChange('ar')}
              style={[
                styles.languageButton,
                language === 'ar' && styles.languageButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === 'ar' && styles.languageButtonTextActive,
                  arabicButtonStyle,
                ]}
              >
                {t('settings.arabic')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleLanguageChange('en')}
              style={[
                styles.languageButton,
                language === 'en' && styles.languageButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  language === 'en' && styles.languageButtonTextActive,
                  englishButtonStyle,
                ]}
              >
                {t('settings.english')}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Version Section */}
        <Card style={styles.sectionCard}>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>v 1.1.8</Text>
            <View style={styles.versionHeader}>
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color={Colors.light.mutedForeground}
              />
              <Text style={[styles.versionLabel, versionLabelStyle]}>{t('settings.version')}</Text>
            </View>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          onPress={handleLogout}
          variant="destructive"
          size="lg"
          style={styles.logoutButton}
          icon={
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={Colors.light.destructiveForeground}
            />
          }
        >
          {t('settings.logout')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingBottom: 90, // Space for bottom nav
  },
  header: {
    padding: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: Colors.light.foreground,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  sectionCard: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: Colors.light.foreground,
  },
  accountInfo: {
    gap: 8,
  },
  accountName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.normal,
    color: Colors.light.foreground,
  },
  accountPhone: {
    fontSize: FontSizes.sm,
    color: Colors.light.mutedForeground,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 0,
    backgroundColor: Colors.light.muted,
    borderRadius: 12,
    padding: 4,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  languageButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  languageButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.normal,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
  },
  languageButtonTextActive: {
    color: Colors.light.primaryForeground,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  versionText: {
    fontSize: FontSizes.base,
    color: Colors.light.mutedForeground,
  },
  versionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  versionLabel: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.normal,
    color: Colors.light.foreground,
  },
  logoutButton: {
    width: '100%',
  },
});
