import { MapSaveData, Area } from "../../data/type";
import { MapAction } from "../actionTypes";

/**
 * 更新區域探索進度
 * @param areaId 區域ID
 * @param progress 探索進度
 */
export const updateAreaProgress = (
    areaId: string,
    progress: {
        currentExploration?: number;
        maxExploration?: number;
        dungeonExploration?: number;
    },
): MapAction => ({
    type: "UPDATE_MAP",
    payload: {
        areaProgress: {
            [areaId]: {
                ...progress,
            },
        },
    },
});

/**
 * 解鎖新區域
 * @param areaIds 要解鎖的區域ID列表
 */
export const unlockAreas = (areaIds: string[]): MapAction => ({
    type: "UPDATE_MAP",
    payload: {
        unlockedAreas: areaIds,
    },
});

/**
 * 記錄BOSS擊殺
 * @param bossIds BOSS ID列表
 */
export const recordBossDefeated = (bossIds: string[]): MapAction => ({
    type: "UPDATE_MAP",
    payload: {
        defeatedBosses: bossIds,
    },
});

/**
 * 更新迷宮探索上限
 * @param dungeonId 迷宮ID
 * @param maxProgress 最大探索度
 */
export const updateDungeonProgress = (
    dungeonId: string,
    maxProgress: number,
): MapAction => ({
    type: "UPDATE_MAP",
    payload: {
        maxDungeonProgress: {
            [dungeonId]: maxProgress,
        },
    },
});

/**
 * 更新整體地圖資料
 * 用於需要一次更新多個地圖相關資料的情況
 * @param data 要更新的地圖資料
 */
export const updateMapData = (data: Partial<MapSaveData>): MapAction => ({
    type: "UPDATE_MAP",
    payload: data,
});
