import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
} from "@mui/material";
import { ArrowRight } from "lucide-react";

const TravelConfirmDialog = ({
	open,
	fromArea,
	toArea,
	estimatedTime,
	onConfirm,
	onCancel,
}) => {
	if (!fromArea || !toArea) return null;

	const formatTime = (seconds) => {
		if (seconds < 60) {
			return `${Math.ceil(seconds)}秒`;
		}
		return `${Math.ceil(seconds / 60)}分鐘`;
	};

	return (
		<Dialog
			open={open}
			onClose={onCancel}
			PaperProps={{
				sx: { minWidth: 300 },
			}}
		>
			<DialogTitle>確認移動</DialogTitle>
			<DialogContent>
				{/* 移動資訊 */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						mb: 2,
					}}
				>
					<Typography variant="subtitle1">{fromArea.name}</Typography>
					<ArrowRight />
					<Typography variant="subtitle1">{toArea.name}</Typography>
				</Box>

				{/* 預估時間 */}
				<Typography variant="body2" color="text.secondary">
					預估移動時間：{formatTime(estimatedTime)}
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel}>取消</Button>
				<Button onClick={onConfirm} variant="contained">
					移動
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default TravelConfirmDialog;
