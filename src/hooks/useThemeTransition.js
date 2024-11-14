import { useCallback } from "react";

export const useThemeTransition = (isDarkMode, setIsDarkMode) => {
	const enableTransitions = () =>
		"startViewTransition" in document &&
		window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

	const toggleTheme = useCallback(
		async (event) => {
			const x = event.clientX;
			const y = event.clientY;

			if (!enableTransitions()) {
				setIsDarkMode((prev) => !prev);
				return;
			}

			const endRadius = Math.hypot(
				Math.max(x, window.innerWidth - x),
				Math.max(y, window.innerHeight - y)
			);

			const clipPath = {
				start: `circle(0px at ${x}px ${y}px)`,
				end: `circle(${endRadius}px at ${x}px ${y}px)`,
			};

			const transition = document.startViewTransition(async () => {
				setIsDarkMode((prev) => !prev);
			});

			await transition.ready;

			document.documentElement.animate(
				{
					clipPath: [clipPath.start, clipPath.end],
				},
				{
					duration: 300,
					easing: "ease-in",
					pseudoElement: "::view-transition-new(root)",
				}
			);
		},
		[isDarkMode, setIsDarkMode]
	);

	return toggleTheme;
};
