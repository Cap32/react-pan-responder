import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onMoveShouldSetCapture', function () {
	test('should fire `onMoveShouldSetCapture()` before fire `onMoveShouldSet()`', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder
				onMoveShouldSetCapture={() => handler(1)}
				onMoveShouldSet={() => handler(4)}
			>
				{(ref) => (
					<div ref={ref}>
						<PanResponder
							onMoveShouldSetCapture={() => handler(2)}
							onMoveShouldSet={() => handler(3)}
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
			.touchMove()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenNthCalledWith(1, 1);
		expect(handler).toHaveBeenNthCalledWith(2, 2);
		expect(handler).toHaveBeenNthCalledWith(3, 3);
		expect(handler).toHaveBeenNthCalledWith(4, 4);
	});

	test('should not fire `onMoveShouldSet()` if `onMoveShouldSetCapture()` returns true', async () => {
		const handler = jest.fn(() => true);
		const captureHandler = jest.fn(() => true);
		let childRef;
		mount(
			<PanResponder
				onMoveShouldSetCapture={captureHandler}
				onMoveShouldSet={handler}
				innerRef={(dom) => (childRef = dom)}
			>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		await Simulator.create(childRef)
			.touchStart()
			.touchMove()
			.touchEnd()
			.exec();
		expect(handler).toHaveBeenCalledTimes(0);
		expect(captureHandler).toHaveBeenCalledTimes(1);
	});
});
