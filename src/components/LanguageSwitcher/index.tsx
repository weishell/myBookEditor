import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.less';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      className={styles.button}
      onClick={toggleLanguage}
      title={i18n.language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      {i18n.language === 'zh' ? 'EN' : '中文'}
    </button>
  );
}
