
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { noop, returnsTrue, returnsFalse } from 'empty-functions';
import LockAxis, { AxisTypes } from './LockAxis';
import delegation from './delegation';

export default class PanResponderView extends Component {
	static propTypes = {
		component: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.func,
		]),
		lockAxis: PropTypes.oneOf(Object.keys(AxisTypes)),
		withRef: PropTypes.bool,

		onStartShouldSetPanResponderCapture: PropTypes.func,
		onStartShouldSetPanResponder: PropTypes.func,
		onMoveShouldSetPanResponderCapture: PropTypes.func,
		onMoveShouldSetPanResponder: PropTypes.func,
		onPanResponderStart: PropTypes.func,
		onPanResponderGrant: PropTypes.func,
		onPanResponderMove: PropTypes.func,
		onPanResponderEnd: PropTypes.func,
		onPanResponderRelease: PropTypes.func,
		onShouldStopPropagation: PropTypes.func,
	};

	static defaultProps = {
		component: 'div',
		onPanResponderStart: noop,
		onPanResponderGrant: noop,
		onPanResponderMove: noop,
		onPanResponderRelease: noop,
		onPanResponderEnd: noop,
		onStartShouldSetPanResponderCapture: returnsFalse,
		onStartShouldSetPanResponder: returnsTrue,
		onMoveShouldSetPanResponderCapture: returnsFalse,
		onMoveShouldSetPanResponder: returnsTrue,
		onShouldStopPropagation: returnsTrue,
		lockAxis: AxisTypes.none,
		withRef: false,
	};

	static AxisTypes = AxisTypes;

	componentWillMount() {
		delegation.init();
	}

	componentDidMount() {
		delegation.addListener(findDOMNode(this), {
			onShouldStartCapture: this._handleShouldStartCapture,
			onShouldStart: this._handleShouldStart,
			onShouldMoveCapture: this._handleShouldMoveCapture,
			onShouldMove: this._handleShouldMove,
			onGrant: this._handleGrant,
			onStart: this._handleStart,
			onMove: this._handleMove,
			onRelease: this._handleRelease,
			onEnd: this._handleEnd,
		});
	}

	componentWillUnmount() {
		delegation.removeListener(findDOMNode(this));
	}

	_refs = this.props.withRef ? { ref: (c) => (this.ref = c) } : {};

	getInstance() {
		return this.ref;
	}

	_handleShouldStartCapture = (...args) => {
		return this.props.onStartShouldSetPanResponderCapture(...args);
	};

	_handleShouldStart = (...args) => {
		return this.props.onStartShouldSetPanResponder(...args);
	};

	_handleGrant = (...args) => {
		const { onPanResponderGrant, lockAxis } = this.props;
		LockAxis.grant(findDOMNode(this), lockAxis);
		onPanResponderGrant(...args);
	};

	_handleStart = (...args) => {
		this.props.onPanResponderStart(...args);
	};

	_handleShouldMoveCapture = (...args) => {
		return this.props.onMoveShouldSetPanResponderCapture(...args);
	};

	_handleShouldMove = (...args) => {
		return this.props.onMoveShouldSetPanResponder(...args);
	};

	_handleMove = (ev, gestureState) => {
		const { onPanResponderMove, lockAxis } = this.props;
		LockAxis.move(findDOMNode(this), lockAxis, ev, gestureState);
		onPanResponderMove(ev, gestureState);
	};

	_handleEnd = (...args) => {
		this.props.onPanResponderEnd(...args);
	};

	_handleRelease = (...args) => {
		LockAxis.release(findDOMNode(this));
		this.props.onPanResponderRelease(...args);
	};

	render() {
		const {
			props: {
				component: Comp,
				lockAxis,

				onStartShouldSetPanResponderCapture,
				onStartShouldSetPanResponder,
				onMoveShouldSetPanResponderCapture,
				onMoveShouldSetPanResponder,
				onPanResponderGrant,
				onPanResponderStart,
				onPanResponderMove,
				onPanResponderRelease,
				onPanResponderEnd,
				onShouldStopPropagation,
				withRef,

				...other,
			},
		} = this;

		return (
			<Comp
				{...other}
				{...this._refs}
			/>
		);
	}
}
