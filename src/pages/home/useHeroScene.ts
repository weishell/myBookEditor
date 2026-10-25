// 首页氛围背景的读写：localStorage 持久化
//
// 为什么独立成 hook 而不是塞在 Home 里：
// - Home 里已经有一堆数据拉取，偏好逻辑单独放一层，读起来清楚
// - 其它页面（比如设置页）以后要复用同一个 key 时，直接引这个 hook 就行
import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_HERO_SCENE_ID,
  HERO_SCENE_STORAGE_KEY,
  HERO_SCENES,
  getHeroScene,
  type HeroScene,
} from './scenes';

function isKnownSceneId(value: unknown): value is string {
  return typeof value === 'string' && HERO_SCENES.some((scene) => scene.id === value);
}

/** 读本地偏好；脏数据（旧 id / 非 JSON / 隐私模式）一律退回默认场景 */
function readSceneId(): string {
  try {
    const raw = window.localStorage.getItem(HERO_SCENE_STORAGE_KEY);
    return isKnownSceneId(raw) ? raw : DEFAULT_HERO_SCENE_ID;
  } catch {
    return DEFAULT_HERO_SCENE_ID;
  }
}

export function useHeroScene(): {
  scene: HeroScene;
  sceneId: string;
  setSceneId: (id: string) => void;
} {
  const [sceneId, setSceneIdState] = useState<string>(readSceneId);

  // 每次切换立刻落盘：首页背景属于"看一眼就定了"的偏好，不需要确认动作
  useEffect(() => {
    try {
      window.localStorage.setItem(HERO_SCENE_STORAGE_KEY, sceneId);
    } catch {
      /* 存不进去就算了，不能因此打断渲染 */
    }
  }, [sceneId]);

  const setSceneId = useCallback((id: string) => {
    if (isKnownSceneId(id)) setSceneIdState(id);
  }, []);

  return { scene: getHeroScene(sceneId), sceneId, setSceneId };
}
