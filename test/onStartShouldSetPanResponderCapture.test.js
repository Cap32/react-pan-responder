import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onStartShouldSetPanResponderCapture', function () {
	test('should fire `onStartShouldSetPanResponderCapture()` before fire `onStartShouldSetPanResponder()`', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder
				onStartShouldSetPanResponderCapture={() => handler(1)}
				onStartShouldSetPanResponder={() => handler(4)}
			>
				{(ref) => (
					<div ref={ref}>
						<PanResponder
							onStartShouldSetPanResponderCapture={() => handler(2)}
							onStartShouldSetPanResponder={() => handler(3)}
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
});
