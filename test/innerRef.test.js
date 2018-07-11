import React, { createRef } from 'react';
import PanResponder from '../src';
import mount from './utils/mount';

describe('innerRef', function () {
	test('should `innerRef` equals to dom ref', async () => {
		let childRef;
		const wrapper = mount(
			<PanResponder innerRef={(dom) => (childRef = dom)}>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		expect(childRef).toBe(wrapper.find(PanResponder).getDOMNode());
	});

	test('should `createRef()` work in `innerRef`', async () => {
		const childRef = createRef();
		const wrapper = mount(
			<PanResponder innerRef={childRef}>
				{(ref) => <div ref={ref} />}
			</PanResponder>,
		);
		expect(childRef.current).toBe(wrapper.find(PanResponder).getDOMNode());
	});
});
