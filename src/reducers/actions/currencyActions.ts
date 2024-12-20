import { CurrencyType } from "../../data/type";
import { CurrencyAction } from "../actionTypes";

/**
 * 更新貨幣數量
 * @param type 貨幣類型
 * @param amount 新的數量
 */
export const updateCurrency = (
    type: CurrencyType,
    amount: number,
): CurrencyAction => ({
    type: "UPDATE_CURRENCY",
    payload: { type, amount },
});
