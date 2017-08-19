/* eslint-disable max-len */

import './styles.scss';
import React, { Component } from 'react';
import { render } from 'react-dom';
import PanResponderView from 'index';
import { Github, User } from 'react-feather';
import {
	AnimatedDiv,
	AnimatedValue,
	AnimatedValueXY,
	timing,
	Easing,
} from 'react-web-animated';

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

	update(gestureState) {
		this.gestureState = gestureState;
		this.forceUpdate();
	}

	render() {
		const { gestureState } = this;
		return (
			<div className="logger">
				<ul>
					{Object.keys(gestureState).map((prop) =>
						<li key={prop}>{prop}: {gestureState[prop]}</li>
					)}
				</ul>
			</div>
		);
	}
}

class App extends Component {
	shouldComponentUpdate() {
		return false;
	}

	layoutAnim = new AnimatedValueXY();

	styleAnim = new AnimatedValue(0);

	hintAmin = new AnimatedValue(1);

	shouldShowHint = true;

	_handleShouldStartCapture = () => {
		console.log('onStartShouldSetPanResponderCapture');
		return false;
	};

	_handleShouldStart = () => {
		console.log('onStartShouldSetPanResponder');
		return true;
	};

	_handleShouldMoveCapture = () => {
		console.log('onMoveShouldSetPanResponderCapture');
		return false;
	};

	_handleShouldMove = () => {
		console.log('onMoveShouldSetPanResponder');
		return true;
	};

	_handleGrant = (ev, gestureState) => {
		console.log('onPanResponderGrant');
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
	};

	_handleStart = () => {
		console.log('onPanResponderStart');
	};

	_handleMove = (ev, gestureState) => {
		console.log('onPanResponderMove');
		const { moveX, moveY } = gestureState;
		const { layoutAnim, logger } = this;
		layoutAnim.setValue({ x: moveX, y: moveY });
		logger.update(gestureState);
	};

	_handleEnd = () => {
		console.log('onPanResponderEnd');
	};

	_handleRelease = (ev, gestureState) => {
		console.log('onPanResponderRelease');
		const { styleAnim, logger } = this;
		logger.update(gestureState);
		timing(styleAnim, {
			toValue: 0,
			duration: 600,
			easing: Easing.out(Easing.ease),
		}).start();
	};

	render() {
		const { styleAnim, layoutAnim, hintAmin } = this;

		return (
			<div className="container">
				<PanResponderView
					className="pan-view"
					onPanResponderGrant={this._handleGrant}
					onPanResponderStart={this._handleStart}
					onPanResponderMove={this._handleMove}
					onPanResponderRelease={this._handleRelease}
					onPanResponderEnd={this._handleEnd}
					onStartShouldSetPanResponderCapture={this._handleShouldStartCapture}
					onStartShouldSetPanResponder={this._handleShouldStart}
					onMoveShouldSetPanResponderCapture={this._handleShouldMoveCapture}
					onMoveShouldSetPanResponder={this._handleShouldMove}
				>
					<AnimatedDiv
						className="touch-hint"
						style={{ opacity: hintAmin }}
					>
						Touch to Start
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
				</PanResponderView>
				<Logger ref={(logger) => (this.logger = logger)} />

				<footer className="footer">
					<a href="https://github.com/Cap32/react-pan-responder-view">
						<Github size={22} color="white" />
					</a>
					<a href="https://github.com/Cap32">
						<User size={22} color="white" />
						<span className="author">@Cap32</span>
					</a>
				</footer>
			</div>
		);
	}
}

render(
	<App />,
	document.getElementById('mount'),
);
