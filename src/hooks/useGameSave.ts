import { useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { classes } from "../data/classes";
import { rootReducer } from "../reducers/rootReducer";
import { GameSaveData, PlayerData } from "../data/type";
import { GameAction } from "../reducers/actionTypes";
import {
    DEFAULT_INVENTORY_SETTINGS,
    ITEM_TYPE_WEIGHT,
} from "../data/inventory/settings";

const SAVE_KEY = "sao_game_save";
const CURRENT_VERSION = "1.0.0";

/**
 * 遊戲資料持久化 Hook
 * 管理遊戲資料的讀取、儲存和更新
 */
export const useGameSave = () => {
    // 使用 reducer 管理狀態
    const [saveData, dispatch] = useReducer(rootReducer, null, () => {
        try {
            const savedData = localStorage.getItem(SAVE_KEY);
            if (savedData) {
                const parsedData: GameSaveData = JSON.parse(savedData);
                if (parsedData.version === CURRENT_VERSION) {
                    return parsedData;
                }
            }
            return null;
        } catch (error) {
            console.error("Failed to load save data:", error);
            return null;
        }
    });

    // 監聽儲存變化自動保存到 localStorage
    useEffect(() => {
        if (!!saveData) {
            try {
                localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
            } catch (error) {
                console.error("Failed to save game data:", error);
            }
        }
    }, [saveData]);

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
                    intelligence: 1,
                },
                currency: {
                    gold: 0, // 初始金幣
                    dungeon: 0, // 初始副本代幣
                    faith: 0, // 初始信仰之力
                    honor: 0, // 初始榮譽點數
                    event: 0, // 初始活動代幣
                },
                inventory: {
                    state: {
                        items: [],
                        maxSlots: DEFAULT_INVENTORY_SETTINGS.defaultMaxSlots,
                    },
                    settings: DEFAULT_INVENTORY_SETTINGS, // 使用預設設定
                    actionHistory: [], // 初始化空的操作歷史
                },
                equipped: {},
                // 初始位置資料
                locationData: {
                    currentFloorId: 1,
                    currentAreaId: "f1-town",
                },
                // 初始地圖資料
                mapSaveData: {
                    areaProgress: {},
                    unlockedAreas: [
                        "f1-town",
                        "f1-wild-east",
                        "f1-wild-west",
                        "f1-dungeon",
                        "f2-town",
                        "f2-wild",
                    ],
                    defeatedBosses: ["f1-dungeon-boss"],
                    maxDungeonProgress: {},
                },
                createdAt: Date.now(),
                lastLoginAt: Date.now(),
            },
            events: {
                tutorial: {
                    name,
                    classId,
                    isCompleted: true,
                },
            },
            version: CURRENT_VERSION,
        };

        dispatch({ type: "UPDATE_PLAYER", payload: newSave.player });

        return newSave;
    };

    /**
     * 刪除存檔
     */
    const deleteSaveData = () => {
        localStorage.removeItem(SAVE_KEY);
        // 重置狀態
        dispatch({ type: "UPDATE_PLAYER", payload: null });
    };

    return {
        saveData,
        dispatch,
        createNewPlayer,
        deleteSaveData,
    };
};
