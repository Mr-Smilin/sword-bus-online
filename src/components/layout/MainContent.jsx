/**
 * @file MainContent.jsx
 * @description 主要內容區域組件，更新模態框邏輯
 */
import React, { useMemo } from "react";
import { Box, Paper, IconButton, Modal } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useLayout } from "../../contexts";
import { usePanelContainerAnimation } from "../../utils/animations";
import { CharacterCard, CharacterPanel } from "../character";

// 面板內容映射
const PANEL_CONTENT = {
	character: CharacterPanel,
	inventory: () => <div>背包道具內容面板</div>,
	skills: () => <div>技能列表面板</div>,
	map: () => <div>地圖面板</div>,
};

const MainContent = () => {
	const {
		currentPanel,
		mainContentStyles,
		isModalOpen,
		layoutActions: { closeModal },
		isModalPanel,
	} = useLayout();

	// 動畫容器
	const { style: emptyPanelStyle, AnimatedContainer: EmptyPanelContainer } =
		usePanelContainerAnimation({});
	const {
		style: characterCardStyle,
		AnimatedContainer: CharacterCardContainer,
	} = usePanelContainerAnimation({});
	const { style: mainPanelStyle, AnimatedContainer: MainPanelContainer } =
		usePanelContainerAnimation({
			deps: currentPanel,
		});
	// 模態窗口的動畫
	const { style: modalStyle, AnimatedContainer: ModalContainer } =
		usePanelContainerAnimation({
			deps: isModalOpen,
		});

	// 記憶化內容
	const emptyPanelContent = useMemo(() => <Box />, []);
	const characterCardContent = useMemo(() => <CharacterCard />, []);
	const currentPanelContent = useMemo(() => {
		const PanelComponent =
			PANEL_CONTENT[currentPanel] || (() => <div>請選擇一個面板</div>);
		return <PanelComponent />;
	}, [currentPanel]);

	return (
		<Box component="main" sx={mainContentStyles.main}>
			<Box sx={mainContentStyles.contentGrid}>
				{/* 空白面板 */}
				<EmptyPanelContainer
					style={emptyPanelStyle}
					sx={{ gridColumn: { xs: "1", sm: "1 / 2" }, minHeight: "200px" }}
				>
					{emptyPanelContent}
				</EmptyPanelContainer>

				{/* 角色卡片 */}
				<CharacterCardContainer
					style={characterCardStyle}
					sx={{ gridColumn: { xs: "1", sm: "2 / 3" } }}
				>
					{characterCardContent}
				</CharacterCardContainer>

				{/* 主要內容面板 - 只在非模態面板時顯示 */}
				{!isModalPanel(currentPanel) && (
					<MainPanelContainer
						style={mainPanelStyle}
						sx={{
							gridColumn: { xs: "1", sm: "1 / 3" },
							minHeight: "200px",
							bgcolor: (theme) => theme.palette.background.paper,
						}}
					>
						{currentPanelContent}
					</MainPanelContainer>
				)}
			</Box>

			{/* 模態窗口 */}
			<Modal
				open={isModalOpen && isModalPanel(currentPanel)}
				onClose={closeModal}
				sx={mainContentStyles.modal}
			>
				<ModalContainer
					onClick={(e) => e.stopPropagation()}
					style={modalStyle}
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "90%",
						maxWidth: 1200,
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						maxHeight: "90vh",
						overflow: "auto",
					}}
				>
					{currentPanelContent}
				</ModalContainer>
			</Modal>
		</Box>
	);
};

export default MainContent;
