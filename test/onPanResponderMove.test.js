import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onPanResponderMove', function () {
	test('should start on touch move', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onPanResponderMove={handler} onStartShouldSetPanResponder>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchMove()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should move on mouse move', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onPanResponderMove={handler} onStartShouldSetPanResponder>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.mouseDown()
			.mouseMove()
			.mouseUp()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should move multiple time', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onPanResponderMove={handler} onStartShouldSetPanResponder>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchMove()
			.touchMove()
			.touchMove()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(3);
	});
});
