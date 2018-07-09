import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onPanResponderGrant', function () {
	test('should grant on touch start', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onPanResponderGrant={handler} onStartShouldSetPanResponder>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should grant on mouse down', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onPanResponderGrant={handler} onStartShouldSetPanResponder>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.mouseDown()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should grant once', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				onStartShouldSetPanResponder
				onMoveShouldSetPanResponder
				onPanResponderGrant={handler}
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart({}, 1)
			.touchStart({}, 2)
			.exec();
		expect(handler).toHaveBeenCalledTimes(1);
	});
});
