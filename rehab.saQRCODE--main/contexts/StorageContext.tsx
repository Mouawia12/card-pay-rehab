import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

const STORAGE_KEY = 'REHAB_QR_RECORDS';
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

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
  const { token } = useAuth();

  // Load records when auth token changes
  useEffect(() => {
    loadRecords();
  }, [token]);

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      if (!token) {
        setRecords([]);
        return;
      }

      // Try to fetch from API first
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const payload = await response.json();
      const mapped: Record[] = (payload?.data || []).map((item: any) => ({
        id: String(item.id),
        date: item.happened_at || new Date().toISOString(),
        title: item.note || item.type || 'Transaction',
        cardId: item.card?.card_code || item.reference || 'N/A',
        name: item.customer?.name || 'Unknown',
        manager: item.product?.name || 'QR Manager',
      }));

      setRecords(mapped);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
    } catch (error) {
      console.error('Error loading records:', error);
      // fallback to cached data if API fails
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setRecords(JSON.parse(storedData));
      }
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
    if (!token) {
      throw new Error('No auth token');
    }

    // send to API
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'stamp_awarded',
        amount: 0,
        currency: 'SAR',
        reference: record.cardId,
        note: record.title,
        happened_at: record.date,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add record (${response.status})`);
    }

    await loadRecords();
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
