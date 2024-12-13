import { useCallback } from "react";
import {
	PlayerData,
	BaseCharacterStats,
	CharacterStats,
	Class,
} from "../../data/type";
import { classes } from "../../data/classes";

/**
 * 計算下一等級所需經驗值
 * @param level 當前等級
 * @returns 升級所需經驗值
 */
const calculateExpToNextLevel = (level: number): number => {
	return Math.floor(100 * Math.pow(1.5, level - 1));
};

/**
 * 計算角色成長屬性
 * @param baseStats 基礎屬性
 * @param growthStats 成長係數
 * @param level 當前等級
 * @returns 計算後的屬性值
 */
const calculateStatGrowth = (
	baseStats: BaseCharacterStats,
	growthStats: Class["growthStats"],
	level: number
): CharacterStats => ({
	...baseStats,
	level,
	experience: 0,
	nextLevelExp: calculateExpToNextLevel(level),
	health: Math.floor(baseStats.health + growthStats.health * (level - 1)),
	currentHealth: Math.floor(
		baseStats.health + growthStats.health * (level - 1)
	),
	mana: Math.floor(baseStats.mana + growthStats.mana * (level - 1)),
	currentMana: Math.floor(baseStats.mana + growthStats.mana * (level - 1)),
	strength: Math.floor(baseStats.strength + growthStats.strength * (level - 1)),
	dexterity: Math.floor(
		baseStats.dexterity + growthStats.dexterity * (level - 1)
	),
	intelligence: Math.floor(
		baseStats.intelligence + growthStats.intelligence * (level - 1)
	),
});

/**
 * 角色狀態管理 Hook
 * @param playerData 玩家資料
 * @param onPlayerChange 更新玩家資料的callback
 */
export const useGameCharacter = (
	playerData: PlayerData | undefined,
	onPlayerChange?: (newPlayer: PlayerData) => void
) => {
	/**
	 * 更新當前生命值
	 */
	const updateCurrentHealth = useCallback(
		(amount: number) => {
			if (!playerData?.characterStats) return;

			const maxHealth = playerData.characterStats.health;
			const newStats = {
				...playerData,
				characterStats: {
					...playerData.characterStats,
					currentHealth: Math.min(
						Math.max(0, playerData.characterStats.currentHealth + amount),
						maxHealth
					),
				},
			};
			onPlayerChange?.(newStats);
		},
		[playerData, onPlayerChange]
	);

	/**
	 * 更新當前魔力值
	 */
	const updateCurrentMana = useCallback(
		(amount: number) => {
			if (!playerData?.characterStats) return;

			const maxMana = playerData.characterStats.mana;
			const newStats = {
				...playerData,
				characterStats: {
					...playerData.characterStats,
					currentMana: Math.min(
						Math.max(0, playerData.characterStats.currentMana + amount),
						maxMana
					),
				},
			};
			onPlayerChange?.(newStats);
		},
		[playerData, onPlayerChange]
	);

	/**
	 * 根據等級更新角色屬性
	 */
	const updatePlayerByLevel = useCallback(
		(level: number, doUpdate: boolean = true) => {
			if (!level || level <= 0 || !playerData?.characterStats) return;

			const currentClass = classes[playerData.currentClassId];
			if (!currentClass) return;

			// 計算基礎成長
			const baseStats = calculateStatGrowth(
				currentClass.baseStats,
				currentClass.growthStats,
				level
			);

			// 檢查職業進階獎勵
			const levelBonuses = currentClass.progression
				.filter((prog) => prog.level <= level)
				.reduce(
					(acc, prog) => ({
						strength: (acc.strength || 0) + (prog.attributeBonus.strength || 0),
						dexterity:
							(acc.dexterity || 0) + (prog.attributeBonus.dexterity || 0),
						intelligence:
							(acc.intelligence || 0) + (prog.attributeBonus.intelligence || 0),
						health: (acc.health || 0) + (prog.attributeBonus.health || 0),
						mana: (acc.mana || 0) + (prog.attributeBonus.mana || 0),
					}),
					{
						strength: 0,
						dexterity: 0,
						intelligence: 0,
						health: 0,
						mana: 0,
					}
				);

			// 合併基礎屬性和獎勵
			const finalStats = {
				...baseStats,
				level,
				nextLevelExp: calculateExpToNextLevel(level),
				health: baseStats.health + (levelBonuses.health || 0),
				currentHealth: baseStats.health + (levelBonuses.health || 0), // 升級時回滿血量
				mana: baseStats.mana + (levelBonuses.mana || 0),
				currentMana: baseStats.mana + (levelBonuses.mana || 0), // 升級時回滿魔力
				strength: baseStats.strength + (levelBonuses.strength || 0),
				dexterity: baseStats.dexterity + (levelBonuses.dexterity || 0),
				intelligence: baseStats.intelligence + (levelBonuses.intelligence || 0),
				experience: 0, // 升級後經驗歸零
			};

			// 檢查當前等級可以解鎖的技能
			const classProgression = currentClass.progression.find(
				(prog) => prog.level === level
			);

			const currentUnlockedSkills = new Set(
				playerData.classProgress?.[currentClass.id]?.unlockedSkills || []
			);

			// 將新技能加入集合中
			classProgression?.unlockedSkills.forEach((skillId) => {
				currentUnlockedSkills.add(skillId);
			});

			const newPlayer = {
				...playerData,
				characterStats: finalStats,
				classProgress: {
					...playerData.classProgress,
					[currentClass.id]: {
						...playerData.classProgress?.[currentClass.id],
						unlockedSkills: Array.from(currentUnlockedSkills),
					},
				},
			};

			if (doUpdate) {
				onPlayerChange?.(newPlayer);
			} else {
				return newPlayer;
			}
		},
		[playerData, onPlayerChange]
	);

	/**
	 * 增加經驗值並處理升級
	 */
	const gainExperience = useCallback(
		(amount: number): void => {
			if (!playerData?.characterStats) return;

			const characterStats = playerData.characterStats;
			let newExp = characterStats.experience + amount;
			let newLevel = characterStats.level;
			let newNextLevelExp = characterStats.nextLevelExp;

			// 檢查是否升級
			while (newExp >= newNextLevelExp) {
				newExp -= newNextLevelExp;
				newLevel++;
				newNextLevelExp = calculateExpToNextLevel(newLevel);
			}

			// 如果升級了則更新屬性
			if (newLevel > characterStats.level) {
				const newPlayer = updatePlayerByLevel(newLevel, false);
				if (newPlayer) {
					onPlayerChange?.({
						...newPlayer,
						characterStats: {
							...newPlayer.characterStats,
							experience: newExp,
						},
					});
				}
			} else {
				// 只更新經驗值
				onPlayerChange?.({
					...playerData,
					characterStats: {
						...characterStats,
						experience: newExp,
						nextLevelExp: newNextLevelExp,
					},
				});
			}
		},
		[playerData, updatePlayerByLevel, onPlayerChange]
	);

	/**
	 * 獲取當前經驗值百分比
	 */
	const getExpPercentage = useCallback((): number => {
		if (!playerData?.characterStats) return 0;
		const { experience, nextLevelExp } = playerData.characterStats;
		return (experience / nextLevelExp) * 100;
	}, [playerData?.characterStats]);

	return {
		updateCurrentHealth,
		updateCurrentMana,
		updatePlayerByLevel,
		gainExperience,
		getExpPercentage,
	};
};
