import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
} from "react";
import {
	floors,
	BASE_MOVEMENT_SPEED,
	getSpeedModifier,
} from "../data/maps/mapDefinitions";
import { useGame } from "./GameContext";

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
	// 取得遊戲狀態
	const {
		areaProgress,
		defeatedBosses,
		updateAreaProgress,
		locationData,
		updateLocationData,
	} = useGame();
	// 狀態
	const [currentFloor, setCurrentFloor] = useState(floors[0]);
	const [currentArea, setCurrentArea] = useState(floors[0].areas[0]);
	const [isMoving, setIsMoving] = useState(false);
	const [moveProgress, setMoveProgress] = useState(0);
	const [travelInfo, setTravelInfo] = useState({
		fromArea: null,
		toArea: null,
		estimatedTime: 0,
		isActive: false,
	});

	/**
	 * 計算移動時間
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

			// 檢查探索度要求
			if (targetArea.requiredExploration) {
				const progress = areaProgress[currentArea.id];
				if (
					!progress ||
					progress.maxExploration < targetArea.requiredExploration
				) {
					return false;
				}
			}

			return true;
		},
		[currentArea, currentFloor, isMoving, areaProgress]
	);

	/**
	 * 檢查是否可以切換樓層
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
				!defeatedBosses.includes(targetFloor.requiredBoss)
			) {
				return false;
			}

			return true;
		},
		[currentArea, defeatedBosses]
	);

	/**
	 * 移動到目標區域
	 */
	const moveToArea = useCallback(
		async (targetAreaId) => {
			if (!canMoveToArea(targetAreaId)) return false;

			const targetArea = currentFloor.areas.find(
				(area) => area.id === targetAreaId
			);
			const travelTime = calculateTravelTime(currentArea, targetArea);

			setTravelInfo({
				fromArea: currentArea,
				toArea: targetArea,
				estimatedTime: travelTime,
			});

			setIsMoving(true);

			return new Promise((resolve) => {
				const startTime = Date.now();
				const animate = () => {
					const elapsed = Date.now() - startTime;
					const progress = Math.min((elapsed / (travelTime * 1000)) * 100, 100);
					setMoveProgress(progress);

					if (progress < 100) {
						requestAnimationFrame(animate);
					} else {
						// 在 100% 時等待 1 秒再結束移動
						setTimeout(() => {
							console.log("save", targetAreaId);
							// 移動完成後更新存檔
							updateLocationData({
								currentFloorId: currentFloor.id,
								currentAreaId: targetAreaId,
							});
							// 更新區域和相關資料
							setCurrentArea(targetArea);
							// 重置當前探索進度
							updateAreaProgress(targetArea.id, {
								currentExploration: 0,
								// 保留最大探索度
								maxExploration:
									areaProgress[targetArea.id]?.maxExploration || 0,
								// 如果是迷宮，重置地域探索度
								dungeonExploration:
									targetArea.type === "dungeon" ? 0 : undefined,
							});

							// 延遲關閉移動狀態
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
			areaProgress,
			updateAreaProgress,
		]
	);

	/**
	 * 切換樓層
	 */
	const changeFloor = useCallback(
		(floorId) => {
			if (!canChangeFloor(floorId)) return false;

			const targetFloor = floors.find((f) => f.id === floorId);
			const targetTown = targetFloor.areas.find((area) => area.type === "town");

			setCurrentFloor(targetFloor);
			setCurrentArea(targetTown);

			return true;
		},
		[canChangeFloor]
	);

	const value = {
		currentFloor,
		currentArea,
		isMoving,
		travelInfo,
		moveProgress,
		moveToArea,
		changeFloor,
		canMoveToArea,
		canChangeFloor,
		calculateTravelTime,
	};

	// 當 locationData 變更時更新地圖資料
	useEffect(() => {
		if (locationData) {
			const floor =
				floors.find((f) => f.id === locationData.currentFloorId) || floors[0];
			setCurrentFloor(floor);

			const area =
				floor.areas.find((a) => a.id === locationData.currentAreaId) ||
				floor.areas[0];
			setCurrentArea(area);
		}
	}, [locationData]);

	return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMap = () => {
	const context = useContext(MapContext);
	if (!context) {
		throw new Error("useMap must be used within a MapProvider");
	}
	return context;
};
