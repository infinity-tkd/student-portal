
// Simple obfuscation to prevent plain-text reading of sensitive data in LocalStorage.
// In a production environment with a real backend, use HttpOnly cookies.
const PREFIX = 'inf_sec_';

const encrypt = (data: any): string => {
  try {
    const json = JSON.stringify(data);
    // UTF-8 Safe Encoding for btoa (handles non-English/Emojis)
    const utf8Bytes = encodeURIComponent(json + 'INF_SALT').replace(/%([0-9A-F]{2})/g,
      (match, p1) => String.fromCharCode(parseInt(p1, 16))
    );
    return btoa(utf8Bytes);
  } catch (e) {
    console.error("Encrypt Error", e);
    return '';
  }
};

const decrypt = (cipher: string): any => {
  try {
    const bytes = atob(cipher);
    const utf8Str = decodeURIComponent(bytes.split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    const decoded = utf8Str.replace('INF_SALT', '');
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Decrypt Error", e);
    return null;
  }
};

export const secureStorage = {
  setItem: (key: string, value: any, remember: boolean) => {
    try {
      const storage = remember ? localStorage : sessionStorage;
      const encrypted = encrypt(value);
      storage.setItem(PREFIX + key, encrypted);
    } catch (e) {
      console.warn('SecureStorage: Failed to save item (Quota exceeded?)', e);
    }
  },

  getItem: (key: string) => {
    // Check both storages
    const local = localStorage.getItem(PREFIX + key);
    if (local) return decrypt(local);

    const session = sessionStorage.getItem(PREFIX + key);
    if (session) return decrypt(session);

    return null;
  },

  removeItem: (key: string) => {
    localStorage.removeItem(PREFIX + key);
    sessionStorage.removeItem(PREFIX + key);
  },

  clearAll: () => {
    // Clear only app specific keys
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(PREFIX)) localStorage.removeItem(k);
    });
    Object.keys(sessionStorage).forEach(k => {
      if (k.startsWith(PREFIX)) sessionStorage.removeItem(k);
    });
  }
};
