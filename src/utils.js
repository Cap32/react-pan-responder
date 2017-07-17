
import passiveEvents from 'detect-passive-events';
import LockAxis from './LockAxis';

export const supportCSSTouchActionPan = (function () {
	try { return CSS.supports('touch-action', 'pan-x'); }
	catch (err) { return false; }
}());

export const passive = passiveEvents.hasSupport && supportCSSTouchActionPan;

export function createEventOptions(capture = false) {
	if (!passiveEvents.hasSupport) { return capture; }
	return { capture, passive };
}

export const TouchActions = {
	[LockAxis.none]: 'none',
	[LockAxis.x]: 'pan-y',
	[LockAxis.y]: 'pan-x',
};

export function getElementPath(event) {
	if (event.path) { return event.path; }

	const pathArr = [];
	let el = event.target;
	while (el) {
		pathArr.push(el);
		el = el.parentNode;
	}
	return pathArr;
}
