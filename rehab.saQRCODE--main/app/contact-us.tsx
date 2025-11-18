import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, FontSizes, FontWeights } from '@/constants/theme';
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

export default function ContactUsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  // Dynamic text styles based on content
  const contactInfoTitleStyle = getTextStyle(t('contactUs.contactInfo'));

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: t('contactUs.errorRequired'),
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: t('contactUs.errorEmail'),
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: t('common.success'),
        textBody: t('contactUs.successMessage'),
      });
      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 1000);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: t('contactUs.title'),
          headerBackTitle: t('common.back'),
        }} 
      />
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
            <Text style={styles.title}>{t('contactUs.title')}</Text>
            <Text style={styles.subtitle}>{t('contactUs.subtitle')}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label={t('contactUs.name')}
              placeholder={t('contactUs.namePlaceholder')}
              value={name}
              onChangeText={setName}
              autoComplete="name"
              leftIcon={<MaterialCommunityIcons name="account-outline" size={20} color={Colors.light.mutedForeground} />}
            />

            <Input
              label={t('contactUs.email')}
              placeholder={t('contactUs.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              leftIcon={<MaterialCommunityIcons name="email-outline" size={20} color={Colors.light.mutedForeground} />}
            />

            <Input
              label={t('contactUs.phone')}
              placeholder={t('contactUs.phonePlaceholder')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              leftIcon={<MaterialCommunityIcons name="phone-outline" size={20} color={Colors.light.mutedForeground} />}
            />

            <Input
              label={t('contactUs.message')}
              placeholder={t('contactUs.messagePlaceholder')}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={styles.messageInput}
              leftIcon={<MaterialCommunityIcons name="message-text-outline" size={20} color={Colors.light.mutedForeground} />}
            />

            <Button
              onPress={handleSubmit}
              size="lg"
              style={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.light.primaryForeground} />
              ) : (
                t('contactUs.submitButton')
              )}
            </Button>
          </View>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            <Text style={[styles.contactInfoTitle, contactInfoTitleStyle]}>{t('contactUs.contactInfo')}</Text>
            
            <View style={styles.contactItem}>
              <MaterialCommunityIcons name="email" size={20} color={Colors.light.primary} />
              <Text style={styles.contactText}>support@rehabqr.com</Text>
            </View>
            
            <View style={styles.contactItem}>
              <MaterialCommunityIcons name="phone" size={20} color={Colors.light.primary} />
              <Text style={styles.contactText}>+966 55 123 4567</Text>
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
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  logoContainer: {
    width: 120,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: FontSizes['2xl'],
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
    marginBottom: 32,
  },
  messageInput: {
    minHeight: 120,
    paddingTop: 12,
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
  contactInfo: {
    marginTop: 16,
    padding: 20,
    backgroundColor: Colors.light.muted,
    borderRadius: 12,
    gap: 12,
  },
  contactInfoTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.light.foreground,
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: FontSizes.base,
    color: Colors.light.foreground,
    flex: 1,
  },
});

