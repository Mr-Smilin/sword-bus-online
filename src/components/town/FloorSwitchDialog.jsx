import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Box,
	Button,
	Typography,
	Tooltip,
} from "@mui/material";
import { Building2 } from "lucide-react";
import { useMap } from "../../contexts/MapContext";
import { floors } from "../../data/maps/mapDefinitions";

const FloorSwitchDialog = ({ open, onClose, onFloorSelect }) => {
	const { currentFloor, canChangeFloor, defeatedBosses } = useMap();

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				elevation: 5,
				sx: {
					borderRadius: 2,
					maxHeight: "80vh",
				},
			}}
		>
			<DialogTitle>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Building2 size={20} />
					選擇目標樓層
				</Box>
			</DialogTitle>

			<DialogContent>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 2,
						mt: 1,
					}}
				>
					{floors.map((floor) => {
						const isCurrentFloor = currentFloor.id === floor.id;
						const canAccess = canChangeFloor(floor.id);
						const needBoss =
							floor.requiredBoss &&
							!defeatedBosses?.includes(floor.requiredBoss);

						return (
							<Tooltip
								key={floor.id}
								title={
									isCurrentFloor
										? "當前樓層"
										: needBoss
										? `需要先擊敗${currentFloor.name}的BOSS`
										: `選擇 ${floor.name}`
								}
								arrow
							>
								<Box>
									<Button
										fullWidth
										variant={isCurrentFloor ? "contained" : "outlined"}
										disabled={!canAccess || isCurrentFloor}
										onClick={() => onFloorSelect(floor.id)}
										sx={{
											justifyContent: "flex-start",
											px: 3,
											py: 1.5,
											borderColor: "divider",
											opacity: canAccess ? 1 : 0.6,
											transition: "all 0.2s",
											"&:hover:not(:disabled)": {
												transform: "translateY(-2px)",
												borderColor: "primary.main",
											},
										}}
									>
										<Box sx={{ width: "100%" }}>
											<Typography variant="body1">{floor.name}</Typography>
											<Typography variant="caption" color="text.secondary">
												{floor.description}
											</Typography>
										</Box>
									</Button>
								</Box>
							</Tooltip>
						);
					})}
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default FloorSwitchDialog;
