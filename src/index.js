
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { noop, returnsTrue } from 'empty-functions';
import LockAxis from './LockAxis';
import { supportCSSTouchActionPan, passive, TouchActions } from './utils';
import delegation from './delegation';

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
		delegation.removeListener(findDOMNode(this));
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

	_capture = this.props.capture;
	_lockingAxis = '';

	_handleShouldStart = (...args) => {
		return this.props.onStartShouldSetPanResponder(...args);
	};

	_handleGrant = (...args) => {
		this.props.onPanResponderGrant(...args);
	};

	_handleStart = (...args) => {
		this.props.onPanResponderStart(...args);
	};

	_handleShouldMove = (...args) => {
		return this.props.onMoveShouldSetPanResponder(...args);
	};

	_handleMove = (ev, gestureState) => {
		const {
			props: { onPanResponderMove, lockAxis },
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
				return;
			}
		}

		onPanResponderMove(ev, gestureState);
	};

	_handleEnd = (...args) => {
		this.props.onPanResponderEnd(...args);
	};

	_handleRelease = (...args) => {
		this._lockingAxis = '';
		this.props.onPanResponderRelease(...args);
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
