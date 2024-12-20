// reducers/rootReducer.ts

import { GameSaveData, PlayerData } from "../data/type";
import { GameAction } from "./actionTypes";
import { currencyReducer } from "./state/currencyReducer";
import { inventoryReducer } from "./state/inventoryReducer";
import {
    statsReducer,
    locationReducer,
    mapReducer,
    playerReducer,
} from "./state/playerReducer";

/**
 * 主要的 reducer，處理所有遊戲狀態更新
 */
export const rootReducer = (
    state: GameSaveData | null,
    action: GameAction,
): GameSaveData | null => {
    if (!state) return null;

    // 根據 action type 來更新對應的 state
    let newPlayerData: PlayerData;

    switch (action.type) {
        case "UPDATE_CURRENCY":
            newPlayerData = {
                ...state.player,
                currency: currencyReducer(state.player.currency, action),
            };
            break;

        case "UPDATE_INVENTORY": {
            newPlayerData = {
                ...state.player,
                inventory: inventoryReducer(state.player.inventory, action),
            };
            break;
        }

        case "UPDATE_MAP": {
            const mapAction = action.payload;
            let newMapData = state.player.mapSaveData;

            switch (mapAction.type) {
                case "UPDATE_AREA_PROGRESS":
                    newMapData = {
                        ...newMapData,
                        areaProgress: {
                            ...newMapData.areaProgress,
                            [mapAction.payload.areaId]: {
                                ...newMapData.areaProgress[
                                    mapAction.payload.areaId
                                ],
                                ...mapAction.payload.progress,
                            },
                        },
                    };
                    break;

                case "UNLOCK_AREAS":
                    newMapData = {
                        ...newMapData,
                        unlockedAreas: Array.from(
                            new Set([
                                ...newMapData.unlockedAreas,
                                ...mapAction.payload.areaIds,
                            ]),
                        ),
                    };
                    break;

                case "RECORD_BOSS_DEFEAT":
                    newMapData = {
                        ...newMapData,
                        defeatedBosses: Array.from(
                            new Set([
                                ...newMapData.defeatedBosses,
                                ...mapAction.payload.bossIds,
                            ]),
                        ),
                    };
                    break;

                case "UPDATE_DUNGEON_PROGRESS":
                    newMapData = {
                        ...newMapData,
                        maxDungeonProgress: {
                            ...newMapData.maxDungeonProgress,
                            [mapAction.payload.dungeonId]:
                                mapAction.payload.maxProgress,
                        },
                    };
                    break;

                case "UPDATE_MAP_DATA":
                    newMapData = {
                        ...newMapData,
                        ...mapAction.payload,
                    };
                    break;
            }

            newPlayerData = {
                ...state.player,
                mapSaveData: newMapData,
            };
            break;
        }

        case "UPDATE_STATS":
            newPlayerData = {
                ...state.player,
                characterStats: statsReducer(
                    state.player.characterStats,
                    action,
                ),
            };
            break;

        case "UPDATE_LOCATION":
            newPlayerData = {
                ...state.player,
                locationData: locationReducer(
                    state.player.locationData,
                    action,
                ),
            };
            break;

        case "UPDATE_PLAYER":
            newPlayerData = playerReducer(state.player, action);
            break;

        default:
            return state;
    }

    // 更新最後登入時間
    newPlayerData.lastLoginAt = Date.now();

    return {
        ...state,
        player: newPlayerData,
        version: state.version, // 保持版本資訊
    };
};
