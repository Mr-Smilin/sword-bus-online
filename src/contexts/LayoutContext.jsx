/**
 * @file LayoutContext.jsx
 * @description 管理應用布局的 Context
 */
import React, { createContext, useContext, useState, useMemo } from "react";

// 布局配置常量
const DRAWER_CONFIG = {
	collapsedWidth: 64,
	expandedWidth: 240,
};

const LayoutContext = createContext(null);

/**
 * 布局配置 Provider 組件
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子組件
 */
export const LayoutProvider = ({ children }) => {
	// 抽屜相關狀態
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isPinned, setIsPinned] = useState(false);
	const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);

	// 記憶化抽屜配置
	const drawerConfig = useMemo(() => DRAWER_CONFIG, []);

	// 計算當前抽屜寬度
	const currentDrawerWidth = useMemo(
		() =>
			isDrawerExpanded
				? drawerConfig.expandedWidth
				: drawerConfig.collapsedWidth,
		[isDrawerExpanded, drawerConfig]
	);

	// 記憶化抽屜操作方法
	const drawerActions = useMemo(
		() => ({
			// 處理抽屜開關
			handleDrawerToggle: () => setMobileOpen((prev) => !prev),

			// 處理抽屜展開狀態
			handleDrawerExpand: (expanded) => {
				if (!isPinned) {
					setIsDrawerExpanded(expanded);
				}
			},

			// 處理固定按鈕點擊
			handlePinClick: () => {
				setIsPinned((prev) => !prev);
				if (!isPinned) {
					setIsDrawerExpanded(true);
				}
			},
		}),
		[isPinned]
	);

	const value = {
		// 狀態
		mobileOpen,
		isPinned,
		isDrawerExpanded,
		currentDrawerWidth,
		// 配置
		drawerConfig,
		// 操作方法
		drawerActions,
	};

	return (
		<LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
	);
};

/**
 * 使用布局 Context 的自定義 Hook
 * @returns {Object} 布局相關的狀態和方法
 * @throws {Error} 如果在 LayoutProvider 外使用會拋出錯誤
 */
export const useLayout = () => {
	const context = useContext(LayoutContext);
	if (!context) {
		throw new Error("useLayout must be used within a LayoutProvider");
	}
	return context;
};
