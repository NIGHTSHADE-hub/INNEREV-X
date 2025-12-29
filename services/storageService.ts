import { KhataRecord } from "../types";

const STORAGE_KEY_PREFIX = 'khatalens_data_';

export const getRecords = (username: string): KhataRecord[] => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${username}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load records", error);
    return [];
  }
};

export const saveRecord = (username: string, record: KhataRecord): KhataRecord[] => {
  try {
    const current = getRecords(username);
    const updated = [record, ...current];
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${username}`, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Failed to save record", error);
    return [];
  }
};