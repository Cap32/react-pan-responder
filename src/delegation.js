import grantedTouchIds from './grantedTouchIds';
import { createEventOptions, getEventNodes, includes } from './utils';
import WeakMap from './WeakMapPolyfill';

const eventOptions = createEventOptions();

let lastStartTimeStamp = 0;
let lastEventType;
let lastMoveTimeStamp = 0;
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

const makeSetGrantedNode = (action) => (ev) => {
	const tempGrantedNodes = [];
	const findAndExec = (arr, methodName) => {
		for (const node of arr) {
			if (grantedNode !== node && listeners.has(node)) {
				const handler = listeners.get(node);
				if (handler[methodName](ev, gestureState)) {
					if (!includes(tempGrantedNodes, node)) {
						if (!grantedNode) grantedNode = node;
						else tempGrantedNodes.push(node);
						handler.onGrant(ev, gestureState);
					}
				}
			}
		}
	};

	const nodes = getEventNodes(ev);
	findAndExec(nodes.reverse(), `onShould${action}Capture`);
	findAndExec(nodes.reverse(), `onShould${action}`);

	if (tempGrantedNodes.length) {
		tempGrantedNodes.forEach((node) => {
			const grantedHandler = listeners.get(grantedNode);
			const handler = listeners.get(node);
			const shouldTerminate = grantedHandler.onRequestTerminate(
				ev,
				gestureState,
			);
			if (shouldTerminate) {
				grantedHandler.onTerminate(ev, gestureState);
				grantedNode = node;
			}
			else {
				handler.onReject(ev, gestureState);
			}
		});
	}

	return grantedNode;
};

const setGrantedNodeOnStart = makeSetGrantedNode('Start');
const setGrantedNodeOnMove = makeSetGrantedNode('Move');

const makeGetTouchInfo = (ev) => {
	const touch = grantedTouchIds.getTouch(ev);
	return (key) => touch[key];
};

const getNumberActiveTouches = (ev) =>
	ev.touches ? ev.touches.length : ev.type === 'mouseup' ? 0 : 1;

const handleStart = (ev) => {
	const { type, timeStamp = 0 } = ev;
	const lastDeltaTime = timeStamp - lastStartTimeStamp;
	const lastTypeIsTouch = lastEventType === 'touchstart';

	isTouch = type === 'touchstart';
	lastStartTimeStamp = timeStamp;
	lastEventType = type;

	if (lastDeltaTime < 300 && type === 'mousedown' && lastTypeIsTouch) return;

	if (!isTouch) {
		window.addEventListener('mousemove', handleMove, eventOptions);
		window.addEventListener('mouseup', handleEnd, eventOptions);
	}

	const getTouch = makeGetTouchInfo(ev);
	const numberActiveTouches = getNumberActiveTouches(ev);

	if (grantedNode && listeners.has(grantedNode) && numberActiveTouches > 1) {
		gestureState.numberActiveTouches = numberActiveTouches;

		const nodes = getEventNodes(ev);

		if (includes(nodes, grantedNode)) {
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
	if (isTouch && ev.type !== 'touchmove') return;
	if (!gestureState.numberActiveTouches) return;

	// ev.timeStamp is not accurate
	const timeStamp = Date.now();
	const deltaTime = timeStamp - lastMoveTimeStamp;

	if (!deltaTime) return;

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

	lastMoveTimeStamp = timeStamp;

	const hasGranted = !!grantedNode;

	grantedNode = setGrantedNodeOnMove(ev);

	if (grantedNode) {
		if (!hasGranted) grantedTouchIds.push(ev);
		listeners.get(grantedNode).onMove(ev, gestureState);
	}
};

const handleEnd = (ev) => {
	if (!isTouch) {
		window.removeEventListener('mousemove', handleMove, eventOptions);
		window.removeEventListener('mouseup', handleEnd, eventOptions);
	}

	if (isTouch && ev.type !== 'touchend') return;
	if (!gestureState.numberActiveTouches) return;

	let handler;
	const numberActiveTouches = getNumberActiveTouches(ev);

	if (grantedNode && listeners.has(grantedNode)) {
		grantedTouchIds.pull(ev);
		handler = listeners.get(grantedNode);
		gestureState.numberActiveTouches = numberActiveTouches;
		handler.onEnd(ev, gestureState);
	}

	if (!numberActiveTouches) {
		isTouch = false;
	}

	if (!grantedTouchIds.getCount()) {
		grantedNode = null;
		handler && handler.onRelease(ev, gestureState);

		gestureState = { ...gestureState, ...getDefaultGestureState() };
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
	addListener(instance, handlers) {
		if (!hasWindowListener) ensureWindowListener();
		const { dom } = instance;
		if (!dom || listeners.has(dom)) return () => {};
		listeners.set(dom, handlers);
		return () => listeners.delete(dom);
	},

	// Useful for testing
	destroy() {
		hasWindowListener = false;
		lastStartTimeStamp = 0;
		lastMoveTimeStamp = 0;
		isTouch = false;
		grantedNode = null;
		gestureState = { stateID: Math.random() };
		grantedTouchIds.clear();

		window.removeEventListener('mousedown', handleStart, eventOptions);
		window.removeEventListener('mousemove', handleMove, eventOptions);
		window.removeEventListener('mouseup', handleEnd, eventOptions);
		window.removeEventListener('touchstart', handleStart, eventOptions);
		window.removeEventListener('touchmove', handleMove, eventOptions);
		window.removeEventListener('touchend', handleEnd, eventOptions);
		window.removeEventListener('touchcancel', handleEnd, eventOptions);
	},
};
