import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Colors, FontSizes, FontWeights } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStorage } from '@/contexts/StorageContext';
import { Record } from '@/contexts/StorageContext';
import { useTranslation } from 'react-i18next';
import { getTextStyle } from '@/utils/textDirection';

interface RecordCardProps {
  record: Record;
}

const RecordCard: React.FC<RecordCardProps> = ({ record }) => {
  const { t } = useTranslation();

  // Parse date and format it as DD/MM/YYYY
  const formatDate = (dateString: string) => {
    try {
      // If it's already in a specific format, try to parse it
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const formattedDate = formatDate(record.date);

  // Dynamic text styles based on content
  const dateStyle = getTextStyle(formattedDate);
  const stampsTextStyle = getTextStyle('1 ' + t('records.stampsAdded'));
  const cardIdStyle = getTextStyle(record.cardId);
  const nameStyle = getTextStyle(record.name);
  const managerStyle = getTextStyle(t('records.manager') + ': ' + record.manager);
  
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="qrcode" size={60} color="#000" />
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.date, dateStyle]}>{formattedDate}</Text>
          <Text style={[styles.stampsText, stampsTextStyle]}>1 {t('records.stampsAdded')}</Text>
          <Text style={[styles.cardId, cardIdStyle]}>{record.cardId}</Text>
          <Text style={[styles.name, nameStyle]}>{record.name}</Text>
          <Text style={[styles.manager, managerStyle]}>{t('records.manager')}: {record.manager}</Text>
        </View>
      </View>
    </View>
  );
};

export default function RecordsScreen() {
  const { records, isLoading } = useStorage();
  const { t } = useTranslation();

  // Dynamic text styles based on content
  const titleStyle = getTextStyle(t('records.title'));
  const loadingTextStyle = getTextStyle(t('common.loading'));
  const emptyTitleStyle = getTextStyle(t('records.empty'));
  const emptySubtitleStyle = getTextStyle(t('records.emptySubtitle'));

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, titleStyle]}>{t('records.title')}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, loadingTextStyle]}>{t('common.loading')}</Text>
        </View>
      </View>
    );
  }

  if (records.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, titleStyle]}>{t('records.title')}</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={40}
              color={Colors.light.mutedForeground}
            />
          </View>
          <Text style={[styles.emptyTitle, emptyTitleStyle]}>{t('records.empty')}</Text>
          <Text style={[styles.emptySubtitle, emptySubtitleStyle]}>{t('records.emptySubtitle')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, titleStyle]}>{t('records.title')}</Text>
      </View>
      <FlatList
        data={records}
        renderItem={({ item }) => <RecordCard record={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.bold,
    color: '#000',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconWrapper: {
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  date: {
    fontSize: FontSizes.sm,
    color: '#444',
    marginBottom: 4,
  },
  stampsText: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    color: '#000',
    marginBottom: 4,
  },
  cardId: {
    fontSize: FontSizes.sm,
    color: '#888',
    marginBottom: 4,
  },
  name: {
    fontSize: FontSizes.sm,
    color: '#000',
    marginBottom: 4,
  },
  manager: {
    fontSize: FontSizes.xs,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: FontSizes.base,
    color: Colors.light.mutedForeground,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.light.muted,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    color: Colors.light.foreground,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: FontSizes.base,
    color: Colors.light.mutedForeground,
  },
});
