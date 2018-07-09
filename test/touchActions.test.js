import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('touchAction', function () {
	const { TouchActions } = PanResponder;

	test('should fire `onPanResponderMove` if `TouchActions.none` and panning horizontally', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction={TouchActions.none}
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

	test('should fire `onPanResponderMove` if `TouchActions.none` and panning vertically', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction={TouchActions.none}
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

	test('should fire `onPanResponderMove` if `TouchActions.y` and panning horizontally', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction={TouchActions.y}
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

	test('should not fire `onPanResponderMove` if `TouchActions.y` and panning vertically', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction={TouchActions.y}
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
		expect(handler).toHaveBeenCalledTimes(0);
	});

	test('should fire `onPanResponderMove` if `TouchActions.x` and panning vertically', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction={TouchActions.x}
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

	test('should not fire `onPanResponderMove` if `TouchActions.x` and panning horizontally', async () => {
		const handler = jest.fn();
		const wrapper = mount(
			<PanResponder
				touchAction={TouchActions.x}
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
		expect(handler).toHaveBeenCalledTimes(0);
	});
});
