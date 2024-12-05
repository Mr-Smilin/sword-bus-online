import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
	useMemo,
} from "react";
import { useGame } from "./GameContext";
import {
	floors,
	BASE_MOVEMENT_SPEED,
	getSpeedModifier,
} from "../data/maps/mapDefinitions";

/**
 * 地圖系統 Context
 */
const MapContext = createContext(null);

/**
 * 地圖系統狀態管理器
 * 負責：
 * 1. 位置管理 - 當前樓層和區域的追蹤
 * 2. 進度管理 - 區域解鎖和BOSS擊殺紀錄
 * 3. 移動系統 - 區域間的移動和樓層切換
 * 4. 探索系統 - 迷宮和一般區域的探索進度
 */
export const MapProvider = ({ children }) => {
	// 取得遊戲存檔管理器
	const { player, updatePlayerData } = useGame();

	// 地圖基礎狀態
	const [currentFloor, setCurrentFloor] = useState(() => {
		// 從玩家資料中獲取當前樓層，預設為第一層
		const floorId = player?.locationData?.currentFloorId || 1;
		return floors.find((f) => f.id === floorId) || floors[0];
	});

	const [currentArea, setCurrentArea] = useState(() => {
		// 從玩家資料中獲取當前區域，預設為新手村
		const areaId = player?.locationData?.currentAreaId || "f1-town";
		return (
			currentFloor.areas.find((a) => a.id === areaId) || currentFloor.areas[0]
		);
	});

	// 移動系統狀態
	const [isMoving, setIsMoving] = useState(false);
	const [moveProgress, setMoveProgress] = useState(0);
	const [travelInfo, setTravelInfo] = useState({
		fromArea: null, // 起始區域
		toArea: null, // 目標區域
		estimatedTime: 0, // 預估移動時間(秒)
	});

	// 地圖探索系統狀態
	const [mapSaveData, setMapSaveData] = useState({
		areaProgress: {}, // 區域探索進度
		unlockedAreas: ["f1-town"], // 已解鎖區域
		defeatedBosses: [], // 已擊敗BOSS
		maxDungeonProgress: {}, // 迷宮探索上限
	});

	/**
	 * 初始化地圖存檔資料
	 */
	useEffect(() => {
		if (!!player?.mapSaveData) {
			setMapSaveData(player.mapSaveData);
		}
	}, [player]);

	/**
	 * 更新地圖存檔資料
	 * @param {Partial<MapSaveData>} updates - 要更新的資料
	 */
	const updateMapSave = useCallback(
		(updates) => {
			setMapSaveData((prev) => {
				const newData = { ...prev, ...updates };

				// 更新玩家資料中的地圖存檔
				updatePlayerData({
					mapSaveData: newData,
				});

				return newData;
			});
		},
		[updatePlayerData]
	);

	/**
	 * 計算區域間的移動時間
	 * @param {Area} from - 起始區域
	 * @param {Area} to - 目標區域
	 * @returns {number} 移動時間(秒)
	 */
	const calculateTravelTime = useCallback((from, to) => {
		const dx = to.position.x - from.position.x;
		const dy = to.position.y - from.position.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const speedModifier = getSpeedModifier(from.type, to.type);

		return distance * BASE_MOVEMENT_SPEED * speedModifier;
	}, []);

	/**
	 * 檢查是否可以移動到目標區域
	 * @param {string} targetAreaId - 目標區域ID
	 * @returns {boolean} 是否可以移動
	 */
	const canMoveToArea = useCallback(
		(targetAreaId) => {
			// 正在移動時不能再次移動
			if (isMoving) return false;

			const targetArea = currentFloor.areas.find(
				(area) => area.id === targetAreaId
			);
			if (!targetArea) return false;

			// 檢查是否有連接
			if (!currentArea.connections.includes(targetAreaId)) return false;

			// 檢查是否已解鎖
			if (!mapSaveData.unlockedAreas.includes(targetAreaId)) return false;

			// 檢查探索度要求
			if (targetArea.requiredExploration) {
				const progress = mapSaveData.areaProgress[currentArea.id];
				if (
					!progress ||
					progress.maxExploration < targetArea.requiredExploration
				) {
					return false;
				}
			}

			return true;
		},
		[currentArea, currentFloor, isMoving, mapSaveData]
	);

	/**
	 * 檢查是否可以切換樓層
	 * @param {number} floorId - 目標樓層ID
	 * @returns {boolean} 是否可以切換
	 */
	const canChangeFloor = useCallback(
		(floorId) => {
			// 只能在城鎮切換樓層
			if (currentArea.type !== "town") return false;

			const targetFloor = floors.find((f) => f.id === floorId);
			if (!targetFloor) return false;

			// 檢查是否擊敗需要的 BOSS
			if (
				targetFloor.requiredBoss &&
				!mapSaveData.defeatedBosses.includes(targetFloor.requiredBoss)
			) {
				return false;
			}

			return true;
		},
		[currentArea.type, mapSaveData.defeatedBosses]
	);

	/**
	 * 移動到目標區域
	 * @param {string} targetAreaId - 目標區域ID
	 * @returns {Promise<boolean>} 移動是否成功
	 */
	const moveToArea = useCallback(
		async (targetAreaId) => {
			if (!canMoveToArea(targetAreaId)) return false;

			const targetArea = currentFloor.areas.find(
				(area) => area.id === targetAreaId
			);
			const travelTime = calculateTravelTime(currentArea, targetArea);

			// 設定移動資訊
			setTravelInfo({
				fromArea: currentArea,
				toArea: targetArea,
				estimatedTime: travelTime,
			});

			setIsMoving(true);

			// 返回 Promise 以便等待移動完成
			return new Promise((resolve) => {
				const startTime = Date.now();
				const animate = () => {
					const elapsed = Date.now() - startTime;
					const progress = Math.min((elapsed / (travelTime * 1000)) * 100, 100);
					setMoveProgress(progress);

					if (progress < 100) {
						requestAnimationFrame(animate);
					} else {
						// 移動完成後的處理
						setTimeout(() => {
							// 更新位置資料
							const newLocationData = {
								currentFloorId: currentFloor.id,
								currentAreaId: targetAreaId,
							};

							updatePlayerData({
								locationData: newLocationData,
							});

							// 更新當前區域
							setCurrentArea(targetArea);

							// 重置探索進度（如果是野外或迷宮）
							if (targetArea.type !== "town") {
								const currentProgress = mapSaveData.areaProgress[
									targetArea.id
								] || {
									maxExploration: 0,
									dungeonExploration:
										targetArea.type === "dungeon" ? 0 : undefined,
								};

								updateMapSave({
									areaProgress: {
										...mapSaveData.areaProgress,
										[targetArea.id]: {
											...currentProgress,
											currentExploration: 0,
										},
									},
								});
							}

							// 延遲重置移動狀態
							setTimeout(() => {
								setIsMoving(false);
								setMoveProgress(0);
								setTravelInfo({
									fromArea: null,
									toArea: null,
									estimatedTime: 0,
								});
								resolve(true);
							}, 500);
						}, 1000);
					}
				};

				requestAnimationFrame(animate);
			});
		},
		[
			canMoveToArea,
			calculateTravelTime,
			currentArea,
			currentFloor,
			mapSaveData.areaProgress,
			updateMapSave,
			updatePlayerData,
		]
	);

	/**
	 * 切換樓層
	 * @param {number} floorId - 目標樓層ID
	 * @returns {boolean} 切換是否成功
	 */
	const changeFloor = useCallback(
		(floorId) => {
			if (!canChangeFloor(floorId)) return false;

			const targetFloor = floors.find((f) => f.id === floorId);
			// 切換到目標樓層的城鎮
			const targetTown = targetFloor.areas.find((area) => area.type === "town");

			// 更新當前位置
			setCurrentFloor(targetFloor);
			setCurrentArea(targetTown);

			// 更新位置資料
			updatePlayerData({
				locationData: {
					currentFloorId: floorId,
					currentAreaId: targetTown.id,
				},
			});

			return true;
		},
		[canChangeFloor, updatePlayerData]
	);

	/**
	 * 記錄BOSS擊殺
	 * @param {string} bossId - BOSS的ID
	 */
	const recordBossDefeat = useCallback(
		(bossId) => {
			// 檢查是否已經記錄
			if (mapSaveData.defeatedBosses.includes(bossId)) return;

			// 更新BOSS擊殺紀錄
			updateMapSave({
				defeatedBosses: [...mapSaveData.defeatedBosses, bossId],
			});
		},
		[mapSaveData.defeatedBosses, updateMapSave]
	);

	/**
	 * 解鎖區域
	 * @param {string} areaId - 要解鎖的區域ID
	 */
	const unlockArea = useCallback(
		(areaId) => {
			// 檢查是否已經解鎖
			if (mapSaveData.unlockedAreas.includes(areaId)) return;

			// 更新解鎖區域列表
			updateMapSave({
				unlockedAreas: [...mapSaveData.unlockedAreas, areaId],
			});
		},
		[mapSaveData.unlockedAreas, updateMapSave]
	);

	// Context 值記憶化
	const value = useMemo(
		() => ({
			// 當前狀態
			currentFloor,
			currentArea,
			isMoving,
			moveProgress,
			travelInfo,

			// 地圖進度
			areaProgress: mapSaveData.areaProgress,
			unlockedAreas: mapSaveData.unlockedAreas,
			defeatedBosses: mapSaveData.defeatedBosses,
			maxDungeonProgress: mapSaveData.maxDungeonProgress,

			// 移動相關方法
			moveToArea,
			changeFloor,
			canMoveToArea,
			canChangeFloor,
			calculateTravelTime,

			// 進度相關方法
			recordBossDefeat,
			unlockArea,
		}),
		[
			currentFloor,
			currentArea,
			isMoving,
			moveProgress,
			travelInfo,
			mapSaveData,
			moveToArea,
			changeFloor,
			canMoveToArea,
			canChangeFloor,
			calculateTravelTime,
			recordBossDefeat,
			unlockArea,
		]
	);

	return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

/**
 * 使用地圖Context的Hook
 */
export const useMap = () => {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error("useMap must be used within a MapProvider");
	}
	return context;
};

export default MapContext;
