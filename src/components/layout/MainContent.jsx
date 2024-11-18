/**
 * @file MainContent.jsx
 * @description 主要內容區域組件，包含主要畫面、角色資訊和側邊欄面板
 */
import React, { useMemo } from "react";
import { Box, Paper, IconButton, Modal } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useLayout } from "../../contexts";
import { usePanelContainerAnimation } from "../../utils/animations";
import { CharacterCard, CharacterPanel } from "../character";
import { MainView } from "../main-view";

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
	const { style: mainViewStyle, AnimatedContainer: MainViewContainer } =
		usePanelContainerAnimation({});
	const {
		style: characterInfoStyle,
		AnimatedContainer: CharacterInfoContainer,
	} = usePanelContainerAnimation({});
	const { style: sidePanelStyle, AnimatedContainer: SidePanelContainer } =
		usePanelContainerAnimation({
			deps: currentPanel,
		});
	const { style: modalStyle, AnimatedContainer: ModalContainer } =
		usePanelContainerAnimation({
			deps: isModalOpen,
		});

	// 記憶化內容
	const mainViewContent = useMemo(() => <MainView />, []);
	const characterInfoContent = useMemo(() => <CharacterCard />, []);
	const sidePanelContent = useMemo(() => {
		const PanelComponent =
			PANEL_CONTENT[currentPanel] || (() => <div>請選擇一個面板</div>);
		return <PanelComponent />;
	}, [currentPanel]);

	return (
		<Box component="main" sx={mainContentStyles.main}>
			<Box sx={mainContentStyles.contentGrid}>
				{/* 主要畫面 */}
				<MainViewContainer
					style={mainViewStyle}
					sx={{
						gridColumn: {
							xs: "1",
							sm: "1 / 2",
						},
						gridRow: {
							xs: "1",
							sm: "1 / 3",
						},
						minHeight: {
							xs: "300px",
							sm: "600px",
						},
						bgcolor: "background.default",
						border: 1,
						borderColor: "divider",
						borderRadius: 1,
					}}
				>
					{mainViewContent}
				</MainViewContainer>

				{/* 角色資訊/職業面板 */}
				<CharacterInfoContainer
					style={characterInfoStyle}
					sx={{
						gridColumn: {
							xs: "1",
							sm: "2 / 3",
						},
						gridRow: {
							xs: "2",
							sm: "1",
						},
					}}
				>
					{characterInfoContent}
				</CharacterInfoContainer>

				{/* 側邊欄面板 */}
				{!isModalPanel(currentPanel) && (
					<SidePanelContainer
						style={sidePanelStyle}
						sx={{
							gridColumn: {
								xs: "1",
								sm: "2 / 3",
							},
							gridRow: {
								xs: "3",
								sm: "2",
							},
							minHeight: "200px",
							bgcolor: "background.paper",
						}}
					>
						{sidePanelContent}
					</SidePanelContainer>
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
					{sidePanelContent}
				</ModalContainer>
			</Modal>
		</Box>
	);
};

export default MainContent;
