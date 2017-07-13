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

class App extends Component {
	state = {
		gestureState: {
			x0: 0,
			y0: 0,
			moveX: 0,
			moveY: 0,
			dx: 0,
			dy: 0,
			vx: 0,
			vy: 0,
		},
		anim: new AnimatedValueXY(),
	};

	_handleGrant = (ev, gestureState) => {
		const { anim } = this.state;
		anim.stopAnimation(({ x, y }) => {
			anim.setOffset({ x, y });
			anim.setValue({ x: 0, y: 0 });
			this.setState({ gestureState });
		});
	};

	_handleMove = (ev, gestureState) => {
		const { anim } = this.state;
		anim.setValue({ x: gestureState.dx, y: gestureState.dy });
		this.setState({ gestureState });
	};

	_handleRelease = () => {
		const { anim } = this.state;
		anim.flattenOffset();
		spring(anim, {
			toValue: 0,
			tension: 40,
			friction: 5,
		}).start();
	};

	render() {
		const { gestureState, anim } = this.state;
		return (
			<div className="container">
				<div className="pan-view">
					<PanResponderView
						className="pan"
						onPanResponderGrant={this._handleGrant}
						onPanResponderMove={this._handleMove}
						onPanResponderRelease={this._handleRelease}
						component={AnimatedDiv}
						style={{
							transform: anim.getTranslateTransform(),
						}}
					>
						<ReactLogo className="logo" />
					</PanResponderView>
					<div className="logger">
						<ul>
							{Object.keys(gestureState).map((prop) =>
								<li key={prop}>{prop}: {gestureState[prop]}</li>
							)}
						</ul>
					</div>
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
