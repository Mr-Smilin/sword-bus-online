import { useCallback } from "react";
import { PlayerData, CurrencyType } from "../../data/type";

/**
 * 貨幣系統 Hook
 * @param playerData 玩家資料
 * @param onPlayerChange 更新玩家資料的callback
 */
export const useGameCurrency = (
	playerData: PlayerData | undefined,
	onPlayerChange?: (newPlayer: PlayerData) => Promise<void>
) => {
	/**
	 * 增加指定類型的貨幣
	 * @param type 貨幣類型
	 * @param amount 金額(需為正數)
	 */
	const addCurrency = useCallback(
		async (type: CurrencyType, amount: number): Promise<boolean> => {
			if (!playerData || amount <= 0) return false;

			const newPlayer = {
				...playerData,
				currency: {
					...playerData.currency,
					[type]: (playerData.currency[type] || 0) + amount,
				},
			};

			await onPlayerChange?.(newPlayer);
			return true;
		},
		[playerData, onPlayerChange]
	);

	/**
	 * 扣除指定類型的貨幣
	 * @param type 貨幣類型
	 * @param amount 金額(需為正數)
	 * @returns 是否扣除成功
	 */
	const deductCurrency = useCallback(
		async (type: CurrencyType, amount: number): Promise<boolean> => {
			if (!playerData || amount <= 0) return false;

			// 檢查餘額是否足夠
			if ((playerData.currency[type] || 0) < amount) return false;

			const newPlayer = {
				...playerData,
				currency: {
					...playerData.currency,
					[type]: (playerData.currency[type] || 0) - amount,
				},
			};

			await onPlayerChange?.(newPlayer);
			return true;
		},
		[playerData, onPlayerChange]
	);

	/**
	 * 檢查指定類型的貨幣是否足夠
	 * @param type 貨幣類型
	 * @param amount 要檢查的金額
	 */
	const hasSufficientCurrency = useCallback(
		(type: CurrencyType, amount: number): boolean => {
			if (!playerData || amount <= 0) return false;
			return (playerData.currency[type] || 0) >= amount;
		},
		[playerData]
	);

	/**
	 * 獲取指定類型的貨幣餘額
	 * @param type 貨幣類型
	 */
	const getCurrencyBalance = useCallback(
		(type: CurrencyType): number => {
			if (!playerData) return 0;
			return playerData.currency[type] || 0;
		},
		[playerData]
	);

	/**
	 * 轉換貨幣(例如用金幣換取活動代幣)
	 * @param fromType 支付的貨幣類型
	 * @param fromAmount 支付金額
	 * @param toType 獲得的貨幣類型
	 * @param toAmount 獲得金額
	 */
	const exchangeCurrency = useCallback(
		async (
			fromType: CurrencyType,
			fromAmount: number,
			toType: CurrencyType,
			toAmount: number
		): Promise<boolean> => {
			if (!playerData || fromAmount <= 0 || toAmount <= 0) return false;
			if (fromType === toType) return false;

			// 檢查餘額是否足夠
			if (!hasSufficientCurrency(fromType, fromAmount)) return false;

			const newPlayer = {
				...playerData,
				currency: {
					...playerData.currency,
					[fromType]: (playerData.currency[fromType] || 0) - fromAmount,
					[toType]: (playerData.currency[toType] || 0) + toAmount,
				},
			};

			await onPlayerChange?.(newPlayer);
			return true;
		},
		[playerData, hasSufficientCurrency, onPlayerChange]
	);

	/**
	 * 獲取所有貨幣餘額
	 * @returns 所有貨幣類型的餘額
	 */
	const getAllCurrencyBalances = useCallback((): Record<
		CurrencyType,
		number
	> => {
		if (!playerData) return {} as Record<CurrencyType, number>;
		return playerData.currency;
	}, [playerData]);

	return {
		addCurrency,
		deductCurrency,
		hasSufficientCurrency,
		getCurrencyBalance,
		exchangeCurrency,
		getAllCurrencyBalances,
	};
};
