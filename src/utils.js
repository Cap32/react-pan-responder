
import passiveEvents from 'detect-passive-events';

export const supportCSSTouchActionPan = (function () {
	try { return CSS.supports('touch-action', 'pan-x'); }
	catch (err) { return false; }
}());

export const passive = passiveEvents.hasSupport && supportCSSTouchActionPan;

export function createEventOptions(capture = false) {
	if (!passiveEvents.hasSupport) { return capture; }
	return { capture, passive };
}

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
