const list = [];

const getChangedTouchId = (ev) =>
	ev.changedTouches ? ev.changedTouches[0].identifier : 0;

export default {
	push(ev) {
		list.push(getChangedTouchId(ev));
	},
	pull(ev) {
		if (ev.touches && !ev.touches.length) {
			this.clear();
			return;
		}

		const touchId = getChangedTouchId(ev);
		const index = list.indexOf(touchId);
		if (index > -1) {
			list.splice(index, 1);
		}
	},
	clear() {
		list.length = 0;
	},
	getCount() {
		return list.length;
	},
	getTouch(ev) {
		const { touches } = ev;
		if (!touches) return ev;
		if (!list.length) return ev.touches[0];
		const { length } = touches;
		for (let i = 0; i < length; i++) {
			const current = touches[i];
			if (current && current.identifier === list[0]) {
				return current;
			}
		}
	},
};
