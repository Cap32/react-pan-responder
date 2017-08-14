

let nativeWeakMap;

beforeAll(() => {
	nativeWeakMap = global.WeakMap;
	Reflect.deleteProperty(global, 'WeakMap');
});

afterAll(() => {
	global.WeakMap = nativeWeakMap;
});

test('should `WeakMapPolyfill` work', () => {

	const WeakMapPolyfill = require('../WeakMapPolyfill').default;
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
});
