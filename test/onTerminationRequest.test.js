import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onTerminationRequest', function () {
	test('should not fire `onTerminationRequest()` by default', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder
				onStartShouldSet={() => true}
				onTerminationRequest={handler}
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

	test('should fire `onTerminationRequest()` when parent responder granted', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder onStartShouldSet={() => true}>
				{(ref) => (
					<div ref={ref}>
						<PanResponder
							onStartShouldSet={() => true}
							onTerminationRequest={handler}
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

	test('could `onTerminationRequest` be boolean', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder onStartShouldSet={() => true} onReject={handler}>
				{(ref) => (
					<div ref={ref}>
						<PanResponder
							onStartShouldSet={() => true}
							onTerminationRequest={false}
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
});
