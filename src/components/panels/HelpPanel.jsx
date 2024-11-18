/**
 * @file components/panels/HelpPanel.jsx
 * @description 幫助面板組件，用於展示遊戲指南
 */
import React from "react";
import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { helpContent } from "../../constants/helpContent";

const HelpPanel = () => {
	return (
		<Box
			sx={{
				p: 3,
				// 標題樣式
				"& h1": {
					fontSize: "1.75rem",
					fontWeight: 600,
					mb: 3,
					color: "primary.main",
				},
				// 子標題樣式
				"& h2": {
					fontSize: "1.25rem",
					fontWeight: 500,
					mt: 3,
					mb: 2,
					color: "text.primary",
					borderBottom: 1,
					borderColor: "divider",
					pb: 1,
				},
				// 段落樣式
				"& p": {
					mb: 2,
					color: "text.primary",
				},
				// 列表樣式
				"& ul": {
					pl: 3,
					mb: 2,
				},
				"& li": {
					mb: 1,
					color: "text.secondary",
					"& strong": {
						color: "text.primary",
					},
				},
				// 強調文字樣式
				"& strong": {
					fontWeight: 600,
					color: "primary.main",
				},
				// 整體區塊樣式
				overflow: "auto",
				height: "100%",
			}}
		>
			<ReactMarkdown remarkPlugins={[remarkGfm]}>{helpContent}</ReactMarkdown>
		</Box>
	);
};

export default HelpPanel;
