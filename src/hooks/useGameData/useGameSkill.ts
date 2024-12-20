import { useCallback, useState, useEffect } from "react";
import {
	PlayerData,
	Skill,
	EffectType,
	Class,
	WeaponType,
} from "../../data/type";
import { skills, skillsByClass, skillMap } from "../../data/skills";
import { classes } from "../../data/classes";

/**
 * 技能系統 Hook
 * @param playerData 玩家資料
 * @param equippedWeaponType 已裝備的武器類型
 * @param onPlayerChange 更新玩家資料的callback
 */
export const useGameSkill = (
	playerData: PlayerData | undefined,
	equippedWeaponType: WeaponType | undefined,
	onPlayerChange?: (newPlayer: PlayerData) => Promise<void>
) => {
	// 技能冷卻狀態
	const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>(
		{}
	);
	// 當前職業資料
	const [currentClass, setCurrentClass] = useState<Class | null>(null);
	// 使用中的效果
	const [activeEffects, setActiveEffects] = useState<
		Record<EffectType, number>
	>({} as Record<EffectType, number>);

	// 初始化職業資料
	useEffect(() => {
		if (!!playerData?.currentClassId) {
			setCurrentClass(classes[playerData.currentClassId]);
		}
	}, [playerData?.currentClassId]);

	/**
	 * 檢查技能是否可用
	 * @param skillId 技能ID
	 */
	const canUseSkill = useCallback(
		(skillId: string): boolean => {
			if (!playerData?.characterStats || !currentClass) return false;

			const skill = skillMap.get(skillId);
			if (!skill) return false;

			// 檢查技能冷卻
			const cooldownEndTime = skillCooldowns[skillId];
			if (cooldownEndTime && Date.now() < cooldownEndTime) {
				return false;
			}

			// 檢查魔力值是否足夠
			if (playerData.characterStats.currentMana < skill.manaCost) {
				return false;
			}

			// 檢查武器需求
			if (
				skill.requirements?.weapon &&
				(!equippedWeaponType ||
					!skill.requirements.weapon.includes(equippedWeaponType))
			) {
				return false;
			}

			// 檢查等級需求
			if (
				skill.requirements?.level &&
				playerData.characterStats.level < skill.requirements.level
			) {
				return false;
			}

			return true;
		},
		[playerData, currentClass, skillCooldowns, equippedWeaponType]
	);

	/**
	 * 使用技能
	 * @param skillId 技能ID
	 */
	const useSkill = useCallback(
		async (skillId: string): Promise<boolean> => {
			if (!canUseSkill(skillId) || !playerData) return false;

			const skill = skillMap.get(skillId);
			if (!skill) return false;

			// 扣除魔力值
			const newMana = playerData.characterStats.currentMana - skill.manaCost;

			// 設置技能冷卻
			const now = Date.now();
			setSkillCooldowns((prev) => ({
				...prev,
				[skillId]: now + skill.cooldown * 1000,
			}));

			// 處理技能效果
			if (skill.effects) {
				setActiveEffects((prev) => {
					const newEffects = { ...prev };
					skill.effects?.forEach((effect) => {
						if (Math.random() * 100 <= (effect.chance || 100)) {
							newEffects[effect.type] = now + effect.duration * 1000;
						}
					});
					return newEffects;
				});
			}

			// 更新玩家狀態
			await onPlayerChange?.({
				...playerData,
				characterStats: {
					...playerData.characterStats,
					currentMana: newMana,
				},
			});

			return true;
		},
		[canUseSkill, playerData, onPlayerChange]
	);

	/**
	 * 獲取技能冷卻時間
	 * @param skillId 技能ID
	 * @returns 剩餘冷卻時間(秒)
	 */
	const getSkillCooldown = useCallback(
		(skillId: string): number => {
			const endTime = skillCooldowns[skillId];
			if (!endTime) return 0;

			const remainingTime = Math.max(0, endTime - Date.now()) / 1000;
			return Math.round(remainingTime * 10) / 10;
		},
		[skillCooldowns]
	);

	/**
	 * 檢查效果是否活動中
	 * @param effectType 效果類型
	 */
	const isEffectActive = useCallback(
		(effectType: EffectType): boolean => {
			const endTime = activeEffects[effectType];
			return endTime ? Date.now() < endTime : false;
		},
		[activeEffects]
	);

	/**
	 * 獲取當前職業的所有可用/未可用技能
	 */
	const getAvailableSkills = useCallback(() => {
		if (!playerData?.currentClassId || !currentClass) {
			return {
				active: [],
				locked: [],
			};
		}

		const checkRequirements = (skill: Skill): boolean => {
			if (!skill.requirements) return true;

			const { level, weapon } = skill.requirements;
			if (level && playerData.characterStats.level < level) return false;

			if (weapon) {
				return !!equippedWeaponType && weapon.includes(equippedWeaponType);
			}

			return true;
		};

		// 所有基礎/進階/終極技能ID
		const classSkillIds = [
			...currentClass.skills.basic,
			...currentClass.skills.advanced,
			...currentClass.skills.ultimate,
		];

		// 當前職業可學技能列表
		const classSkillList = skillsByClass[playerData.currentClassId] || [];

		// 已學習技能列表
		const unlockedSkills =
			playerData.classProgress?.[playerData.currentClassId]?.unlockedSkills ||
			[];

		const skillsMap = {
			active: [] as Skill[],
			locked: [] as Skill[],
		};

		const usedSkillIds = new Set<string>();

		// 處理職業技能
		classSkillList.forEach((skill) => {
			if (classSkillIds.includes(skill.id)) {
				if (!usedSkillIds.has(skill.id)) {
					if (checkRequirements(skill)) {
						skillsMap.active.push(skill);
					} else {
						skillsMap.locked.push(skill);
					}
					usedSkillIds.add(skill.id);
				}
			}
		});

		// 處理額外技能
		unlockedSkills.forEach((skillId) => {
			const skill = skillMap.get(skillId);
			if (skill && checkRequirements(skill) && !usedSkillIds.has(skill.id)) {
				skillsMap.active.push(skill);
				usedSkillIds.add(skill.id);
			}
		});

		return skillsMap;
	}, [playerData, currentClass, equippedWeaponType]);

	/**
	 * 檢查職業是否擁有該技能
	 * @param classId 職業ID
	 * @param skillId 技能ID
	 */
	const isClassSkillAvailable = useCallback(
		(classId: string, skillId: string): boolean =>
			skillsByClass[classId]?.some((skill) => skill.id === skillId) ?? false,
		[]
	);

	/**
	 * 解鎖技能
	 * @param skillId 技能ID
	 */
	const unlockSkill = useCallback(
		async (skillId: string): Promise<boolean> => {
			if (!playerData?.currentClassId || !currentClass) return false;

			// 檢查技能是否存在
			if (!skillMap.has(skillId)) return false;

			// 檢查是否已經解鎖
			const unlockedSkills =
				playerData.classProgress?.[currentClass.id]?.unlockedSkills || [];
			if (unlockedSkills.includes(skillId)) return false;

			// 更新玩家資料
			await onPlayerChange?.({
				...playerData,
				classProgress: {
					...playerData.classProgress,
					[currentClass.id]: {
						...playerData.classProgress?.[currentClass.id],
						unlockedSkills: [...unlockedSkills, skillId],
					},
				},
			});

			return true;
		},
		[playerData, currentClass, onPlayerChange]
	);

	return {
		canUseSkill,
		useSkill,
		getSkillCooldown,
		isEffectActive,
		getAvailableSkills,
		isClassSkillAvailable,
		unlockSkill,
		activeEffects,
	};
};
