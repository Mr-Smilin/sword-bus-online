import { CurrencyData } from "../../data/type";
import { CurrencyAction } from "../actionTypes";

export const currencyReducer = (
    state: CurrencyData,
    action: CurrencyAction,
): CurrencyData => {
    switch (action.type) {
        case "UPDATE_CURRENCY":
            return {
                ...state,
                [action.payload.type]: action.payload.amount,
            };
        default:
            return state;
    }
};
