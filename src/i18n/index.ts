import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zh from './locales/zh';
import zhTW from './locales/zh-TW';
import en from './locales/en';
import ja from './locales/ja';
import ko from './locales/ko';
import fr from './locales/fr';
import de from './locales/de';

export type AppLanguage = 'zh' | 'zh-TW' | 'en' | 'ja' | 'ko' | 'fr' | 'de';

export const SUPPORTED_LANGUAGES: AppLanguage[] = ['zh', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de'];

/**
 * 触发按钮 / 下拉行右侧展示的语言短码。
 * 刻意不随当前语言变化（语言名本身用各语言的原生写法，见 locales 里的 `languages`）。
 */
export const LANGUAGE_SHORT: Record<AppLanguage, string> = {
  zh: '中',
  'zh-TW': '繁',
  en: 'EN',
  ja: '日',
  ko: '한',
  fr: 'FR',
  de: 'DE',
};

const STORAGE_KEY = 'mybook-language';

/** 上次选择的语言（校验合法性），无记录时回退简中 */
function readStoredLanguage(): AppLanguage {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && (SUPPORTED_LANGUAGES as string[]).includes(v)) return v as AppLanguage;
  } catch {
    /* localStorage 不可用，忽略 */
  }
  return 'zh';
}

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    'zh-TW': { translation: zhTW },
    en: { translation: en },
    ja: { translation: ja },
    ko: { translation: ko },
    fr: { translation: fr },
    de: { translation: de },
  },
  lng: readStoredLanguage(),
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
});

// 记住语言选择，并同步 <html lang>（供字体回退 / 无障碍使用）；刷新后不丢。
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* ignore */
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

export default i18n;
