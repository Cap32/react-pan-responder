import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onPanResponderTerminate', function () {
	test('should not fire `onPanResponderTerminate()` by default', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder
				onStartShouldSetPanResponder={() => true}
				onPanResponderTerminate={handler}
				innerRef={(dom) => (childRef = dom)}
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(childRef)
			.touchStart()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(0);
	});

	test('should fire `onPanResponderTerminate()` when `onPanResponderTerminationRequest()` returns `true`', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder onStartShouldSetPanResponder={() => true}>
				{(ref) => (
					<div ref={ref}>
						<PanResponder
							onStartShouldSetPanResponder={() => true}
							onPanResponderTerminationRequest={() => true}
							onPanResponderTerminate={handler}
							innerRef={(dom) => (childRef = dom)}
						>
							{(ref) => <div ref={ref} />}
						</PanResponder>
					</div>
				)}
			</PanResponder>,
		);
		await Simulator.create(childRef)
			.touchStart()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(1);
	});

	test('should fire `onPanResponderTerminate()` when touch canceled', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder
				onStartShouldSetPanResponder={() => true}
				onPanResponderTerminate={handler}
				innerRef={(dom) => (childRef = dom)}
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(childRef)
			.touchStart()
			.touchCancel()
			.exec();
		expect(handler).toHaveBeenCalledTimes(1);
	});
});
