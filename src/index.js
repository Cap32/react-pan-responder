
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { noop, returnsTrue } from 'empty-functions';
import LockAxis from './LockAxis';
import {
	isFunction, supportCSSTouchActionPan, createEventOptions, passive,
	TouchActions,
} from './utils';

let isTouchable;

const makeGetTouchInfo = (ev) => (key) =>
	isTouchable ? ev.touches[0][key] : ev[key]
;

const getDefaultGestureState = (options) => ({
	x0: 0,
	y0: 0,
	moveX: 0,
	moveY: 0,
	dx: 0,
	dy: 0,
	...options,
});

export default class PanResponderView extends Component {
	static propTypes = {
		style: PropTypes.object,
		component: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.func,
		]),
		lockAxis: PropTypes.oneOf(Object.keys(LockAxis)),
		capture: PropTypes.bool,
		withRef: PropTypes.bool,

		onStartShouldSetPanResponder: PropTypes.func,
		onMoveShouldSetPanResponder: PropTypes.func,
		onPanResponderGrant: PropTypes.func,
		onPanResponderMove: PropTypes.func,
		onPanResponderRelease: PropTypes.func,
		onShouldStopPropagation: PropTypes.func,

		onTouchStart: PropTypes.func, // react original event
		onMouseDown: PropTypes.func, // react original event
	};

	static defaultProps = {
		style: {},
		component: 'div',
		onPanResponderGrant: noop,
		onPanResponderMove: noop,
		onPanResponderRelease: noop,
		onStartShouldSetPanResponder: returnsTrue,
		onMoveShouldSetPanResponder: returnsTrue,
		onShouldStopPropagation: returnsTrue,
		lockAxis: LockAxis.none,
		capture: false,
		withRef: false,
	};

	static LockAxis = LockAxis;

	componentWillMount() {
		this.state = {
			style: this._setStyle(this.props),
		};
	}

	componentWillReceiveProps(nextProps) {
		const { lockAxis, style } = this.props;
		if (nextProps.lockAxis !== lockAxis || nextProps.style !== style) {
			this.setState({ style: this._setStyle(nextProps) });
		}
	}

	componentWillUnmount() {
		this._removeMoveListeners();
	}

	_setStyle({ lockAxis, style }) {
		if (!supportCSSTouchActionPan) {
			return style;
		}

		return {
			...style,
			touchAction: TouchActions[lockAxis],
		};
	}

	_refs = this.props.withRef ? { ref: (c) => (this.ref = c) } : {};

	getInstance() {
		return this.ref;
	}

	gestureState = {};

	_capture = this.props.capture;
	_isResponder = false;
	_mostRecentTimeStamp = 0;
	_lockingAxis = '';

	_handleShouldBlock = (ev, gestureState) => {
		// !passive && ev.preventDefault();
		if (this.props.onShouldStopPropagation(ev, gestureState)) {
			ev.stopPropagation();
			if (isFunction(ev.stopImmediatePropagation)) {
				ev.stopImmediatePropagation();
			}
		}
	};

	_handleStart(ev) {
		const {
			onStartShouldSetPanResponder,
			onPanResponderGrant,
		} = this.props;

		const getTouch = makeGetTouchInfo(ev);
		this.gestureState = getDefaultGestureState({
			x0: getTouch('pageX'),
			y0: getTouch('pageY'),
		});

		if (!this._isResponder) {
			this._isResponder = onStartShouldSetPanResponder(ev, this.gestureState);
		}

		if (!this._isResponder) { return; }

		this._lockingAxis = '';

		onPanResponderGrant(ev, this.gestureState);
		this._handleShouldBlock(ev, this.gestureState);

		const options = createEventOptions(this._capture);

		window.addEventListener('touchmove', this._handleTouchMove, options);
		window.addEventListener('mousemove', this._handleMouseMove, options);
		window.addEventListener('touchend', this._handleTouchEnd, options);
		window.addEventListener('mouseup', this._handleMouseUp, options);
	}

	_handleMove(ev) {
		if (!this._isResponder) { return; }

		const {
			props: {
				onPanResponderMove, onMoveShouldSetPanResponder, lockAxis,
			},
			gestureState,
		} = this;

		// TODO: should bind to `touch` client, not `event`.
		const { timeStamp } = ev;

		const getTouch = makeGetTouchInfo(ev);
		const { x0, y0 } = gestureState;
		const moveX = getTouch('pageX');
		const moveY = getTouch('pageY');
		const deltaTime = timeStamp - this._mostRecentTimeStamp;

		const nextDX = moveX - x0;
		const nextDY = moveY - y0;

		gestureState.moveX = moveX;
		gestureState.moveY = moveY;
		gestureState.vx = (nextDX - gestureState.dx) / deltaTime;
		gestureState.vy = (nextDY - gestureState.dy) / deltaTime;
		gestureState.dx = nextDX;
		gestureState.dy = nextDY;

		this._mostRecentTimeStamp = timeStamp;
		this._isResponder = onMoveShouldSetPanResponder(ev, gestureState);

		if (lockAxis === LockAxis.none) {
			if (!passive) { ev.preventDefault(); }
		}
		else {
			if (!this._lockingAxis) {
				const absDX = Math.abs(nextDX);
				const absDY = Math.abs(nextDY);
				this._lockingAxis = absDX > absDY ? LockAxis.x : LockAxis.y;
			}

			if (this._lockingAxis === lockAxis) {
				if (!passive) { ev.preventDefault(); }
			}
			else {
				this._removeMoveListeners();
				return;
			}
		}

		if (!this._isResponder) {
			this._removeMoveListeners();
			return;
		}

		onPanResponderMove(ev, gestureState);
		this._handleShouldBlock(ev, gestureState);
	}

	_handleRelease(ev) {
		this._removeMoveListeners();

		this._lockingAxis = '';

		if (!this._isResponder) { return; }

		const { onPanResponderRelease } = this.props;

		this._isResponder = false;
		onPanResponderRelease(ev, this.gestureState);
		this.gestureState = {};
	}

	_handleTouchStart = (ev) => {
		const { onTouchStart } = this.props;
		isTouchable = true;
		this._handleStart(ev);
		onTouchStart && onTouchStart(ev);
	};

	_handleMouseDown = (ev) => {
		const { onMouseDown } = this.props;
		isTouchable || this._handleStart(ev);
		onMouseDown && onMouseDown(ev);
	};

	_handleTouchMove = (ev) => {
		isTouchable = true;
		this._handleMove(ev);
	};

	_handleMouseMove = (ev) => {
		isTouchable || this._handleMove(ev);
	};

	_handleTouchEnd = (ev) => {
		isTouchable = true;
		this._handleRelease(ev);
	};

	_handleMouseUp = (ev) => {
		isTouchable || this._handleRelease(ev);
	};

	_removeMoveListeners = () => {
		const options = createEventOptions(this._capture);
		window.removeEventListener('touchmove', this._handleTouchMove, options);
		window.removeEventListener('mousemove', this._handleMouseMove, options);
		window.removeEventListener('touchend', this._handleTouchEnd, options);
		window.removeEventListener('mouseup', this._handleMouseUp, options);
	};

	render() {
		const {
			props: {
				component: Comp,
				lockAxis,

				onPanResponderGrant,
				onPanResponderMove,
				onPanResponderRelease,
				onStartShouldSetPanResponder,
				onMoveShouldSetPanResponder,
				onShouldStopPropagation,
				style,
				capture,
				withRef,

				...other,
			},
			state,
		} = this;

		return (
			<Comp
				{...other}
				{...state}
				onTouchStart={this._handleTouchStart}
				onMouseDown={this._handleMouseDown}
				{...this._refs}
			/>
		);
	}
}

export function undocumented_updateTouchSupport() {
	isTouchable = undefined;
}

