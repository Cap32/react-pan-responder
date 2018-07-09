import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onPanResponderStart', function () {
	test('should start on touch start', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onPanResponderStart={handler} onStartShouldSetPanResponder>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should start on mouse down', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onPanResponderStart={handler} onStartShouldSetPanResponder>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.mouseDown()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should start multiple time', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onPanResponderStart={handler} onStartShouldSetPanResponder>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart({}, 1)
			.touchStart({}, 2)
			.exec();
		expect(handler).toHaveBeenCalledTimes(2);
	});
});
