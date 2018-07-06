import React from 'react';
import PanResponder from '../src';
import mount from './utils/mount';

let wrapper;

describe('component', function () {
	test('should be a div', function () {
		wrapper = mount(<PanResponder>{() => <div />}</PanResponder>);
		expect(wrapper.find(PanResponder).getDOMNode().nodeName).toBe('DIV');
	});

	test('should children props be called', function () {
		const children = jest.fn(() => <div />);
		wrapper = mount(<PanResponder>{children}</PanResponder>);
		expect(children).toHaveBeenCalled();
	});
});
