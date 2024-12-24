import {
    CurrencyType,
    InventoryState,
    InventoryData,
    InventoryItem,
    InventoryAction as InvAction,
    CharacterStats,
    LocationData,
    MapSaveData,
    AreaProgress,
    PlayerData,
} from "../data/type";

// 貨幣相關
export type CurrencyAction = {
    type: "UPDATE_CURRENCY";
    payload: {
        type: CurrencyType;
        amount: number;
    };
};

// 背包相關的 action
export type InventoryAction = {
    type: "UPDATE_INVENTORY";
    payload: {
        // 背包狀態
        items: InventoryItem[];
        // 操作紀錄
        historyAction: InvAction;
    };
};

// 角色狀態相關
export type StatsAction = {
    type: "UPDATE_STATS";
    payload: Partial<CharacterStats>;
};

// 位置相關
export type LocationAction = {
    type: "UPDATE_LOCATION";
    payload: LocationData;
};

// 地圖相關
type MapActionType =
    | {
          type: "UPDATE_AREA_PROGRESS";
          payload: { areaId: string; progress: AreaProgress };
      }
    | { type: "UNLOCK_AREAS"; payload: { areaIds: string[] } }
    | { type: "RECORD_BOSS_DEFEAT"; payload: { bossIds: string[] } }
    | {
          type: "UPDATE_DUNGEON_PROGRESS";
          payload: { dungeonId: string; maxProgress: number };
      }
    | { type: "UPDATE_MAP_DATA"; payload: Partial<MapSaveData> };

export type MapAction = {
    type: "UPDATE_MAP";
    payload: MapActionType;
};

// 玩家資料相關
export type PlayerAction = {
    type: "UPDATE_PLAYER";
    payload: Partial<PlayerData>;
};

// 統一所有 Action 類型
export type GameAction =
    | CurrencyAction
    | InventoryAction
    | StatsAction
    | LocationAction
    | MapAction
    | PlayerAction;
