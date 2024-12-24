import {
    InventoryItem,
    InventoryState,
    InventoryAction as InvAction,
} from "../../data/type";
import { InventoryAction } from "../actionTypes";

/**
 * 建立背包操作歷史
 */
const createHistoryAction = (
    type: InvAction["type"],
    itemId: string,
    quantity: number,
    fromSlot?: number,
    toSlot?: number,
) => ({
    type,
    itemId,
    quantity,
    fromSlot,
    toSlot,
    timestamp: Date.now(),
});

/**
 * 添加物品到背包
 */
export const addItem = (
    items: InventoryItem[],
    itemId: string,
    quantity: number,
): InventoryAction => ({
    type: "UPDATE_INVENTORY",
    payload: {
        items,
        historyAction: createHistoryAction("add", itemId, quantity),
    },
});

/**
 * 從背包移除物品
 */
export const removeItem = (
    items: InventoryItem[],
    itemId: string,
    quantity: number,
    fromSlot: number,
): InventoryAction => ({
    type: "UPDATE_INVENTORY",
    payload: {
        items,
        historyAction: createHistoryAction(
            "remove",
            itemId,
            quantity,
            fromSlot,
        ),
    },
});

/**
 * 移動背包物品
 */
export const moveItem = (
    items: InventoryItem[],
    itemId: string,
    quantity: number,
    fromSlot: number,
    toSlot: number,
): InventoryAction => ({
    type: "UPDATE_INVENTORY",
    payload: {
        items,
        historyAction: createHistoryAction(
            "move",
            itemId,
            quantity,
            fromSlot,
            toSlot,
        ),
    },
});

/**
 * 拆分堆疊
 */
export const splitStack = (
    items: InventoryItem[],
    itemId: string,
    quantity: number,
    fromSlot: number,
    toSlot: number,
): InventoryAction => ({
    type: "UPDATE_INVENTORY",
    payload: {
        items,
        historyAction: createHistoryAction(
            "split",
            itemId,
            quantity,
            fromSlot,
            toSlot,
        ),
    },
});

/**
 * 整理背包
 */
export const sortInventory = (items: InventoryItem[]): InventoryAction => ({
    type: "UPDATE_INVENTORY",
    payload: {
        items,
        historyAction: createHistoryAction("sort", "", 0),
    },
});
