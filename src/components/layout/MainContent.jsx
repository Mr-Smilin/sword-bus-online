/**
 * @file MainContent.jsx
 * @description 主要內容區域組件
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

const MainContent = ({ selectedPanel, isModalOpen, onCloseModal }) => {
	const { currentDrawerWidth } = useLayout();

	// 動畫容器
	const { style: emptyPanelStyle, AnimatedContainer: EmptyPanelContainer } =
		usePanelContainerAnimation({});
	const {
		style: characterCardStyle,
		AnimatedContainer: CharacterCardContainer,
	} = usePanelContainerAnimation({});
	const { style: mainPanelStyle, AnimatedContainer: MainPanelContainer } =
		usePanelContainerAnimation({
			deps: selectedPanel,
		});

	// 記憶化內容
	const emptyPanelContent = useMemo(() => <Box />, []);
	const characterCardContent = useMemo(() => <CharacterCard />, []);
	const currentPanelContent = useMemo(() => {
		const PanelComponent =
			PANEL_CONTENT[selectedPanel] || (() => <div>請選擇一個面板</div>);
		return <PanelComponent />;
	}, [selectedPanel]);

	return (
		<Box
			component="main"
			sx={{
				flexGrow: 1,
				p: 3,
				mt: 8,
				width: { md: `calc(100% - ${currentDrawerWidth}px)` },
				transition: (theme) =>
					theme.transitions.create("margin", {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.standard,
					}),
			}}
		>
			<Box
				sx={{
					display: "grid",
					gap: 2,
					gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
					gridTemplateRows: "auto",
				}}
			>
				<EmptyPanelContainer
					style={emptyPanelStyle}
					sx={{ gridColumn: { xs: "1", sm: "1 / 2" } }}
				>
					{emptyPanelContent}
				</EmptyPanelContainer>

				<CharacterCardContainer
					style={characterCardStyle}
					sx={{ gridColumn: { xs: "1", sm: "2 / 3" } }}
				>
					{characterCardContent}
				</CharacterCardContainer>

				{!isModalOpen && (
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
				open={isModalOpen && selectedPanel === "map"}
				onClose={onCloseModal}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Paper
					sx={{
						position: "relative",
						width: "80%",
						maxWidth: 800,
						maxHeight: "80vh",
						overflow: "auto",
						p: 4,
						outline: "none",
					}}
					onClick={(e) => e.stopPropagation()}
				>
					<IconButton
						onClick={onCloseModal}
						sx={{ position: "absolute", right: 8, top: 8 }}
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
