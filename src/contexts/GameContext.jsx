import React, { createContext, useContext } from "react";
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
 * 遊戲核心狀態管理器
 * 負責：
 * 1. 玩家核心資料管理
 * 2. 遊戲事件追蹤
 * 3. 存檔系統整合
 */
export const GameProvider = ({ children }) => {
    // 遊戲存檔管理
    const { saveData, dispatch, createNewPlayer, deleteSaveData } =
        useGameSave();

    // 遊戲核心數據
    const gameData = useGameData(saveData, dispatch);

    // 整合所有遊戲相關的狀態和方法
    const contextValue = {
        // 玩家狀態
        player: saveData?.player || null,
        isNewPlayer: !saveData,
        eventData: saveData?.events || {},

        // 從 useGameData 取得的核心功能
        ...gameData,

        // 從 useGameSave 取得的方法
        dispatch,
        deleteSaveData,
    };

    /**
     * 處理新手引導完成
     * @param {string} name - 角色名稱
     * @param {string} classId - 職業ID
     */
    const handleTutorialComplete = (name, classId) => {
        createNewPlayer(name, classId);
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

export default GameContext;
