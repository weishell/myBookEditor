import { useLanguage } from '@/context/LanguageContext';
import styles from './LanguageSwitcher.module.less';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className={styles.button}
      onClick={toggleLanguage}
      title={language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      {language === 'zh' ? '中文' : 'EN'}
    </button>
  );
}
