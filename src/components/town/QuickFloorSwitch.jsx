import React from "react";
import { Box, Button, Tooltip } from "@mui/material";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { useMap } from "../../contexts/MapContext";
import { floors } from "../../data/maps/mapDefinitions";

const QuickFloorSwitch = ({ onFloorSelect }) => {
	const { currentFloor, canChangeFloor } = useMap();

	const adjacentFloors = {
		up: floors.find((f) => f.id === currentFloor.id + 1),
		down: floors.find((f) => f.id === currentFloor.id - 1),
	};

	return (
		<Box
			sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}
		>
			<Tooltip
				title={
					!adjacentFloors.down
						? "已是最低層"
						: canChangeFloor(adjacentFloors.down.id)
						? `前往 ${adjacentFloors.down.name}`
						: "無法前往下一層"
				}
				arrow
			>
				<span>
					<Button
						variant="outlined"
						disabled={
							!adjacentFloors.down || !canChangeFloor(adjacentFloors.down.id)
						}
						onClick={() => onFloorSelect(adjacentFloors.down.id)}
						startIcon={<ArrowBigDown />}
						size="small"
					>
						下一層
					</Button>
				</span>
			</Tooltip>

			<Tooltip
				title={
					!adjacentFloors.up
						? "已是最高層"
						: canChangeFloor(adjacentFloors.up.id)
						? `前往 ${adjacentFloors.up.name}`
						: "需要先擊敗本層BOSS"
				}
				arrow
			>
				<span>
					<Button
						variant="outlined"
						disabled={
							!adjacentFloors.up || !canChangeFloor(adjacentFloors.up.id)
						}
						onClick={() => onFloorSelect(adjacentFloors.up.id)}
						startIcon={<ArrowBigUp />}
						size="small"
					>
						上一層
					</Button>
				</span>
			</Tooltip>
		</Box>
	);
};

export default QuickFloorSwitch;
