
import './styles.scss';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { render } from 'react-dom';
import ReactLogo from './ReactLogo';
import { AnimatedDiv, AnimatedValueXY, spring } from 'react-web-animated';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';
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
			<div>
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
					<h1>{'<ReactPanResponderView />'}</h1>
					<p>React pan gesture responder component. Just like React Native PanResponder, but for browser</p>

					<h2>Example</h2>

					<SyntaxHighlighter style={docco}>
						{exampleCode}
					</SyntaxHighlighter>
				</div>
			</div>
		);
	}
}

render(
	<App />,
	document.getElementById('mount'),
);
