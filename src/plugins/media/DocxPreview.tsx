// Word(.docx) 文档预览：
//  - 线上（公网 http(s) 地址）：直接用 Office 在线预览 iframe，由微软服务器抓取文件；
//  - 本地（localhost/内网地址、本地相对路径）：Office 服务抓不到，退回 docx-preview 前端解析。
import React, { useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import { toMediaUrl } from '@/data/media';
import styles from './MediaBlock.module.less';

const DOCX_MIME = /^application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$/i;
const DOCX_EXT = /\.docx$/i;
const LEGACY_DOC_EXT = /\.doc(?:\?|#|$)/i;

/** 新格式 .docx：docx-preview 能解析 */
export const isDocxFile = (name = '', mimeType = ''): boolean =>
  DOCX_MIME.test(mimeType) || DOCX_EXT.test(name);

/** 旧格式 .doc（二进制）：浏览器端库解析不了，只能提示下载 / 转换 */
export const isLegacyDocFile = (name = '', mimeType = ''): boolean =>
  !isDocxFile(name, mimeType) &&
  (/^application\/msword$/i.test(mimeType) || LEGACY_DOC_EXT.test(name));

/** localhost / 回环 / 局域网 / .local 主机：Office 在线预览无法访问 */
const PRIVATE_HOST =
  /^(?:localhost|127\.|0\.0\.0\.0|\[?::1\]?|10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|[^.]+\.local)$/i;

const isPrivateHost = (host = ''): boolean => !host || PRIVATE_HOST.test(host);

/**
 * 是否只能在前端本地解析：
 * - 绝对 http(s) 地址指向 localhost / 内网 → 本地解析
 * - 相对路径：当前站点本身在 localhost / 内网时才本地解析，
 *   线上部署时相对路径同样是公网可访问的，交给 Office 在线预览
 */
export const isLocalDocxSrc = (src = ''): boolean => {
  if (!src) return true;
  if (!/^https?:\/\//i.test(src)) return isPrivateHost(window.location.hostname);
  try {
    return isPrivateHost(new URL(src).hostname);
  } catch {
    return true;
  }
};

/** 补成绝对地址：Office 在线预览需要能从公网抓取的完整 URL */
export const toAbsoluteUrl = (src = ''): string => {
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
};

interface DocxPreviewProps {
  src: string;
  /** inline：文档内视图层（限高、内部滚动）；full：全屏预览（铺满可用高度） */
  variant?: 'inline' | 'full';
}

const DocxPreview: React.FC<DocxPreviewProps> = ({ src, variant = 'inline' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'office' | 'error'>('loading');
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;
    el.innerHTML = '';
    setError('');

    // 线上地址交给 Office 在线预览；本地/内网地址才走前端解析
    const local = isLocalDocxSrc(src);
    setUrl(local ? toMediaUrl(src) : toAbsoluteUrl(src));

    if (!local) {
      setStatus('office');
      return () => {
        el.innerHTML = '';
      };
    }

    setStatus('loading');

    (async () => {
      try {
        const res = await fetch(toMediaUrl(src));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;
        // ignoreWidth/ignoreHeight：文档页跟随容器宽度排版，避免固定 21cm 版心在正文里横向溢出
        await renderAsync(buffer, el, undefined, {
          className: 'docx-embed',
          inWrapper: true,
          ignoreWidth: true,
          ignoreHeight: true,
          breakPages: true,
          // 图片/字体转 base64，避免反复渲染时产生一堆未回收的 blob URL
          useBase64URL: true,
        });
        if (!cancelled) setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        setError(String((err as Error)?.message || err));
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      el.innerHTML = '';
    };
  }, [src]);

  return (
    <div className={`${styles.docxView} ${variant === 'full' ? styles.docxViewFull : ''}`}>
      <div
        ref={containerRef}
        className={styles.docxBody}
        style={status === 'office' ? { display: 'none' } : undefined}
      />
      {status === 'office' && (
        <iframe
          className={styles.docxOffice}
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
          title="Word 在线预览"
          frameBorder="0"
          allowFullScreen
        />
      )}
      {status === 'loading' && <div className={styles.docxHint}>文档加载中…</div>}
      {status === 'error' && (
        <div className={styles.docxHint}>
          无法预览该 Word 文件：{error}
          {url && <div className={styles.docxHintUrl}>{url}</div>}
          可点击右上角「下载」后在本地查看。
        </div>
      )}
    </div>
  );
};

export default DocxPreview;
