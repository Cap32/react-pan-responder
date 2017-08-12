
import passiveEvents from 'detect-passive-events';

export function isFunction(target) {
	return typeof target === 'function';
}

export function noop() {}

export const supportPassive = passiveEvents.hasSupport;

export function createEventOptions(
	capture = false,
	passive = false, // maybe, we should able to use `passive = true` sometimes
) {
	if (!supportPassive) { return capture; }
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
