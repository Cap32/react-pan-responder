
import React from 'react';
import { findDOMNode } from 'react-dom';
import { JSDOM } from 'jsdom';
import { mount } from 'enzyme';
import Simulator from './Simulator';
import PanView from '../src';
import delegation from '../src/delegation';

let wrapper;

beforeEach(() => {
	const { window } = new JSDOM(
		'<!doctype html><html><body></body></html>'
	);
	global.window = window;
	global.document = window.document;
});

afterEach(() => {
	delegation.destroy();
	if (wrapper.unmount) { wrapper.unmount(); }
});

describe('component', function () {
	test('should be a div', function () {
		const text = 'hello world';
		wrapper = mount(
			<PanView>{text}</PanView>
		);
		expect(wrapper.find(PanView).text()).toBe(text);
		expect(wrapper.find(PanView).getDOMNode().nodeName).toBe('DIV');
	});

	test('should custom component work', function () {
		const text = 'hello world';
		const Custom = (props) => (<span {...props} />);
		wrapper = mount(
			<PanView component={Custom}>{text}</PanView>
		);
		expect(wrapper.find(Custom).getDOMNode().nodeName).toBe('SPAN');
	});
});

describe('withRef', function () {
	test('should `withRef` work', function () {
		class Custom extends React.Component {
			test() { return true; }
			render() {
				return (
					<div />
				);
			}
		}
		wrapper = mount(
			<PanView component={Custom} withRef />
		);
		expect(wrapper.get(0).getInstance().test()).toBe(true);
	});
});

describe('onStartShouldSetPanResponder', function () {
	test('should not grant on start by default', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView onPanResponderGrant={handler} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(0);
	});

	test('should grant if `onStartShouldSetPanResponder` is true', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderGrant={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should grant if `onStartShouldSetPanResponder()` function returns true', async () => {
		const handler = jest.fn();
		const shouldSetPanResponder = (ev, gestureState) => gestureState.x0 > 100;
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder={shouldSetPanResponder}
				onPanResponderGrant={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart({ pageX: 102 })
			.touchEnd()
			.touchStart({ pageX: 101 })
			.touchEnd()
			.touchStart({ pageX: 100 })
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(2);
	});

	test('should `onStartShouldSetPanResponder()` `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.touchEnd()
			.exec()
		;
		const [, gestureState] = handler.mock.calls[0];
		expect(gestureState.dx).toEqual(0);
		expect(gestureState.dy).toEqual(0);
		expect(gestureState.moveX).toEqual(0);
		expect(gestureState.moveY).toEqual(0);
		expect(gestureState.numberActiveTouches).toEqual(1);
		expect(gestureState.vx).toEqual(0);
		expect(gestureState.vy).toEqual(0);
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
	});
});

describe('onStartShouldSetPanResponderCapture', function () {
	test('should grant if `onStartShouldSetPanResponderCapture()` function returns true', async () => {
		const handler = jest.fn();
		const shouldSetPanResponder = (ev, gestureState) => gestureState.x0 > 100;
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponderCapture={shouldSetPanResponder}
				onPanResponderGrant={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart({ pageX: 102 })
			.touchEnd()
			.touchStart({ pageX: 101 })
			.touchEnd()
			.touchStart({ pageX: 100 })
			.exec()
		;
		expect(handler.mock.calls.length).toBe(2);
	});

	test('should `onStartShouldSetPanResponderCapture()` `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponderCapture={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.touchEnd()
			.exec()
		;
		const [, gestureState] = handler.mock.calls[0];
		expect(gestureState.dx).toEqual(0);
		expect(gestureState.dy).toEqual(0);
		expect(gestureState.moveX).toEqual(0);
		expect(gestureState.moveY).toEqual(0);
		expect(gestureState.numberActiveTouches).toEqual(1);
		expect(gestureState.vx).toEqual(0);
		expect(gestureState.vy).toEqual(0);
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
	});

	test('should fire `onStartShouldSetPanResponderCapture()` before fire `onStartShouldSetPanResponder()`', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponderCapture={() => handler(2)}
				onStartShouldSetPanResponder={() => handler(3)}
			>
				<PanView
					onStartShouldSetPanResponderCapture={() => handler(1)}
					onStartShouldSetPanResponder={() => handler(4)}
				/>
			</PanView>
		);
		await Simulator
			.create(findDOMNode(wrapper.find(PanView).get(1)))
			.touchStart()
			.touchEnd()
			.exec()
		;
		const { calls } = handler.mock;
		expect(calls[0][0]).toBe(1);
		expect(calls[1][0]).toBe(2);
		expect(calls[2][0]).toBe(3);
		expect(calls[3][0]).toBe(4);
	});

	test('should not fire parent `onStartShouldSetPanResponderCapture()` if child node returns true', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponderCapture={() => handler(2)}
				onStartShouldSetPanResponder={() => handler(3)}
			>
				<PanView
					onStartShouldSetPanResponderCapture={() => handler(1) || true}
					onStartShouldSetPanResponder={() => handler(4)}
				/>
			</PanView>
		);
		await Simulator
			.create(findDOMNode(wrapper.find(PanView).get(1)))
			.touchStart()
			.touchEnd()
			.exec()
		;
		const { calls } = handler.mock;
		expect(calls[0][0]).toBe(1);
		expect(calls.length).toBe(1);
	});
});

describe('onMoveShouldSetPanResponder', function () {
	test('should not grant on move by default', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView onPanResponderGrant={handler} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove()
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(0);
	});

	test('should grant if `onMoveShouldSetPanResponder` is true', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onMoveShouldSetPanResponder
				onPanResponderGrant={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove()
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should grant if `onMoveShouldSetPanResponder` function returns true', async () => {
		const handler = jest.fn();
		const shouldSetPanResponder = (ev, gestureState) => gestureState.dx > 10;
		wrapper = mount(
			<PanView
				onMoveShouldSetPanResponder={shouldSetPanResponder}
				onPanResponderGrant={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart({ pageX: 0 })
			.touchMove({ pageX: 12 })
			.touchEnd()
			.touchStart({ pageX: 1 })
			.touchMove({ pageX: 12 })
			.touchEnd()
			.touchStart({ pageX: 2 })
			.touchMove({ pageX: 12 })
			.exec()
		;
		expect(handler.mock.calls.length).toBe(2);
	});

	test('should `onMoveShouldSetPanResponder()` `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		wrapper = mount(
			<PanView
				onMoveShouldSetPanResponder={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.touchMove(touchClient)
			.touchEnd()
			.exec()
		;
		const [, gestureState] = handler.mock.calls[0];
		expect(gestureState.dx).toEqual(0);
		expect(gestureState.dy).toEqual(0);
		expect(gestureState.moveX).toEqual(100);
		expect(gestureState.moveY).toEqual(200);
		expect(gestureState.numberActiveTouches).toEqual(1);
		expect(gestureState.vx).toEqual(0);
		expect(gestureState.vy).toEqual(0);
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
	});
});

describe('onMoveShouldSetPanResponderCapture', function () {
	test('should grant if `onMoveShouldSetPanResponderCapture()` function returns true', async () => {
		const handler = jest.fn();
		const shouldSetPanResponder = (ev, gestureState) => gestureState.dx > 100;
		wrapper = mount(
			<PanView
				onMoveShouldSetPanResponderCapture={shouldSetPanResponder}
				onPanResponderGrant={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove({ pageX: 102 })
			.touchEnd()
			.touchStart()
			.touchMove({ pageX: 101 })
			.touchEnd()
			.touchStart()
			.touchMove({ pageX: 100 })
			.exec()
		;
		expect(handler.mock.calls.length).toBe(2);
	});

	test('should `onMoveShouldSetPanResponderCapture()` `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		wrapper = mount(
			<PanView
				onMoveShouldSetPanResponderCapture={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.touchMove(touchClient)
			.touchEnd()
			.exec()
		;
		const [, gestureState] = handler.mock.calls[0];
		expect(gestureState.dx).toEqual(0);
		expect(gestureState.dy).toEqual(0);
		expect(gestureState.moveX).toEqual(touchClient.pageX);
		expect(gestureState.moveY).toEqual(touchClient.pageY);
		expect(gestureState.numberActiveTouches).toEqual(1);
		expect(gestureState.vx).toEqual(0);
		expect(gestureState.vy).toEqual(0);
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
	});

	test('should fire `onMoveShouldSetPanResponderCapture()` before fire `onStartShouldSetPanResponder()`', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onMoveShouldSetPanResponderCapture={() => handler(2)}
				onMoveShouldSetPanResponder={() => handler(3)}
			>
				<PanView
					onMoveShouldSetPanResponderCapture={() => handler(1)}
					onMoveShouldSetPanResponder={() => handler(4)}
				/>
			</PanView>
		);
		await Simulator
			.create(findDOMNode(wrapper.find(PanView).get(1)))
			.touchStart()
			.touchMove()
			.touchEnd()
			.exec()
		;
		const { calls } = handler.mock;
		expect(calls[0][0]).toBe(1);
		expect(calls[1][0]).toBe(2);
		expect(calls[2][0]).toBe(3);
		expect(calls[3][0]).toBe(4);
	});

	test('should not fire parent `onMoveShouldSetPanResponderCapture()` if child node returns true', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onMoveShouldSetPanResponderCapture={() => handler(2)}
				onMoveShouldSetPanResponder={() => handler(3)}
			>
				<PanView
					onMoveShouldSetPanResponderCapture={() => handler(1) || true}
					onMoveShouldSetPanResponder={() => handler(4)}
				/>
			</PanView>
		);
		await Simulator
			.create(findDOMNode(wrapper.find(PanView).get(1)))
			.touchStart()
			.touchMove()
			.touchEnd()
			.exec()
		;
		const { calls } = handler.mock;
		expect(calls[0][0]).toBe(1);
		expect(calls.length).toBe(1);
	});
});

describe('onPanResponderGrant', function () {
	test('should grant on touch start', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderGrant={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should grant on mouse down', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderGrant={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.mouseDown()
			.mouseUp()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should grant `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderGrant={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.touchEnd()
			.exec()
		;

		const [, gestureState] = handler.mock.calls[0];
		expect(gestureState.dx).toEqual(0);
		expect(gestureState.dy).toEqual(0);
		expect(gestureState.moveX).toEqual(0);
		expect(gestureState.moveY).toEqual(0);
		expect(gestureState.numberActiveTouches).toEqual(1);
		expect(gestureState.vx).toEqual(0);
		expect(gestureState.vy).toEqual(0);
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
	});

	test('should grant once', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onMoveShouldSetPanResponder
				onPanResponderGrant={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart({}, 1)
			.touchStart({}, 2)
			.touchMove({}, 1)
			.touchMove({}, 1)
			.touchMove({}, 2)
			.touchEnd({}, 1)
			.touchEnd({}, 2)
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});
});

describe('onPanResponderStart', function () {
	test('should start on touch start', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderStart={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should start on mouse down', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderStart={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.mouseDown()
			.mouseUp()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should start `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderStart={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.touchEnd()
			.exec()
		;
		const [, gestureState] = handler.mock.calls[0];
		expect(gestureState.dx).toEqual(0);
		expect(gestureState.dy).toEqual(0);
		expect(gestureState.moveX).toEqual(0);
		expect(gestureState.moveY).toEqual(0);
		expect(gestureState.numberActiveTouches).toEqual(1);
		expect(gestureState.vx).toEqual(0);
		expect(gestureState.vy).toEqual(0);
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
	});

	test('should start multiple time', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderStart={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart({}, 1)
			.touchStart({}, 2)
			.touchEnd({}, 1)
			.touchEnd({}, 2)
			.exec()
		;
		expect(handler.mock.calls.length).toBe(2);
	});
});

describe('onPanResponderMove', function () {
	test('should move on touch move', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove()
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should move on mouse move', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.mouseDown()
			.mouseMove()
			.mouseUp()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should start `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		const delta = { x: 10, y: -20 };
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.touchMove({
				pageX: touchClient.pageX + delta.x,
				pageY: touchClient.pageY + delta.y,
			})
			.touchEnd()
			.exec()
		;
		const [, gestureState] = handler.mock.calls[0];
		expect(gestureState.dx).toEqual(delta.x);
		expect(gestureState.dy).toEqual(delta.y);
		expect(gestureState.moveX).toEqual(touchClient.pageX + delta.x);
		expect(gestureState.moveY).toEqual(touchClient.pageY + delta.y);
		expect(gestureState.numberActiveTouches).toEqual(1);
		expect(gestureState.vx > 0).toEqual(true);
		expect(gestureState.vy < 0).toEqual(true);
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
	});

	test('should move multiple time', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove()
			.touchMove()
			.touchMove()
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(3);
	});
});

describe('onPanResponderRelease', function () {
	test('should release on last touch end', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderRelease={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should release on mouse up', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderRelease={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.mouseDown()
			.mouseUp()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should release `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderRelease={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.touchEnd()
			.exec()
		;

		const [, gestureState] = handler.mock.calls[0];
		expect(gestureState.dx).toEqual(0);
		expect(gestureState.dy).toEqual(0);
		expect(gestureState.moveX).toEqual(0);
		expect(gestureState.moveY).toEqual(0);
		expect(gestureState.numberActiveTouches).toEqual(1);
		expect(gestureState.vx).toEqual(0);
		expect(gestureState.vy).toEqual(0);
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
	});

	test('should release once', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onMoveShouldSetPanResponder
				onPanResponderRelease={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart({}, 1)
			.touchStart({}, 2)
			.touchMove({}, 1)
			.touchMove({}, 1)
			.touchMove({}, 2)
			.touchEnd({}, 1)
			.touchEnd({}, 2)
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});
});

describe('onPanResponderEnd', function () {
	test('should end on last touch end', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderEnd={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should end on mouse up', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderEnd={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.mouseDown()
			.mouseUp()
			.exec()
		;
		expect(handler.mock.calls.length).toBe(1);
	});

	test('should end `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderEnd={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.touchEnd()
			.exec()
		;
		const [, gestureState] = handler.mock.calls[0];
		expect(gestureState.dx).toEqual(0);
		expect(gestureState.dy).toEqual(0);
		expect(gestureState.moveX).toEqual(0);
		expect(gestureState.moveY).toEqual(0);
		expect(gestureState.numberActiveTouches).toEqual(1);
		expect(gestureState.vx).toEqual(0);
		expect(gestureState.vy).toEqual(0);
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
	});

	test('should end multiple time', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderEnd={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart({}, 1)
			.touchStart({}, 2)
			.touchEnd({}, 1)
			.touchEnd({}, 2)
			.exec()
		;
		expect(handler.mock.calls.length).toBe(2);
	});
});

describe('lockAxis', function () {
	test('should fire `onPanResponderMove` if `AxisTypes.none` and panning horizontally', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				lockAxis={PanView.AxisTypes.none}
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove({ pageX: 20, pageY: 10 })
			.touchMove({ pageX: 20, pageY: 100 })
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toEqual(2);
	});

	test('should fire `onPanResponderMove` if `AxisTypes.none` and panning vertically', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				lockAxis={PanView.AxisTypes.none}
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove({ pageX: 10, pageY: 20 })
			.touchMove({ pageX: 100, pageY: 20 })
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toEqual(2);
	});

	test('should fire `onPanResponderMove` if `AxisTypes.x` and panning horizontally', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				lockAxis={PanView.AxisTypes.x}
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove({ pageX: 20, pageY: 10 })
			.touchMove({ pageX: 20, pageY: 100 })
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toEqual(2);
	});

	test('should not fire `onPanResponderMove` if `AxisTypes.x` and panning vertically', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				lockAxis={PanView.AxisTypes.x}
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove({ pageX: 10, pageY: 20 })
			.touchMove({ pageX: 100, pageY: 20 })
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toEqual(0);
	});

	test('should fire `onPanResponderMove` if `AxisTypes.y` and panning vertically', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				lockAxis={PanView.AxisTypes.y}
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove({ pageX: 10, pageY: 20 })
			.touchMove({ pageX: 100, pageY: 20 })
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toEqual(2);
	});

	test('should not fire `onPanResponderMove` if `AxisTypes.y` and panning horizontally', async () => {
		const handler = jest.fn();
		wrapper = mount(
			<PanView
				lockAxis={PanView.AxisTypes.y}
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			/>
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove({ pageX: 20, pageY: 10 })
			.touchMove({ pageX: 20, pageY: 100 })
			.touchEnd()
			.exec()
		;
		expect(handler.mock.calls.length).toEqual(0);
	});
});
