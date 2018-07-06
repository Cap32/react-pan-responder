import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onStartShouldSetPanResponder', function () {
	test('should not grant on start by default', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onPanResponderGrant={handler}>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec();
		expect(handler).not.toHaveBeenCalled();
	});

	test('should grant if `onStartShouldSetPanResponder` is true', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder onPanResponderGrant={handler} onStartShouldSetPanResponder>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalled();
	});

	test('should grant if `onStartShouldSetPanResponder()` function returns true', async () => {
		const handler = jest.fn();
		const shouldSetPanResponder = (ev, gestureState) => gestureState.x0 > 100;
		const wrapper = mount(
			<PanResponder
				onPanResponderGrant={handler}
				onStartShouldSetPanResponder={shouldSetPanResponder}
			>
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

	test('should `onStartShouldSetPanResponder()` `gestureState` work', async () => {
		const handler = jest.fn();
		const touchClient = { pageX: 100, pageY: 200 };
		const wrapper = mount(
			<PanResponder
				onPanResponderGrant={handler}
				onStartShouldSetPanResponder={handler}
			>
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
