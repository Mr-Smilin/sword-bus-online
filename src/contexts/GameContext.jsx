import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
} from "react";
import { useGameSave } from "../hooks/useGameSave";
import { useGameData } from "../hooks/useGameData";
import { MapProvider } from "./MapContext";
import TutorialModal from "../components/tutorial/TutorialModal";

const GameContext = createContext(null);

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
	const gameData = useGameData(saveData?.player);

	/**
	 * 處理新手引導完成
	 */
	const handleTutorialComplete = (name, classId) => {
		const newSave = createNewPlayer(name, classId);
		gameData.initializePlayerData(newSave.player);
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
				// 其他區域的初始進度...
			}
		);
	});

	// 更新探索進度的方法
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

	useEffect(() => {
		console.log(saveData?.player?.locationData);
		if (saveData?.player?.locationData) {
			setLocationData(saveData.player.locationData);
		}
	}, [saveData]);

	// 更新位置的方法
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

	// 提供 context 值
	const contextValue = {
		player: saveData?.player || null,
		isNewPlayer: !saveData,
		eventData: saveData?.events || {},
		areaProgress,
		locationData,
		updatePlayerData,
		updateEventData,
		updateAreaProgress,
		updateLocationData,
		...gameData,
	};

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

export const useGame = () => {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGame must be used within a GameProvider");
	}
	return context;
};
