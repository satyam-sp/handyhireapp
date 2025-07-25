import Toast from "react-native-toast-message";
import axiosInstance from "../services/axiosInstance";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Import translation files

import i18n from 'i18next';
import * as RNLocalize from 'react-native-localize'; // For getting device locale (for bare React Native)
import { Alert } from "react-native";

const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' }, // Added Hindi
];

const DEFAULT_LANGUAGE = 'en'; // Fallback language if device locale is not supported

export const formatToINRCurrency = (value: string) => {
    if (!value) return '';
    const numericValue = value.toString().replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return '₹' + new Intl.NumberFormat('en-IN').format(Number(numericValue));
};

export function padNumberWithZero(num: number) {
  return String(num).padStart(2, '0');
}


// --- Helper Functions ---
// Modified truncateText to allow for line limits rather than just word limits
export const truncateText = (text: string, maxLines: number, fontSettings: { fontSize: number, lineHeight: number, width: number }) => {
  if (!text) return '';

  // A rough estimation of characters per line based on font size and line height.
  // This is not precise as character widths vary, but provides a reasonable guess.
  // Assuming an average character width of about 0.6 * fontSize
  const charsPerLine = Math.floor(fontSettings.width / (fontSettings.fontSize * 0.6));
  const maxChars = charsPerLine * maxLines;

  if (text.length > maxChars) {
      // Find the last space within the maxChars limit to avoid cutting words
      let truncated = text.substring(0, maxChars);
      const lastSpace = truncated.lastIndexOf(' ');
      if (lastSpace !== -1) {
          truncated = truncated.substring(0, lastSpace);
      }
      return truncated + '...';
  }
  return text;
};


export const errorBlock = (err: any) => {
  let errorMessage = 'Something went wrong';

  if (axios.isAxiosError(err)) {
    // Axios error structure
    if (err.response?.data) {
      errorMessage = err.response.data.errors.join('\n')
      showToastMessage('error', 'Error', errorMessage);
    } else {
      errorMessage = err.message;
      showToastMessage('error', 'Error', errorMessage);
    }
  } else if (err instanceof Error) {
    errorMessage = err.message;
    showToastMessage('error', 'Error', errorMessage);
  } else {
    console.error('Unknown error type:', err);
    showToastMessage('error', 'Error', errorMessage);
  }
  return errorMessage;
}


export const loadAndSetInitialLanguage = async () => {
  try {
    const persistedLanguage = await AsyncStorage.getItem('appLanguage');
    if (persistedLanguage) {
      i18n.changeLanguage(persistedLanguage);
    } else {
      // Get device locale using react-native-localize
      const locales = RNLocalize.getLocales();
      const deviceLocale = locales[0]?.languageCode; // e.g., 'en-US' -> 'en'

      const isDeviceLocaleAvailable = AVAILABLE_LANGUAGES.some(lang => lang.code === deviceLocale);
      if (isDeviceLocaleAvailable) {
        i18n.changeLanguage(deviceLocale);
      } else {
        i18n.changeLanguage(DEFAULT_LANGUAGE);
      }
    }
  } catch (error) {
    console.error("Failed to load initial language:", error);
    // Fallback to default if storage fails
    i18n.changeLanguage(DEFAULT_LANGUAGE);
  }
};

export const changeAppLanguage = async (newLanguageCode: any) => {
  try {
    await i18n.changeLanguage(newLanguageCode);
    await AsyncStorage.setItem('appLanguage', newLanguageCode);
  } catch (error) {
    console.error("Failed to change or persist language:", error);
    Alert.alert("Error", "Could not change language.");
  }
};
export const showToastMessage = (type = 'success', text1 ='', text2 = '') => {
  return Toast.show({
    type,
    text1,
    text2,
  });
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'closed':
      return '#dc3545'; // red
    case 'active':
      return '#28a745'; // green
    case 'inprogress':
      return '#fd7e14'; // orange
    case 'hold':
      return '#6c757d'; // gray (bootstrap secondary)
    default:
      return '#adb5bd'; // light gray for unknown
  }
};



export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
};




export const fetchSWR = (url: string) => {
  return axiosInstance.get(url).then(res => res.data);
};