let nativeWeakMap;

const getWeakMapPolyfill = () => require('../src/WeakMapPolyfill').default;

beforeAll(() => {
	nativeWeakMap = global.WeakMap;
	Reflect.deleteProperty(global, 'WeakMap');
});

afterAll(() => {
	global.WeakMap = nativeWeakMap;
});

describe('WeakMapPolyfill', function () {
	test('should `WeakMapPolyfill` work', () => {
		const WeakMapPolyfill = getWeakMapPolyfill();
		const weakMap = new WeakMapPolyfill();
		const obj = {};
		const val = 'it works';
		const newVal = 'update';
		weakMap.set(obj, val);
		expect(weakMap.has(obj)).toBe(true);
		expect(weakMap.get(obj)).toBe(val);
		weakMap.set(obj, newVal);
		expect(weakMap.get(obj)).toBe(newVal);
		weakMap.delete(obj);
		expect(weakMap.has(obj)).toBe(false);
		expect(weakMap.get(obj)).toBe(undefined);
		expect(weakMap.delete(obj)).toBe(false);
	});
});
