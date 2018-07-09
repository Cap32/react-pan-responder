import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onPanResponderRelease', function () {
	test('should start on touch start', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				onPanResponderRelease={handler}
				onStartShouldSetPanResponder
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should start on mouse down', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				onPanResponderRelease={handler}
				onStartShouldSetPanResponder
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.mouseDown()
			.mouseUp()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should release once', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				onPanResponderRelease={handler}
				onStartShouldSetPanResponder
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart({}, 1)
			.touchStart({}, 2)
			.touchMove({}, 1)
			.touchMove({}, 1)
			.touchMove({}, 2)
			.touchEnd({}, 1)
			.touchEnd({}, 2)
			.exec();
		expect(handler).toHaveBeenCalledTimes(1);
	});
});
