
import { LoginResponse, FullAppData } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const callApi = async (action: string, payload: any = {}) => {
  if (!API_URL) throw new Error("API Config Error: VITE_API_URL missing");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, ...payload }),
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const json = await response.json();
    if (!json.success) throw new Error(json.message || "Unknown API Error");

    return json.data;
  } catch (error) {
    console.error(`API Call Failed [${action}]:`, error);
    throw error;
  }
};

export const api = {
  // Login now returns EVERYTHING
  login: async (id: string, pass: string): Promise<LoginResponse> => {
    try {
      const data: FullAppData = await callApi('login', { id, pass });
      return { success: true, data };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  // Keep these as backups if we needed to refresh specific sections individually
  // But primarily we will use the initial load.
  getEvents: () => callApi('getEvents'),
  getAchievements: (studentId: string) => callApi('getAchievements', { studentId }),
  // ... others can remain for ad-hoc validtion but won't be used by main UI
};