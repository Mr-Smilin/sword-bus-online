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
		isModalOpen,
		mainContentStyles,
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
				<EmptyPanelContainer
					style={emptyPanelStyle}
					sx={{ gridColumn: { xs: "1", sm: "1 / 2" }, minHeight: "200px" }}
				>
					{emptyPanelContent}
				</EmptyPanelContainer>

				<CharacterCardContainer
					style={characterCardStyle}
					sx={{ gridColumn: { xs: "1", sm: "2 / 3" } }}
				>
					{characterCardContent}
				</CharacterCardContainer>

				{!isModalOpen && !isModalPanel(currentPanel) && (
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

			<Modal
				open={isModalOpen && isModalPanel(currentPanel)}
				onClose={closeModal}
				sx={mainContentStyles.modal}
			>
				<Paper onClick={(e) => e.stopPropagation()}>
					<IconButton
						onClick={closeModal}
						sx={{
							position: "absolute",
							right: 8,
							top: 8,
							bgcolor: "background.paper",
							"&:hover": {
								bgcolor: "action.hover",
							},
						}}
					>
						<CloseIcon />
					</IconButton>
					{currentPanelContent}
				</Paper>
			</Modal>
		</Box>
	);
};

export default MainContent;
