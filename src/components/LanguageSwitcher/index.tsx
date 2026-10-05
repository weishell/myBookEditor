import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { LANGUAGE_SHORT } from '@/i18n';
import styles from './LanguageSwitcher.module.less';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <button className={styles.button} onClick={toggleLanguage} title={t('settings.language')}>
      {LANGUAGE_SHORT[language]}
    </button>
  );
}
