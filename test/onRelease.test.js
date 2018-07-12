import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onRelease', function () {
	test('should release on touch end', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onRelease={handler} onStartShouldSet>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should release on mouse up', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onRelease={handler} onStartShouldSet>
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
			<PanResponder onRelease={handler} onStartShouldSet>
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
