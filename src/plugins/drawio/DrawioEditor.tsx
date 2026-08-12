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
  const lastXmlRef = useRef(initialXml || '');
  // 用户主动保存后，等待 export 返回预览图再退出
  const pendingCloseRef = useRef(false);

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

  // 关闭编辑器（防重复）
  const doClose = useCallback(() => {
    pendingCloseRef.current = false;
    onCloseRef.current();
  }, []);

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
          // 用户点击保存/保存并退出：保存 XML + 请求 SVG 导出，等导出完成后退出
          const xml = msg.xml || '';
          lastXmlRef.current = xml;
          onSaveRef.current(xml);
          pendingCloseRef.current = true;
          sendMessage({
            action: 'export',
            format: 'svg',
            xml,
          });
          break;
        }

        case 'export': {
          // SVG 预览图返回：更新预览
          if (msg.data) {
            onSaveRef.current(lastXmlRef.current || msg.xml || '', msg.data);
          }
          // 如果用户点击了保存/保存并退出，生成预览图后退出编辑器
          if (pendingCloseRef.current) {
            doClose();
          }
          break;
        }

        case 'exit': {
          // 退出按钮直接关闭
          doClose();
          break;
        }

        case 'autosave': {
          // 自动保存：静默更新 XML，不退出
          if (msg.xml) {
            lastXmlRef.current = msg.xml;
          }
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [sendLoad, sendMessage, doClose]);

  // iframe 加载完成兑底：如果 init 没触发，3 秒后强制发送 load
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
