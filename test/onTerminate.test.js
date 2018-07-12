import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onTerminate', function () {
	test('should not fire `onTerminate()` by default', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder
				onStartShouldSet={() => true}
				onTerminate={handler}
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

	test('should fire `onTerminate()` when `onTerminationRequest()` returns `true`', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder onStartShouldSet={() => true}>
				{(ref) => (
					<div ref={ref}>
						<PanResponder
							onStartShouldSet={() => true}
							onTerminationRequest={() => true}
							onTerminate={handler}
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

	test('should fire `onTerminate()` when touch canceled', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder
				onStartShouldSet={() => true}
				onTerminate={handler}
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
