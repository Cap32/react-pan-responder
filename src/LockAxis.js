
// FIXME: doesn't work if browser supports css `touch-action`

import { supportCSSTouchActionPan } from './utils';

let locking = null;

export const AxisTypes = {
	none: 'none',
	x: 'x',
	y: 'y',
};

export const TouchActions = {
	[AxisTypes.none]: 'none',
	[AxisTypes.x]: 'pan-y',
	[AxisTypes.y]: 'pan-x',
};

export default {
	grant(domNode, lockAxis) {
		if (domNode && supportCSSTouchActionPan) {

			// NOTE: not use `setState` or `forceUpdate`, because:
			// 1. it's slow
			// 2. `component` may not support `style` prop
			domNode.style.touchAction = TouchActions[lockAxis];
		}
	},
	release(domNode) {
		locking = null;
		if (domNode && supportCSSTouchActionPan) {
			domNode.style.touchAction = null;
		}
	},
	move(domNode, lockAxis, ev, gestureState) {
		if (domNode && !supportCSSTouchActionPan) {
			if (lockAxis === AxisTypes.none) {
				ev.preventDefault();
			}
			else {
				if (!locking) {
					const absDX = Math.abs(gestureState.dx);
					const absDY = Math.abs(gestureState.dy);
					locking = absDX > absDY ? AxisTypes.x : AxisTypes.y;
				}

				if (locking === lockAxis) { ev.preventDefault(); }
			}
		}
	},
};
