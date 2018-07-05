export default {
	none: () => false,
	x: ({ dx, dy }) => Math.abs(dx) > Math.abs(dy),
	y: ({ dx, dy }) => Math.abs(dx) < Math.abs(dy),
	up: ({ dx, dy }) => Math.abs(dx) < dy,
	down: ({ dx, dy }) => Math.abs(dx) < -dy,
	left: ({ dx, dy }) => Math.abs(dy) < dx,
	right: ({ dx, dy }) => Math.abs(dy) < -dx,
};
