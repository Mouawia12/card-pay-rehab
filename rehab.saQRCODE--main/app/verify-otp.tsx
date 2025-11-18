import { Button } from '@/components/ui/Button';
import { BorderRadius, Colors, FontSizes, FontWeights } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ALERT_TYPE, Toast } from 'react-native-alert-notification';
import { getTextStyle } from '@/utils/textDirection';

const OTP_LENGTH = 4;
const RESEND_TIMEOUT = 59; // seconds

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams();
  const phoneNumber = params.phone as string || '';
  
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { t } = useTranslation();

  // Dynamic text styles based on content
  const instructionsStyle = getTextStyle(t('auth.verifyOtp.instructions'));
  const infoTextStyle = getTextStyle(t('auth.verifyOtp.infoMessage'));

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length === 0) {
      // Empty field
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      
      // Focus previous input
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (numericValue.length === 1) {
      // Single digit
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);
      
      // Focus next input
      if (index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // Last input - blur keyboard
        inputRefs.current[index]?.blur();
      }
    } else if (numericValue.length > 1) {
      // Paste multiple digits
      const digits = numericValue.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      
      digits.forEach((digit, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    // Check if all fields are filled
    if (otpString.length !== OTP_LENGTH) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: t('auth.verifyOtp.errorIncomplete'),
      });
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate different error scenarios (for testing)
    // In real app, you would check API response
    const randomError = Math.random();
    if (randomError < 0.3) {
      // Invalid code
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: t('auth.verifyOtp.errorInvalid'),
      });
      setIsVerifying(false);
      // Clear OTP
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } else {
      // Success
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: t('common.success'),
        textBody: t('auth.verifyOtp.successVerify'),
      });
      setIsVerifying(false);
      
      // Navigate to reset password screen
      setTimeout(() => {
        router.replace('/reset-password');
      }, 1500);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsResending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: t('common.success'),
      textBody: t('auth.verifyOtp.successResend'),
    });

    // Reset timer
    setTimer(RESEND_TIMEOUT);
    setCanResend(false);
    setIsResending(false);

    // Clear OTP
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleBack = () => {
    router.back();
  };

  const formatPhoneNumber = (phone: string) => {
    // Mask the phone number: +966 5X XXX XXXX
    if (phone.length < 4) return phone;
    const visiblePart = phone.slice(0, 5);
    const maskedPart = phone.slice(5).replace(/\d/g, 'X');
    return visiblePart + ' ' + maskedPart;
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isVerifyDisabled = otp.join('').length !== OTP_LENGTH || isVerifying;

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
              <MaterialCommunityIcons name="message-text-lock" size={60} color={Colors.light.primary} />
            </View>
            <Text style={styles.title}>{t('auth.verifyOtp.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.verifyOtp.subtitle')}</Text>
            
            {/* Phone number display */}
            {phoneNumber && (
              <View style={styles.phoneDisplay}>
                <MaterialCommunityIcons name="phone-check" size={16} color={Colors.light.primary} />
                <Text style={styles.phoneText}>
                  {t('auth.verifyOtp.phoneDisplay', { phone: formatPhoneNumber(phoneNumber) })}
                </Text>
              </View>
            )}
          </View>

          {/* OTP Input Fields */}
          <View style={styles.otpContainer}>
            <Text style={[styles.instructions, instructionsStyle]}>{t('auth.verifyOtp.instructions')}</Text>
            
            <View style={styles.otpInputs}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit !== '' && styles.otpInputFilled,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  accessibilityLabel={t(`auth.verifyOtp.otpField${index + 1}`)}
                  autoComplete="one-time-code"
                />
              ))}
            </View>
          </View>

          {/* Verify Button */}
          <Button
            onPress={handleVerify}
            size="lg"
            style={styles.verifyButton}
            disabled={isVerifyDisabled}
            loading={isVerifying}
          >
            {t('auth.verifyOtp.verify')}
          </Button>

          {/* Resend Code Section */}
          <View style={styles.resendContainer}>
            {canResend ? (
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResending}
                style={styles.resendButton}
              >
                {isResending ? (
                  <ActivityIndicator color={Colors.light.primary} size="small" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="refresh"
                      size={20}
                      color={Colors.light.primary}
                    />
                    <Text style={styles.resendText}>{t('auth.verifyOtp.resendCode')}</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.timerContainer}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color={Colors.light.mutedForeground}
                />
                <Text style={styles.timerText}>
                  {phoneNumber 
                    ? t('auth.verifyOtp.resendTimerWithPhone', { 
                        time: formatTimer(timer), 
                        phone: formatPhoneNumber(phoneNumber) 
                      })
                    : t('auth.verifyOtp.resendTimer', { time: formatTimer(timer) })
                  }
                </Text>
              </View>
            )}
          </View>

          {/* Info Message */}
          <View style={styles.infoBox}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={Colors.light.mutedForeground}
            />
            <Text style={[styles.infoText, infoTextStyle]}>{t('auth.verifyOtp.infoMessage')}</Text>
          </View>

          {/* Change Phone Link */}
          <TouchableOpacity onPress={handleBack} style={styles.changePhoneLink}>
            <Text style={styles.changePhoneText}>{t('auth.verifyOtp.changePhone')}</Text>
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
    marginBottom: 16,
  },
  phoneDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.light.primary + '05',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary + '20',
  },
  phoneText: {
    fontSize: FontSizes.sm,
    color: Colors.light.primary,
    fontWeight: FontWeights.bold,
  },
  otpContainer: {
    marginBottom: 24,
  },
  instructions: {
    fontSize: FontSizes.sm,
    color: Colors.light.mutedForeground,
    marginBottom: 16,
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  otpInput: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.lg,
    fontSize: 24,
    fontWeight: FontWeights.bold,
    color: Colors.light.foreground,
    textAlign: 'center',
    minWidth: 60,
  },
  otpInputFilled: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary + '05',
  },
  verifyButton: {
    width: '100%',
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resendText: {
    fontSize: FontSizes.base,
    color: Colors.light.primary,
    fontWeight: FontWeights.bold,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: FontSizes.sm,
    color: Colors.light.mutedForeground,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.primary + '05',
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.light.mutedForeground,
    lineHeight: 20,
  },
  changePhoneLink: {
    alignSelf: 'center',
    padding: 8,
  },
  changePhoneText: {
    fontSize: FontSizes.sm,
    color: Colors.light.primary,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
  },
});

