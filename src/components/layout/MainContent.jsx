/**
 * @file MainContent.jsx
 * @description 主要內容區域組件，包含主要畫面、角色資訊和側邊欄面板
 */
import React, { useMemo } from "react";
import { Box, Paper, IconButton, Modal } from "@mui/material";
import { Close as CloseIcon, Opacity } from "@mui/icons-material";
import { useLayout } from "../../contexts";
import { usePanelContainerAnimation } from "../../utils/animations";
import { useMap } from "../../contexts/MapContext";
import { CharacterCard, CharacterPanel } from "../character";
import { MainView } from "../main-view";
import HelpPanel from "../panels/HelpPanel";
import MapPanel from "../panels/MapPanel";
import InventoryPanel from "../inventory/InventoryPanel";
import TravelProgress from "../map/TravelProgress";

/**
 * 面板內容映射表
 * 定義每個面板ID對應的組件
 */
const PANEL_CONTENT = {
	character: CharacterPanel,
	inventory: InventoryPanel,
	skills: () => <div>技能列表面板</div>,
	map: MapPanel,
	help: HelpPanel,
};

/**
 * 主內容區域組件
 * 負責整合和顯示所有主要內容面板
 */
const MainContent = () => {
	const {
		currentPanel,
		mainContentStyles,
		isModalOpen,
		isInventoryExpanded,
		layoutActions: { closeModal },
		isModalPanel,
	} = useLayout();

	// 從 Map Context 獲取移動相關狀態
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

	// 記憶化主要內容組件，避免不必要的重渲染
	const mainViewContent = useMemo(() => <MainView />, []);
	const characterInfoContent = useMemo(() => <CharacterCard />, []);
	const sidePanelContent = useMemo(() => {
		const PanelComponent =
			PANEL_CONTENT[currentPanel] || (() => <div>請選擇一個面板</div>);
		return <PanelComponent />;
	}, [currentPanel]);

	/**
	 * 計算角色資訊區域的樣式
	 * 包含展開/收合背包時的動畫效果
	 */
	const characterInfoStyles = useMemo(
		() => ({
			// 基礎樣式
			position: "relative",
			width: "100%",
			mb: 2,
			minHeight: 0,
			// 展開/收合動畫
			transform:
				isInventoryExpanded && currentPanel === "inventory"
					? "translateX(102%)"
					: "translateX(0)",
			transition: (theme) =>
				theme.transitions.create(["transform", "opacity"], {
					duration: theme.transitions.duration.standard,
					easing: theme.transitions.easing.easeInOut,
				}),
			// 其他樣式
			bgcolor: "transparent",
			borderRadius: 1,
			overflow: "hidden",
			flex: "0 0 auto", // 不要伸縮，使用自身高度
			height: {
				xs: "auto",
				sm: "calc(50vh - 44px)", // 保持原本的最大高度限制
			},
		}),
		[isInventoryExpanded, currentPanel]
	);

	// 側邊面板的樣式
	const sidePanelStyles = useMemo(
		() => ({
			// 基礎樣式
			position: "absolute", // 永遠使用絕對定位
			width: "100%",
			maxHeight: {
				xs: "auto",
				sm: "calc(45vh - 44px)", // 保持原本的最大高度限制
			},
			// 使用 transform 來控制位置
			transform: {
				xs: "translateY(0)",
				sm: "translateY(0)",
			},
			// 動畫過渡
			transition: (theme) =>
				theme.transitions.create(["transform", "height"], {
					duration: theme.transitions.duration.standard, // 300ms
					easing: theme.transitions.easing.easeInOut,
				}),
			// 其他樣式
			bgcolor: "background.paper",
			borderRadius: 1,
			overflow: "hidden",
			...(isInventoryExpanded &&
				currentPanel === "inventory" && {
					maxHeight: {
						xs: "auto",
						sm: "calc(70vh-44px)",
					},
					transform: {
						xs: "translateY(0)",
						sm: "translateY(calc(44px - 50vh))",
					},
				}),
		}),
		[isInventoryExpanded, currentPanel]
	);

	return (
		<Box component="main" sx={mainContentStyles.main}>
			{/* 移動進度條 */}
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
						height: "calc(100vh - 180px)", // 減去 header 的高度
						overflow: "hidden", // 防止內容溢出
						display: "flex", // 使用 flex 布局
						flexDirection: "column",
					}}
				>
					{mainViewContent}
				</MainViewContainer>

				<Box
					sx={{
						// Grid 相關設定
						gridColumn: {
							xs: "1", // 手機版占滿寬度
							sm: "2 / 3", // 平板以上在右側
						},
						gridRow: {
							xs: "auto", // 手機版自動高度
							sm: "1 / 3", // 平板以上占滿高度
						},
						// 定位與布局
						position: "relative", // 作為絕對定位的參考點
						display: "flex", // 使用 flex 布局
						flexDirection: "column", // 垂直排列子元素
						// 尺寸相關
						height: "100%", // 占滿容器高度
						minHeight: 0, // 確保 flex 容器可以正確 scroll
						// 過渡動畫
						transition: (theme) =>
							theme.transitions.create(["height", "transform"], {
								duration: theme.transitions.duration.standard,
								easing: theme.transitions.easing.easeInOut,
							}),
						// 其他樣式
						backgroundColor: "transparent", // 透明背景，讓子元素背景色生效
						zIndex: 0, // 基礎層級
						// 確保內容不會溢出
						// overflow: "hidden",
					}}
				>
					{/* 角色資訊/職業面板 */}
					<CharacterInfoContainer
						style={characterInfoStyle}
						sx={characterInfoStyles}
					>
						{characterInfoContent}
					</CharacterInfoContainer>

					{/* 側邊欄面板 */}
					{!isModalPanel(currentPanel) && (
						<SidePanelContainer style={sidePanelStyle} sx={sidePanelStyles}>
							{sidePanelContent}
						</SidePanelContainer>
					)}
				</Box>
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
