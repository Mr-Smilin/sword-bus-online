import { useCallback, useState, useEffect } from "react";
import { PlayerData, EffectType } from "../../data/type";

/**
 * 效果資料介面
 */
interface EffectData {
	type: EffectType;
	value: number;
	endTime: number;
	source?: string; // 效果來源（技能ID或物品ID）
	stackId?: string; // 堆疊ID，相同ID的效果可以疊加
	priority?: number; // 優先級，決定同類效果的覆蓋規則
}

/**
 * 效果統計資料
 */
interface EffectStats {
	strength: number;
	dexterity: number;
	intelligence: number;
	health: number;
	mana: number;
	defense: number;
	attackSpeed: number;
	moveSpeed: number;
}

/**
 * 效果系統 Hook
 * @param playerData 玩家資料
 * @param onPlayerChange 更新玩家資料的callback
 */
export const useGameEffect = (
	playerData: PlayerData | undefined,
	onPlayerChange?: (newPlayer: PlayerData) => Promise<void>
) => {
	// 活動中的效果列表
	const [activeEffects, setActiveEffects] = useState<EffectData[]>([]);

	// 效果優先級配置
	const EFFECT_PRIORITIES = {
		// 增益效果
		attack_up: 1,
		defense_up: 1,
		speed_up: 1,
		regeneration: 1,
		shield: 2,
		stealth: 3,
		immune: 4,

		// 減益效果
		slow: 1,
		weakness: 1,
		defense_down: 1,
		silence: 2,
		stun: 3,
		freeze: 3,
	};

	/**
	 * 定期清理過期效果
	 */
	useEffect(() => {
		const timer = setInterval(() => {
			const now = Date.now();
			setActiveEffects((prev) => prev.filter((effect) => effect.endTime > now));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	/**
	 * 添加效果
	 * @param type 效果類型
	 * @param value 效果值
	 * @param duration 持續時間（秒）
	 * @param source 效果來源
	 * @param stackId 堆疊ID
	 */
	const addEffect = useCallback(
		(
			type: EffectType,
			value: number,
			duration: number,
			source?: string,
			stackId?: string
		): void => {
			const now = Date.now();
			const endTime = now + duration * 1000;
			const priority = EFFECT_PRIORITIES[type] || 0;

			setActiveEffects((prev) => {
				let newEffects = [...prev];

				// 檢查是否有相同類型的效果
				const existingEffect = newEffects.find((e) => e.type === type);
				if (existingEffect) {
					// 如果有堆疊ID且相同，進行堆疊
					if (stackId && existingEffect.stackId === stackId) {
						existingEffect.value += value;
						existingEffect.endTime = Math.max(existingEffect.endTime, endTime);
					}
					// 否則根據優先級決定是否覆蓋
					else if (priority >= (existingEffect.priority || 0)) {
						newEffects = newEffects.filter((e) => e.type !== type);
						newEffects.push({
							type,
							value,
							endTime,
							source,
							stackId,
							priority,
						});
					}
				} else {
					// 沒有相同類型的效果，直接添加
					newEffects.push({
						type,
						value,
						endTime,
						source,
						stackId,
						priority,
					});
				}

				return newEffects;
			});
		},
		[]
	);

	/**
	 * 移除效果
	 * @param type 效果類型
	 * @param source 效果來源（可選）
	 */
	const removeEffect = useCallback(
		(type: EffectType, source?: string): void => {
			setActiveEffects((prev) =>
				prev.filter(
					(effect) =>
						effect.type !== type || (source && effect.source !== source)
				)
			);
		},
		[]
	);

	/**
	 * 清除所有效果
	 * @param types 要清除的效果類型（可選，不指定則清除所有）
	 */
	const clearEffects = useCallback((types?: EffectType[]): void => {
		if (!types) {
			setActiveEffects([]);
		} else {
			setActiveEffects((prev) =>
				prev.filter((effect) => !types.includes(effect.type))
			);
		}
	}, []);

	/**
	 * 檢查效果是否活動中
	 * @param type 效果類型
	 * @param source 效果來源（可選）
	 */
	const hasEffect = useCallback(
		(type: EffectType, source?: string): boolean => {
			const now = Date.now();
			return activeEffects.some(
				(effect) =>
					effect.type === type &&
					effect.endTime > now &&
					(!source || effect.source === source)
			);
		},
		[activeEffects]
	);

	/**
	 * 獲取效果剩餘時間
	 * @param type 效果類型
	 * @param source 效果來源（可選）
	 */
	const getEffectDuration = useCallback(
		(type: EffectType, source?: string): number => {
			const now = Date.now();
			const effect = activeEffects.find(
				(e) =>
					e.type === type && e.endTime > now && (!source || e.source === source)
			);
			if (!effect) return 0;
			return Math.max(0, (effect.endTime - now) / 1000);
		},
		[activeEffects]
	);

	/**
	 * 計算所有活動效果的綜合影響
	 */
	const calculateEffectStats = useCallback((): EffectStats => {
		const now = Date.now();
		const stats: EffectStats = {
			strength: 0,
			dexterity: 0,
			intelligence: 0,
			health: 0,
			mana: 0,
			defense: 0,
			attackSpeed: 0,
			moveSpeed: 0,
		};

		activeEffects
			.filter((effect) => effect.endTime > now)
			.forEach((effect) => {
				switch (effect.type) {
					case "attack_up":
						stats.strength += effect.value;
						break;
					case "defense_up":
						stats.defense += effect.value;
						break;
					case "defense_down":
						stats.defense -= effect.value;
						break;
					case "speed_up":
						stats.moveSpeed += effect.value;
						stats.attackSpeed += effect.value;
						break;
					case "slow":
						stats.moveSpeed -= effect.value;
						break;
					case "weakness":
						stats.strength -= effect.value;
						break;
					// 其他效果類型的處理...
				}
			});

		return stats;
	}, [activeEffects]);

	/**
	 * 更新角色屬性
	 */
	const updatePlayerStats = useCallback(async () => {
		if (!playerData) return;

		const effectStats = calculateEffectStats();
		const characterStats = { ...playerData.characterStats };

		// 應用效果加成
		characterStats.strength += effectStats.strength;
		characterStats.dexterity += effectStats.dexterity;
		characterStats.intelligence += effectStats.intelligence;

		// 確保屬性不會低於0
		Object.keys(characterStats).forEach((key) => {
			if (typeof characterStats[key] === "number") {
				characterStats[key] = Math.max(0, characterStats[key]);
			}
		});

		await onPlayerChange?.({
			...playerData,
			characterStats,
		});
	}, [playerData, calculateEffectStats, onPlayerChange]);

	// 當效果變更時更新角色屬性
	useEffect(() => {
		updatePlayerStats();
	}, [activeEffects, updatePlayerStats]);

	return {
		addEffect,
		removeEffect,
		clearEffects,
		hasEffect,
		getEffectDuration,
		calculateEffectStats,
		activeEffects,
	};
};
