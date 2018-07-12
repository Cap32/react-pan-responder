export default {
	none: () => false,
	x: ({ dx, dy }) => Math.abs(dx) > Math.abs(dy),
	y: ({ dx, dy }) => Math.abs(dx) < Math.abs(dy),
};
