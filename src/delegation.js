
import { createEventOptions, getElementPath } from './utils';

let hasWindowListener = false;
let grantedNode = null;
let prevTouchId = null;

let gestureState = {

	// Useful for debugging
	stateID: Math.random(),
};

const getDefaultGestureState = () => ({
	dx: 0,
	dy: 0,
	moveX: 0,
	moveY: 0,
	vx: 0,
	vy: 0,
	x0: 0,
	y0: 0,
	numberActiveTouches: 0,
});

// TODO: should add a polyfill
const listeners = new WeakMap();

let mostRecentTimeStamp = 0;

const makeGetTouchInfo = (ev) => (key) => {
	const { touches } = ev;
	if (!touches) { return ev[key]; }

	let touch;

	if (prevTouchId) {
		const { length } = touches;
		for (let i = 0; i < length; i++) {
			const current = touches[i];
			if (current && current.identifier === prevTouchId) {
				touch = current;
				break;
			}
		}
	}

	if (!touch) {
		touch = touches[0];
		prevTouchId = touch.identifier;
	}

	return touch[key];
};

const getNumberActiveTouches = (ev) => ev.touches ? ev.touches.length : 1;

const handleStart = (ev) => {
	const getTouch = makeGetTouchInfo(ev);
	const numberActiveTouches = getNumberActiveTouches(ev);

	if (grantedNode && listeners.has(grantedNode) && numberActiveTouches > 1) {
		gestureState.numberActiveTouches = numberActiveTouches;
		listeners.get(grantedNode).onStart(ev, gestureState);
		return;
	}

	gestureState = {
		...gestureState,
		...getDefaultGestureState(),
		x0: getTouch('pageX'),
		y0: getTouch('pageY'),
		numberActiveTouches,
	};

	if (!grantedNode) {
		for (const node of getElementPath(ev)) {
			if (listeners.has(node)) {
				const handler = listeners.get(node);
				const shouldStart = handler.onShouldStart(ev, gestureState);
				if (shouldStart) {
					grantedNode = node;
					handler.onGrant(ev, gestureState);
					break;
				}
			}
		}
	}

	if (grantedNode) {
		listeners.get(grantedNode).onStart(ev, gestureState);
	}
};

const handleMove = (ev) => {
	if (!gestureState.numberActiveTouches) { return; }

	// ev.timeStamp is not accurate
	const timeStamp = Date.now();
	const deltaTime = timeStamp - mostRecentTimeStamp;

	if (!deltaTime) { return; }

	const getTouch = makeGetTouchInfo(ev);
	const numberActiveTouches = getNumberActiveTouches(ev);
	const { x0, y0 } = gestureState;
	const moveX = getTouch('pageX');
	const moveY = getTouch('pageY');
	const nextDX = moveX - x0;
	const nextDY = moveY - y0;

	gestureState.moveX = moveX;
	gestureState.moveY = moveY;
	gestureState.vx = (nextDX - gestureState.dx) / deltaTime;
	gestureState.vy = (nextDY - gestureState.dy) / deltaTime;
	gestureState.dx = nextDX;
	gestureState.dy = nextDY;
	gestureState.numberActiveTouches = numberActiveTouches;

	mostRecentTimeStamp = timeStamp;

	if (!grantedNode) {
		for (const node of getElementPath(ev)) {
			if (listeners.has(node)) {
				const handler = listeners.get(node);
				const shouldMove = handler.onShouldMove(ev, gestureState);
				if (shouldMove) {
					grantedNode = node;
					handler.onGrant(ev, gestureState);
				}
			}
		}
	}

	if (grantedNode) {
		listeners.get(grantedNode).onMove(ev, gestureState);
	}
};

const handleEnd = (ev) => {
	if (!gestureState.numberActiveTouches) { return; }

	if (grantedNode && listeners.has(grantedNode)) {
		const handler = listeners.get(grantedNode);
		const numberActiveTouches = getNumberActiveTouches(ev);
		gestureState.numberActiveTouches = numberActiveTouches;
		handler.onEnd(ev, gestureState);

		if (!numberActiveTouches) {
			grantedNode = null;
			handler.onRelease(ev, gestureState);
			setTimeout(() => {
				gestureState = {
					...gestureState,
					...getDefaultGestureState(),
				};
			}, 0);
		}
	}
};

const ensureWindowListener = () => {
	if (hasWindowListener) { return; }

	hasWindowListener = true;
	window.addEventListener('mousedown', handleStart, createEventOptions(false));
	window.addEventListener('mousemove', handleMove, createEventOptions(false));
	window.addEventListener('mouseup', handleEnd, createEventOptions(false));
	window.addEventListener('touchstart', handleStart, createEventOptions(false));
	window.addEventListener('touchmove', handleMove, createEventOptions(false));
	window.addEventListener('touchend', handleEnd, createEventOptions(false));
};

export default {
	init() {
		ensureWindowListener();
	},

	addListener(domNode, handlers) {
		if (!domNode || listeners.has(domNode)) { return false; }

		listeners.set(domNode, {
			capture: false,
			...handlers,
		});

		return true;
	},

	removeListener(domNode) {
		listeners.delete(domNode);
	},
};
