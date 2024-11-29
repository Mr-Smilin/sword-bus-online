// src/theme.js
import { createTheme } from "@mui/material";

/**
 * 自定義色彩配置
 */
const customColors = {
	// 主色調
	primary: {
		main: "#1976d2", // 主要色彩
		light: "#42a5f5", // 較淺版本
		dark: "#1565c0", // 較深版本
		contrastText: "#333", // 文字顏色
	},
	// 成功色調（用於選中狀態）
	success: {
		main: "#2e7d32", // 主要綠色
		light: "#048914", // 較淺的綠色
		dark: "#1b5e20", // 較深的綠色
		contrastText: "#fff", // 文字顏色
	},
	// 背景色彩
	background: {
		default: "#cccccc", // 預設背景
		paper: "#f5f5f5", // 卡片背景
	},
	// 文字顏色
	text: {
		primary: "#333333", // 主要文字
		secondary: "#666666", // 次要文字
	},
};

/**
 * 淺色主題配置
 */
export const lightTheme = createTheme({
	palette: {
		mode: "light",
		...customColors,
	},
});

/**
 * 深色主題配置
 */
export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		// 深色主題的自定義顏色
		primary: {
			main: "#90caf9", // 較亮的藍色
			light: "#e3f2fd", // 非常淺的藍色
			dark: "#42a5f5", // 中等藍色
			contrastText: "#000", // 黑色文字
		},
		success: {
			main: "#66bb6a", // 較亮的綠色
			light: "#81c784", // 淺綠色
			dark: "#388e3c", // 深綠色
			contrastText: "#000", // 黑色文字
		},
		background: {
			default: "#121212", // 深色背景
			paper: "#3b3535", // 稍淺的深色
		},
		text: {
			primary: "#ffffff", // 白色文字
			secondary: "#b0b0b0", // 灰色文字
		},
	},
});
