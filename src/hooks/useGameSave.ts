import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GameSaveData, PlayerData, GameEventData } from '../data/type';
import { classes } from '../data/classes';

const SAVE_KEY = 'sao_game_save';
const CURRENT_VERSION = '1.0.0';

/**
 * 遊戲資料持久化 Hook
 * 管理遊戲資料的讀取、儲存和更新
 */
export const useGameSave = () => {
  // 遊戲存檔資料
  const [saveData, setSaveData] = useState<GameSaveData | null>(null);
  // 是否正在載入
  const [isLoading, setIsLoading] = useState(true);

  // 初始化時載入存檔
  useEffect(() => {
    loadSaveData();
  }, []);

  /**
   * 載入遊戲存檔
   */
  const loadSaveData = () => {
    try {
      setIsLoading(true);
      const savedData = localStorage.getItem(SAVE_KEY);
      if (savedData) {
        const parsedData: GameSaveData = JSON.parse(savedData);
        // 檢查版本是否相符，未來可以在這裡加入版本升級邏輯
        if (parsedData.version === CURRENT_VERSION) {
          setSaveData(parsedData);
          return;
        }
      }
      setSaveData(null);
    } catch (error) {
      console.error('Failed to load save data:', error);
      setSaveData(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 儲存遊戲資料
   * @param {GameSaveData} data - 要儲存的資料
   */
  const saveGameData = (data: GameSaveData) => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      setSaveData(data);
    } catch (error) {
      console.error('Failed to save game data:', error);
    }
  };

  /**
   * 更新玩家資料
   * @param {Partial<PlayerData>} updates - 要更新的玩家資料欄位
   */
  const updatePlayerData = (updates: Partial<PlayerData>) => {
    if (!saveData) return;

    const updatedSave = {
      ...saveData,
      player: {
        ...saveData.player,
        ...updates,
        lastLoginAt: Date.now()
      }
    };

    saveGameData(updatedSave);
  };

  /**
   * 更新事件資料
   * @param {string} eventId - 事件ID
   * @param {Partial<GameEventData>} data - 要更新的事件資料
   */
  const updateEventData = (eventId: string, data: Partial<GameEventData>) => {
    if (!saveData) return;

    const updatedSave = {
      ...saveData,
      events: {
        ...saveData.events,
        [eventId]: {
          ...saveData.events[eventId],
          ...data
        }
      }
    };

    saveGameData(updatedSave);
  };

 /**
   * 創建新玩家
   * @param {string} name - 角色名稱
   * @param {string} classId - 職業ID
   * @returns {GameSaveData} 新的存檔資料
   */
  const createNewPlayer = (name: string, classId: string): GameSaveData => {
    const newSave: GameSaveData = {
      player: {
        id: uuidv4(),
        name,
        currentClassId: classId,
        classProgress: {
          // [classId]: {
          //   unlockedSkills: classes[classId].skills.basic,  // 初始職業的基礎技能
          // }
        },
        characterStats: {
          level: 0,
          experience: 0,
          nextLevelExp: 10,
          health: 1,
          currentHealth: 1,
          mana: 1,
          currentMana: 1,
          strength: 1,
          dexterity: 1,
          intelligence: 1
        },
        inventory: [],
        equipped: {},
         // 初始位置資料
         locationData: {
          currentFloorId: 1,
          currentAreaId: 'f1-town'
        },
        // 初始地圖資料
        mapSaveData: {
          areaProgress: {},
          unlockedAreas: ['f1-town','f1-wild-east','f1-wild-west','f1-dungeon','f2-town','f2-wild'],
          defeatedBosses: ['f1-dungeon-boss'],
          maxDungeonProgress: {}
        },
        createdAt: Date.now(),
        lastLoginAt: Date.now()
      },
      events: {
        tutorial: {
          name,
          classId,
          isCompleted: true
        }
      },
      version: CURRENT_VERSION
    };

    saveGameData(newSave);
    return newSave;
  };

  /**
   * 刪除存檔
   */
  const deleteSaveData = () => {
    localStorage.removeItem(SAVE_KEY);
    setSaveData(null);
  };

  return {
    saveData,
    isLoading,
    updatePlayerData,
    updateEventData,
    createNewPlayer,
    deleteSaveData
  };
};