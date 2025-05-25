import { useState, useEffect } from 'react';
import { DEFAULT_OPTIONS, DocagramOptions } from '../Options';

export const useOptions = () => {
  const [options, setOptions] = useState<DocagramOptions>(DEFAULT_OPTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const result = await chrome.storage.sync.get('docagramOptions');
      if (result.docagramOptions) {
        setOptions(result.docagramOptions);
      }
    } catch (error) {
      console.error('Failed to load options:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOptions = async (newOptions: Partial<DocagramOptions>) => {
    try {
      const updatedOptions = { ...options, ...newOptions };
      await chrome.storage.sync.set({ docagramOptions: updatedOptions });
      setOptions(updatedOptions);
    } catch (error) {
      console.error('Failed to save options:', error);
      throw error;
    }
  };

  const resetToDefaults = async () => {
    try {
      await chrome.storage.sync.set({ docagramOptions: DEFAULT_OPTIONS });
      setOptions(DEFAULT_OPTIONS);
    } catch (error) {
      console.error('Failed to reset options:', error);
      throw error;
    }
  };

  return { options, loading, saveOptions, resetToDefaults };
};