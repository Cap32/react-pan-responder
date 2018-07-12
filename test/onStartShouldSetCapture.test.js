import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onStartShouldSetCapture', function () {
	test('should fire `onStartShouldSetCapture()` before fire `onStartShouldSet()`', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder
				onStartShouldSetCapture={() => handler(1)}
				onStartShouldSet={() => handler(4)}
			>
				{(ref) => (
					<div ref={ref}>
						<PanResponder
							onStartShouldSetCapture={() => handler(2)}
							onStartShouldSet={() => handler(3)}
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
		expect(handler).toHaveBeenNthCalledWith(1, 1);
		expect(handler).toHaveBeenNthCalledWith(2, 2);
		expect(handler).toHaveBeenNthCalledWith(3, 3);
		expect(handler).toHaveBeenNthCalledWith(4, 4);
	});

	test('should not fire `onStartShouldSet()` if `onStartShouldSetCapture()` returns true', async () => {
		const handler = jest.fn(() => true);
		const captureHandler = jest.fn(() => true);
		let childRef;
		mount(
			<PanResponder
				onStartShouldSetCapture={captureHandler}
				onStartShouldSet={handler}
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
		expect(captureHandler).toHaveBeenCalledTimes(1);
	});
});
