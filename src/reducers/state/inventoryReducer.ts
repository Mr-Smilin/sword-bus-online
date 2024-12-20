import { InventoryData, InventoryState } from "../../data/type";
import { InventoryAction } from "../actionTypes";

export const inventoryReducer = (
    state: InventoryData,
    action: InventoryAction,
): InventoryData => {
    switch (action.type) {
        case "UPDATE_INVENTORY":
            return {
                ...state,
                state: {
                    ...state.state,
                    items: action.payload.items,
                },
                actionHistory: [
                    ...(state.actionHistory || []),
                    action.payload.historyAction,
                ],
            };
        default:
            return state;
    }
};
