import { MapSaveData } from "../../data/type";
import { MapAction } from "../actionTypes";

export const mapReducer = (
    state: MapSaveData,
    action: MapAction,
): MapSaveData => {
    if (action.type !== "UPDATE_MAP") return state;

    const { type, payload } = action.payload;

    switch (type) {
        case "UPDATE_AREA_PROGRESS":
            return {
                ...state,
                areaProgress: {
                    ...state.areaProgress,
                    [payload.areaId]: {
                        ...state.areaProgress[payload.areaId],
                        ...payload.progress,
                    },
                },
            };

        case "UNLOCK_AREAS":
            return {
                ...state,
                unlockedAreas: Array.from(
                    new Set([...state.unlockedAreas, ...payload.areaIds]),
                ),
            };

        case "RECORD_BOSS_DEFEAT":
            return {
                ...state,
                defeatedBosses: Array.from(
                    new Set([...state.defeatedBosses, ...payload.bossIds]),
                ),
            };

        case "UPDATE_DUNGEON_PROGRESS":
            return {
                ...state,
                maxDungeonProgress: {
                    ...state.maxDungeonProgress,
                    [payload.dungeonId]: payload.maxProgress,
                },
            };

        case "UPDATE_MAP_DATA":
            return {
                ...state,
                ...payload,
            };

        default:
            return state;
    }
};
