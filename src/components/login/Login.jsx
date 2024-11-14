import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import ThemeToggle from "../ThemeToggle";

const Login = ({ onLogin, isDarkMode, onToggleTheme }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (username === "root" && password === "1234") {
			onLogin(true);
			setError("");
		} else {
			setError("Invalid username or password");
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<Box sx={{ position: "absolute", top: 16, right: 16 }}>
				<ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
			</Box>
			<Paper
				elevation={3}
				sx={{
					p: 4,
					width: "100%",
					maxWidth: 400,
				}}
			>
				<Typography variant="h4" component="h1" gutterBottom align="center">
					Sword Art Offline
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						margin="normal"
						label="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<TextField
						fullWidth
						margin="normal"
						label="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error && (
						<Typography color="error" align="center" sx={{ mt: 2 }}>
							{error}
						</Typography>
					)}
					<Button fullWidth type="submit" variant="contained" sx={{ mt: 3 }}>
						Login
					</Button>
				</form>
			</Paper>
		</Box>
	);
};

export default Login;
