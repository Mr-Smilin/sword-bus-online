import { useState, useCallback } from "react";

/**
 * 管理面板選擇和彈出視窗的 Hook
 * @param {string} initialPanel - 初始選中的面板
 * @returns {Object} 面板狀態和控制方法
 */
export const useModalPanel = (initialPanel = "") => {
	// 當前選中的面板
	const [selectedPanel, setSelectedPanel] = useState(initialPanel);
	// 記錄上一個非彈出式面板的選中狀態
	const [lastNonModalPanel, setLastNonModalPanel] = useState(initialPanel);
	// 彈出式面板的開啟狀態
	const [isModalOpen, setIsModalOpen] = useState(false);

	/**
	 * 處理面板切換
	 * @param {string} panelId - 面板ID
	 * @param {boolean} isModal - 是否為彈出式面板
	 */
	const handlePanelChange = useCallback(
		(panelId, isModal = false) => {
			if (isModal) {
				// 開啟彈出式面板前，記住目前選中的非彈出式面板
				setLastNonModalPanel(selectedPanel);
				setSelectedPanel(panelId);
				setIsModalOpen(true);
			} else {
				// 選擇非彈出式面板
				setSelectedPanel(panelId);
				setLastNonModalPanel(panelId);
				setIsModalOpen(false);
			}
		},
		[selectedPanel]
	);

	/**
	 * 關閉彈出式面板，恢復上一個選中的面板
	 */
	const closeModal = useCallback(() => {
		setIsModalOpen(false);
		// 恢復到上一個選中的非彈出式面板
		setSelectedPanel(lastNonModalPanel);
	}, [lastNonModalPanel]);

	return {
		selectedPanel, // 當前選中的面板
		isModalOpen, // 彈出視窗狀態
		handlePanelChange, // 處理面板切換
		closeModal, // 關閉彈出視窗
	};
};
