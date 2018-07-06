import delay from 'delay';
import { getEventNodes } from '../../src/utils';

export default class Simulator {
	static create(domNode) {
		return new Simulator(domNode);
	}

	constructor(domNode) {
		this._actions = [];
		this._touches = [];
		this._changedTouches = [];
		this._domNode = domNode;
	}

	get _prevTouchIdentifier() {
		return (this._touches[0] || {}).identifier || 0;
	}

	_createTouch(data, identifier) {
		return {
			...this._ensureData(data),
			identifier,
		};
	}

	_ensureData(data) {
		return {
			screenX: 0,
			screenY: 0,
			clientX: 0,
			clientY: 0,
			pageX: 0,
			pageY: 0,
			...data,
		};
	}

	_pushTouch(touch) {
		const index = this._touches.findIndex(
			(t) => t.identifier === touch.identifier,
		);

		if (index > -1) {
			this._touches.splice(index, 1, touch);
		}
		else {
			this._touches.push(touch);
		}
		this._changedTouches = [touch];
	}

	_dropTouch(touch) {
		const index = this._touches.findIndex(
			(t) => t.identifier === touch.identifier,
		);
		if (index > -1) {
			this._touches.splice(index, 1);
		}
		this._changedTouches = [];
	}

	_perform(eventType, data) {
		const event = document.createEvent('MouseEvents');
		event.initMouseEvent(
			eventType, // type
			true, // canBubble
			true, // cancelable
			window, // view
			1, // detail
			data.screenX, // screenX
			data.screenY, // screenY
			data.clientX, // clientX
			data.clientY, // clientY
			data.pageX, // pageX
			data.pageY, // pageY
			// false, // ctrlKey
			// false, // altKey
			// false, // shiftKey
			// false, // metaKey
			// 0, // button
			// null, // relatedTarget
		);

		if (eventType.startsWith('touch')) {
			event.touches = this._touches;
			event.changedTouches = this._changedTouches;
		}
		event.path = [...getEventNodes({ target: this._domNode }), window].filter(
			(d, index, arr) => arr.indexOf(d) === index,
		);

		window.dispatchEvent(event);
	}

	_push(action) {
		this._actions.push(action);
		return this;
	}

	_pushMouseAction(eventType, data) {
		return this._push(() => this._perform(eventType, this._ensureData(data)));
	}

	mouseDown(data) {
		return this._pushMouseAction('mousedown', data);
	}

	mouseMove(data) {
		return this._pushMouseAction('mousemove', data);
	}

	mouseUp(data) {
		return this._pushMouseAction('mouseup', data);
	}

	touchStart(data, identifier) {
		return this._push(() => {
			const touch = this._createTouch(data, identifier || Math.random());
			this._pushTouch(touch);
			this._perform('touchstart', touch);
		});
	}

	touchMove(data, identifier) {
		return this._push(() => {
			const touchId = identifier || this._prevTouchIdentifier;
			const touch = this._createTouch(data, touchId);
			this._pushTouch(touch);
			this._perform('touchmove', touch);
		});
	}

	touchEnd(data, identifier) {
		return this._push(() => {
			const touchId = identifier || this._prevTouchIdentifier;
			const touch = this._createTouch(data, touchId);
			this._pushTouch(touch);
			this._perform('touchend', touch);
			this._dropTouch(touch);
		});
	}

	async exec() {
		for (const fn of this._actions) {
			fn();
			await delay(1000 / 60);
		}
	}
}
