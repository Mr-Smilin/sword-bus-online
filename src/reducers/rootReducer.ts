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
    let newPlayerData: PlayerData = state.player;

    switch (action.type) {
        case "UPDATE_CURRENCY":
            newPlayerData = {
                ...state.player,
                currency: currencyReducer(state.player.currency, action),
            };
            break;

        case "UPDATE_INVENTORY":
            newPlayerData = {
                ...state.player,
                inventory: inventoryReducer(state.player.inventory, action),
            };
            break;

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

        case "UPDATE_MAP":
            newPlayerData = {
                ...state.player,
                mapSaveData: mapReducer(state.player.mapSaveData, action),
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
