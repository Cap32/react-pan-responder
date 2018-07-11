import React from 'react';
import PanResponder from '../src';
import Simulator from './utils/Simulator';
import mount from './utils/mount';

describe('onPanResponderTerminationRequest', function () {
	test('should not fire `onPanResponderTerminationRequest()` by default', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder
				onStartShouldSetPanResponder={() => true}
				onPanResponderTerminationRequest={handler}
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

	test('should fire `onPanResponderTerminationRequest()` when parent responder granted', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder onStartShouldSetPanResponder={() => true}>
				{(ref) => (
					<div ref={ref}>
						<PanResponder
							onStartShouldSetPanResponder={() => true}
							onPanResponderTerminationRequest={handler}
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

	test('could `onPanResponderTerminationRequest` be boolean', async () => {
		const handler = jest.fn();
		let childRef;
		mount(
			<PanResponder
				onStartShouldSetPanResponder={() => true}
				onPanResponderReject={handler}
			>
				{(ref) => (
					<div ref={ref}>
						<PanResponder
							onStartShouldSetPanResponder={() => true}
							onPanResponderTerminationRequest={false}
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
