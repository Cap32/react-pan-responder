
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import TouchActions from './TouchActions';
import delegation from './delegation';
import { isFunction, noop } from './utils';

const funcOrBool = PropTypes.oneOfType([
	PropTypes.func,
	PropTypes.bool,
]);

export default class PanResponderView extends Component {
	static propTypes = {
		component: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.func,
		]),
		touchAction: PropTypes.oneOf(Object.keys(TouchActions)),
		withRef: PropTypes.bool,

		onStartShouldSetPanResponderCapture: funcOrBool,
		onStartShouldSetPanResponder: funcOrBool,
		onMoveShouldSetPanResponderCapture: funcOrBool,
		onMoveShouldSetPanResponder: funcOrBool,
		onPanResponderStart: PropTypes.func,
		onPanResponderGrant: PropTypes.func,
		onPanResponderMove: PropTypes.func,
		onPanResponderEnd: PropTypes.func,
		onPanResponderRelease: PropTypes.func,
	};

	static defaultProps = {
		component: 'div',
		onPanResponderStart: noop,
		onPanResponderGrant: noop,
		onPanResponderMove: noop,
		onPanResponderRelease: noop,
		onPanResponderEnd: noop,
		onStartShouldSetPanResponderCapture: false,
		onStartShouldSetPanResponder: false,
		onMoveShouldSetPanResponderCapture: false,
		onMoveShouldSetPanResponder: false,
		touchAction: TouchActions.none,
		withRef: false,
	};

	static TouchActions = TouchActions;

	_locking = null;

	_refs = this.props.withRef ? { ref: (c) => (this.ref = c) } : {};

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

	getInstance() {
		return this.ref;
	}

	_handleShouldStartCapture = (...args) => {
		const { onStartShouldSetPanResponderCapture: should } = this.props;
		return isFunction(should) ? should(...args) : should;
	};

	_handleShouldStart = (...args) => {
		const { onStartShouldSetPanResponder: should } = this.props;
		return isFunction(should) ? should(...args) : should;
	};

	_handleGrant = (...args) => {
		const { onPanResponderGrant } = this.props;
		onPanResponderGrant(...args);
	};

	_handleStart = (...args) => {
		this.props.onPanResponderStart(...args);
	};

	_handleShouldMoveCapture = (...args) => {
		const { onMoveShouldSetPanResponderCapture: should } = this.props;
		return isFunction(should) ? should(...args) : should;
	};

	_handleShouldMove = (...args) => {
		const { onMoveShouldSetPanResponder: should } = this.props;
		return isFunction(should) ? should(...args) : should;
	};

	_handleMove = (ev, gestureState) => {
		const { onPanResponderMove, touchAction } = this.props;

		if (touchAction !== TouchActions.none) {
			if (!this._locking) {
				const absDX = Math.abs(gestureState.dx);
				const absDY = Math.abs(gestureState.dy);
				this._locking = absDX > absDY ? TouchActions.x : TouchActions.y;
			}

			if (this._locking !== touchAction) { return; }
		}

		ev.preventDefault();
		onPanResponderMove(ev, gestureState);
	};

	_handleEnd = (...args) => {
		this.props.onPanResponderEnd(...args);
	};

	_handleRelease = (...args) => {
		this._locking = null;
		this.props.onPanResponderRelease(...args);
	};

	render() {
		const {
			props: {
				component: Comp,
				touchAction,

				onStartShouldSetPanResponderCapture,
				onStartShouldSetPanResponder,
				onMoveShouldSetPanResponderCapture,
				onMoveShouldSetPanResponder,
				onPanResponderGrant,
				onPanResponderStart,
				onPanResponderMove,
				onPanResponderRelease,
				onPanResponderEnd,
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
