import React, { createContext, useContext } from "react";
import { useGameData } from "../hooks/useGameData";

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
	const gameData = useGameData();

	return (
		<GameContext.Provider value={gameData}>{children}</GameContext.Provider>
	);
};

export const useGame = () => {
	const context = useContext(GameContext);
	if (!context) {
		throw new Error("useGame must be used within a GameProvider");
	}
	return context;
};
