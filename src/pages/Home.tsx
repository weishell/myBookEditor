import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { getAllArticles, getAllCategories, getAllTags, getArticleTotal } from '@/data/articles';
import { assetUrl } from '@/data/assets';
import { canWrite, getDataState } from '@/data/store';
import { HERO_SCENES, HeroSceneBackdrop } from '@/pages/home/scenes';
import { useHeroScene } from '@/pages/home/useHeroScene';
import NewArticleModal from './NewArticleModal';
import TaxonomyManager from '@/components/TaxonomyManager';
import styles from './Home.module.less';

export default function Home() {
  const categories = getAllCategories();
  const tags = getAllTags();
  const total = getArticleTotal();
  const latest = getAllArticles().slice(0, 5);
  const writable = canWrite();
  const source = getDataState().source;
  const [newOpen, setNewOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  // 维护面板改完分类/标签后自增，触发本页重新渲染（数据在 store 里已更新）
  const [, bumpVersion] = useState(0);
  // 首页氛围背景：存在 localStorage，和全局壁纸是两套偏好
  const { scene, sceneId, setSceneId } = useHeroScene();

  return (
    <div className={styles.page}>
      {/* 只读模式说明：数据源不是本地 api 时新建/管理入口会被隐藏，必须告诉用户为什么、怎么开 */}
      {!writable && (
        <div className={styles.readonlyTip}>
          <b>当前是只读模式</b>
          <span>
            {source === 'demo'
              ? '未连接本地数据服务，展示的是内置示例数据。'
              : '展示的是构建时导出的静态快照。'}{' '}
            在项目根目录运行 <code>pnpm dev</code>
            （会同时启动后端与前端），刷新后即可新建文档、管理分类与标签。
          </span>
        </div>
      )}

      {/* Hero：整幅氛围背景铺底，左侧文案 + 右侧数据卡。
          背景色调（light / dark）由场景自带，决定文字用深色还是浅色 —— 
          否则在"星河夜幕"上写深色标题会完全看不清。 */}
      <section className={`${styles.hero} ${scene.tone === 'dark' ? styles.heroDark : ''}`}>
        <HeroSceneBackdrop scene={scene} />
        <span className={styles.heroVeil} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.heroBadge}>MyBook 文章中心</span>
            <h1 className={styles.heroTitle}>好文章，值得慢慢读</h1>
            <p className={styles.heroDesc}>
              按分类浏览，或从标签直达感兴趣的话题。每一篇文章都是可编辑的富文档，打开即是编辑器。
            </p>
            <div className={styles.heroActions}>
              {writable && (
                <button
                  type="button"
                  className={styles.heroBtnPrimary}
                  onClick={() => setNewOpen(true)}
                >
                  ＋ 新建文档
                </button>
              )}
              {writable && (
                <button
                  type="button"
                  className={styles.heroBtnGhost}
                  onClick={() => setManageOpen(true)}
                >
                  管理分类 / 标签
                </button>
              )}
              <Link to="/demo" className={styles.heroBtn}>
                打开全功能示例文档
              </Link>
            </div>
            <span className={styles.heroHint}>流程图、画板、图表、公式…所有能力都在里面</span>

            {/* 背景切换：直接做在 Hero 里，选完立刻看得见，不用跳设置页来回试 */}
            <div className={styles.sceneBar}>
              <span className={styles.sceneLabel}>氛围背景</span>
              <div className={styles.sceneDots}>
                {HERO_SCENES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.sceneDot} ${item.id === sceneId ? styles.sceneDotActive : ''}`}
                    style={{ background: item.swatch }}
                    onClick={() => setSceneId(item.id)}
                    title={`${item.name} · ${item.desc}`}
                    aria-label={item.name}
                    aria-pressed={item.id === sceneId}
                  />
                ))}
              </div>
              <span className={styles.sceneName}>{scene.name}</span>
            </div>
          </div>

          <aside className={styles.heroAside} aria-label="全站统计">
            <div className={styles.statCard}>
              <b>{total}</b>
              <span>篇文章</span>
            </div>
            <div className={styles.statCard}>
              <b>{categories.length}</b>
              <span>个分类</span>
            </div>
            <div className={styles.statCard}>
              <b>{tags.length}</b>
              <span>个标签</span>
            </div>
          </aside>
        </div>
      </section>

      {latest.length > 0 && (
        <section className={styles.block}>
          <div className={styles.blockHeader}>
            <h2 className={styles.blockTitle}>最近更新</h2>
            <span className={styles.blockDesc}>
              {writable
                ? '本地索引库实时反映文件改动'
                : source === 'demo'
                  ? '内置示例数据 · 只读'
                  : '来自构建时生成的数据快照'}
            </span>
            <Link to="/articles" className={styles.moreLink}>
              更多<span className={styles.moreArrow}>›</span>
            </Link>
          </div>
          <div className={styles.latestList}>
            {latest.map((a, i) => (
              <Link key={a.id} to={`/article/${a.id}`} className={styles.latestRow}>
                <span className={styles.latestIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.latestTitle}>{a.title}</span>
                <span className={styles.latestDate}>{a.date}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h2 className={styles.blockTitle}>文章分类</h2>
          <span className={styles.blockDesc}>选择一个方向，开始阅读</span>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/category/${c.id}`}
              className={styles.categoryCard}
              style={{ '--card-color': c.color } as CSSProperties}
            >
              <span
                className={styles.categoryCover}
                style={{ backgroundImage: `url(${assetUrl(c.cover)})` }}
              />
              <span className={styles.categoryBody}>
                <span className={styles.categoryIcon}>{c.icon}</span>
                <span className={styles.categoryName}>{c.name}</span>
                <span className={styles.categoryDesc}>{c.desc}</span>
                <span className={styles.categoryCount}>{c.count} 篇</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h2 className={styles.blockTitle}>热门标签</h2>
          <span className={styles.blockDesc}>点一个标签，看相关文章</span>
        </div>
        <div className={styles.tagCloud}>
          {tags.map((t) => (
            <Link
              key={t.id}
              to={`/tag/${t.id}`}
              className={styles.tagCard}
              style={{ '--card-color': t.color } as CSSProperties}
            >
              <span className={styles.tagName}># {t.name}</span>
              <span className={styles.tagCount}>{t.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <NewArticleModal open={newOpen} onClose={() => setNewOpen(false)} />
      <TaxonomyManager
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        onChanged={() => bumpVersion((v) => v + 1)}
      />
    </div>
  );
}
