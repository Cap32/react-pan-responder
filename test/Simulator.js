
import delay from 'delay';

export default class Simulator {
	static create(domNode) {
		return new Simulator(domNode);
	}

	constructor(domNode) {
		this._actions = [];
		this._domNode = domNode;
	}

	_perform(eventType, touches) {
		const event = document.createEvent('MouseEvents');
		touches = [].concat(touches);
		const {
			screenX = 0,
			screenY = 0,
			clientX = 0,
			clientY = 0,
			pageX = 0,
			pageY = 0,
		} = touches[0] || {};

		if (!touches.length) {
			touches.push({ screenX, screenY, clientX, clientY, pageX, pageY });
		}

		event.initMouseEvent(
			eventType,								// type
			true,											// canBubble
			true,											// cancelable
			window,										// view
			1,												// detail
			screenX || 0,							// screenX
			screenY || 0,							// screenY
			clientX || 0,							// clientX
			clientY || 0,							// clientY
			pageX || 0,								// pageX
			pageY || 0,								// pageY
			false,										// ctrlKey
			false,										// altKey
			false,										// shiftKey
			false,										// metaKey
			0,												// button
			null,											// relatedTarget
		);

		if (eventType.startsWith('touch')) {
			event.touches = touches;
			event.changedTouches = touches;
		}
		event.path = [window, this._domNode].filter(
			(d, index, arr) => arr.indexOf(d) === index
		);
		window.dispatchEvent(event);
	}

	_push(eventType, touches = []) {
		this._actions.push(() => this._perform(eventType, touches));
		return this;
	}

	mouseDown(touches) {
		return this._push('mousedown', touches);
	}

	mouseMove(touches) {
		return this._push('mousemove', touches);
	}

	mouseUp(touches) {
		return this._push('mouseup', touches);
	}

	touchStart(touches) {
		return this._push('touchstart', touches);
	}

	touchMove(touches) {
		return this._push('touchmove', touches);
	}

	touchEnd(touches) {
		return this._push('touchend', touches);
	}

	async exec() {
		for (const fn of this._actions) {
			fn();
			await delay(1000 / 60);
		}
	}
}
