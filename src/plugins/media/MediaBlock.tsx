// 文件 / 视频 媒体块插件 - 主组件
// 三套展示层（layer）：
//  - text：行内紧凑文本层（图标 + 文件名，最小占用）
//  - card：卡片层（图标 + 文件名 + 大小 + 操作）
//  - view：视图层（行内展开：文本文件显示正文，视频显示播放器）
// eye 图标始终可打开更大尺寸的预览浮层（Modal）。

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic, useSelected } from 'slate-react';
import { ElementWrapper } from '../element-wrapper/ElementWrapper';
import { BlockElementType } from '@/enums';
import { copyBlockToClipboard } from '@/utils/clipboard';
import MediaPreview from './MediaPreview';
import styles from './MediaBlock.module.less';

export type MediaKind = 'file' | 'video';
export type MediaLayer = 'text' | 'card' | 'view';

export interface MediaAttrs {
  kind: MediaKind;
  src: string;
  name: string;
  size?: number; // 字节
  mimeType?: string;
  layer?: MediaLayer;
  width?: number;
  height?: number;
}

interface MediaProps {
  attributes: any;
  children?: React.ReactNode;
  pluginId: string;
  element: { id: string; attrs: MediaAttrs } & Record<string, any>;
}

/** 字节 → 可读大小 */
export const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

/** 文本类文件（可读取正文预览） */
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

const FileIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const VideoIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="5" width="14" height="14" rx="2" />
    <polygon points="22 8 16 12 22 16 22 8" />
  </svg>
);

const EyeIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LayerIcon = ({
  active,
  title,
  onClick,
  children,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    title={title}
    className={`${styles.layerBtn} ${active ? styles.layerBtnActive : ''}`}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    type="button"
  >
    {children}
  </button>
);

const TEXT_LAYER_ICON = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="17" x2="20" y2="17" />
  </svg>
);
const CARD_LAYER_ICON = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const VIEW_LAYER_ICON = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M8 9h8M8 13h5" />
  </svg>
);

const MediaBlock: React.FC<MediaProps> = ({ attributes, children, pluginId, element }) => {
  const editor = useSlateStatic();
  const { attrs } = element;
  const isSelected = useSelected();

  const kind: MediaKind = attrs?.kind === 'video' ? 'video' : 'file';
  const layer: MediaLayer =
    attrs?.layer === 'text' || attrs?.layer === 'view' ? attrs.layer : 'card';

  const [showToolbar, setShowToolbar] = useState(false);
  const [editing, setEditing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [textLoading, setTextLoading] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);

  const hideTimerRef = useRef<number | null>(null);
  const attrsRef = useRef(attrs);
  attrsRef.current = attrs;

  const isTextFile = kind === 'file' && isTextual(attrs?.name, attrs?.mimeType);

  const getElementPath = useCallback(() => {
    try {
      return ReactEditor.findPath(editor, element as any);
    } catch {
      return null;
    }
  }, [editor, element]);

  const updateAttrs = useCallback(
    (newAttrs: Partial<MediaAttrs>) => {
      const path = getElementPath();
      if (!path) {
        console.warn('[MediaBlock] updateAttrs: path not found', element);
        return;
      }
      try {
        Transforms.setNodes(editor, { attrs: { ...attrsRef.current, ...newAttrs } } as any, {
          at: path,
        });
      } catch (err) {
        console.error('[MediaBlock] updateAttrs failed:', err);
      }
    },
    [editor, getElementPath, element],
  );

  const handleRemove = useCallback(() => {
    const path = getElementPath();
    if (!path) return;
    Transforms.removeNodes(editor, { at: path });
  }, [editor, getElementPath]);

  const handleCopy = useCallback(() => {
    const path = getElementPath();
    if (!path) return;
    copyBlockToClipboard(editor, path);
  }, [editor, getElementPath]);

  // 行内视图层（view）时，自动拉取文本正文
  useEffect(() => {
    if (layer !== 'view' || kind !== 'file' || !isTextFile || !attrs?.src) {
      setTextContent(null);
      return;
    }
    let cancelled = false;
    setTextLoading(true);
    setTextError(null);
    fetch(attrs.src)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((t) => {
        if (!cancelled) {
          setTextContent(t);
          setTextLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setTextError(String(err?.message || err));
          setTextLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [layer, kind, isTextFile, attrs?.src]);

  const showToolbarHandler = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setShowToolbar(true);
  }, []);

  const hideToolbarHandler = useCallback(() => {
    if (isSelected) return;
    hideTimerRef.current = window.setTimeout(() => {
      setShowToolbar(false);
      hideTimerRef.current = null;
    }, 300);
  }, [isSelected]);

  const Icon = kind === 'video' ? VideoIcon : FileIcon;
  const typeLabel = kind === 'video' ? '视频' : '文件';

  return (
    <ElementWrapper
      type={kind === 'video' ? BlockElementType.VIDEO_BLOCK : BlockElementType.FILE_BLOCK}
      pluginId={pluginId}
      attributes={attributes}
    >
      <div
        className={styles.wrapper}
        onMouseEnter={showToolbarHandler}
        onMouseLeave={hideToolbarHandler}
      >
        {(showToolbar || isSelected) && (
          <div
            className={styles.toolbar}
            onMouseEnter={showToolbarHandler}
            onMouseLeave={hideToolbarHandler}
          >
            <LayerIcon
              active={layer === 'text'}
              title="文本层"
              onClick={() => updateAttrs({ layer: 'text' })}
            >
              {TEXT_LAYER_ICON}
            </LayerIcon>
            <LayerIcon
              active={layer === 'card'}
              title="卡片层"
              onClick={() => updateAttrs({ layer: 'card' })}
            >
              {CARD_LAYER_ICON}
            </LayerIcon>
            <LayerIcon
              active={layer === 'view'}
              title="视图层"
              onClick={() => updateAttrs({ layer: 'view' })}
            >
              {VIEW_LAYER_ICON}
            </LayerIcon>
            <div className={styles.divider} />
            <button
              className={styles.toolbarButton}
              title="放大预览"
              onClick={() => setPreviewOpen(true)}
            >
              <EyeIcon />
            </button>
            <button className={styles.toolbarButton} title="复制" onClick={handleCopy}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <button className={styles.toolbarButton} title="删除" onClick={handleRemove}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        )}

        {/* 文本层 */}
        {layer === 'text' && (
          <div
            className={styles.textLayer}
            contentEditable={false}
            suppressContentEditableWarning={true}
            onClick={() => setPreviewOpen(true)}
          >
            <span className={styles.textLayerIcon}>
              <Icon size={16} />
            </span>
            <span className={styles.textLayerName}>{attrs?.name || typeLabel}</span>
            <span className={styles.textLayerMeta}>{formatBytes(attrs?.size)}</span>
          </div>
        )}

        {/* 卡片层 */}
        {layer === 'card' && (
          <div
            className={styles.cardLayer}
            contentEditable={false}
            suppressContentEditableWarning={true}
          >
            <div className={styles.cardIcon}>
              <Icon size={28} />
            </div>
            <div className={styles.cardInfo}>
              {editing ? (
                <input
                  className={styles.cardNameInput}
                  value={attrs?.name || ''}
                  placeholder="文件名"
                  onChange={(e) => updateAttrs({ name: e.target.value })}
                  onMouseDown={(e) => e.stopPropagation()}
                  autoFocus
                />
              ) : (
                <div className={styles.cardName} title={attrs?.name}>
                  {attrs?.name || typeLabel}
                </div>
              )}
              {editing ? (
                <input
                  className={styles.cardUrlInput}
                  value={attrs?.src || ''}
                  placeholder="文件 / 视频链接 URL"
                  onChange={(e) => updateAttrs({ src: e.target.value })}
                  onMouseDown={(e) => e.stopPropagation()}
                />
              ) : (
                <div className={styles.cardMeta}>
                  {typeLabel} · {formatBytes(attrs?.size)}
                </div>
              )}
            </div>
            <div className={styles.cardActions}>
              <button
                className={styles.cardAction}
                title={editing ? '完成' : '编辑名称 / 链接'}
                onClick={() => setEditing((v) => !v)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button
                className={styles.cardAction}
                title="预览"
                onClick={() => setPreviewOpen(true)}
              >
                <EyeIcon size={16} />
              </button>
              {attrs?.src && (
                <a
                  className={styles.cardAction}
                  title="下载"
                  href={attrs.src}
                  download={attrs?.name || undefined}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 视图层 */}
        {layer === 'view' && (
          <div
            className={styles.viewLayer}
            contentEditable={false}
            suppressContentEditableWarning={true}
          >
            {kind === 'video' ? (
              attrs?.src ? (
                <video className={styles.video} src={attrs.src} controls preload="metadata" />
              ) : (
                <div className={styles.emptyView}>暂无可播放的视频地址</div>
              )
            ) : (
              <>
                <div className={styles.viewHeader}>
                  <Icon size={18} />
                  <span className={styles.viewName}>{attrs?.name || typeLabel}</span>
                </div>
                <div className={styles.viewBody}>
                  {textLoading && <div className={styles.emptyView}>加载中…</div>}
                  {textError && <div className={styles.emptyView}>无法预览：{textError}</div>}
                  {!textLoading && !textError && textContent !== null && (
                    <pre className={styles.textContent}>{textContent}</pre>
                  )}
                  {!textLoading && !textError && textContent === null && !isTextFile && (
                    <div className={styles.emptyView}>
                      该文件类型不支持行内预览，点击右上角放大查看或下载
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {children}

        {previewOpen && (
          <MediaPreview kind={kind} attrs={attrs} onClose={() => setPreviewOpen(false)} />
        )}
      </div>
    </ElementWrapper>
  );
};

export default MediaBlock;
