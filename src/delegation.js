
import grantedTouchIds from './grantedTouchIds';
import { createEventOptions, getElementPath } from './utils';
import WeakMap from './WeakMapPolyfill';

const eventOptions = createEventOptions(true);

let isTouch = false;
let hasWindowListener = false;
let grantedNode = null;

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

const listeners = new WeakMap();

let mostRecentTimeStamp = 0;

const makeSetGrantedNode = (action) => (ev) => {
	const findAndExec = (arr, methodName) => {
		if (!grantedNode) {
			for (const node of arr) {
				if (listeners.has(node)) {
					const handler = listeners.get(node);
					if (handler[methodName](ev, gestureState)) {
						grantedNode = node;
						handler.onGrant(ev, gestureState);
						break;
					}
				}
			}
		}
	};

	const elementPath = getElementPath(ev);
	findAndExec(elementPath, `onShould${action}Capture`);
	findAndExec(elementPath.reverse(), `onShould${action}`);
	return grantedNode;
};

const setGrantedNodeOnStart = makeSetGrantedNode('Start');
const setGrantedNodeOnMove = makeSetGrantedNode('Move');

const makeGetTouchInfo = (ev) => {
	const touch = grantedTouchIds.getTouch(ev);
	return (key) => touch[key];
};

const getNumberActiveTouches = (ev) =>
	ev.touches ? ev.touches.length : (ev.type === 'mouseup' ? 0 : 1)
;

const handleStart = (ev) => {
	isTouch = ev.type === 'touchstart';

	if (!isTouch) {
		window.addEventListener('mousemove', handleMove, eventOptions);
		window.addEventListener('mouseup', handleEnd, eventOptions);
	}

	const getTouch = makeGetTouchInfo(ev);
	const numberActiveTouches = getNumberActiveTouches(ev);

	if (grantedNode && listeners.has(grantedNode) && numberActiveTouches > 1) {
		gestureState.numberActiveTouches = numberActiveTouches;

		const elementPath = getElementPath(ev);

		if (elementPath.indexOf(grantedNode) > -1) {
			grantedTouchIds.push(ev);
			listeners.get(grantedNode).onStart(ev, gestureState);
		}
		return;
	}

	gestureState = {
		...gestureState,
		...getDefaultGestureState(),
		x0: getTouch('pageX'),
		y0: getTouch('pageY'),
		numberActiveTouches,
	};

	grantedNode = setGrantedNodeOnStart(ev);

	if (grantedNode) {
		grantedTouchIds.push(ev);
		listeners.get(grantedNode).onStart(ev, gestureState);
	}
};

const handleMove = (ev) => {
	if (isTouch && ev.type !== 'touchmove') { return; }
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

	const hasGranted = !!grantedNode;

	if (!hasGranted) {
		grantedNode = setGrantedNodeOnMove(ev);
		if (grantedNode) { grantedTouchIds.push(ev); }
	}

	if (grantedNode) { listeners.get(grantedNode).onMove(ev, gestureState); }
};

const handleEnd = (ev) => {
	if (!isTouch) {
		window.removeEventListener('mousemove', handleMove, eventOptions);
		window.removeEventListener('mouseup', handleEnd, eventOptions);
	}

	if (isTouch && ev.type !== 'touchend') { return; }
	if (!gestureState.numberActiveTouches) { return; }

	let handler;
	const numberActiveTouches = getNumberActiveTouches(ev);

	if (grantedNode && listeners.has(grantedNode)) {
		grantedTouchIds.pull(ev);
		handler = listeners.get(grantedNode);
		gestureState.numberActiveTouches = numberActiveTouches;
		handler.onEnd(ev, gestureState);
	}

	if (!numberActiveTouches) { isTouch = false; }

	if (!grantedTouchIds.getCount()) {
		grantedNode = null;
		handler && handler.onRelease(ev, gestureState);
		setTimeout(() => {
			gestureState = {
				...gestureState,
				...getDefaultGestureState(),
			};
		}, 0);
	}
};

const ensureWindowListener = () => {
	hasWindowListener = true;
	window.addEventListener('mousedown', handleStart, eventOptions);
	window.addEventListener('touchstart', handleStart, eventOptions);
	window.addEventListener('touchmove', handleMove, eventOptions);
	window.addEventListener('touchend', handleEnd, eventOptions);
	window.addEventListener('touchcancel', handleEnd, eventOptions);
};

export default {
	init() {
		if (!hasWindowListener) { ensureWindowListener(); }
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

	// Useful for testing
	destroy() {
		hasWindowListener = false;
		isTouch = false;
		grantedNode = null;
		gestureState = { stateID: Math.random() };

		window.removeEventListener('mousedown', handleStart, eventOptions);
		window.removeEventListener('mousemove', handleMove, eventOptions);
		window.removeEventListener('mouseup', handleEnd, eventOptions);
		window.removeEventListener('touchstart', handleStart, eventOptions);
		window.removeEventListener('touchmove', handleMove, eventOptions);
		window.removeEventListener('touchend', handleEnd, eventOptions);
		window.removeEventListener('touchcancel', handleEnd, eventOptions);
	},
};
