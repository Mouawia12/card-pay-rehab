import { Colors, FontSizes, FontWeights, NAV_HEIGHT, Shadows } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { Tabs } from 'expo-router';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { getTextStyle } from '@/utils/textDirection';
import { useScanner } from '@/contexts/ScannerContext';

function CustomTabButton(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      style={[styles.tabButton, props.style]}
      android_ripple={{ color: Colors.light.primary + '20', borderless: true }}
    >
      {props.children}
    </PlatformPressable>
  );
}

function CenterTabButton(props: BottomTabBarButtonProps) {
  const isSelected = props.accessibilityState?.selected;
  const { startScanningRef } = useScanner();

  const handlePress = useCallback((e: any) => {
    // Set global flag to trigger scanning
    if (typeof global !== 'undefined') {
      (global as any).__shouldStartScan = true;
    }
    
    // Always allow default navigation
    props.onPress?.(e);
    
    // If context is available, also use it as backup
    if (startScanningRef?.current) {
      const delay = isSelected ? 100 : 250;
      setTimeout(() => {
        if (startScanningRef?.current) {
          startScanningRef.current();
        }
      }, delay);
    }
  }, [isSelected, props, startScanningRef]);

  return (
    <CustomTabButton 
      {...props} 
      onPress={handlePress}
    >
      <View style={styles.tabContentCenter}>
        <View style={styles.centerIcon}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.light.primary }]}>
            <MaterialCommunityIcons name="qrcode-scan" size={36} color={Colors.light.primaryForeground} />
          </View>
        </View>
      </View>
    </CustomTabButton>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  // Dynamic text styles based on content
  const tabSettingsStyle = getTextStyle(t('tabs.settings'));
  const tabRecordsStyle = getTextStyle(t('tabs.records'));

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: NAV_HEIGHT,
          borderTopWidth: 0,
          backgroundColor: Colors.light.card,
          ...Shadows.lg,
        },
      }}>
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarButton: (props) => (
            <CustomTabButton {...props}>
              <View style={styles.tabContent}>
                <MaterialCommunityIcons 
                  name="cog-outline" 
                  size={28} 
                  color={props.accessibilityState?.selected ? Colors.light.primary : Colors.light.tabIconDefault} 
                />
                <Text style={[styles.tabLabel, tabSettingsStyle, { color: props.accessibilityState?.selected ? Colors.light.primary : Colors.light.tabIconDefault }]}>
                  {t('tabs.settings')}
                </Text>
              </View>
            </CustomTabButton>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarButton: (props) => <CenterTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: t('tabs.records'),
          tabBarButton: (props) => (
            <CustomTabButton {...props}>
              <View style={styles.tabContent}>
                <MaterialCommunityIcons 
                  name="clock-outline" 
                  size={28} 
                  color={props.accessibilityState?.selected ? Colors.light.primary : Colors.light.tabIconDefault} 
                />
                <Text style={[styles.tabLabel, tabRecordsStyle, { color: props.accessibilityState?.selected ? Colors.light.primary : Colors.light.tabIconDefault }]}>
                  {t('tabs.records')}
                </Text>
              </View>
            </CustomTabButton>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabContentCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    marginTop: 4,
  },
  centerIcon: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
  },
});
