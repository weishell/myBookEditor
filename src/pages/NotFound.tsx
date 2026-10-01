import { Link } from 'react-router-dom';
import styles from './NotFound.module.less';

export default function NotFound() {
  return (
    <div className={styles.wrap}>
      <div className={styles.code}>404</div>
      <div className={styles.title}>页面未找到</div>
      <div className={styles.desc}>您访问的页面不存在或已被删除</div>
      <Link to="/" className={styles.home}>
        返回首页
      </Link>
    </div>
  );
}
