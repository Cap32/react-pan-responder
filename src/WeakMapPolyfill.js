const $id = Symbol('id');

const supportWeakMap = typeof WeakMap === 'function';

export default (supportWeakMap ?
	WeakMap :
	class WeakMapPolyfill {
			_id = 1;
			_maps = {};

			set(object, value) {
				if (!object[$id]) {
					object[$id] = this._id++;
				}
				this._maps[object[$id]] = value;
			}

			has(object) {
				const id = object[$id];
				return !!id && this._maps.hasOwnProperty(id);
			}

			get(object) {
				return this.has(object) ? this._maps[object[$id]] : undefined;
			}

			delete(object) {
				if (!this.has(object)) {
					return false;
				}
				delete this._maps[object[$id]];
				return true;
			}
	  });
