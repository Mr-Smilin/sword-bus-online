import { useCallback, useState,useEffect } from 'react';
import { 
    CharacterStats, 
    PlayerData,
    Item, 
    Weapon, 
    Class, 
    Skill,
    WeaponType,
    EffectType
} from '../data/type';
import { items } from '../data/item';
import { weapons } from '../data/weapons';
import { classes, classMap } from '../data/classes/';
import { skills, skillsByClass, skillMap } from '../data/skills/';

/**
 * 角色裝備欄位類型定義
 */
interface EquipmentSlots {
  weapon: Weapon | null;
}

/**
 * 背包物品類型定義，繼承自 Item 並添加額外屬性
 */
interface InventoryItem extends Item {
  quantity: number;
  slot: number;
}

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
  baseStats: CharacterStats,
  growthStats: Class['growthStats'],
  level: number
): CharacterStats => {
  return {
    ...baseStats,
    level,
    experience: baseStats.experience,
    nextLevelExp: calculateExpToNextLevel(level),
    health: Math.floor(baseStats.health + growthStats.health * (level - 1)),
    mana: Math.floor(baseStats.mana + growthStats.mana * (level - 1)),
    strength: Math.floor(baseStats.strength + growthStats.strength * (level - 1)),
    dexterity: Math.floor(baseStats.dexterity + growthStats.dexterity * (level - 1)),
    intelligence: Math.floor(baseStats.intelligence + growthStats.intelligence * (level - 1))
  };
};

/**
 * 遊戲數據管理 Hook
 * @param playerData 玩家資料
 * @param onStatsChange 角色屬性更新回調
 * @returns 遊戲數據和操作方法
 */
export const useGameData = (
  playerData?: PlayerData,
  onStatsChange?: (newStats: CharacterStats) => void
) => {
  // 當前職業資訊
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  
  // 背包系統
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  
  // 裝備系統
  const [equipment, setEquipment] = useState<EquipmentSlots>({
    weapon: null
  });

  // 技能冷卻系統
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({});

  // 角色效果系統
  const [activeEffects, setActiveEffects] = useState<Record<EffectType, number>>({} as Record<EffectType, number>);

  /**
   * 初始化
   */
  useEffect(() => {
    if (playerData) {
      // 設置職業
      if (playerData.currentClassId) {
        setCurrentClass(classes[playerData.currentClassId]);
      }
      // 設置背包
      if (playerData.inventory) {
        // 轉換成 InventoryItem 格式
        const inventoryItems = playerData.inventory.map((itemId, index) => {
          const item = items.find(i => i.id === itemId);
          if (!item) return null;
          return {
            ...item,
            quantity: 1,
            slot: index
          };
        }).filter(Boolean) as InventoryItem[];
        setInventory(inventoryItems);
      }
      // 設置裝備
      if (playerData.equipped) {
        const weapon = playerData.equipped.weapon ? 
          weapons.find(w => w.id === playerData.equipped.weapon) : 
          null;
        setEquipment({ weapon });
      }
    }
  }, [playerData]);

  /**
   * 增加經驗值並處理升級
   */
  const gainExperience = useCallback((amount: number): void => {
    if (!playerData?.characterStats || !currentClass) return;
    const characterStats = playerData.characterStats;

    const newStats = (() => {
      let newExp = characterStats.experience + amount;
      let newLevel = characterStats.level;
      let newNextLevelExp = characterStats.nextLevelExp;

      // 檢查是否升級
      while (newExp >= newNextLevelExp) {
        newExp -= newNextLevelExp;
        newLevel++;
        newNextLevelExp = calculateExpToNextLevel(newLevel);
      }

      // 如果升級了才計算新的屬性值
      if (newLevel > characterStats.level) {
        const newStats = calculateStatGrowth(
          currentClass.baseStats,
          currentClass.growthStats,
          newLevel
        );

        return {
          ...newStats,
          experience: newExp,
          nextLevelExp: newNextLevelExp
        };
      }

      // 沒升級就只更新經驗值
      return {
        ...characterStats,
        experience: newExp,
        nextLevelExp: newNextLevelExp
      };
    })();

    onStatsChange?.(newStats);
  }, [playerData?.characterStats, currentClass, onStatsChange]);

  /**
   * 將物品添加到背包
   */
  const addToInventory = useCallback((itemId: string, quantity: number = 1): boolean => {
    const item = items.find(i => i.id === itemId);
    if (!item) return false;

    setInventory(prev => {
      if (item.stackable) {
        const existingItem = prev.find(i => i.id === itemId && i.quantity < (item.maxStack || Infinity));
        if (existingItem) {
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            item.maxStack || Infinity
          );
          return prev.map(i => 
            i.slot === existingItem.slot
              ? { ...i, quantity: newQuantity }
              : i
          );
        }
      }

      const nextSlot = prev.length > 0 
        ? Math.max(...prev.map(i => i.slot)) + 1 
        : 0;

      return [...prev, {
        ...item,
        quantity,
        slot: nextSlot
      }];
    });

    return true;
  }, []);

  /**
   * 從背包移除物品
   */
  const removeFromInventory = useCallback((slot: number, quantity: number = 1): boolean => {
    let removed = false;

    setInventory(prev => {
      const item = prev.find(i => i.slot === slot);
      if (!item) return prev;

      if (item.quantity <= quantity) {
        return prev.filter(i => i.slot !== slot);
      } else {
        return prev.map(i => 
          i.slot === slot 
            ? { ...i, quantity: i.quantity - quantity }
            : i
        );
      }
    });

    return removed;
  }, []);

  /**
   * 移動背包物品
   */
  const moveItem = useCallback((fromSlot: number, toSlot: number): boolean => {
    setInventory(prev => {
      const fromIndex = prev.findIndex(i => i.slot === fromSlot);
      const toIndex = prev.findIndex(i => i.slot === toSlot);
      
      if (fromIndex === -1) return prev;
      
      const newInventory = [...prev];
      const [movedItem] = newInventory.splice(fromIndex, 1);
      
      // 如果目標位置已有物品
      if (toIndex !== -1) {
        const targetItem = newInventory[toIndex];
        
        // 如果是相同物品且可堆疊
        if (movedItem.id === targetItem.id && movedItem.stackable) {
          const totalQuantity = movedItem.quantity + targetItem.quantity;
          const maxStack = movedItem.maxStack || Infinity;
          
          if (totalQuantity <= maxStack) {
            newInventory[toIndex] = {
              ...targetItem,
              quantity: totalQuantity
            };
          } else {
            newInventory[toIndex] = {
              ...targetItem,
              quantity: maxStack
            };
            newInventory.splice(fromIndex, 0, {
              ...movedItem,
              quantity: totalQuantity - maxStack
            });
          }
        } else {
          // 不同物品則交換位置
          newInventory.splice(fromIndex, 0, {
            ...targetItem,
            slot: fromSlot
          });
          newInventory[toIndex] = {
            ...movedItem,
            slot: toSlot
          };
        }
      } else {
        // 目標位置為空，直接移動
        newInventory.splice(toIndex, 0, {
          ...movedItem,
          slot: toSlot
        });
      }
      
      return newInventory;
    });

    return true;
  }, []);

  /**
   * 檢查是否可以裝備武器
   */
  const canEquipWeapon = useCallback((weapon: Weapon): boolean => {
    if (!currentClass || !playerData?.characterStats) return false;
    const characterStats = playerData.characterStats;

    if (!currentClass.allowedWeapons.includes(weapon.type)) return false;

    if (weapon.requirements) {
      const { requirements } = weapon;
      if (
        (requirements.level && characterStats.level < requirements.level) ||
        (requirements.strength && characterStats.strength < requirements.strength) ||
        (requirements.dexterity && characterStats.dexterity < requirements.dexterity) ||
        (requirements.intelligence && characterStats.intelligence < requirements.intelligence)
      ) {
        return false;
      }
    }

    return true;
  }, [currentClass, playerData?.characterStats]);

  /**
   * 裝備武器
   */
  const equipWeapon = useCallback((weapon: Weapon): boolean => {
    if (!canEquipWeapon(weapon)) return false;

    setEquipment(prev => ({
      ...prev,
      weapon
    }));

    return true;
  }, [canEquipWeapon]);

  /**
   * 使用技能
   */
  const useSkill = useCallback((skillId: string): boolean => {
    const skill = skillMap.get(skillId);
    if (!skill || !playerData?.characterStats) return false;
    const characterStats = playerData.characterStats;

    const now = Date.now();

    if (skillCooldowns[skillId] && now < skillCooldowns[skillId]) {
      return false;
    }

    if (characterStats.mana < skill.manaCost) {
      return false;
    }

    if (
      skill.requirements?.weapon &&
      (!equipment.weapon || !skill.requirements.weapon.includes(equipment.weapon.type))
    ) {
      return false;
    }

    setSkillCooldowns(prev => ({
      ...prev,
      [skillId]: now + (skill.cooldown * 1000)
    }));

    // 更新魔力值
    const newStats = {
      ...characterStats,
      mana: characterStats.mana - skill.manaCost
    };
    onStatsChange?.(newStats);

    // 處理技能效果
    if (skill.effects) {
      setActiveEffects(prev => {
        const newEffects = { ...prev };
        skill.effects?.forEach(effect => {
          if (Math.random() * 100 <= (effect.chance || 100)) {
            newEffects[effect.type] = now + (effect.duration * 1000);
          }
        });
        return newEffects;
      });
    }

    return true;
  }, [playerData?.characterStats, equipment.weapon, skillCooldowns, onStatsChange]);

  /**
   * 獲取技能冷卻時間
   */
  const getSkillCooldown = useCallback((skillId: string): number => {
    const endTime = skillCooldowns[skillId];
    if (!endTime) return 0;

    const remainingTime = Math.max(0, endTime - Date.now()) / 1000;
    return Math.round(remainingTime * 10) / 10;
  }, [skillCooldowns]);

  /**
   * 檢查效果是否活動中
   */
  const isEffectActive = useCallback((effectType: EffectType): boolean => {
    const endTime = activeEffects[effectType];
    return endTime ? Date.now() < endTime : false;
  }, [activeEffects]);

  /**
   * 檢查職業是否擁有該技能
   */
  const isClassSkillAvailable = useCallback((classId: string, skillId: string): boolean => 
    skillsByClass[classId]?.some(skill => skill.id === skillId) ?? false
  , []);

  /**
   * 獲取當前經驗值百分比
   */
  const getExpPercentage = useCallback((): number => {
    if (!playerData?.characterStats) return 0;
    const { experience, nextLevelExp } = playerData.characterStats;
    return (experience / nextLevelExp) * 100;
  }, [playerData?.characterStats]);

  return {
    // 狀態
    characterStats: playerData?.characterStats || null,
    currentClass,
    inventory,
    equipment,
    activeEffects,

    // 操作方法
    gainExperience,
    getExpPercentage,

    // 背包相關
    addToInventory,
    removeFromInventory,
    moveItem,

    // 裝備相關
    canEquipWeapon,
    equipWeapon,

    // 技能相關
    useSkill,
    getSkillCooldown,
    isEffectActive,
    isClassSkillAvailable,

    // 遊戲數據
    classes: Object.values(classes),
    skills,
    skillsByClass,
  };
};