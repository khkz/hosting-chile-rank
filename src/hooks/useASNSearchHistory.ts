import { useState, useEffect, useCallback } from 'react';

export interface ASNSearchHistoryItem {
  asn: number;
  name: string;
  countryCode?: string;
  searchedAt: string;
}

const STORAGE_KEY = 'asn-search-history';
const MAX_HISTORY_ITEMS = 10;

export const useASNSearchHistory = () => {
  const [history, setHistory] = useState<ASNSearchHistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading ASN search history:', error);
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving ASN search history:', error);
    }
  }, [history]);

  const addToHistory = useCallback((item: Omit<ASNSearchHistoryItem, 'searchedAt'>) => {
    const newItem: ASNSearchHistoryItem = {
      ...item,
      searchedAt: new Date().toISOString(),
    };

    setHistory(prevHistory => {
      // Remove any existing entry for this ASN
      const filtered = prevHistory.filter(h => h.asn !== item.asn);
      
      // Add new item at the beginning
      const updated = [newItem, ...filtered];
      
      // Keep only the most recent MAX_HISTORY_ITEMS
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
  };
};
