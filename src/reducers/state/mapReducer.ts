import { MapSaveData } from "../../data/type";
import { MapAction } from "../actionTypes";

export const mapReducer = (
    state: MapSaveData,
    action: MapAction,
): MapSaveData => {
    switch (action.type) {
        case "UPDATE_MAP":
            // 更新地圖進度時需要考慮：
            // 1. 探索度不能超過上限
            // 2. 已解鎖區域不能重複
            // 3. BOSS擊殺記錄不能重複
            if (action.payload.areaProgress) {
                return {
                    ...state,
                    areaProgress: {
                        ...state.areaProgress,
                        ...action.payload.areaProgress,
                    },
                };
            }
            if (action.payload.unlockedAreas) {
                return {
                    ...state,
                    unlockedAreas: Array.from(
                        new Set([
                            ...state.unlockedAreas,
                            ...action.payload.unlockedAreas,
                        ]),
                    ),
                };
            }
            if (action.payload.defeatedBosses) {
                return {
                    ...state,
                    defeatedBosses: Array.from(
                        new Set([
                            ...state.defeatedBosses,
                            ...action.payload.defeatedBosses,
                        ]),
                    ),
                };
            }
            if (action.payload.maxDungeonProgress) {
                return {
                    ...state,
                    maxDungeonProgress: {
                        ...state.maxDungeonProgress,
                        ...action.payload.maxDungeonProgress,
                    },
                };
            }
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};
