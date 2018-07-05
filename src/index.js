import { Component } from 'react';
import PropTypes from 'prop-types';
import TouchActions from './TouchActions';
import delegation from './delegation';
import { isFunction, noop } from './utils';

const funcOrBool = PropTypes.oneOfType([PropTypes.func, PropTypes.bool]);

const TouchActionTypes = Object.keys(TouchActions);
const TouchActionNames = TouchActionTypes.reduce((actions, key) => {
	actions[key] = key;
	return actions;
}, {});

export default class PanResponderView extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		touchAction: PropTypes.oneOf(TouchActionTypes),
		onStartShouldSetPanResponderCapture: funcOrBool,
		onStartShouldSetPanResponder: funcOrBool,
		onMoveShouldSetPanResponderCapture: funcOrBool,
		onMoveShouldSetPanResponder: funcOrBool,
		onPanResponderTerminationRequest: funcOrBool,
		onPanResponderStart: PropTypes.func,
		onPanResponderGrant: PropTypes.func,
		onPanResponderReject: PropTypes.func,
		onPanResponderMove: PropTypes.func,
		onPanResponderEnd: PropTypes.func,
		onPanResponderRelease: PropTypes.func,
		onPanResponderTerminate: PropTypes.func,
	};

	static defaultProps = {
		onPanResponderStart: noop,
		onPanResponderGrant: noop,
		onPanResponderMove: noop,
		onPanResponderRelease: noop,
		onPanResponderEnd: noop,
		onPanResponderReject: noop,
		onPanResponderTerminate: noop,
		onStartShouldSetPanResponderCapture: false,
		onStartShouldSetPanResponder: false,
		onMoveShouldSetPanResponderCapture: false,
		onMoveShouldSetPanResponder: false,
		onPanResponderTerminationRequest: false,
		touchAction: TouchActionNames.none,
	};

	static TouchActions = TouchActionNames;

	_locking = null;

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
		if (this.dom && dom && this.dom !== dom) {
			this._removeListener();
			this._removeListener = delegation.addListener(dom, this._handlers);
		}
		this.dom = dom;
	};

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
		if (this._locking === null) {
			this._locking = TouchActions[touchAction](gestureState);
		}
		if (this._locking) return;
		ev.cancelable !== false && ev.preventDefault();
		onPanResponderMove(ev, gestureState);
	};

	_handleEnd = (...args) => {
		this.props.onPanResponderEnd(...args);
	};

	_handleRelease = (...args) => {
		this._locking = null;
		this.props.onPanResponderRelease(...args);
	};

	_handleReject = (...args) => {
		this.props.onPanResponderReject(...args);
	};

	_handleTerminate = (...args) => {
		this.props.onPanResponderTerminate(...args);
	};

	_handleRequestTerminate = (...args) => {
		const { onPanResponderTerminationRequest: should } = this.props;
		return isFunction(should) ? should(...args) : should;
	};

	render() {
		return this.props.children(this.getDOMNodeByRef);
	}
}
