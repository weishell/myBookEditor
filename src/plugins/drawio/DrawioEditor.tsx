// Drawio 全屏编辑器 - 通过 iframe 嵌入 draw.io，使用 postMessage 通信
import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styles from './Drawio.module.less';

interface DrawioEditorProps {
  initialXml?: string;
  onSave: (xml: string, svgDataUrl?: string) => void;
  onClose: () => void;
}

// draw.io embed URL
// proto=json: 消息必须 JSON.stringify 发送
const DRAWIO_URL =
  'https://embed.diagrams.net/?embed=1&spin=1&proto=json&saveAndExit=1&libraries=1';

const DrawioEditor: React.FC<DrawioEditorProps> = ({ initialXml, onSave, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onSaveRef = useRef(onSave);
  const onCloseRef = useRef(onClose);
  const loadedRef = useRef(false);

  // 保持回调引用最新
  onSaveRef.current = onSave;
  onCloseRef.current = onClose;

  // 向 draw.io iframe 发送消息 - proto=json 模式必须发 JSON 字符串
  const sendMessage = useCallback((msg: Record<string, unknown>) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
  }, []);

  // 发送 load 指令（只发一次）
  const sendLoad = useCallback(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    sendMessage({
      action: 'load',
      xml: initialXml || '',
      autosave: 1,
    });
  }, [initialXml, sendMessage]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // draw.io 发送 JSON 字符串
      let msg: any;
      if (typeof event.data === 'string') {
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }
      } else if (typeof event.data === 'object' && event.data !== null) {
        msg = event.data;
      } else {
        return;
      }

      if (!msg || !msg.event) return;

      switch (msg.event) {
        case 'init': {
          // draw.io 就绪
          sendLoad();
          break;
        }

        case 'save': {
          const xml = msg.xml || '';
          sendMessage({
            action: 'export',
            format: 'svg',
            xml,
          });
          onSaveRef.current(xml);
          break;
        }

        case 'export': {
          if (msg.data) {
            onSaveRef.current(msg.xml || '', msg.data);
          }
          break;
        }

        case 'exit': {
          onCloseRef.current();
          break;
        }

        case 'autosave':
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [sendLoad, sendMessage]);

  // iframe 加载完成兜底：如果 init 没触发，3 秒后强制发送 load
  const handleIframeLoad = useCallback(() => {
    setTimeout(() => {
      if (!loadedRef.current) {
        sendLoad();
      }
    }, 3000);
  }, [sendLoad]);

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <iframe
        ref={iframeRef}
        className={styles.overlayIframe}
        src={DRAWIO_URL}
        title="Drawio Editor"
        allow="fullscreen"
        onLoad={handleIframeLoad}
      />
    </div>,
    document.body,
  );
};

export default DrawioEditor;
