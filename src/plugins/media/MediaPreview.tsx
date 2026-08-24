// 媒体全屏预览页 - 点小眼睛打开，铺满整个视口
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { formatBytes } from './MediaBlock';
import type { MediaKind, MediaAttrs } from './MediaBlock';
import styles from './MediaBlock.module.less';

interface MediaPreviewProps {
  kind: MediaKind;
  attrs: MediaAttrs;
  onClose: () => void;
}

const isTextual = (name = '', mime = ''): boolean => {
  if (/^text\//.test(mime)) return true;
  if (
    /\.(txt|md|markdown|json|csv|log|xml|html|htm|css|js|ts|tsx|jsx|less|yml|yaml|ini|env|gitignore)$/i.test(
      name,
    )
  )
    return true;
  return false;
};

// Office 在线预览结果：kind 表示识别到的类型，url 为可嵌入的预览地址（需公网 http(s)）
// 通过 switch case 分发，方便后续扩展更多文件类型 / 预览通道（微软、WPS 等）
interface OfficePreview {
  kind: 'word' | 'excel' | 'ppt' | null;
  url: string | null;
}

function getOfficePreview(name = '', src = ''): OfficePreview {
  const ext = (name.split('.').pop() || '').toLowerCase();
  let kind: OfficePreview['kind'] = null;
  switch (ext) {
    case 'doc':
    case 'docx':
      kind = 'word';
      break;
    case 'xls':
    case 'xlsx':
    case 'xlsm':
      kind = 'excel';
      break;
    case 'ppt':
    case 'pptx':
      kind = 'ppt';
      break;
    default:
      break;
  }
  // 在线预览要求文件是公网可访问的 http(s) 地址；本地/内网地址无法被预览服务抓取
  const publicSrc = kind && /^https?:\/\//i.test(src) ? src : null;
  return {
    kind,
    url: publicSrc
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicSrc)}`
      : null,
  };
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ kind, attrs, onClose }) => {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isText = kind === 'file' && isTextual(attrs?.name, attrs?.mimeType);
  const office = getOfficePreview(attrs?.name, attrs?.src);

  useEffect(() => {
    if (!isText || !attrs?.src) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(attrs.src)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((t) => {
        if (!cancelled) {
          setText(t);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(String(err?.message || err));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isText, attrs?.src]);

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div className={styles.fullPage}>
          <div className={styles.fullPageHeader}>
            <button className={styles.fullPageBack} onClick={onClose}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>退出</span>
            </button>
            <div className={styles.fullPageTitle}>
              <span>{attrs?.name || (kind === 'video' ? '视频' : '文件')}</span>
              <span className={styles.fullPageMeta}>{formatBytes(attrs?.size)}</span>
            </div>
            <div className={styles.fullPageActions}>
              {attrs?.src && (
                <a
                  className={styles.fullPageBtn}
                  href={attrs.src}
                  download={attrs?.name || undefined}
                >
                  下载
                </a>
              )}
            </div>
          </div>
          <div className={styles.fullPageBody}>
            {kind === 'video' ? (
              attrs?.src ? (
                <video
                  className={styles.fullPageVideo}
                  src={attrs.src}
                  controls
                  autoPlay
                  preload="metadata"
                />
              ) : (
                <div className={styles.fullPageEmpty}>暂无可播放的视频地址</div>
              )
            ) : isText ? (
              loading ? (
                <div className={styles.fullPageEmpty}>加载中…</div>
              ) : error ? (
                <div className={styles.fullPageEmpty}>无法预览：{error}</div>
              ) : (
                <pre className={styles.fullPageText}>{text}</pre>
              )
            ) : office?.url ? (
              <iframe
                className={styles.fullPageOffice}
                src={office.url}
                title={attrs?.name}
                frameBorder="0"
                allowFullScreen
              />
            ) : office?.kind ? (
              <div className={styles.fullPageEmpty}>
                {office.kind === 'word' ? 'Word' : office.kind === 'excel' ? 'Excel' : 'PPT'}
                在线预览需要文件的公网 http(s)
                地址，当前地址无法被预览服务访问，请下载后在本地查看。
              </div>
            ) : (
              <div className={styles.fullPageEmpty}>
                该文件类型不支持内容预览，可点击右上角「下载」保存后在本地查看。
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </React.Fragment>
  );
};

export default MediaPreview;
