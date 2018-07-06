import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import delegation from '../../src/delegation';

Enzyme.configure({ adapter: new Adapter() });

let wrapper = null;

afterEach(() => {
	delegation.destroy();
	if (wrapper.unmount) wrapper.unmount();
});

export default function mount(...args) {
	return (wrapper = Enzyme.mount(...args));
}
