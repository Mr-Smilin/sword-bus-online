import {
    CharacterStats,
    LocationData,
    MapSaveData,
    PlayerData,
} from "../../data/type";
import {
    StatsAction,
    LocationAction,
    MapAction,
    PlayerAction,
} from "../actionTypes";

/**
 * 更新角色屬性
 * @param stats 要更新的屬性
 */
export const updateStats = (stats: Partial<CharacterStats>): StatsAction => ({
    type: "UPDATE_STATS",
    payload: stats,
});

/**
 * 更新位置資料
 * @param location 新的位置資料
 */
export const updateLocation = (location: LocationData): LocationAction => ({
    type: "UPDATE_LOCATION",
    payload: location,
});

/**
 * 更新地圖資料
 * @param mapData 要更新的地圖資料
 */
export const updateMap = (mapData: Partial<MapSaveData>): MapAction => ({
    type: "UPDATE_MAP",
    payload: mapData,
});

/**
 * 更新玩家資料
 * @param data 要更新的玩家資料
 */
export const updatePlayer = (data: Partial<PlayerData>): PlayerAction => ({
    type: "UPDATE_PLAYER",
    payload: data,
});
