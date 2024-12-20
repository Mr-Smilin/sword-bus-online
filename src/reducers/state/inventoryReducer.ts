import { InventoryAction as InvAction, InventoryData } from "../../data/type";
import { InventoryAction } from "../actionTypes";

export const inventoryReducer = (
    state: InventoryData,
    action: InventoryAction,
) => {
    switch (action.type) {
        case "UPDATE_INVENTORY":
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};
