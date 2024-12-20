import {
    InventoryData,
    InventoryState,
    InventoryAction as InvAction,
} from "../../data/type";
import { InventoryAction } from "../actionTypes";

/**
 * 更新背包狀態
 * @param state 新的背包狀態
 * @param action 背包操作記錄
 */
export const updateInventory = (
    state: InventoryData,
    action: InventoryAction,
): InventoryAction => ({
    type: "UPDATE_INVENTORY",
    payload: state,
});
