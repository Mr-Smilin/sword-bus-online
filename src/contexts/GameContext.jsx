import React, {
	createContext,
	useContext,
	useCallback,
	useState,
	useEffect,
} from "react";
import { useGameSave } from "../hooks/useGameSave";
import { useGameData } from "../hooks/useGameData";
import { MapProvider } from "./MapContext";
import TutorialModal from "../components/tutorial/TutorialModal";

/**
 * 遊戲上下文
 * 用於全局共享遊戲狀態和方法
 */
const GameContext = createContext(null);

/**
 * 遊戲狀態提供者組件
 * 管理遊戲的核心狀態和邏輯
 */
export const GameProvider = ({ children }) => {
	// 遊戲存檔管理
	const {
		saveData,
		isLoading,
		createNewPlayer,
		updatePlayerData,
		updateEventData,
	} = useGameSave();

	// 遊戲核心數據
	const gameData = useGameData(
		saveData?.player,
		// 當角色情報改變時，更新存檔
		(newPlayer) => {
			updatePlayerData(newPlayer);
		}
	);

	/**
	 * 處理新手引導完成
	 * @param {string} name - 角色名稱
	 * @param {string} classId - 職業ID
	 */
	const handleTutorialComplete = (name, classId) => {
		const newSave = createNewPlayer(name, classId);
		// gameData.initializePlayerData(newSave.player);
	};

	// 初始化探索進度
	const [areaProgress, setAreaProgress] = useState(() => {
		// 如果有存檔就用存檔的資料，否則建立初始資料
		return (
			saveData?.areaProgress || {
				"f1-town": { currentExploration: 0, maxExploration: 0 },
				"f1-wild-east": { currentExploration: 0, maxExploration: 0 },
				"f1-wild-west": { currentExploration: 0, maxExploration: 0 },
				"f1-dungeon": { currentExploration: 0, maxExploration: 0 },
			}
		);
	});

	/**
	 * 更新探索進度
	 */
	const updateAreaProgress = useCallback((areaId, progress) => {
		setAreaProgress((prev) => ({
			...prev,
			[areaId]: progress,
		}));
	}, []);

	// 位置相關的資料存檔結構
	const [locationData, setLocationData] = useState({
		currentFloorId: 1,
		currentAreaId: "f1-town",
	});

	// 當存檔資料更新時，更新位置資料
	useEffect(() => {
		if (saveData?.player?.locationData) {
			setLocationData(saveData.player.locationData);
		}
	}, [saveData]);

	/**
	 * 更新位置資料
	 */
	const updateLocationData = useCallback(
		(newLocationData) => {
			setLocationData((prevData) => {
				const updatedData = { ...prevData, ...newLocationData };
				// 更新存檔
				updatePlayerData({
					locationData: updatedData,
				});
				return updatedData;
			});
		},
		[updatePlayerData]
	);

	/**
	 * 整合所有遊戲相關的狀態和方法
	 */
	const contextValue = {
		// 存檔狀態
		player: saveData?.player || null,
		isNewPlayer: !saveData,
		eventData: saveData?.events || {},

		// 探索相關
		areaProgress,
		locationData,

		// 核心遊戲數據和方法
		...gameData,

		// 存檔操作方法
		updatePlayerData,
		updateEventData,
		updateAreaProgress,
		updateLocationData,
	};

	/**
	 * 如果沒有存檔，顯示新手引導
	 * 否則顯示遊戲主內容
	 */
	return (
		<GameContext.Provider value={contextValue}>
			{!saveData ? (
				<TutorialModal onComplete={handleTutorialComplete} />
			) : (
				<MapProvider>{children}</MapProvider>
			)}
		</GameContext.Provider>
	);
};

/**
 * 遊戲狀態 Hook
 * 用於在組件中獲取遊戲狀態和方法
 */
export const useGame = () => {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGame must be used within a GameProvider");
	}
	return context;
};
