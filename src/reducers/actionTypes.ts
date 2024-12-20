import {
    CurrencyType,
    InventoryState,
    InventoryData,
    CharacterStats,
    LocationData,
    MapSaveData,
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

// 背包相關
export type InventoryAction = {
    type: "UPDATE_INVENTORY";
    payload: InventoryData;
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
export type MapAction = {
    type: "UPDATE_MAP";
    payload: Partial<MapSaveData>;
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
