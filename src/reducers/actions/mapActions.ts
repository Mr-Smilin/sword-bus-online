import { MapSaveData, AreaProgress } from "../../data/type";
import { MapAction } from "../actionTypes";

/**
 * 更新區域探索進度
 */
export const updateAreaProgress = (
    areaId: string,
    progress: AreaProgress,
): MapAction => ({
    type: "UPDATE_MAP",
    payload: {
        type: "UPDATE_AREA_PROGRESS",
        payload: { areaId, progress },
    },
});

/**
 * 解鎖新區域
 */
export const unlockAreas = (areaIds: string[]): MapAction => ({
    type: "UPDATE_MAP",
    payload: {
        type: "UNLOCK_AREAS",
        payload: { areaIds },
    },
});

/**
 * 記錄BOSS擊殺
 */
export const recordBossDefeated = (bossIds: string[]): MapAction => ({
    type: "UPDATE_MAP",
    payload: {
        type: "RECORD_BOSS_DEFEAT",
        payload: { bossIds },
    },
});

/**
 * 更新迷宮探索上限
 */
export const updateDungeonProgress = (
    dungeonId: string,
    maxProgress: number,
): MapAction => ({
    type: "UPDATE_MAP",
    payload: {
        type: "UPDATE_DUNGEON_PROGRESS",
        payload: { dungeonId, maxProgress },
    },
});

/**
 * 更新整體地圖資料
 */
export const updateMapData = (data: Partial<MapSaveData>): MapAction => ({
    type: "UPDATE_MAP",
    payload: {
        type: "UPDATE_MAP_DATA",
        payload: data,
    },
});
