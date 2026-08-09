import { useMemo } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useTheme } from '@/context/ThemeContext';

/**
 * 把 antd 的算法/token 桥接到我们自己的 ThemeContext 上：
 * - 浅色：defaultAlgorithm
 * - 暗黑：darkAlgorithm + 一组与 --dm-xxx 变量一致的深色 token
 * - colorPrimary 跟随当前主题色
 *
 * 必须放在 <ThemeProvider> 内部使用（因为依赖 useTheme）。
 */
export default function AntdThemeBridge({ children }: { children: React.ReactNode }) {
  const { isDarkMode, themeColor } = useTheme();
  const antdConfig = useMemo(() => {
    return {
      algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: themeColor,
        borderRadius: 6,
        ...(isDarkMode
          ? {
              colorBgBase: '#121721',
              colorBgContainer: '#121721',
              colorBgElevated: '#1a2130',
              colorBgLayout: '#080b13',
              colorTextBase: '#e5e7eb',
              colorText: '#e5e7eb',
              colorTextSecondary: '#9ca3af',
              colorTextTertiary: '#6b7280',
              colorTextQuaternary: '#4b5563',
              colorBorder: '#2b3240',
              colorBorderSecondary: '#202837',
              colorSplit: '#202837',
            }
          : {}),
      },
      components: isDarkMode
        ? {
            Select: {
              selectorBg: '#1a2130',
              colorText: '#e5e7eb',
              colorTextPlaceholder: '#6b7280',
              colorBorder: '#2b3240',
              optionSelectedBg: 'rgba(59, 130, 246, 0.16)',
              optionActiveBg: '#1e2532',
            },
            Dropdown: {
              controlItemBgActive: '#1e2532',
              controlItemBgHover: '#1e2532',
            },
            Popover: {
              zIndexPopup: 10001,
            },
            Tooltip: {
              colorBgDefault: '#1a2130',
            },
          }
        : undefined,
    };
  }, [isDarkMode, themeColor]);
  return <ConfigProvider {...antdConfig}>{children}</ConfigProvider>;
}
