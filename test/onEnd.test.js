import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onEnd', function () {
	test('should end on touch end', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onEnd={handler} onStartShouldSet>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should end on mouse up', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onEnd={handler} onStartShouldSet>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.mouseDown()
			.mouseUp()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should end on touch end and mouse end', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onEnd={handler} onStartShouldSet>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.mouseDown()
			.touchEnd()
			.mouseUp()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should end multiple time', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onEnd={handler} onStartShouldSet>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart({}, 1)
			.touchStart({}, 2)
			.touchEnd({}, 1)
			.touchEnd({}, 2)
			.exec();
		expect(handler).toHaveBeenCalledTimes(2);
	});
});
