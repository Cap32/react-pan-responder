/* eslint-disable max-len */

import './styles.scss';
import React, { Component } from 'react';
import { render } from 'react-dom';
import PanResponder from 'index';
import { Github, Eye, EyeOff } from 'react-feather';
import Granim from 'granim';
import {
	AnimatedDiv,
	AnimatedValue,
	AnimatedValueXY,
	timing,
	Easing,
} from 'react-web-animated';

const ls = (function () {
	const noop = () => {};
	const _key = 'showLogger';
	const _ls = localStorage || {
		getItem: noop,
		setItem: noop,
		removeItem: noop,
	};

	return {
		has: () => _ls.getItem(_key),
		check: () => _ls.setItem(_key, 'YES'),
		uncheck: () => _ls.removeItem(_key),
	};
})();

class Logger extends Component {
	gestureState = {
		stateID: Math.random(),
		x0: 0,
		y0: 0,
		moveX: 0,
		moveY: 0,
		dx: 0,
		dy: 0,
		vx: 0,
		vy: 0,
		numberActiveTouches: 0,
	};

	toFixed(state, key) {
		state[key] = state[key].toFixed(2) / 1;
	}

	update(gestureState) {
		this.gestureState = gestureState;
		this.toFixed(gestureState, 'vx');
		this.toFixed(gestureState, 'vy');
		this.forceUpdate();
	}

	render() {
		const { gestureState } = this;
		return (
			<AnimatedDiv className="logger" {...this.props}>
				<ul>
					{Object.keys(gestureState).map((prop) => (
						<li key={prop}>
							{prop}: {gestureState[prop]}
						</li>
					))}
				</ul>
			</AnimatedDiv>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);

		const createPanHandlers = (name) => ({
			onPanResponderGrant: (ev, gestureState) => {
				console.log(name, 'onPanResponderGrant');

				// if (name !== 'parent') return;

				const { x0, y0 } = gestureState;
				const { layoutAnim, styleAnim, hintAmin, logger } = this;

				styleAnim.stopAnimation((value) => {
					styleAnim.setValue(value);
					timing(styleAnim, {
						toValue: 1,
						duration: 100,
						easing: Easing.in(Easing.ease),
					}).start();
				});

				logger.update(gestureState);

				layoutAnim.stopAnimation(() => {
					layoutAnim.setValue({ x: x0, y: y0 });
				});

				if (this.shouldShowHint) {
					this.shouldShowHint = false;
					timing(hintAmin, { toValue: 0 }).start();
				}
			},
			onPanResponderStart: () => {
				console.log(name, 'onPanResponderStart');
			},
			onPanResponderMove: (ev, gestureState) => {
				console.log(name, 'onPanResponderMove');

				// if (name !== 'parent') return;

				const { moveX, moveY } = gestureState;
				const { layoutAnim, logger } = this;
				layoutAnim.setValue({ x: moveX, y: moveY });
				logger.update(gestureState);
			},
			onPanResponderRelease: (ev, gestureState) => {
				console.log(name, 'onPanResponderRelease');

				// if (name !== 'parent') return;

				const { styleAnim, logger } = this;
				logger.update(gestureState);
				timing(styleAnim, {
					toValue: 0,
					duration: 600,
					easing: Easing.out(Easing.ease),
				}).start();
			},
			onPanResponderEnd: () => {
				console.log(name, 'onPanResponderEnd');
			},
			onStartShouldSetPanResponderCapture: () => {
				console.log(name, 'onStartShouldSetPanResponderCapture');
			},
			onStartShouldSetPanResponder: () => {
				console.log(name, 'onStartShouldSetPanResponder');
			},
			onMoveShouldSetPanResponderCapture: () => {
				console.log(name, 'onMoveShouldSetPanResponderCapture');
			},
			onMoveShouldSetPanResponder: () => {
				console.log(name, 'onMoveShouldSetPanResponder');
				return true;
				// return name === 'parent';
			},
			onPanResponderTerminationRequest: () => {
				console.log(name, 'onPanResponderTerminationRequest');
			},
			onPanResponderTerminate: () => {
				console.log(name, 'onPanResponderTerminate');
			},
			onPanResponderReject: () => {
				console.log(name, 'onPanResponderReject');
			},
		});

		this.parentPanHandlers = createPanHandlers('parent');
		this.childPanHandlers = createPanHandlers('child');
	}

	componentDidMount() {
		// eslint-disable-next-line no-new
		new Granim({
			element: '.gradient',
			opacity: [1, 1],
			states: {
				'default-state': {
					gradients: [['#834D9B', '#D04ED6'], ['#2AFADF', '#4C83FF']],
					transitionSpeed: 20000,
				},
			},
		});
	}

	shouldComponentUpdate() {
		return false;
	}

	layoutAnim = new AnimatedValueXY();

	styleAnim = new AnimatedValue(0);

	hintAmin = new AnimatedValue(1);

	loggerAnim = new AnimatedValue(ls.has() ? 1 : 0);

	shouldShowHint = true;

	_toggleLoggerSwitch = (ev) => {
		const { checked } = ev.currentTarget;
		const toValue = checked ? 1 : 0;
		ls[checked ? 'check' : 'uncheck']();
		timing(this.loggerAnim, { toValue }).start();
	};

	render() {
		const {
			styleAnim,
			layoutAnim,
			loggerAnim,
			hintAmin,
			parentPanHandlers,
			childPanHandlers,
		} = this;

		return (
			<div className="container">
				<article className="doc">
					<h1>React Pan Responder View</h1>
					<h2>
						<a href="https://github.com/Cap32">Author: Cap32</a>
					</h2>
				</article>

				<canvas className="gradient" />

				<PanResponder {...parentPanHandlers}>
					{(ref) => (
						<div ref={ref} className="pan-view">
							<PanResponder {...childPanHandlers}>
								{(childRef) => (
									<div ref={childRef} className="child-pan-view" />
								)}
							</PanResponder>
						</div>
					)}
				</PanResponder>

				<AnimatedDiv className="touch-hint" style={{ opacity: hintAmin }}>
					Pan to Start
				</AnimatedDiv>

				<AnimatedDiv
					className="tracker"
					style={{
						opacity: styleAnim,
						transform: [
							...layoutAnim.getTranslateTransform(),
							{
								scale: styleAnim.interpolate({
									inputRange: [0, 1],
									outputRange: [2, 1],
								}),
							},
						],
					}}
				/>

				<Logger
					ref={(logger) => (this.logger = logger)}
					style={{ opacity: loggerAnim }}
				/>

				<footer className="footer">
					<div className="footer-left">
						<input
							type="checkbox"
							className="button checkbox"
							onChange={this._toggleLoggerSwitch}
							defaultChecked={ls.has()}
						/>
						<span className="button logger-switch eye">
							<Eye size={22} color="white" />
						</span>
						<span className="button logger-switch eye-off">
							<EyeOff size={22} color="white" />
						</span>
					</div>

					<div className="footer-right">
						<a
							className="button"
							href="https://github.com/Cap32/react-pan-responder-view"
						>
							<Github size={22} color="white" />
						</a>
					</div>
				</footer>
			</div>
		);
	}
}

render(<App />, document.getElementById('mount'));
