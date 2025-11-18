import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'REHAB_QR_RECORDS';

export interface Record {
  id: string;
  date: string;
  title: string;
  cardId: string;
  name: string;
  manager: string;
}

interface StorageContextType {
  records: Record[];
  addRecord: (record: Omit<Record, 'id'>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  clearRecords: () => Promise<void>;
  reloadRecords: () => Promise<void>;
  isLoading: boolean;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

interface StorageProviderProps {
  children: ReactNode;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load records on mount
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setRecords(JSON.parse(storedData));
      } else {
        // For development: Add sample data if no records exist
        const sampleRecords: Record[] = [
          {
            id: `1-${Date.now()}`,
            date: new Date('2025-01-15').toISOString(),
            title: '1 stamps added',
            cardId: 'QR12345678901234567890',
            name: 'Abdoulkream Alahmrei',
            manager: 'Hussain Ali',
          },
          {
            id: `2-${Date.now() + 1}`,
            date: new Date('2025-01-20').toISOString(),
            title: '1 stamps added',
            cardId: 'QR98765432109876543210',
            name: 'John Smith',
            manager: 'Hussain Ali',
          },
          {
            id: `3-${Date.now() + 2}`,
            date: new Date('2025-01-25').toISOString(),
            title: '1 stamps added',
            cardId: 'QR45678901234567890123',
            name: 'Sarah Johnson',
            manager: 'Hussain Ali',
          },
        ];
        setRecords(sampleRecords);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleRecords));
      }
    } catch (error) {
      console.error('Error loading records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecords = async (newRecords: Record[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
      setRecords(newRecords);
    } catch (error) {
      console.error('Error saving records:', error);
      throw error;
    }
  };

  const addRecord = async (record: Omit<Record, 'id'>) => {
    const newRecord: Record = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    const updatedRecords = [newRecord, ...records];
    await saveRecords(updatedRecords);
  };

  const deleteRecord = async (id: string) => {
    const updatedRecords = records.filter((record) => record.id !== id);
    await saveRecords(updatedRecords);
  };

  const clearRecords = async () => {
    await saveRecords([]);
  };

  const reloadRecords = async () => {
    await loadRecords();
  };

  const value: StorageContextType = {
    records,
    addRecord,
    deleteRecord,
    clearRecords,
    reloadRecords,
    isLoading,
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};
