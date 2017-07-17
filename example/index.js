/* eslint-disable max-len */

import './styles.scss';
import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactLogo from './ReactLogo';
import { AnimatedDiv, AnimatedValueXY, spring } from 'react-web-animated';
import SyntaxHighlighter from 'react-syntax-highlighter';
import githubGist from 'react-syntax-highlighter/dist/styles/github-gist';
import exampleCode from './example.es';
import PanResponderView from 'index';

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

	anim = new AnimatedValueXY();

	_handleShouldStartCapture = () => {
		console.log('onStartShouldSetPanResponderCapture');
		return false;
	};

	_handleShouldStart = () => {
		console.log('onStartShouldSetPanResponder');
		return false;
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
		const { anim, logger } = this;
		anim.stopAnimation(({ x, y }) => {
			anim.setOffset({ x, y });
			anim.setValue({ x: 0, y: 0 });
			logger.update(gestureState);
		});
	};

	_handleStart = () => {
		console.log('onPanResponderStart');
	};

	_handleMove = (ev, gestureState) => {
		console.log('onPanResponderMove');
		const { anim, logger } = this;
		anim.setValue({ x: gestureState.dx, y: gestureState.dy });
		logger.update(gestureState);
	};

	_handleEnd = () => {
		console.log('onPanResponderEnd');
	};

	_handleRelease = (ev, gestureState) => {
		console.log('onPanResponderRelease');
		const { anim, logger } = this;
		anim.flattenOffset();
		logger.update(gestureState);
		spring(anim, {
			toValue: 0,
			tension: 40,
			friction: 5,
		}).start();
	};

	render() {
		return (
			<div className="container">
				<div className="pan-view">
					<PanResponderView
						className="pan"
						onPanResponderGrant={this._handleGrant}
						onPanResponderStart={this._handleStart}
						onPanResponderMove={this._handleMove}
						onPanResponderRelease={this._handleRelease}
						onPanResponderEnd={this._handleEnd}
						onStartShouldSetPanResponderCapture={this._handleShouldStartCapture}
						onStartShouldSetPanResponder={this._handleShouldStart}
						onMoveShouldSetPanResponderCapture={this._handleShouldMoveCapture}
						onMoveShouldSetPanResponder={this._handleShouldMove}
						component={AnimatedDiv}
						style={{
							transform: this.anim.getTranslateTransform(),
						}}
					>
						<ReactLogo className="logo" />
					</PanResponderView>
					<Logger ref={(logger) => (this.logger = logger)} />
				</div>

				<div className="doc">
					<h1>ReactPanResponderView</h1>
					<p>React pan gesture responder component. Just like React Native PanResponder, but for browser</p>

					<h2>Example</h2>

					<figure>
						<SyntaxHighlighter style={githubGist}>
							{exampleCode}
						</SyntaxHighlighter>
					</figure>

					<h2>Props</h2>

					<div className="props-container">
						<table className="props">
							<tbody>
								<tr>
									<th>Property</th>
									<th>Type</th>
									<th>Default</th>
									<th>Required</th>
									<th>Description</th>
								</tr>
								<tr>
									<td>component</td>
									<td>React Component</td>
									<td>{`"div"`}</td>
									<td>false</td>
									<td>Wrapper component</td>
								</tr>
								<tr>
									<td>onStartShouldSetPanResponder</td>
									<td>Function</td>
									<td>{'() => true'}</td>
									<td>false</td>
									<td>Does this view want to become responder on the start of a touch?</td>
								</tr>
								<tr>
									<td>onMoveShouldSetPanResponder</td>
									<td>Function</td>
									<td>{'() => true'}</td>
									<td>false</td>
									<td>Called for every touch move on the View when it is not the responder</td>
								</tr>
								<tr>
									<td>onPanResponderGrant</td>
									<td>Function</td>
									<td>{'(ev, gestureState) => {}'}</td>
									<td>false</td>
									<td>The View is now responding for touch events. This is the time to highlight and show the user what is happening</td>
								</tr>
								<tr>
									<td>onPanResponderMove</td>
									<td>Function</td>
									<td>{'(ev, gestureState) => {}'}</td>
									<td>false</td>
									<td>The user is moving their finger</td>
								</tr>
								<tr>
									<td>onPanResponderRelease</td>
									<td>Function</td>
									<td>{'(ev, gestureState) => {}'}</td>
									<td>false</td>
									<td>{'Fired at the end of the touch, ie "touchUp"'}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<footer className="footer">
					<p>Author: Cap32</p>
				</footer>
			</div>
		);
	}
}

render(
	<App />,
	document.getElementById('mount'),
);
