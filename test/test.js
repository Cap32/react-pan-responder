
import React from 'react';
import jsdom from 'jsdom';
import { mount } from 'enzyme';
import { simulateTouchEvent, simulateMouseEvent } from './utils';
import PanView from '../src';

let wrapper;

beforeEach(() => {
	global.document = jsdom.jsdom(
		'<!doctype html><html><body></body></html>'
	);
	if (typeof window === 'undefined') {
		global.window = global.document.defaultView;
		global.navigator = global.window.navigator;
	}
});

afterEach(() => {
	if (wrapper.unmount) { wrapper.unmount(); }
});

describe('<PanView />', function () {
	test('should be a div', function () {
		const text = 'hello world';
		wrapper = mount(
			<PanView>{text}</PanView>
		);
		expect(wrapper.find('div').text()).toBe(text);
	});
});

describe('onPanResponderGrant', function () {
	test('should trigger on touch start', function (done) {
		wrapper = mount(
			<PanView onPanResponderGrant={done} />
		);
		wrapper.find(PanView).simulate('touchstart', { touches: [{}] });
	});

	test('should trigger on mouse down', function (done) {
		wrapper = mount(
			<PanView onPanResponderGrant={done} />
		);
		wrapper.find(PanView).simulate('mousedown');
	});

	test('should arguments work', function (done) {
		const touchClient = { pageX: 100, pageY: 200 };
		const handlePanResponderGrant = (ev, gestureState) => {
			expect(ev.touches[0]).toEqual(touchClient);
			expect(gestureState).toEqual({
				x0: touchClient.pageX,
				y0: touchClient.pageY,
				moveX: 0,
				moveY: 0,
				dx: 0,
				dy: 0,
			});
			done();
		};
		wrapper = mount(
			<PanView onPanResponderGrant={handlePanResponderGrant} />
		);
		wrapper.find(PanView).simulate('touchstart', {
			touches: [touchClient],
		});
	});
});

describe('onPanResponderMove', function () {
	test('should trigger on touch move', function (done) {
		wrapper = mount(
			<PanView onPanResponderMove={done} />
		);
		wrapper.find(PanView).simulate('touchstart', { touches: [{}] });
		simulateTouchEvent('touchmove', { pageX: 100, pageY: 200 });
	});

	test('should trigger on mouse move', function (done) {
		wrapper = mount(
			<PanView onPanResponderMove={done} />
		);
		wrapper.find(PanView).simulate('mousedown');
		simulateMouseEvent('mousemove', { pageX: 100, pageY: 200 });
	});
});
