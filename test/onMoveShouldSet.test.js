import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onMoveShouldSet', function () {
	test('should not grant on move by default', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onGrant={handler}>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchMove()
			.touchEnd()
			.exec();
		expect(handler).not.toHaveBeenCalled();
	});

	test('should grant if `onMoveShouldSet` is true', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onGrant={handler} onMoveShouldSet>
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

	test('should grant if `onMoveShouldSet()` function returns true', async () => {
		const handler = jest.fn();
		const shouldSet = (ev, gestureState) => gestureState.dx > 10;
		const wrapper = mount(
			<PanResponder onGrant={handler} onMoveShouldSet={shouldSet}>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart({ pageX: 0 })
			.touchMove({ pageX: 12 })
			.touchEnd()
			.touchStart({ pageX: 1 })
			.touchMove({ pageX: 12 })
			.touchEnd()
			.touchStart({ pageX: 2 })
			.touchMove({ pageX: 12 })
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(2);
	});
});
