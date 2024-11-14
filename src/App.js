import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import GameLayout from "./components/GameLayout";
import { lightTheme, darkTheme } from "./theme";
import { useThemeTransition } from "./hooks/useThemeTransition";
import { GameProvider, LayoutProvider } from "./contexts";
import "./styles/transitions.css";

function App() {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const savedTheme = localStorage.getItem("theme");
		return savedTheme ? JSON.parse(savedTheme) : false;
	});

	// 使用新的 transition hook
	const toggleTheme = useThemeTransition(isDarkMode, setIsDarkMode);

	// 保存主題設置到 localStorage
	React.useEffect(() => {
		localStorage.setItem("theme", JSON.stringify(isDarkMode));
	}, [isDarkMode]);

	return (
		<ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
			<CssBaseline />
			<GameProvider>
				<LayoutProvider>
					<Router>
						<GameLayout isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
					</Router>
				</LayoutProvider>
			</GameProvider>
		</ThemeProvider>
	);
}

export default App;
