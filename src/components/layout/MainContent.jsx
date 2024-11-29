/**
 * @file MainContent.jsx
 * @description 主要內容區域組件，包含主要畫面、角色資訊和側邊欄面板
 */
import React, { useMemo } from "react";
import { Box, Paper, IconButton, Modal } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useLayout } from "../../contexts";
import { usePanelContainerAnimation } from "../../utils/animations";
import { useMap } from "../../contexts/MapContext";
import { CharacterCard, CharacterPanel } from "../character";
import { MainView } from "../main-view";
import HelpPanel from "../panels/HelpPanel";
import MapPanel from "../panels/MapPanel";
import TravelProgress from "../map/TravelProgress";

// 面板內容映射
const PANEL_CONTENT = {
	character: CharacterPanel,
	inventory: () => <div>背包道具內容面板</div>,
	skills: () => <div>技能列表面板</div>,
	map: MapPanel,
	help: HelpPanel,
};

const MainContent = () => {
	const {
		currentPanel,
		mainContentStyles,
		isModalOpen,
		layoutActions: { closeModal },
		isModalPanel,
	} = useLayout();
	const { isMoving, travelInfo, moveProgress } = useMap();

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
			{/* 進度條 */}
			{isMoving && (
				<TravelProgress
					progress={moveProgress}
					fromArea={travelInfo.fromArea}
					toArea={travelInfo.toArea}
					estimatedTime={travelInfo.estimatedTime}
					isMoving={isMoving}
				/>
			)}

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
						// 調整視窗高度和內部間距
						maxHeight: {
							xs: "85vh", // 手機版稍微小一點
							sm: "90vh", // 電腦版可以大一點
						},
						height: "auto", // 根據內容自適應高度
						display: "flex",
						flexDirection: "column",
						// 圓角和邊框
						borderRadius: 1,
						border: 1,
						borderColor: "divider",
						// 內容區塊間距
						p: {
							xs: 2, // 手機版間距小一點
							sm: 3, // 平板以上間距大一點
							md: 4, // 電腦版間距更大
						},
						// 確保內容不會溢出
						overflow: "hidden",
						// 添加轉場效果
						transition: (theme) =>
							theme.transitions.create(["transform", "box-shadow"], {
								duration: theme.transitions.duration.shortest,
							}),
					}}
				>
					{/* 根據不同面板可能需要不同的內容容器樣式 */}
					<Box
						sx={{
							flexGrow: 1,
							overflow: "auto", // 內容過長時可滾動
							// 當內容可滾動時添加一些漸變效果
							background: (theme) =>
								`linear-gradient(${theme.palette.background.paper} 33%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), ${theme.palette.background.paper} 66%) 0 100%, radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0)) 0 100%`,
							backgroundRepeat: "no-repeat",
							backgroundSize: "100% 40px, 100% 40px, 100% 14px, 100% 14px",
							backgroundAttachment: "local, local, scroll, scroll",
							// 內容區域的間距
							px: { xs: 2, sm: 3 },
							py: 1,
						}}
					>
						{sidePanelContent}
					</Box>
				</ModalContainer>
			</Modal>
		</Box>
	);
};

export default MainContent;
