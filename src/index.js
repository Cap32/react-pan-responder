import { Component } from 'react';
import PropTypes from 'prop-types';
import TouchActions from './TouchActions';
import delegation from './delegation';
import { isFunction, isObject, noop } from './utils';

const funcOrBool = PropTypes.oneOfType([PropTypes.func, PropTypes.bool]);

const TouchActionTypes = Object.keys(TouchActions);

export default class PanResponder extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		touchAction: PropTypes.oneOf(TouchActionTypes),
		innerRef: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.shape({ current: PropTypes.object }),
		]),
		onStartShouldSetCapture: funcOrBool,
		onStartShouldSet: funcOrBool,
		onMoveShouldSetCapture: funcOrBool,
		onMoveShouldSet: funcOrBool,
		onTerminationRequest: funcOrBool,
		onStart: PropTypes.func,
		onGrant: PropTypes.func,
		onReject: PropTypes.func,
		onMove: PropTypes.func,
		onEnd: PropTypes.func,
		onRelease: PropTypes.func,
		onTerminate: PropTypes.func,
	};

	static defaultProps = {
		onStart: noop,
		onGrant: noop,
		onMove: noop,
		onRelease: noop,
		onEnd: noop,
		onReject: noop,
		onTerminate: noop,
		onStartShouldSetCapture: false,
		onStartShouldSet: false,
		onMoveShouldSetCapture: false,
		onMoveShouldSet: false,
		onTerminationRequest: false,
		touchAction: 'none',
	};

	_isTouchAction = null;
	_removeListener = noop;

	componentDidMount() {
		this._handlers = {
			onShouldStartCapture: this._handleShouldStartCapture,
			onShouldStart: this._handleShouldStart,
			onShouldMoveCapture: this._handleShouldMoveCapture,
			onShouldMove: this._handleShouldMove,
			onGrant: this._handleGrant,
			onReject: this._handleReject,
			onStart: this._handleStart,
			onMove: this._handleMove,
			onRelease: this._handleRelease,
			onEnd: this._handleEnd,
			onRequestTerminate: this._handleRequestTerminate,
			onTerminate: this._handleTerminate,
		};
		this._removeListener = delegation.addListener(this.dom, this._handlers);
	}

	componentWillUnmount() {
		this._removeListener();
	}

	getDOMNodeByRef = (dom) => {
		const { innerRef } = this.props;
		this.dom = dom;
		if (isFunction(innerRef)) innerRef(dom);
		else if (isObject(innerRef)) innerRef.current = dom;
	};

	_handleShouldStartCapture = (...args) => {
		const { onStartShouldSetCapture: should } = this.props;
		return isFunction(should) ? should(...args) : should;
	};

	_handleShouldStart = (...args) => {
		const { onStartShouldSet: should } = this.props;
		return isFunction(should) ? should(...args) : should;
	};

	_handleGrant = (...args) => {
		const { onGrant } = this.props;
		onGrant(...args);
	};

	_handleStart = (...args) => {
		this.props.onStart(...args);
	};

	_handleShouldMoveCapture = (...args) => {
		const { onMoveShouldSetCapture: should } = this.props;
		return isFunction(should) ? should(...args) : should;
	};

	_handleShouldMove = (...args) => {
		const { onMoveShouldSet: should } = this.props;
		return isFunction(should) ? should(...args) : should;
	};

	_handleMove = (ev, gestureState) => {
		const { onMove, touchAction } = this.props;
		if (this._isTouchAction === null) {
			this._isTouchAction = TouchActions[touchAction](gestureState);
		}
		if (!this._isTouchAction) {
			ev.cancelable !== false && ev.preventDefault();
			onMove(ev, gestureState);
		}
	};

	_handleEnd = (...args) => {
		this.props.onEnd(...args);
	};

	_handleRelease = (...args) => {
		this._isTouchAction = null;
		this.props.onRelease(...args);
	};

	_handleReject = (...args) => {
		this.props.onReject(...args);
	};

	_handleTerminate = (...args) => {
		this.props.onTerminate(...args);
	};

	_handleRequestTerminate = (...args) => {
		const { onTerminationRequest: should } = this.props;
		return isFunction(should) ? should(...args) : should;
	};

	render() {
		return this.props.children(this.getDOMNodeByRef);
	}
}
