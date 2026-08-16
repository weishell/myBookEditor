// lilist 列表图标（飞书风格）
// 有序：三个列表项 1/2/3；无序：三个圆点
// color 默认 currentColor，跟随所在容器的文字颜色（主题色切换无需额外处理）

export interface LilistIconProps {
  color?: string;
  size?: number;
}

/** 有序列表图标：左侧 1/2/3 数字 + 右侧三条横线 */
export const OlListIcon = ({ color = 'currentColor', size = 16 }: LilistIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <text x="1.5" y="8.5" fontSize="7" fontWeight="bold" fill={color}>
      1
    </text>
    <line x1="9" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <text x="1.5" y="15" fontSize="7" fontWeight="bold" fill={color}>
      2
    </text>
    <line x1="9" y1="12.5" x2="21" y2="12.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <text x="1.5" y="21.5" fontSize="7" fontWeight="bold" fill={color}>
      3
    </text>
    <line x1="9" y1="19" x2="21" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** 无序列表图标：左侧实心圆点 + 右侧三条横线 */
export const UlListIcon = ({ color = 'currentColor', size = 16 }: LilistIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="3.5" cy="6" r="1.7" fill={color} />
    <line x1="9" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="3.5" cy="12.5" r="1.7" fill={color} />
    <line x1="9" y1="12.5" x2="21" y2="12.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="3.5" cy="19" r="1.7" fill={color} />
    <line x1="9" y1="19" x2="21" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
