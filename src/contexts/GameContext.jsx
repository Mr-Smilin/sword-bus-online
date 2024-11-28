import React, { createContext, useContext } from "react";
import { useGameSave } from "../hooks/useGameSave";
import { useGameData } from "../hooks/useGameData";
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

	// 如果正在載入，可以顯示載入畫面
	if (isLoading) {
		return <div>Loading...</div>;
	}

	// 提供 context 值
	const contextValue = {
		player: saveData?.player || null,
		isNewPlayer: !saveData,
		eventData: saveData?.events || {},
		...gameData,
		updatePlayerData,
		updateEventData,
	};

	return (
		<GameContext.Provider value={contextValue}>
			{!saveData ? (
				<TutorialModal onComplete={handleTutorialComplete} />
			) : (
				children
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
