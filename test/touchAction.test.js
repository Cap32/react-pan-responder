import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('touchAction', function () {
	test('should fire `onPanResponderMove` if touchAction is "none" and panning horizontally', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction="none"
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchMove({ pageX: 20, pageY: 10 })
			.touchMove({ pageX: 20, pageY: 100 })
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(2);
	});

	test('should fire `onPanResponderMove` if touchAction is "none" and panning vertically', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction="none"
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart()
			.touchMove({ pageX: 10, pageY: 20 })
			.touchMove({ pageX: 100, pageY: 20 })
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(2);
	});

	test('should fire `onPanResponderMove` if touchAction is "x" and panning horizontally', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction="x"
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart({ pageX: 0, pageY: 0 })
			.touchMove({ pageX: 10, pageY: 20 })
			.touchMove({ pageX: 100, pageY: 20 })
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(2);
	});

	test('should not fire `onPanResponderMove` if touchAction is "x" and panning vertically', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction="x"
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart({ pageX: 0, pageY: 0 })
			.touchMove({ pageX: 20, pageY: 10 })
			.touchMove({ pageX: 20, pageY: 100 })
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(0);
	});

	test('should fire `onPanResponderMove` if touchAction is "y" and panning vertically', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction="y"
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart({ pageX: 0, pageY: 0 })
			.touchMove({ pageX: 20, pageY: 10 })
			.touchMove({ pageX: 20, pageY: 100 })
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(2);
	});

	test('should not fire `onPanResponderMove` if touchAction is "y" and panning horizontally', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction="y"
				onStartShouldSetPanResponder
				onPanResponderMove={handler}
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(wrapper.find(PanResponder).getDOMNode())
			.touchStart({ pageX: 0, pageY: 0 })
			.touchMove({ pageX: 10, pageY: 20 })
			.touchMove({ pageX: 100, pageY: 20 })
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(0);
	});
});
