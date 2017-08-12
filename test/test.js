
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

describe('onPanResponderGrant', function () {
	test('should grant on touch start', async (done) => {
		wrapper = mount(
			<PanView onPanResponderGrant={done} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.exec()
		;
	});

	test('should grant on mouse down', async (done) => {
		wrapper = mount(
			<PanView onPanResponderGrant={done} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.mouseDown()
			.exec()
		;
	});

	test('should grant gestureState work', async (done) => {
		const touchClient = { pageX: 100, pageY: 200 };
		const handlePanResponderGrant = (ev, gestureState) => {
			expect(ev.touches[0]).toEqual(touchClient);
			expect(gestureState.x0).toEqual(touchClient.pageX);
			expect(gestureState.y0).toEqual(touchClient.pageY);
			expect(gestureState.numberActiveTouches).toEqual(1);
			done();
		};
		wrapper = mount(
			<PanView onPanResponderGrant={handlePanResponderGrant} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.exec()
		;
	});
});

describe('onPanResponderStart', function () {
	test('should start on touch start', async (done) => {
		wrapper = mount(
			<PanView onPanResponderStart={done} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.exec()
		;
	});

	test('should start on mouse down', async (done) => {
		wrapper = mount(
			<PanView onPanResponderStart={done} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.mouseDown()
			.exec()
		;
	});

	test('should start gestureState work', async (done) => {
		const touchClient = { pageX: 100, pageY: 200 };
		const handler = (ev, gestureState) => {
			expect(gestureState.x0).toEqual(touchClient.pageX);
			expect(gestureState.y0).toEqual(touchClient.pageY);
			expect(gestureState.numberActiveTouches).toEqual(1);
			done();
		};
		wrapper = mount(
			<PanView onPanResponderStart={handler} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.exec()
		;
	});
});

describe('onPanResponderMove', function () {
	test('should move on touch move', async (done) => {
		wrapper = mount(
			<PanView onPanResponderMove={done} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart()
			.touchMove()
			.exec()
		;
	});

	test('should move on mouse move', async (done) => {
		wrapper = mount(
			<PanView onPanResponderMove={done} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.mouseDown()
			.mouseMove()
			.exec()
		;
	});

	test('should start gestureState work', async (done) => {
		const touchClient = { pageX: 100, pageY: 200 };
		const handler = (ev, gestureState) => {
			expect(gestureState.x0).toEqual(touchClient.pageX);
			expect(gestureState.y0).toEqual(touchClient.pageY);
			expect(gestureState.numberActiveTouches).toEqual(1);
			done();
		};
		wrapper = mount(
			<PanView onPanResponderMove={handler} />
		);
		await Simulator
			.create(wrapper.find(PanView).getDOMNode())
			.touchStart(touchClient)
			.touchMove(touchClient)
			.exec()
		;
	});
});
