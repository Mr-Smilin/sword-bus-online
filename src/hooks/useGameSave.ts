import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { GameSaveData, PlayerData, GameEventData } from "../data/type";
import { classes } from "../data/classes";
import {
	DEFAULT_INVENTORY_SETTINGS,
	ITEM_TYPE_WEIGHT,
} from "../data/inventory/settings";
import { UpdateQueue } from "./useQueue";

const SAVE_KEY = "sao_game_save";
const CURRENT_VERSION = "1.0.0";

/**
 * 遊戲資料持久化 Hook
 * 管理遊戲資料的讀取、儲存和更新
 */
export const useGameSave = () => {
	// 遊戲存檔資料
	const [saveData, setSaveData] = useState<GameSaveData | null>(null);
	// 是否正在載入
	const [isLoading, setIsLoading] = useState(true);

	// 使用 useUpdateQueue 管理保存数据的更新
	const updateQueue = useRef(new UpdateQueue()).current;

	// 更新存档数据的方法
	const updateSaveData = useCallback(
		(
			updateFn: (prevState: GameSaveData | null) => GameSaveData,
			onComplete?: () => void,
			source?: string
		) => {
			return new Promise<void>((resolve) => {
				try {
					setSaveData((currentState) => {
						const updatedData = updateFn(currentState);

						// 同步更新 localStorage
						localStorage.setItem(SAVE_KEY, JSON.stringify(updatedData));

						// 使用回调函数确保状态更新后执行
						setTimeout(() => {
							console.log(`Data updated from source: ${source}`);
							onComplete?.();
							resolve(); // 确保 Promise 被 resolve
						}, 200);

						return updatedData;
					});
				} catch (error) {
					console.error("Update save data failed", error);
					resolve(); // 即使出错也要 resolve
				}
			});
		},
		[]
	);

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
			console.error("Failed to load save data:", error);
			setSaveData(null);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * 更新玩家資料
	 * @param {Partial<PlayerData>} updates - 要更新的玩家資料欄位
	 */
	const updatePlayerData = async (
		updates: Partial<PlayerData>,
		source?: string
	) => {
		if (!saveData) return;

		await updateSaveData(
			(prevSave) => ({
				...prevSave!,
				player: {
					...prevSave!.player,
					...updates,
					lastLoginAt: Date.now(),
				},
			}),
			() => console.log("Player data updated"),
			source || "player_update"
		);
	};

	/**
	 * 更新事件資料
	 * @param {string} eventId - 事件ID
	 * @param {Partial<GameEventData>} data - 要更新的事件資料
	 */
	const updateEventData = async (
		eventId: string,
		data: Partial<GameEventData>,
		source?: string
	) => {
		if (!saveData) return;

		await updateSaveData(
			(prevSave) => ({
				...prevSave!,
				events: {
					...prevSave!.events,
					[eventId]: {
						...prevSave!.events[eventId],
						...data,
					},
				},
			}),
			() => console.log(`Event ${eventId} updated`),
			source || "event_update"
		);
	};

	/**
	 * 創建新玩家
	 * @param {string} name - 角色名稱
	 * @param {string} classId - 職業ID
	 * @returns {GameSaveData} 新的存檔資料
	 */
	const createNewPlayer = async (
		name: string,
		classId: string
	): Promise<GameSaveData> => {
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

		await updateSaveData(
			() => newSave,
			() => console.log("New player created"),
			"new_player_creation"
		);

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
		deleteSaveData,
	};
};
