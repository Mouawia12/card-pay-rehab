import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Colors, BorderRadius, FontSizes, FontWeights, Shadows } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStorage } from '@/contexts/StorageContext';
import { useScanner } from '@/contexts/ScannerContext';
import { useTranslation } from 'react-i18next';
import { Toast, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { getTextStyle } from '@/utils/textDirection';
import { useFocusEffect } from '@react-navigation/native';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { addRecord } = useStorage();
  const { startScanningRef } = useScanner();
  const { t } = useTranslation();
  const isWeb = Platform.OS === 'web';
  const webVideoRef = useRef<any>(null);
  const webScannerRef = useRef<any>(null);

  // Dynamic text styles based on content
  const titleStyle = getTextStyle(t('scanner.title'));
  const subtitleStyle = getTextStyle(t('scanner.subtitle'));
  const emptyTitleStyle = getTextStyle(t('scanner.startScanning'));
  const emptySubtitleStyle = getTextStyle(t('scanner.cameraDescription'));
  const errorTextStyle = getTextStyle(t('scanner.cameraSettingsMessage'));
  const instructionsTextStyle = getTextStyle(t('scanner.pointCamera'));
  const infoTitleStyle = getTextStyle(t('scanner.tips.title'));
  const tipTextStyle1 = getTextStyle(t('scanner.tips.goodLighting'));
  const tipTextStyle2 = getTextStyle(t('scanner.tips.steadyCamera'));
  const tipTextStyle3 = getTextStyle(t('scanner.tips.clearCode'));

  useEffect(() => {
    // Request permission when component mounts
    if (!permission?.granted && !permission?.canAskAgain) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: t('scanner.cameraPermissionRequired'),
        textBody: t('scanner.cameraPermissionMessage'),
        button: t('common.ok'),
      });
    }
  }, [permission, t]);

  const startScanning = useCallback(async () => {
    if (!isWeb && !permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: t('scanner.cameraDenied'),
          textBody: t('scanner.cameraDeniedMessage'),
          button: t('common.ok'),
        });
        return;
      }
    }
    setIsScanning(true);
    setScanned(false);
    setScanMessage(null);
  }, [isWeb, permission, requestPermission, t]);

  // Register startScanning function in the context
  useEffect(() => {
    startScanningRef.current = startScanning;
    return () => {
      startScanningRef.current = null;
    };
  }, [startScanning, startScanningRef]);

  // Listen for global scan trigger when screen is focused
  useFocusEffect(
    useCallback(() => {
      const checkAndStartScan = () => {
        if (typeof global !== 'undefined' && (global as any).__shouldStartScan) {
          (global as any).__shouldStartScan = false;
          startScanning();
        }
      };

      // Check immediately when screen is focused
      checkAndStartScan();
      
      // Also check periodically for a short time after focus
      const interval = setInterval(() => {
        checkAndStartScan();
      }, 150);

      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 1500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }, [startScanning])
  );

  const stopScanning = () => {
    setIsScanning(false);
    setScanned(false);
    if (isWeb) {
      webScannerRef.current?.reset();
      webScannerRef.current = null;
    }
  };

  const parseScannedData = (data: string) => {
    const raw = data.trim();
    if (!raw) {
      return null;
    }

    if (raw.includes('|')) {
      const parts = raw.split('|');
      return {
        cardId: parts[2] || raw.substring(0, 20),
        name: parts[0] || t('records.unknown'),
        manager: parts[1] || 'QR Manager',
      };
    }

    if ((raw.startsWith('http://') || raw.startsWith('https://')) && typeof URL !== 'undefined') {
      try {
        const url = new URL(raw);
        const cardParam = url.searchParams.get('card');
        if (cardParam) {
          return {
            cardId: cardParam,
            name: t('records.unknown'),
            manager: 'QR Manager',
          };
        }
      } catch {
        // ignore parsing errors and fallback to raw
      }
    }

    return {
      cardId: raw.substring(0, 40),
      name: t('records.unknown'),
      manager: 'QR Manager',
    };
  };

  const handleBarCodeScanned = useCallback(async ({ data }: { data: string }) => {
    if (scanned || isSubmitting) return;
    
    setIsSubmitting(true);
    setScanned(true);
    setIsScanning(false);

    try {
      const parsed = parseScannedData(data);
      if (!parsed?.cardId) {
        throw new Error('invalid_qr');
      }
      const today = new Date().toISOString();

      const { google_wallet } = await addRecord({
        date: today,
        title: '1 اختام أضيفت',
        cardId: parsed.cardId,
        name: parsed.name,
        manager: parsed.manager,
      });

      const successText = t('scanner.scanSuccessMessage') || 'تم تسجيل الزيارة وإضافة النقاط';
      setScanMessage({
        type: 'success',
        text: successText,
      });
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: t('scanner.scanSuccess'),
        textBody: successText,
      });

      // Google Wallet handling
      if (google_wallet?.status === 'success') {
        if (google_wallet.save_url) {
          if (Platform.OS === 'web') {
            window.location.href = google_wallet.save_url;
          } else {
            // Native: open in browser
            const Linking = (await import('react-native')).Linking;
            Linking.openURL(google_wallet.save_url);
          }
        } else {
          Toast.show({
            type: ALERT_TYPE.INFO,
            title: t('scanner.walletAlreadyAdded') || 'البطاقة مضافة مسبقًا إلى Google Wallet',
            textBody: t('scanner.walletAlreadyAdded') || 'البطاقة مضافة مسبقًا إلى Google Wallet',
          });
        }
      }
    } catch (error) {
      console.error('Scan error', error);
      const message =
        error instanceof Error
          ? error.message
          : t('scanner.scanError') || 'حدث خطأ، يرجى المحاولة لاحقًا';
      let userMessage = message;

      if (message === 'invalid_qr') {
        userMessage = t('scanner.invalidCard') || 'البطاقة غير صالحة';
      } else if (message.includes('404')) {
        userMessage = t('scanner.invalidCard') || 'البطاقة غير صالحة';
      } else if (message.includes('422')) {
        userMessage = message;
      }

      setScanMessage({
        type: 'error',
        text: userMessage || t('scanner.scanError'),
      });
      setScanned(false);
      setIsScanning(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: t('common.error'),
        textBody: userMessage || t('scanner.scanError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [addRecord, isSubmitting, scanned, t]);

  useEffect(() => {
    if (!isWeb) return;
    if (!isScanning) return;
    if (!webVideoRef.current) return;

    let cancelled = false;
    let reader: any = null;

    const stopReader = () => {
      if (!reader) return;
      if (typeof reader.reset === 'function') {
        reader.reset();
      }
      if (typeof reader.stopContinuousDecode === 'function') {
        reader.stopContinuousDecode();
      }
      if (typeof reader.stop === 'function') {
        reader.stop();
      }
    };

    const startWebScanner = async () => {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        if (cancelled) return;
        reader = new BrowserMultiFormatReader();
        webScannerRef.current = reader;

        reader.decodeFromVideoDevice(undefined, webVideoRef.current, (result: any) => {
          if (result) {
            handleBarCodeScanned({ data: result.getText() });
            stopReader();
          }
        }).catch(() => {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: t('common.error'),
            textBody: t('scanner.scanError'),
          });
        });
      } catch {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: t('common.error'),
          textBody: t('scanner.scanError'),
        });
      }
    };

    startWebScanner();

    return () => {
      cancelled = true;
      stopReader();
    };
  }, [handleBarCodeScanned, isScanning, isWeb, t]);

  if (permission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, titleStyle]}>{t('scanner.title')}</Text>
        <Text style={[styles.subtitle, subtitleStyle]}>{t('scanner.subtitle')}</Text>
      </View>

      {/* Scanner Area */}
      <View style={styles.scannerContainer}>
        {scanMessage ? (
          <View
            style={[
              styles.scanMessage,
              scanMessage.type === 'success' ? styles.scanMessageSuccess : styles.scanMessageError,
            ]}
          >
            <Text style={styles.scanMessageText}>{scanMessage.text}</Text>
          </View>
        ) : null}
        {!isScanning ? (
          <Card style={styles.scannerCard}>
            <View style={styles.emptyState}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="qrcode" size={64} color={Colors.light.primary} />
              </View>
              <Text style={[styles.emptyTitle, emptyTitleStyle]}>{t('scanner.startScanning')}</Text>
              <Text style={[styles.emptySubtitle, emptySubtitleStyle]}>
                {t('scanner.cameraDescription')}
              </Text>
              <Button
                onPress={startScanning}
                size="lg"
                style={styles.startButton}
                icon={
                  <MaterialCommunityIcons
                    name="camera-outline"
                    size={20}
                    color={Colors.light.primaryForeground}
                  />
                }
              >
                {t('scanner.openCamera')}
              </Button>
              {!permission?.granted && !permission?.canAskAgain && (
                <Text style={[styles.errorText, errorTextStyle]}>
                  {t('scanner.cameraSettingsMessage')}
                </Text>
              )}
            </View>
          </Card>
        ) : isWeb ? (
          <View style={styles.cameraWrapper}>
            <View style={styles.webCamera}>
              <video
                ref={webVideoRef}
                style={styles.webVideo as any}
                muted
                playsInline
              />
              {/* Scanning Frame */}
              <View style={styles.overlay}>
                <View style={styles.frame}>
                  {/* Corner borders */}
                  <View style={styles.corner} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
              </View>

              {/* Close button */}
              <TouchableOpacity
                onPress={stopScanning}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={Colors.light.destructiveForeground}
                />
              </TouchableOpacity>

              {/* Instructions overlay */}
              <View style={styles.instructionsOverlay}>
                <Text style={[styles.instructionsText, instructionsTextStyle]}>{t('scanner.pointCamera')}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.cameraWrapper}>
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={handleBarCodeScanned}
            >
              {/* Scanning Frame */}
              <View style={styles.overlay}>
                <View style={styles.frame}>
                  {/* Corner borders */}
                  <View style={styles.corner} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
              </View>

              {/* Close button */}
              <TouchableOpacity
                onPress={stopScanning}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={Colors.light.destructiveForeground}
                />
              </TouchableOpacity>

              {/* Instructions overlay */}
              <View style={styles.instructionsOverlay}>
                <Text style={[styles.instructionsText, instructionsTextStyle]}>{t('scanner.pointCamera')}</Text>
              </View>
            </CameraView>
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Card variant="muted" style={styles.infoCard}>
          <Text style={[styles.infoTitle, infoTitleStyle]}>{t('scanner.tips.title')}</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, tipTextStyle1]}>{t('scanner.tips.goodLighting')}</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, tipTextStyle2]}>{t('scanner.tips.steadyCamera')}</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, tipTextStyle3]}>{t('scanner.tips.clearCode')}</Text>
            </View>
          </View>
        </Card>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.mutedForeground,
  },
  scannerContainer: {
    paddingHorizontal: 16,
  },
  scannerCard: {
    minHeight: 350,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 300,
  },
  iconContainer: {
    width: 128,
    height: 128,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.light.foreground,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    width: '100%',
    maxWidth: 300,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: Colors.light.destructive,
    marginTop: 16,
    textAlign: 'center',
  },
  cameraWrapper: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.lg,
  },
  webCamera: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },
  webVideo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    objectFit: 'cover',
  },
  camera: {
    width: '100%',
    aspectRatio: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 48,
    height: 48,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.light.primary,
    borderTopLeftRadius: BorderRadius.lg,
  },
  topRight: {
    top: 0,
    left: 'auto',
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: 4,
    borderTopRightRadius: BorderRadius.lg,
  },
  bottomLeft: {
    top: 'auto',
    bottom: 0,
    borderTopWidth: 0,
    borderBottomWidth: 4,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  bottomRight: {
    top: 'auto',
    bottom: 0,
    left: 'auto',
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: BorderRadius.lg,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: Colors.light.destructive,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  instructionsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 24,
  },
  instructionsText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  infoSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  scanMessage: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    marginBottom: 12,
  },
  scanMessageSuccess: {
    backgroundColor: 'rgba(34,197,94,0.12)',
  },
  scanMessageError: {
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  scanMessageText: {
    fontSize: FontSizes.sm,
    color: Colors.light.foreground,
    textAlign: 'center',
  },
  infoCard: {
    padding: 16,
  },
  infoTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    color: Colors.light.foreground,
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipBullet: {
    fontSize: FontSizes.base,
    color: Colors.light.primary,
    marginTop: 2,
  },
  tipText: {
    fontSize: FontSizes.sm,
    color: Colors.light.mutedForeground,
    flex: 1,
  },
});
