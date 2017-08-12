
import React from 'react';
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

describe('PanView component', function () {
	test('should be a div', function () {
		const text = 'hello world';
		wrapper = mount(
			<PanView>{text}</PanView>
		);
		expect(wrapper.find('div').text()).toBe(text);
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

	test('should grant if `onStartShouldSetPanResponder` function returns true', async () => {
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
			.exec()
		;
		expect(handler.mock.calls.length).toBe(2);
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

	test('should grant gestureState work', async () => {
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
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
		expect(gestureState.numberActiveTouches).toEqual(1);
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

	test('should start gestureState work', async () => {
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
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
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

	test('should start gestureState work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		wrapper = mount(
			<PanView
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
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
		expect(gestureState.x0).toEqual(touchClient.pageX);
		expect(gestureState.y0).toEqual(touchClient.pageY);
	});
});
