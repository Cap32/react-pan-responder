
import { createEventOptions } from './utils';

let hasWindowListener = false;
let grantedNode = null;

// TODO: should add a polyfill
const listeners = new WeakMap();

const handleStart = (ev) => {
	if (!grantedNode) {
		for (const node of ev.path) {
			if (listeners.has(node)) {
				const handler = listeners.get(node);
				const shouldStart = handler.onShouldStart(ev);
				if (shouldStart) {
					grantedNode = node;
					handler.onGrant(ev);
					break;
				}
			}
		}
	}

	if (grantedNode) {
		listeners.get(grantedNode).onStart(ev);
	}
};

const handleMove = (ev) => {
	if (!grantedNode) {
		for (const node of ev.path) {
			if (listeners.has(node)) {
				const handler = listeners.get(node);
				handler.onBeforeMove(ev);
				const shouldMove = handler.onShouldMove(ev);
				if (shouldMove) {
					grantedNode = node;
					handler.onGrant(ev);
				}
			}
		}
	}
	else if (listeners.has(grantedNode)) {
		listeners.get(grantedNode).onBeforeMove(ev);
	}

	if (grantedNode) {
		listeners.get(grantedNode).onMove(ev);
	}
};

const handleEnd = (ev) => {
	if (grantedNode && listeners.has(grantedNode)) {
		const handler = listeners.get(grantedNode);
		grantedNode = null;
		handler.onEnd(ev);
		handler.onRelease(ev);
	}
};

const ensureWindowListener = () => {
	if (hasWindowListener) { return; }

	hasWindowListener = true;
	// window.addEventListener('mousedown', handleStart, createEventOptions(false));
	// window.addEventListener('mousemove', handleMove, createEventOptions(false));
	// window.addEventListener('mouseup', handleEnd, createEventOptions(false));
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
};
