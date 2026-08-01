import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppLanguage } from '@/i18n';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function normalizeLng(lng: string | undefined): AppLanguage {
  return lng === 'en' ? 'en' : 'zh';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  const language = normalizeLng(i18n.language);

  const setLanguage = useCallback(
    async (lang: AppLanguage) => {
      if (i18n.language !== lang) {
        await i18n.changeLanguage(lang);
      }
    },
    [i18n],
  );

  const toggleLanguage = useCallback(async () => {
    const current = normalizeLng(i18n.language);
    const next: AppLanguage = current === 'zh' ? 'en' : 'zh';
    await i18n.changeLanguage(next);
  }, [i18n]);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
