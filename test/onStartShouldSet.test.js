import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onStartShouldSet', function () {
	test('should not grant on start by default', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onGrant={handler}>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec();
		expect(handler).not.toHaveBeenCalled();
	});

	test('should grant if `onStartShouldSet` is true', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onGrant={handler} onStartShouldSet>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should grant if `onStartShouldSet()` function returns true', async () => {
		const handler = jest.fn();
		const shouldSet = (ev, gestureState) => gestureState.x0 > 100;
		const wrapper = mount(
			<PanResponder onGrant={handler} onStartShouldSet={shouldSet}>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart({ pageX: 102 })
			.touchEnd()
			.touchStart({ pageX: 101 })
			.touchEnd()
			.touchStart({ pageX: 100 })
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(2);
	});

	test('should `onStartShouldSet()` `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		const wrapper = mount(
			<PanResponder onGrant={handler} onStartShouldSet={handler}>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart(touchClient)
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenLastCalledWith(
			expect.any(Object),
			expect.objectContaining({
				dx: 0,
				dy: 0,
				moveX: 0,
				moveY: 0,
				numberActiveTouches: 1,
				vx: 0,
				vy: 0,
				x0: touchClient.pageX,
				y0: touchClient.pageY,
			}),
		);
	});
});
