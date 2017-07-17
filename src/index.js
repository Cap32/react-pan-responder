
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { noop, returnsTrue } from 'empty-functions';
import LockAxis from './LockAxis';
import {
	isFunction, supportCSSTouchActionPan, passive, TouchActions,
} from './utils';
import delegation from './delegation';

// TODO
// let isTouchable;
let isTouchable = true;

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
		onPanResponderStart: PropTypes.func,
		onPanResponderGrant: PropTypes.func,
		onPanResponderMove: PropTypes.func,
		onPanResponderEnd: PropTypes.func,
		onPanResponderRelease: PropTypes.func,
		onShouldStopPropagation: PropTypes.func,
	};

	static defaultProps = {
		style: {},
		component: 'div',
		onPanResponderStart: noop,
		onPanResponderGrant: noop,
		onPanResponderMove: noop,
		onPanResponderRelease: noop,
		onPanResponderEnd: noop,
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

		delegation.init();
	}

	componentDidMount() {
		delegation.addListener(findDOMNode(this), {
			onShouldStart: this._handleShouldStart,
			onGrant: this._handleGrant,
			onStart: this._handleStart,
			onBeforeMove: this._handleBeforeMove,
			onShouldMove: this._handleShouldMove,
			onMove: this._handleMove,
			onRelease: this._handleRelease,
			onEnd: this._handleEnd,
		});
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

	_handleShouldStart = (ev) => {
		const getTouch = makeGetTouchInfo(ev);
		this.gestureState = getDefaultGestureState({
			x0: getTouch('pageX'),
			y0: getTouch('pageY'),
		});

		return this.props.onStartShouldSetPanResponder(ev, this.gestureState);
	};

	_handleGrant = (ev) => {
		this.props.onPanResponderGrant(ev, this.gestureState);
	};

	_handleStart = (ev) => {
		this.props.onPanResponderStart(ev, this.gestureState);
	};

	_handleBeforeMove = (ev) => {
		const { gestureState } = this;

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
	};

	_handleShouldMove = (ev) => {
		return this.props.onMoveShouldSetPanResponder(ev, this.gestureState);
	};

	_handleMove = (ev) => {
		const {
			props: { onPanResponderMove, lockAxis },
			gestureState,
		} = this;

		if (lockAxis === LockAxis.none) {
			if (!passive) { ev.preventDefault(); }
		}
		else {
			if (!this._lockingAxis) {
				const absDX = Math.abs(gestureState.dx);
				const absDY = Math.abs(gestureState.dy);
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

		onPanResponderMove(ev, gestureState);
	};

	_handleRelease = (ev) => {
		this.props.onPanResponderRelease(ev, this.gestureState);
	};

	_handleEnd = (ev) => {
		this._lockingAxis = '';
		this.props.onPanResponderEnd(ev, this.gestureState);
	};
	render() {
		const {
			props: {
				component: Comp,
				lockAxis,

				onPanResponderGrant,
				onPanResponderStart,
				onPanResponderMove,
				onPanResponderRelease,
				onPanResponderEnd,
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
				{...this._refs}
			/>
		);
	}
}

export function undocumented_updateTouchSupport() {
	isTouchable = undefined;
}

