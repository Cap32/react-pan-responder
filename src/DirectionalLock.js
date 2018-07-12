export default {
	both: true,
	nont: false,
	x: ({ dx, dy }) => Math.abs(dx) < Math.abs(dy),
	y: ({ dx, dy }) => Math.abs(dx) > Math.abs(dy),
};
