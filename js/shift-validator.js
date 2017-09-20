(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.validator = require("shift-validator");

},{"shift-validator":78}],2:[function(require,module,exports){
'use strict';

var copy             = require('es5-ext/object/copy')
  , normalizeOptions = require('es5-ext/object/normalize-options')
  , ensureCallable   = require('es5-ext/object/valid-callable')
  , map              = require('es5-ext/object/map')
  , callable         = require('es5-ext/object/valid-callable')
  , validValue       = require('es5-ext/object/valid-value')

  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , define;

define = function (name, desc, options) {
	var value = validValue(desc) && callable(desc.value), dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (!options.overwriteDefinition && hasOwnProperty.call(this, name)) return value;
		desc.value = bind.call(value, options.resolveContext ? options.resolveContext(this) : this);
		defineProperty(this, name, desc);
		return this[name];
	};
	return dgs;
};

module.exports = function (props/*, options*/) {
	var options = normalizeOptions(arguments[1]);
	if (options.resolveContext != null) ensureCallable(options.resolveContext);
	return map(props, function (desc, name) { return define(name, desc, options); });
};

},{"es5-ext/object/copy":25,"es5-ext/object/map":34,"es5-ext/object/normalize-options":35,"es5-ext/object/valid-callable":40,"es5-ext/object/valid-value":41}],3:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":22,"es5-ext/object/is-callable":28,"es5-ext/object/normalize-options":35,"es5-ext/string/#/contains":42}],4:[function(require,module,exports){
// Inspired by Google Closure:
// http://closure-library.googlecode.com/svn/docs/
// closure_goog_array_array.js.html#goog.array.clear

"use strict";

var value = require("../../object/valid-value");

module.exports = function () {
	value(this).length = 0;
	return this;
};

},{"../../object/valid-value":41}],5:[function(require,module,exports){
"use strict";

var numberIsNaN       = require("../../number/is-nan")
  , toPosInt          = require("../../number/to-pos-integer")
  , value             = require("../../object/valid-value")
  , indexOf           = Array.prototype.indexOf
  , objHasOwnProperty = Object.prototype.hasOwnProperty
  , abs               = Math.abs
  , floor             = Math.floor;

module.exports = function (searchElement /*, fromIndex*/) {
	var i, length, fromIndex, val;
	if (!numberIsNaN(searchElement)) return indexOf.apply(this, arguments);

	length = toPosInt(value(this).length);
	fromIndex = arguments[1];
	if (isNaN(fromIndex)) fromIndex = 0;
	else if (fromIndex >= 0) fromIndex = floor(fromIndex);
	else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

	for (i = fromIndex; i < length; ++i) {
		if (objHasOwnProperty.call(this, i)) {
			val = this[i];
			if (numberIsNaN(val)) return i; // Jslint: ignore
		}
	}
	return -1;
};

},{"../../number/is-nan":16,"../../number/to-pos-integer":20,"../../object/valid-value":41}],6:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Array.from
	: require("./shim");

},{"./is-implemented":7,"./shim":8}],7:[function(require,module,exports){
"use strict";

module.exports = function () {
	var from = Array.from, arr, result;
	if (typeof from !== "function") return false;
	arr = ["raz", "dwa"];
	result = from(arr);
	return Boolean(result && (result !== arr) && (result[1] === "dwa"));
};

},{}],8:[function(require,module,exports){
"use strict";

var iteratorSymbol = require("es6-symbol").iterator
  , isArguments    = require("../../function/is-arguments")
  , isFunction     = require("../../function/is-function")
  , toPosInt       = require("../../number/to-pos-integer")
  , callable       = require("../../object/valid-callable")
  , validValue     = require("../../object/valid-value")
  , isValue        = require("../../object/is-value")
  , isString       = require("../../string/is-string")
  , isArray        = Array.isArray
  , call           = Function.prototype.call
  , desc           = { configurable: true, enumerable: true, writable: true, value: null }
  , defineProperty = Object.defineProperty;

// eslint-disable-next-line complexity
module.exports = function (arrayLike /*, mapFn, thisArg*/) {
	var mapFn = arguments[1]
	  , thisArg = arguments[2]
	  , Context
	  , i
	  , j
	  , arr
	  , length
	  , code
	  , iterator
	  , result
	  , getIterator
	  , value;

	arrayLike = Object(validValue(arrayLike));

	if (isValue(mapFn)) callable(mapFn);
	if (!this || this === Array || !isFunction(this)) {
		// Result: Plain array
		if (!mapFn) {
			if (isArguments(arrayLike)) {
				// Source: Arguments
				length = arrayLike.length;
				if (length !== 1) return Array.apply(null, arrayLike);
				arr = new Array(1);
				arr[0] = arrayLike[0];
				return arr;
			}
			if (isArray(arrayLike)) {
				// Source: Array
				arr = new Array(length = arrayLike.length);
				for (i = 0; i < length; ++i) arr[i] = arrayLike[i];
				return arr;
			}
		}
		arr = [];
	} else {
		// Result: Non plain array
		Context = this;
	}

	if (!isArray(arrayLike)) {
		if ((getIterator = arrayLike[iteratorSymbol]) !== undefined) {
			// Source: Iterator
			iterator = callable(getIterator).call(arrayLike);
			if (Context) arr = new Context();
			result = iterator.next();
			i = 0;
			while (!result.done) {
				value = mapFn ? call.call(mapFn, thisArg, result.value, i) : result.value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, i, desc);
				} else {
					arr[i] = value;
				}
				result = iterator.next();
				++i;
			}
			length = i;
		} else if (isString(arrayLike)) {
			// Source: String
			length = arrayLike.length;
			if (Context) arr = new Context();
			for (i = 0, j = 0; i < length; ++i) {
				value = arrayLike[i];
				if (i + 1 < length) {
					code = value.charCodeAt(0);
					// eslint-disable-next-line max-depth
					if (code >= 0xd800 && code <= 0xdbff) value += arrayLike[++i];
				}
				value = mapFn ? call.call(mapFn, thisArg, value, j) : value;
				if (Context) {
					desc.value = value;
					defineProperty(arr, j, desc);
				} else {
					arr[j] = value;
				}
				++j;
			}
			length = j;
		}
	}
	if (length === undefined) {
		// Source: array or array-like
		length = toPosInt(arrayLike.length);
		if (Context) arr = new Context(length);
		for (i = 0; i < length; ++i) {
			value = mapFn ? call.call(mapFn, thisArg, arrayLike[i], i) : arrayLike[i];
			if (Context) {
				desc.value = value;
				defineProperty(arr, i, desc);
			} else {
				arr[i] = value;
			}
		}
	}
	if (Context) {
		desc.value = null;
		arr.length = length;
	}
	return arr;
};

},{"../../function/is-arguments":9,"../../function/is-function":10,"../../number/to-pos-integer":20,"../../object/is-value":30,"../../object/valid-callable":40,"../../object/valid-value":41,"../../string/is-string":45,"es6-symbol":59}],9:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString
  , id = objToString.call(
	(function () {
		return arguments;
	})()
);

module.exports = function (value) {
	return objToString.call(value) === id;
};

},{}],10:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString, id = objToString.call(require("./noop"));

module.exports = function (value) {
	return typeof value === "function" && objToString.call(value) === id;
};

},{"./noop":11}],11:[function(require,module,exports){
"use strict";

// eslint-disable-next-line no-empty-function
module.exports = function () {};

},{}],12:[function(require,module,exports){
/* eslint strict: "off" */

module.exports = (function () {
	return this;
}());

},{}],13:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Math.sign
	: require("./shim");

},{"./is-implemented":14,"./shim":15}],14:[function(require,module,exports){
"use strict";

module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== "function") return false;
	return (sign(10) === 1) && (sign(-20) === -1);
};

},{}],15:[function(require,module,exports){
"use strict";

module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || (value === 0)) return value;
	return value > 0 ? 1 : -1;
};

},{}],16:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Number.isNaN
	: require("./shim");

},{"./is-implemented":17,"./shim":18}],17:[function(require,module,exports){
"use strict";

module.exports = function () {
	var numberIsNaN = Number.isNaN;
	if (typeof numberIsNaN !== "function") return false;
	return !numberIsNaN({}) && numberIsNaN(NaN) && !numberIsNaN(34);
};

},{}],18:[function(require,module,exports){
"use strict";

module.exports = function (value) {
	// eslint-disable-next-line no-self-compare
	return value !== value;
};

},{}],19:[function(require,module,exports){
"use strict";

var sign = require("../math/sign")

  , abs = Math.abs, floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if ((value === 0) || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};

},{"../math/sign":13}],20:[function(require,module,exports){
"use strict";

var toInteger = require("./to-integer")

  , max = Math.max;

module.exports = function (value) {
 return max(0, toInteger(value));
};

},{"./to-integer":19}],21:[function(require,module,exports){
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order

"use strict";

var callable                = require("./valid-callable")
  , value                   = require("./valid-value")
  , bind                    = Function.prototype.bind
  , call                    = Function.prototype.call
  , keys                    = Object.keys
  , objPropertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb /*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort(typeof compareFn === "function" ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== "function") method = list[method];
		return call.call(method, list, function (key, index) {
			if (!objPropertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

},{"./valid-callable":40,"./valid-value":41}],22:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Object.assign
	: require("./shim");

},{"./is-implemented":23,"./shim":24}],23:[function(require,module,exports){
"use strict";

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== "function") return false;
	obj = { foo: "raz" };
	assign(obj, { bar: "dwa" }, { trzy: "trzy" });
	return (obj.foo + obj.bar + obj.trzy) === "razdwatrzy";
};

},{}],24:[function(require,module,exports){
"use strict";

var keys  = require("../keys")
  , value = require("../valid-value")
  , max   = Math.max;

module.exports = function (dest, src /*, …srcn*/) {
	var error, i, length = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try {
			dest[key] = src[key];
		} catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < length; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":31,"../valid-value":41}],25:[function(require,module,exports){
"use strict";

var aFrom  = require("../array/from")
  , assign = require("./assign")
  , value  = require("./valid-value");

module.exports = function (obj/*, propertyNames, options*/) {
	var copy = Object(value(obj)), propertyNames = arguments[1], options = Object(arguments[2]);
	if (copy !== obj && !propertyNames) return copy;
	var result = {};
	if (propertyNames) {
		aFrom(propertyNames, function (propertyName) {
			if (options.ensure || propertyName in obj) result[propertyName] = obj[propertyName];
		});
	} else {
		assign(result, obj);
	}
	return result;
};

},{"../array/from":6,"./assign":22,"./valid-value":41}],26:[function(require,module,exports){
// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

"use strict";

var create = Object.create, shim;

if (!require("./set-prototype-of/is-implemented")()) {
	shim = require("./set-prototype-of/shim");
}

module.exports = (function () {
	var nullObject, polyProps, desc;
	if (!shim) return create;
	if (shim.level !== 1) return create;

	nullObject = {};
	polyProps = {};
	desc = {
		configurable: false,
		enumerable: false,
		writable: true,
		value: undefined
	};
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === "__proto__") {
			polyProps[name] = {
				configurable: true,
				enumerable: false,
				writable: true,
				value: undefined
			};
			return;
		}
		polyProps[name] = desc;
	});
	Object.defineProperties(nullObject, polyProps);

	Object.defineProperty(shim, "nullPolyfill", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: nullObject
	});

	return function (prototype, props) {
		return create(prototype === null ? nullObject : prototype, props);
	};
}());

},{"./set-prototype-of/is-implemented":38,"./set-prototype-of/shim":39}],27:[function(require,module,exports){
"use strict";

module.exports = require("./_iterate")("forEach");

},{"./_iterate":21}],28:[function(require,module,exports){
// Deprecated

"use strict";

module.exports = function (obj) {
 return typeof obj === "function";
};

},{}],29:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

var map = { function: true, object: true };

module.exports = function (value) {
	return (isValue(value) && map[typeof value]) || false;
};

},{"./is-value":30}],30:[function(require,module,exports){
"use strict";

var _undefined = require("../function/noop")(); // Support ES3 engines

module.exports = function (val) {
 return (val !== _undefined) && (val !== null);
};

},{"../function/noop":11}],31:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Object.keys
	: require("./shim");

},{"./is-implemented":32,"./shim":33}],32:[function(require,module,exports){
"use strict";

module.exports = function () {
	try {
		Object.keys("primitive");
		return true;
	} catch (e) {
 return false;
}
};

},{}],33:[function(require,module,exports){
"use strict";

var isValue = require("../is-value");

var keys = Object.keys;

module.exports = function (object) {
	return keys(isValue(object) ? Object(object) : object);
};

},{"../is-value":30}],34:[function(require,module,exports){
"use strict";

var callable = require("./valid-callable")
  , forEach  = require("./for-each")
  , call     = Function.prototype.call;

module.exports = function (obj, cb /*, thisArg*/) {
	var result = {}, thisArg = arguments[2];
	callable(cb);
	forEach(obj, function (value, key, targetObj, index) {
		result[key] = call.call(cb, thisArg, value, key, targetObj, index);
	});
	return result;
};

},{"./for-each":27,"./valid-callable":40}],35:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

// eslint-disable-next-line no-unused-vars
module.exports = function (opts1 /*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (!isValue(options)) return;
		process(Object(options), result);
	});
	return result;
};

},{"./is-value":30}],36:[function(require,module,exports){
"use strict";

var forEach = Array.prototype.forEach, create = Object.create;

// eslint-disable-next-line no-unused-vars
module.exports = function (arg /*, …args*/) {
	var set = create(null);
	forEach.call(arguments, function (name) {
		set[name] = true;
	});
	return set;
};

},{}],37:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? Object.setPrototypeOf
	: require("./shim");

},{"./is-implemented":38,"./shim":39}],38:[function(require,module,exports){
"use strict";

var create = Object.create, getPrototypeOf = Object.getPrototypeOf, plainObject = {};

module.exports = function (/* CustomCreate*/) {
	var setPrototypeOf = Object.setPrototypeOf, customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== "function") return false;
	return getPrototypeOf(setPrototypeOf(customCreate(null), plainObject)) === plainObject;
};

},{}],39:[function(require,module,exports){
/* eslint no-proto: "off" */

// Big thanks to @WebReflection for sorting this out
// https://gist.github.com/WebReflection/5593554

"use strict";

var isObject        = require("../is-object")
  , value           = require("../valid-value")
  , objIsPrototypOf = Object.prototype.isPrototypeOf
  , defineProperty  = Object.defineProperty
  , nullDesc        = {
	configurable: true,
	enumerable: false,
	writable: true,
	value: undefined
}
  , validate;

validate = function (obj, prototype) {
	value(obj);
	if (prototype === null || isObject(prototype)) return obj;
	throw new TypeError("Prototype must be null or an object");
};

module.exports = (function (status) {
	var fn, set;
	if (!status) return null;
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function (obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function (obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self (obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = objIsPrototypOf.call(self.nullPolyfill, obj);
			if (isNullBase) delete self.nullPolyfill.__proto__;
			if (prototype === null) prototype = self.nullPolyfill;
			obj.__proto__ = prototype;
			if (isNullBase) defineProperty(self.nullPolyfill, "__proto__", nullDesc);
			return obj;
		};
	}
	return Object.defineProperty(fn, "level", {
		configurable: false,
		enumerable: false,
		writable: false,
		value: status.level
	});
}(
	(function () {
		var tmpObj1 = Object.create(null)
		  , tmpObj2 = {}
		  , set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(tmpObj1, tmpObj2);
			} catch (ignore) {}
			if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { set: set, level: 2 };
		}

		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 2 };

		tmpObj1 = {};
		tmpObj1.__proto__ = tmpObj2;
		if (Object.getPrototypeOf(tmpObj1) === tmpObj2) return { level: 1 };

		return false;
	})()
));

require("../create");

},{"../create":26,"../is-object":29,"../valid-value":41}],40:[function(require,module,exports){
"use strict";

module.exports = function (fn) {
	if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],41:[function(require,module,exports){
"use strict";

var isValue = require("./is-value");

module.exports = function (value) {
	if (!isValue(value)) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{"./is-value":30}],42:[function(require,module,exports){
"use strict";

module.exports = require("./is-implemented")()
	? String.prototype.contains
	: require("./shim");

},{"./is-implemented":43,"./shim":44}],43:[function(require,module,exports){
"use strict";

var str = "razdwatrzy";

module.exports = function () {
	if (typeof str.contains !== "function") return false;
	return (str.contains("dwa") === true) && (str.contains("foo") === false);
};

},{}],44:[function(require,module,exports){
"use strict";

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],45:[function(require,module,exports){
"use strict";

var objToString = Object.prototype.toString, id = objToString.call("");

module.exports = function (value) {
	return (
		typeof value === "string" ||
		(value &&
			typeof value === "object" &&
			(value instanceof String || objToString.call(value) === id)) ||
		false
	);
};

},{}],46:[function(require,module,exports){
'use strict';

var setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , contains       = require('es5-ext/string/#/contains')
  , d              = require('d')
  , Iterator       = require('./')

  , defineProperty = Object.defineProperty
  , ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
	Iterator.call(this, arr);
	if (!kind) kind = 'value';
	else if (contains.call(kind, 'key+value')) kind = 'key+value';
	else if (contains.call(kind, 'key')) kind = 'key';
	else kind = 'value';
	defineProperty(this, '__kind__', d('', kind));
};
if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

ArrayIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(ArrayIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === 'value') return this.__list__[i];
		if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
		return i;
	}),
	toString: d(function () { return '[object Array Iterator]'; })
});

},{"./":49,"d":3,"es5-ext/object/set-prototype-of":37,"es5-ext/string/#/contains":42}],47:[function(require,module,exports){
'use strict';

var isArguments = require('es5-ext/function/is-arguments')
  , callable    = require('es5-ext/object/valid-callable')
  , isString    = require('es5-ext/string/is-string')
  , get         = require('./get')

  , isArray = Array.isArray, call = Function.prototype.call
  , some = Array.prototype.some;

module.exports = function (iterable, cb/*, thisArg*/) {
	var mode, thisArg = arguments[2], result, doBreak, broken, i, l, char, code;
	if (isArray(iterable) || isArguments(iterable)) mode = 'array';
	else if (isString(iterable)) mode = 'string';
	else iterable = get(iterable);

	callable(cb);
	doBreak = function () { broken = true; };
	if (mode === 'array') {
		some.call(iterable, function (value) {
			call.call(cb, thisArg, value, doBreak);
			if (broken) return true;
		});
		return;
	}
	if (mode === 'string') {
		l = iterable.length;
		for (i = 0; i < l; ++i) {
			char = iterable[i];
			if ((i + 1) < l) {
				code = char.charCodeAt(0);
				if ((code >= 0xD800) && (code <= 0xDBFF)) char += iterable[++i];
			}
			call.call(cb, thisArg, char, doBreak);
			if (broken) break;
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call.call(cb, thisArg, result.value, doBreak);
		if (broken) return;
		result = iterable.next();
	}
};

},{"./get":48,"es5-ext/function/is-arguments":9,"es5-ext/object/valid-callable":40,"es5-ext/string/is-string":45}],48:[function(require,module,exports){
'use strict';

var isArguments    = require('es5-ext/function/is-arguments')
  , isString       = require('es5-ext/string/is-string')
  , ArrayIterator  = require('./array')
  , StringIterator = require('./string')
  , iterable       = require('./valid-iterable')
  , iteratorSymbol = require('es6-symbol').iterator;

module.exports = function (obj) {
	if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
	if (isArguments(obj)) return new ArrayIterator(obj);
	if (isString(obj)) return new StringIterator(obj);
	return new ArrayIterator(obj);
};

},{"./array":46,"./string":51,"./valid-iterable":52,"es5-ext/function/is-arguments":9,"es5-ext/string/is-string":45,"es6-symbol":59}],49:[function(require,module,exports){
'use strict';

var clear    = require('es5-ext/array/#/clear')
  , assign   = require('es5-ext/object/assign')
  , callable = require('es5-ext/object/valid-callable')
  , value    = require('es5-ext/object/valid-value')
  , d        = require('d')
  , autoBind = require('d/auto-bind')
  , Symbol   = require('es6-symbol')

  , defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , Iterator;

module.exports = Iterator = function (list, context) {
	if (!(this instanceof Iterator)) return new Iterator(list, context);
	defineProperties(this, {
		__list__: d('w', value(list)),
		__context__: d('w', context),
		__nextIndex__: d('w', 0)
	});
	if (!context) return;
	callable(context.on);
	context.on('_add', this._onAdd);
	context.on('_delete', this._onDelete);
	context.on('_clear', this._onClear);
};

defineProperties(Iterator.prototype, assign({
	constructor: d(Iterator),
	_next: d(function () {
		var i;
		if (!this.__list__) return;
		if (this.__redo__) {
			i = this.__redo__.shift();
			if (i !== undefined) return i;
		}
		if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
		this._unBind();
	}),
	next: d(function () { return this._createResult(this._next()); }),
	_createResult: d(function (i) {
		if (i === undefined) return { done: true, value: undefined };
		return { done: false, value: this._resolve(i) };
	}),
	_resolve: d(function (i) { return this.__list__[i]; }),
	_unBind: d(function () {
		this.__list__ = null;
		delete this.__redo__;
		if (!this.__context__) return;
		this.__context__.off('_add', this._onAdd);
		this.__context__.off('_delete', this._onDelete);
		this.__context__.off('_clear', this._onClear);
		this.__context__ = null;
	}),
	toString: d(function () { return '[object Iterator]'; })
}, autoBind({
	_onAdd: d(function (index) {
		if (index >= this.__nextIndex__) return;
		++this.__nextIndex__;
		if (!this.__redo__) {
			defineProperty(this, '__redo__', d('c', [index]));
			return;
		}
		this.__redo__.forEach(function (redo, i) {
			if (redo >= index) this.__redo__[i] = ++redo;
		}, this);
		this.__redo__.push(index);
	}),
	_onDelete: d(function (index) {
		var i;
		if (index >= this.__nextIndex__) return;
		--this.__nextIndex__;
		if (!this.__redo__) return;
		i = this.__redo__.indexOf(index);
		if (i !== -1) this.__redo__.splice(i, 1);
		this.__redo__.forEach(function (redo, i) {
			if (redo > index) this.__redo__[i] = --redo;
		}, this);
	}),
	_onClear: d(function () {
		if (this.__redo__) clear.call(this.__redo__);
		this.__nextIndex__ = 0;
	})
})));

defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
	return this;
}));
defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));

},{"d":3,"d/auto-bind":2,"es5-ext/array/#/clear":4,"es5-ext/object/assign":22,"es5-ext/object/valid-callable":40,"es5-ext/object/valid-value":41,"es6-symbol":59}],50:[function(require,module,exports){
'use strict';

var isArguments    = require('es5-ext/function/is-arguments')
  , isString       = require('es5-ext/string/is-string')
  , iteratorSymbol = require('es6-symbol').iterator

  , isArray = Array.isArray;

module.exports = function (value) {
	if (value == null) return false;
	if (isArray(value)) return true;
	if (isString(value)) return true;
	if (isArguments(value)) return true;
	return (typeof value[iteratorSymbol] === 'function');
};

},{"es5-ext/function/is-arguments":9,"es5-ext/string/is-string":45,"es6-symbol":59}],51:[function(require,module,exports){
// Thanks @mathiasbynens
// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

'use strict';

var setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , d              = require('d')
  , Iterator       = require('./')

  , defineProperty = Object.defineProperty
  , StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) return new StringIterator(str);
	str = String(str);
	Iterator.call(this, str);
	defineProperty(this, '__length__', d('', str.length));

};
if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

StringIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(StringIterator),
	_next: d(function () {
		if (!this.__list__) return;
		if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
		this._unBind();
	}),
	_resolve: d(function (i) {
		var char = this.__list__[i], code;
		if (this.__nextIndex__ === this.__length__) return char;
		code = char.charCodeAt(0);
		if ((code >= 0xD800) && (code <= 0xDBFF)) return char + this.__list__[this.__nextIndex__++];
		return char;
	}),
	toString: d(function () { return '[object String Iterator]'; })
});

},{"./":49,"d":3,"es5-ext/object/set-prototype-of":37}],52:[function(require,module,exports){
'use strict';

var isIterable = require('./is-iterable');

module.exports = function (value) {
	if (!isIterable(value)) throw new TypeError(value + " is not iterable");
	return value;
};

},{"./is-iterable":50}],53:[function(require,module,exports){
'use strict';

if (!require('./is-implemented')()) {
	Object.defineProperty(require('es5-ext/global'), 'Map',
		{ value: require('./polyfill'), configurable: true, enumerable: false,
			writable: true });
}

},{"./is-implemented":54,"./polyfill":58,"es5-ext/global":12}],54:[function(require,module,exports){
'use strict';

module.exports = function () {
	var map, iterator, result;
	if (typeof Map !== 'function') return false;
	try {
		// WebKit doesn't support arguments and crashes
		map = new Map([['raz', 'one'], ['dwa', 'two'], ['trzy', 'three']]);
	} catch (e) {
		return false;
	}
	if (String(map) !== '[object Map]') return false;
	if (map.size !== 3) return false;
	if (typeof map.clear !== 'function') return false;
	if (typeof map.delete !== 'function') return false;
	if (typeof map.entries !== 'function') return false;
	if (typeof map.forEach !== 'function') return false;
	if (typeof map.get !== 'function') return false;
	if (typeof map.has !== 'function') return false;
	if (typeof map.keys !== 'function') return false;
	if (typeof map.set !== 'function') return false;
	if (typeof map.values !== 'function') return false;

	iterator = map.entries();
	result = iterator.next();
	if (result.done !== false) return false;
	if (!result.value) return false;
	if (result.value[0] !== 'raz') return false;
	if (result.value[1] !== 'one') return false;

	return true;
};

},{}],55:[function(require,module,exports){
// Exports true if environment provides native `Map` implementation,
// whatever that is.

'use strict';

module.exports = (function () {
	if (typeof Map === 'undefined') return false;
	return (Object.prototype.toString.call(new Map()) === '[object Map]');
}());

},{}],56:[function(require,module,exports){
'use strict';

module.exports = require('es5-ext/object/primitive-set')('key',
	'value', 'key+value');

},{"es5-ext/object/primitive-set":36}],57:[function(require,module,exports){
'use strict';

var setPrototypeOf    = require('es5-ext/object/set-prototype-of')
  , d                 = require('d')
  , Iterator          = require('es6-iterator')
  , toStringTagSymbol = require('es6-symbol').toStringTag
  , kinds             = require('./iterator-kinds')

  , defineProperties = Object.defineProperties
  , unBind = Iterator.prototype._unBind
  , MapIterator;

MapIterator = module.exports = function (map, kind) {
	if (!(this instanceof MapIterator)) return new MapIterator(map, kind);
	Iterator.call(this, map.__mapKeysData__, map);
	if (!kind || !kinds[kind]) kind = 'key+value';
	defineProperties(this, {
		__kind__: d('', kind),
		__values__: d('w', map.__mapValuesData__)
	});
};
if (setPrototypeOf) setPrototypeOf(MapIterator, Iterator);

MapIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(MapIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === 'value') return this.__values__[i];
		if (this.__kind__ === 'key') return this.__list__[i];
		return [this.__list__[i], this.__values__[i]];
	}),
	_unBind: d(function () {
		this.__values__ = null;
		unBind.call(this);
	}),
	toString: d(function () { return '[object Map Iterator]'; })
});
Object.defineProperty(MapIterator.prototype, toStringTagSymbol,
	d('c', 'Map Iterator'));

},{"./iterator-kinds":56,"d":3,"es5-ext/object/set-prototype-of":37,"es6-iterator":49,"es6-symbol":59}],58:[function(require,module,exports){
'use strict';

var clear          = require('es5-ext/array/#/clear')
  , eIndexOf       = require('es5-ext/array/#/e-index-of')
  , setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , callable       = require('es5-ext/object/valid-callable')
  , validValue     = require('es5-ext/object/valid-value')
  , d              = require('d')
  , ee             = require('event-emitter')
  , Symbol         = require('es6-symbol')
  , iterator       = require('es6-iterator/valid-iterable')
  , forOf          = require('es6-iterator/for-of')
  , Iterator       = require('./lib/iterator')
  , isNative       = require('./is-native-implemented')

  , call = Function.prototype.call
  , defineProperties = Object.defineProperties, getPrototypeOf = Object.getPrototypeOf
  , MapPoly;

module.exports = MapPoly = function (/*iterable*/) {
	var iterable = arguments[0], keys, values, self;
	if (!(this instanceof MapPoly)) throw new TypeError('Constructor requires \'new\'');
	if (isNative && setPrototypeOf && (Map !== MapPoly)) {
		self = setPrototypeOf(new Map(), getPrototypeOf(this));
	} else {
		self = this;
	}
	if (iterable != null) iterator(iterable);
	defineProperties(self, {
		__mapKeysData__: d('c', keys = []),
		__mapValuesData__: d('c', values = [])
	});
	if (!iterable) return self;
	forOf(iterable, function (value) {
		var key = validValue(value)[0];
		value = value[1];
		if (eIndexOf.call(keys, key) !== -1) return;
		keys.push(key);
		values.push(value);
	}, self);
	return self;
};

if (isNative) {
	if (setPrototypeOf) setPrototypeOf(MapPoly, Map);
	MapPoly.prototype = Object.create(Map.prototype, {
		constructor: d(MapPoly)
	});
}

ee(defineProperties(MapPoly.prototype, {
	clear: d(function () {
		if (!this.__mapKeysData__.length) return;
		clear.call(this.__mapKeysData__);
		clear.call(this.__mapValuesData__);
		this.emit('_clear');
	}),
	delete: d(function (key) {
		var index = eIndexOf.call(this.__mapKeysData__, key);
		if (index === -1) return false;
		this.__mapKeysData__.splice(index, 1);
		this.__mapValuesData__.splice(index, 1);
		this.emit('_delete', index, key);
		return true;
	}),
	entries: d(function () { return new Iterator(this, 'key+value'); }),
	forEach: d(function (cb/*, thisArg*/) {
		var thisArg = arguments[1], iterator, result;
		callable(cb);
		iterator = this.entries();
		result = iterator._next();
		while (result !== undefined) {
			call.call(cb, thisArg, this.__mapValuesData__[result],
				this.__mapKeysData__[result], this);
			result = iterator._next();
		}
	}),
	get: d(function (key) {
		var index = eIndexOf.call(this.__mapKeysData__, key);
		if (index === -1) return;
		return this.__mapValuesData__[index];
	}),
	has: d(function (key) {
		return (eIndexOf.call(this.__mapKeysData__, key) !== -1);
	}),
	keys: d(function () { return new Iterator(this, 'key'); }),
	set: d(function (key, value) {
		var index = eIndexOf.call(this.__mapKeysData__, key), emit;
		if (index === -1) {
			index = this.__mapKeysData__.push(key) - 1;
			emit = true;
		}
		this.__mapValuesData__[index] = value;
		if (emit) this.emit('_add', index, key);
		return this;
	}),
	size: d.gs(function () { return this.__mapKeysData__.length; }),
	values: d(function () { return new Iterator(this, 'value'); }),
	toString: d(function () { return '[object Map]'; })
}));
Object.defineProperty(MapPoly.prototype, Symbol.iterator, d(function () {
	return this.entries();
}));
Object.defineProperty(MapPoly.prototype, Symbol.toStringTag, d('c', 'Map'));

},{"./is-native-implemented":55,"./lib/iterator":57,"d":3,"es5-ext/array/#/clear":4,"es5-ext/array/#/e-index-of":5,"es5-ext/object/set-prototype-of":37,"es5-ext/object/valid-callable":40,"es5-ext/object/valid-value":41,"es6-iterator/for-of":47,"es6-iterator/valid-iterable":52,"es6-symbol":59,"event-emitter":64}],59:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":60,"./polyfill":62}],60:[function(require,module,exports){
'use strict';

var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};

},{}],61:[function(require,module,exports){
'use strict';

module.exports = function (x) {
	if (!x) return false;
	if (typeof x === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return (x[x.constructor.toStringTag] === 'Symbol');
};

},{}],62:[function(require,module,exports){
// ES2015 Symbol polyfill for environments that do not (or partially) support it

'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// To ensure proper interoperability with other native functions (e.g. Array.from)
	// fallback to eventual native implementation of given symbol
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

},{"./validate-symbol":63,"d":3}],63:[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":61}],64:[function(require,module,exports){
'use strict';

var d        = require('d')
  , callable = require('es5-ext/object/valid-callable')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;

},{"d":3,"es5-ext/object/valid-callable":40}],65:[function(require,module,exports){
"use strict";

/* global module, define */

var Multimap = (function() {
  var mapCtor;
  if (typeof Map !== 'undefined') {
    mapCtor = Map;
  }

  function Multimap(iterable) {
    var self = this;

    self._map = mapCtor;
    
    if (Multimap.Map) {
      self._map = Multimap.Map;
    }

    self._ = self._map ? new self._map() : {};

    if (iterable) {
      iterable.forEach(function(i) {
        self.set(i[0], i[1]);
      });
    }
  }

  /**
   * @param {Object} key
   * @return {Array} An array of values, undefined if no such a key;
   */
  Multimap.prototype.get = function(key) {
    return this._map ? this._.get(key) : this._[key];
  };

  /** 
   * @param {Object} key
   * @param {Object} val...
   */
  Multimap.prototype.set = function(key, val) {
    var args = Array.prototype.slice.call(arguments);

    key = args.shift();

    var entry = this.get(key);
    if (!entry) {
      entry = [];
      if (this._map)
        this._.set(key, entry);
      else
        this._[key] = entry;
    }

    Array.prototype.push.apply(entry, args);
    return this;
  };

  /**
   * @param {Object} key
   * @param {Object=} val
   * @return {boolean} true if any thing changed
   */
  Multimap.prototype.delete = function(key, val) {
    if (!this.has(key))
      return false;

    if (arguments.length == 1) {
      this._map ? (this._.delete(key)) : (delete this._[key]);
      return true;
    } else {
      var entry = this.get(key);
      var idx = entry.indexOf(val);
      if (idx != -1) {
        entry.splice(idx, 1);
        return true;
      }
    }

    return false;
  };

  /**
   * @param {Object} key
   * @param {Object=} val
   * @return {boolean} whether the map contains 'key' or 'key=>val' pair
   */
  Multimap.prototype.has = function(key, val) {
    var hasKey = this._map ? this._.has(key) : this._.hasOwnProperty(key);

    if (arguments.length == 1 || !hasKey)
      return hasKey;

    var entry = this.get(key) || [];
    return entry.indexOf(val) != -1;
  };

  /**
   * @return {Array} all the keys in the map
   */
  Multimap.prototype.keys = function() {
    if (this._map) 
      return this._.keys();

    return makeIterator(Object.keys(this._));
  };

  /**
   * @return {Array} all the values in the map
   */
  Multimap.prototype.values = function() {
    var vals = [];
    this.forEachEntry(function(entry) {
      Array.prototype.push.apply(vals, entry);
    });

    return makeIterator(vals);
  };

  /**
   *
   */
  Multimap.prototype.forEachEntry = function(iter) {
    var self = this;

    var keys = self.keys();
    var next;
    while(!(next = keys.next()).done) {
      iter(self.get(next.value), next.value, self);
    }
  };

  Multimap.prototype.forEach = function(iter) {
    var self = this;
    self.forEachEntry(function(entry, key) {
      entry.forEach(function(item) {
        iter(item, key, self);
      });
    });
  };


  Multimap.prototype.clear = function() {
    if (this._map) {
      this._.clear();
    } else {
      this._ = {};
    }
  };

  Object.defineProperty(
    Multimap.prototype,
    "size", {
      configurable: false,
      enumerable: true,
      get: function() {
        var self = this;
        var keys = self.keys();
        var next, total = 0;
        while(!(next = keys.next()).done) {
          total += self.get(next.value).length;
        }
        return total;
      }
    });


  function makeIterator(array){
    var nextIndex = 0;
    
    return {
      next: function(){
        return nextIndex < array.length ?
          {value: array[nextIndex++], done: false} :
        {done: true};
      }
    };
  }

  return Multimap;
})();


if(typeof exports === 'object' && module && module.exports)
  module.exports = Multimap;
else if(typeof define === 'function' && define.amd)
  define(function() { return Multimap; });

},{}],66:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Generated by src/generate.js.

/**
 * Copyright 2016 Shape Security, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ArrayAssignmentTarget = exports.ArrayAssignmentTarget = function ArrayAssignmentTarget(_ref) {
  var elements = _ref.elements;
  var rest = _ref.rest;

  _classCallCheck(this, ArrayAssignmentTarget);

  this.type = 'ArrayAssignmentTarget';
  this.elements = elements;
  this.rest = rest;
};

var ArrayBinding = exports.ArrayBinding = function ArrayBinding(_ref2) {
  var elements = _ref2.elements;
  var rest = _ref2.rest;

  _classCallCheck(this, ArrayBinding);

  this.type = 'ArrayBinding';
  this.elements = elements;
  this.rest = rest;
};

var ArrayExpression = exports.ArrayExpression = function ArrayExpression(_ref3) {
  var elements = _ref3.elements;

  _classCallCheck(this, ArrayExpression);

  this.type = 'ArrayExpression';
  this.elements = elements;
};

var ArrowExpression = exports.ArrowExpression = function ArrowExpression(_ref4) {
  var params = _ref4.params;
  var body = _ref4.body;

  _classCallCheck(this, ArrowExpression);

  this.type = 'ArrowExpression';
  this.params = params;
  this.body = body;
};

var AssignmentExpression = exports.AssignmentExpression = function AssignmentExpression(_ref5) {
  var binding = _ref5.binding;
  var expression = _ref5.expression;

  _classCallCheck(this, AssignmentExpression);

  this.type = 'AssignmentExpression';
  this.binding = binding;
  this.expression = expression;
};

var AssignmentTargetIdentifier = exports.AssignmentTargetIdentifier = function AssignmentTargetIdentifier(_ref6) {
  var name = _ref6.name;

  _classCallCheck(this, AssignmentTargetIdentifier);

  this.type = 'AssignmentTargetIdentifier';
  this.name = name;
};

var AssignmentTargetPropertyIdentifier = exports.AssignmentTargetPropertyIdentifier = function AssignmentTargetPropertyIdentifier(_ref7) {
  var binding = _ref7.binding;
  var init = _ref7.init;

  _classCallCheck(this, AssignmentTargetPropertyIdentifier);

  this.type = 'AssignmentTargetPropertyIdentifier';
  this.binding = binding;
  this.init = init;
};

var AssignmentTargetPropertyProperty = exports.AssignmentTargetPropertyProperty = function AssignmentTargetPropertyProperty(_ref8) {
  var name = _ref8.name;
  var binding = _ref8.binding;

  _classCallCheck(this, AssignmentTargetPropertyProperty);

  this.type = 'AssignmentTargetPropertyProperty';
  this.name = name;
  this.binding = binding;
};

var AssignmentTargetWithDefault = exports.AssignmentTargetWithDefault = function AssignmentTargetWithDefault(_ref9) {
  var binding = _ref9.binding;
  var init = _ref9.init;

  _classCallCheck(this, AssignmentTargetWithDefault);

  this.type = 'AssignmentTargetWithDefault';
  this.binding = binding;
  this.init = init;
};

var BinaryExpression = exports.BinaryExpression = function BinaryExpression(_ref10) {
  var left = _ref10.left;
  var operator = _ref10.operator;
  var right = _ref10.right;

  _classCallCheck(this, BinaryExpression);

  this.type = 'BinaryExpression';
  this.left = left;
  this.operator = operator;
  this.right = right;
};

var BindingIdentifier = exports.BindingIdentifier = function BindingIdentifier(_ref11) {
  var name = _ref11.name;

  _classCallCheck(this, BindingIdentifier);

  this.type = 'BindingIdentifier';
  this.name = name;
};

var BindingPropertyIdentifier = exports.BindingPropertyIdentifier = function BindingPropertyIdentifier(_ref12) {
  var binding = _ref12.binding;
  var init = _ref12.init;

  _classCallCheck(this, BindingPropertyIdentifier);

  this.type = 'BindingPropertyIdentifier';
  this.binding = binding;
  this.init = init;
};

var BindingPropertyProperty = exports.BindingPropertyProperty = function BindingPropertyProperty(_ref13) {
  var name = _ref13.name;
  var binding = _ref13.binding;

  _classCallCheck(this, BindingPropertyProperty);

  this.type = 'BindingPropertyProperty';
  this.name = name;
  this.binding = binding;
};

var BindingWithDefault = exports.BindingWithDefault = function BindingWithDefault(_ref14) {
  var binding = _ref14.binding;
  var init = _ref14.init;

  _classCallCheck(this, BindingWithDefault);

  this.type = 'BindingWithDefault';
  this.binding = binding;
  this.init = init;
};

var Block = exports.Block = function Block(_ref15) {
  var statements = _ref15.statements;

  _classCallCheck(this, Block);

  this.type = 'Block';
  this.statements = statements;
};

var BlockStatement = exports.BlockStatement = function BlockStatement(_ref16) {
  var block = _ref16.block;

  _classCallCheck(this, BlockStatement);

  this.type = 'BlockStatement';
  this.block = block;
};

var BreakStatement = exports.BreakStatement = function BreakStatement(_ref17) {
  var label = _ref17.label;

  _classCallCheck(this, BreakStatement);

  this.type = 'BreakStatement';
  this.label = label;
};

var CallExpression = exports.CallExpression = function CallExpression(_ref18) {
  var callee = _ref18.callee;
  var _arguments = _ref18.arguments;

  _classCallCheck(this, CallExpression);

  this.type = 'CallExpression';
  this.callee = callee;
  this.arguments = _arguments;
};

var CatchClause = exports.CatchClause = function CatchClause(_ref19) {
  var binding = _ref19.binding;
  var body = _ref19.body;

  _classCallCheck(this, CatchClause);

  this.type = 'CatchClause';
  this.binding = binding;
  this.body = body;
};

var ClassDeclaration = exports.ClassDeclaration = function ClassDeclaration(_ref20) {
  var name = _ref20.name;
  var _super = _ref20.super;
  var elements = _ref20.elements;

  _classCallCheck(this, ClassDeclaration);

  this.type = 'ClassDeclaration';
  this.name = name;
  this.super = _super;
  this.elements = elements;
};

var ClassElement = exports.ClassElement = function ClassElement(_ref21) {
  var isStatic = _ref21.isStatic;
  var method = _ref21.method;

  _classCallCheck(this, ClassElement);

  this.type = 'ClassElement';
  this.isStatic = isStatic;
  this.method = method;
};

var ClassExpression = exports.ClassExpression = function ClassExpression(_ref22) {
  var name = _ref22.name;
  var _super = _ref22.super;
  var elements = _ref22.elements;

  _classCallCheck(this, ClassExpression);

  this.type = 'ClassExpression';
  this.name = name;
  this.super = _super;
  this.elements = elements;
};

var CompoundAssignmentExpression = exports.CompoundAssignmentExpression = function CompoundAssignmentExpression(_ref23) {
  var binding = _ref23.binding;
  var operator = _ref23.operator;
  var expression = _ref23.expression;

  _classCallCheck(this, CompoundAssignmentExpression);

  this.type = 'CompoundAssignmentExpression';
  this.binding = binding;
  this.operator = operator;
  this.expression = expression;
};

var ComputedMemberAssignmentTarget = exports.ComputedMemberAssignmentTarget = function ComputedMemberAssignmentTarget(_ref24) {
  var object = _ref24.object;
  var expression = _ref24.expression;

  _classCallCheck(this, ComputedMemberAssignmentTarget);

  this.type = 'ComputedMemberAssignmentTarget';
  this.object = object;
  this.expression = expression;
};

var ComputedMemberExpression = exports.ComputedMemberExpression = function ComputedMemberExpression(_ref25) {
  var object = _ref25.object;
  var expression = _ref25.expression;

  _classCallCheck(this, ComputedMemberExpression);

  this.type = 'ComputedMemberExpression';
  this.object = object;
  this.expression = expression;
};

var ComputedPropertyName = exports.ComputedPropertyName = function ComputedPropertyName(_ref26) {
  var expression = _ref26.expression;

  _classCallCheck(this, ComputedPropertyName);

  this.type = 'ComputedPropertyName';
  this.expression = expression;
};

var ConditionalExpression = exports.ConditionalExpression = function ConditionalExpression(_ref27) {
  var test = _ref27.test;
  var consequent = _ref27.consequent;
  var alternate = _ref27.alternate;

  _classCallCheck(this, ConditionalExpression);

  this.type = 'ConditionalExpression';
  this.test = test;
  this.consequent = consequent;
  this.alternate = alternate;
};

var ContinueStatement = exports.ContinueStatement = function ContinueStatement(_ref28) {
  var label = _ref28.label;

  _classCallCheck(this, ContinueStatement);

  this.type = 'ContinueStatement';
  this.label = label;
};

var DataProperty = exports.DataProperty = function DataProperty(_ref29) {
  var name = _ref29.name;
  var expression = _ref29.expression;

  _classCallCheck(this, DataProperty);

  this.type = 'DataProperty';
  this.name = name;
  this.expression = expression;
};

var DebuggerStatement = exports.DebuggerStatement = function DebuggerStatement() {
  _classCallCheck(this, DebuggerStatement);

  this.type = 'DebuggerStatement';
};

var Directive = exports.Directive = function Directive(_ref30) {
  var rawValue = _ref30.rawValue;

  _classCallCheck(this, Directive);

  this.type = 'Directive';
  this.rawValue = rawValue;
};

var DoWhileStatement = exports.DoWhileStatement = function DoWhileStatement(_ref31) {
  var body = _ref31.body;
  var test = _ref31.test;

  _classCallCheck(this, DoWhileStatement);

  this.type = 'DoWhileStatement';
  this.body = body;
  this.test = test;
};

var EmptyStatement = exports.EmptyStatement = function EmptyStatement() {
  _classCallCheck(this, EmptyStatement);

  this.type = 'EmptyStatement';
};

var Export = exports.Export = function Export(_ref32) {
  var declaration = _ref32.declaration;

  _classCallCheck(this, Export);

  this.type = 'Export';
  this.declaration = declaration;
};

var ExportAllFrom = exports.ExportAllFrom = function ExportAllFrom(_ref33) {
  var moduleSpecifier = _ref33.moduleSpecifier;

  _classCallCheck(this, ExportAllFrom);

  this.type = 'ExportAllFrom';
  this.moduleSpecifier = moduleSpecifier;
};

var ExportDefault = exports.ExportDefault = function ExportDefault(_ref34) {
  var body = _ref34.body;

  _classCallCheck(this, ExportDefault);

  this.type = 'ExportDefault';
  this.body = body;
};

var ExportFrom = exports.ExportFrom = function ExportFrom(_ref35) {
  var namedExports = _ref35.namedExports;
  var moduleSpecifier = _ref35.moduleSpecifier;

  _classCallCheck(this, ExportFrom);

  this.type = 'ExportFrom';
  this.namedExports = namedExports;
  this.moduleSpecifier = moduleSpecifier;
};

var ExportFromSpecifier = exports.ExportFromSpecifier = function ExportFromSpecifier(_ref36) {
  var name = _ref36.name;
  var exportedName = _ref36.exportedName;

  _classCallCheck(this, ExportFromSpecifier);

  this.type = 'ExportFromSpecifier';
  this.name = name;
  this.exportedName = exportedName;
};

var ExportLocalSpecifier = exports.ExportLocalSpecifier = function ExportLocalSpecifier(_ref37) {
  var name = _ref37.name;
  var exportedName = _ref37.exportedName;

  _classCallCheck(this, ExportLocalSpecifier);

  this.type = 'ExportLocalSpecifier';
  this.name = name;
  this.exportedName = exportedName;
};

var ExportLocals = exports.ExportLocals = function ExportLocals(_ref38) {
  var namedExports = _ref38.namedExports;

  _classCallCheck(this, ExportLocals);

  this.type = 'ExportLocals';
  this.namedExports = namedExports;
};

var ExpressionStatement = exports.ExpressionStatement = function ExpressionStatement(_ref39) {
  var expression = _ref39.expression;

  _classCallCheck(this, ExpressionStatement);

  this.type = 'ExpressionStatement';
  this.expression = expression;
};

var ForInStatement = exports.ForInStatement = function ForInStatement(_ref40) {
  var left = _ref40.left;
  var right = _ref40.right;
  var body = _ref40.body;

  _classCallCheck(this, ForInStatement);

  this.type = 'ForInStatement';
  this.left = left;
  this.right = right;
  this.body = body;
};

var ForOfStatement = exports.ForOfStatement = function ForOfStatement(_ref41) {
  var left = _ref41.left;
  var right = _ref41.right;
  var body = _ref41.body;

  _classCallCheck(this, ForOfStatement);

  this.type = 'ForOfStatement';
  this.left = left;
  this.right = right;
  this.body = body;
};

var ForStatement = exports.ForStatement = function ForStatement(_ref42) {
  var init = _ref42.init;
  var test = _ref42.test;
  var update = _ref42.update;
  var body = _ref42.body;

  _classCallCheck(this, ForStatement);

  this.type = 'ForStatement';
  this.init = init;
  this.test = test;
  this.update = update;
  this.body = body;
};

var FormalParameters = exports.FormalParameters = function FormalParameters(_ref43) {
  var items = _ref43.items;
  var rest = _ref43.rest;

  _classCallCheck(this, FormalParameters);

  this.type = 'FormalParameters';
  this.items = items;
  this.rest = rest;
};

var FunctionBody = exports.FunctionBody = function FunctionBody(_ref44) {
  var directives = _ref44.directives;
  var statements = _ref44.statements;

  _classCallCheck(this, FunctionBody);

  this.type = 'FunctionBody';
  this.directives = directives;
  this.statements = statements;
};

var FunctionDeclaration = exports.FunctionDeclaration = function FunctionDeclaration(_ref45) {
  var isGenerator = _ref45.isGenerator;
  var name = _ref45.name;
  var params = _ref45.params;
  var body = _ref45.body;

  _classCallCheck(this, FunctionDeclaration);

  this.type = 'FunctionDeclaration';
  this.isGenerator = isGenerator;
  this.name = name;
  this.params = params;
  this.body = body;
};

var FunctionExpression = exports.FunctionExpression = function FunctionExpression(_ref46) {
  var isGenerator = _ref46.isGenerator;
  var name = _ref46.name;
  var params = _ref46.params;
  var body = _ref46.body;

  _classCallCheck(this, FunctionExpression);

  this.type = 'FunctionExpression';
  this.isGenerator = isGenerator;
  this.name = name;
  this.params = params;
  this.body = body;
};

var Getter = exports.Getter = function Getter(_ref47) {
  var name = _ref47.name;
  var body = _ref47.body;

  _classCallCheck(this, Getter);

  this.type = 'Getter';
  this.name = name;
  this.body = body;
};

var IdentifierExpression = exports.IdentifierExpression = function IdentifierExpression(_ref48) {
  var name = _ref48.name;

  _classCallCheck(this, IdentifierExpression);

  this.type = 'IdentifierExpression';
  this.name = name;
};

var IfStatement = exports.IfStatement = function IfStatement(_ref49) {
  var test = _ref49.test;
  var consequent = _ref49.consequent;
  var alternate = _ref49.alternate;

  _classCallCheck(this, IfStatement);

  this.type = 'IfStatement';
  this.test = test;
  this.consequent = consequent;
  this.alternate = alternate;
};

var Import = exports.Import = function Import(_ref50) {
  var defaultBinding = _ref50.defaultBinding;
  var namedImports = _ref50.namedImports;
  var moduleSpecifier = _ref50.moduleSpecifier;

  _classCallCheck(this, Import);

  this.type = 'Import';
  this.defaultBinding = defaultBinding;
  this.namedImports = namedImports;
  this.moduleSpecifier = moduleSpecifier;
};

var ImportNamespace = exports.ImportNamespace = function ImportNamespace(_ref51) {
  var defaultBinding = _ref51.defaultBinding;
  var namespaceBinding = _ref51.namespaceBinding;
  var moduleSpecifier = _ref51.moduleSpecifier;

  _classCallCheck(this, ImportNamespace);

  this.type = 'ImportNamespace';
  this.defaultBinding = defaultBinding;
  this.namespaceBinding = namespaceBinding;
  this.moduleSpecifier = moduleSpecifier;
};

var ImportSpecifier = exports.ImportSpecifier = function ImportSpecifier(_ref52) {
  var name = _ref52.name;
  var binding = _ref52.binding;

  _classCallCheck(this, ImportSpecifier);

  this.type = 'ImportSpecifier';
  this.name = name;
  this.binding = binding;
};

var LabeledStatement = exports.LabeledStatement = function LabeledStatement(_ref53) {
  var label = _ref53.label;
  var body = _ref53.body;

  _classCallCheck(this, LabeledStatement);

  this.type = 'LabeledStatement';
  this.label = label;
  this.body = body;
};

var LiteralBooleanExpression = exports.LiteralBooleanExpression = function LiteralBooleanExpression(_ref54) {
  var value = _ref54.value;

  _classCallCheck(this, LiteralBooleanExpression);

  this.type = 'LiteralBooleanExpression';
  this.value = value;
};

var LiteralInfinityExpression = exports.LiteralInfinityExpression = function LiteralInfinityExpression() {
  _classCallCheck(this, LiteralInfinityExpression);

  this.type = 'LiteralInfinityExpression';
};

var LiteralNullExpression = exports.LiteralNullExpression = function LiteralNullExpression() {
  _classCallCheck(this, LiteralNullExpression);

  this.type = 'LiteralNullExpression';
};

var LiteralNumericExpression = exports.LiteralNumericExpression = function LiteralNumericExpression(_ref55) {
  var value = _ref55.value;

  _classCallCheck(this, LiteralNumericExpression);

  this.type = 'LiteralNumericExpression';
  this.value = value;
};

var LiteralRegExpExpression = exports.LiteralRegExpExpression = function LiteralRegExpExpression(_ref56) {
  var pattern = _ref56.pattern;
  var global = _ref56.global;
  var ignoreCase = _ref56.ignoreCase;
  var multiLine = _ref56.multiLine;
  var sticky = _ref56.sticky;
  var unicode = _ref56.unicode;

  _classCallCheck(this, LiteralRegExpExpression);

  this.type = 'LiteralRegExpExpression';
  this.pattern = pattern;
  this.global = global;
  this.ignoreCase = ignoreCase;
  this.multiLine = multiLine;
  this.sticky = sticky;
  this.unicode = unicode;
};

var LiteralStringExpression = exports.LiteralStringExpression = function LiteralStringExpression(_ref57) {
  var value = _ref57.value;

  _classCallCheck(this, LiteralStringExpression);

  this.type = 'LiteralStringExpression';
  this.value = value;
};

var Method = exports.Method = function Method(_ref58) {
  var isGenerator = _ref58.isGenerator;
  var name = _ref58.name;
  var params = _ref58.params;
  var body = _ref58.body;

  _classCallCheck(this, Method);

  this.type = 'Method';
  this.isGenerator = isGenerator;
  this.name = name;
  this.params = params;
  this.body = body;
};

var Module = exports.Module = function Module(_ref59) {
  var directives = _ref59.directives;
  var items = _ref59.items;

  _classCallCheck(this, Module);

  this.type = 'Module';
  this.directives = directives;
  this.items = items;
};

var NewExpression = exports.NewExpression = function NewExpression(_ref60) {
  var callee = _ref60.callee;
  var _arguments = _ref60.arguments;

  _classCallCheck(this, NewExpression);

  this.type = 'NewExpression';
  this.callee = callee;
  this.arguments = _arguments;
};

var NewTargetExpression = exports.NewTargetExpression = function NewTargetExpression() {
  _classCallCheck(this, NewTargetExpression);

  this.type = 'NewTargetExpression';
};

var ObjectAssignmentTarget = exports.ObjectAssignmentTarget = function ObjectAssignmentTarget(_ref61) {
  var properties = _ref61.properties;

  _classCallCheck(this, ObjectAssignmentTarget);

  this.type = 'ObjectAssignmentTarget';
  this.properties = properties;
};

var ObjectBinding = exports.ObjectBinding = function ObjectBinding(_ref62) {
  var properties = _ref62.properties;

  _classCallCheck(this, ObjectBinding);

  this.type = 'ObjectBinding';
  this.properties = properties;
};

var ObjectExpression = exports.ObjectExpression = function ObjectExpression(_ref63) {
  var properties = _ref63.properties;

  _classCallCheck(this, ObjectExpression);

  this.type = 'ObjectExpression';
  this.properties = properties;
};

var ReturnStatement = exports.ReturnStatement = function ReturnStatement(_ref64) {
  var expression = _ref64.expression;

  _classCallCheck(this, ReturnStatement);

  this.type = 'ReturnStatement';
  this.expression = expression;
};

var Script = exports.Script = function Script(_ref65) {
  var directives = _ref65.directives;
  var statements = _ref65.statements;

  _classCallCheck(this, Script);

  this.type = 'Script';
  this.directives = directives;
  this.statements = statements;
};

var Setter = exports.Setter = function Setter(_ref66) {
  var name = _ref66.name;
  var param = _ref66.param;
  var body = _ref66.body;

  _classCallCheck(this, Setter);

  this.type = 'Setter';
  this.name = name;
  this.param = param;
  this.body = body;
};

var ShorthandProperty = exports.ShorthandProperty = function ShorthandProperty(_ref67) {
  var name = _ref67.name;

  _classCallCheck(this, ShorthandProperty);

  this.type = 'ShorthandProperty';
  this.name = name;
};

var SpreadElement = exports.SpreadElement = function SpreadElement(_ref68) {
  var expression = _ref68.expression;

  _classCallCheck(this, SpreadElement);

  this.type = 'SpreadElement';
  this.expression = expression;
};

var StaticMemberAssignmentTarget = exports.StaticMemberAssignmentTarget = function StaticMemberAssignmentTarget(_ref69) {
  var object = _ref69.object;
  var property = _ref69.property;

  _classCallCheck(this, StaticMemberAssignmentTarget);

  this.type = 'StaticMemberAssignmentTarget';
  this.object = object;
  this.property = property;
};

var StaticMemberExpression = exports.StaticMemberExpression = function StaticMemberExpression(_ref70) {
  var object = _ref70.object;
  var property = _ref70.property;

  _classCallCheck(this, StaticMemberExpression);

  this.type = 'StaticMemberExpression';
  this.object = object;
  this.property = property;
};

var StaticPropertyName = exports.StaticPropertyName = function StaticPropertyName(_ref71) {
  var value = _ref71.value;

  _classCallCheck(this, StaticPropertyName);

  this.type = 'StaticPropertyName';
  this.value = value;
};

var Super = exports.Super = function Super() {
  _classCallCheck(this, Super);

  this.type = 'Super';
};

var SwitchCase = exports.SwitchCase = function SwitchCase(_ref72) {
  var test = _ref72.test;
  var consequent = _ref72.consequent;

  _classCallCheck(this, SwitchCase);

  this.type = 'SwitchCase';
  this.test = test;
  this.consequent = consequent;
};

var SwitchDefault = exports.SwitchDefault = function SwitchDefault(_ref73) {
  var consequent = _ref73.consequent;

  _classCallCheck(this, SwitchDefault);

  this.type = 'SwitchDefault';
  this.consequent = consequent;
};

var SwitchStatement = exports.SwitchStatement = function SwitchStatement(_ref74) {
  var discriminant = _ref74.discriminant;
  var cases = _ref74.cases;

  _classCallCheck(this, SwitchStatement);

  this.type = 'SwitchStatement';
  this.discriminant = discriminant;
  this.cases = cases;
};

var SwitchStatementWithDefault = exports.SwitchStatementWithDefault = function SwitchStatementWithDefault(_ref75) {
  var discriminant = _ref75.discriminant;
  var preDefaultCases = _ref75.preDefaultCases;
  var defaultCase = _ref75.defaultCase;
  var postDefaultCases = _ref75.postDefaultCases;

  _classCallCheck(this, SwitchStatementWithDefault);

  this.type = 'SwitchStatementWithDefault';
  this.discriminant = discriminant;
  this.preDefaultCases = preDefaultCases;
  this.defaultCase = defaultCase;
  this.postDefaultCases = postDefaultCases;
};

var TemplateElement = exports.TemplateElement = function TemplateElement(_ref76) {
  var rawValue = _ref76.rawValue;

  _classCallCheck(this, TemplateElement);

  this.type = 'TemplateElement';
  this.rawValue = rawValue;
};

var TemplateExpression = exports.TemplateExpression = function TemplateExpression(_ref77) {
  var tag = _ref77.tag;
  var elements = _ref77.elements;

  _classCallCheck(this, TemplateExpression);

  this.type = 'TemplateExpression';
  this.tag = tag;
  this.elements = elements;
};

var ThisExpression = exports.ThisExpression = function ThisExpression() {
  _classCallCheck(this, ThisExpression);

  this.type = 'ThisExpression';
};

var ThrowStatement = exports.ThrowStatement = function ThrowStatement(_ref78) {
  var expression = _ref78.expression;

  _classCallCheck(this, ThrowStatement);

  this.type = 'ThrowStatement';
  this.expression = expression;
};

var TryCatchStatement = exports.TryCatchStatement = function TryCatchStatement(_ref79) {
  var body = _ref79.body;
  var catchClause = _ref79.catchClause;

  _classCallCheck(this, TryCatchStatement);

  this.type = 'TryCatchStatement';
  this.body = body;
  this.catchClause = catchClause;
};

var TryFinallyStatement = exports.TryFinallyStatement = function TryFinallyStatement(_ref80) {
  var body = _ref80.body;
  var catchClause = _ref80.catchClause;
  var finalizer = _ref80.finalizer;

  _classCallCheck(this, TryFinallyStatement);

  this.type = 'TryFinallyStatement';
  this.body = body;
  this.catchClause = catchClause;
  this.finalizer = finalizer;
};

var UnaryExpression = exports.UnaryExpression = function UnaryExpression(_ref81) {
  var operator = _ref81.operator;
  var operand = _ref81.operand;

  _classCallCheck(this, UnaryExpression);

  this.type = 'UnaryExpression';
  this.operator = operator;
  this.operand = operand;
};

var UpdateExpression = exports.UpdateExpression = function UpdateExpression(_ref82) {
  var isPrefix = _ref82.isPrefix;
  var operator = _ref82.operator;
  var operand = _ref82.operand;

  _classCallCheck(this, UpdateExpression);

  this.type = 'UpdateExpression';
  this.isPrefix = isPrefix;
  this.operator = operator;
  this.operand = operand;
};

var VariableDeclaration = exports.VariableDeclaration = function VariableDeclaration(_ref83) {
  var kind = _ref83.kind;
  var declarators = _ref83.declarators;

  _classCallCheck(this, VariableDeclaration);

  this.type = 'VariableDeclaration';
  this.kind = kind;
  this.declarators = declarators;
};

var VariableDeclarationStatement = exports.VariableDeclarationStatement = function VariableDeclarationStatement(_ref84) {
  var declaration = _ref84.declaration;

  _classCallCheck(this, VariableDeclarationStatement);

  this.type = 'VariableDeclarationStatement';
  this.declaration = declaration;
};

var VariableDeclarator = exports.VariableDeclarator = function VariableDeclarator(_ref85) {
  var binding = _ref85.binding;
  var init = _ref85.init;

  _classCallCheck(this, VariableDeclarator);

  this.type = 'VariableDeclarator';
  this.binding = binding;
  this.init = init;
};

var WhileStatement = exports.WhileStatement = function WhileStatement(_ref86) {
  var test = _ref86.test;
  var body = _ref86.body;

  _classCallCheck(this, WhileStatement);

  this.type = 'WhileStatement';
  this.test = test;
  this.body = body;
};

var WithStatement = exports.WithStatement = function WithStatement(_ref87) {
  var object = _ref87.object;
  var body = _ref87.body;

  _classCallCheck(this, WithStatement);

  this.type = 'WithStatement';
  this.object = object;
  this.body = body;
};

var YieldExpression = exports.YieldExpression = function YieldExpression(_ref88) {
  var expression = _ref88.expression;

  _classCallCheck(this, YieldExpression);

  this.type = 'YieldExpression';
  this.expression = expression;
};

var YieldGeneratorExpression = exports.YieldGeneratorExpression = function YieldGeneratorExpression(_ref89) {
  var expression = _ref89.expression;

  _classCallCheck(this, YieldGeneratorExpression);

  this.type = 'YieldGeneratorExpression';
  this.expression = expression;
};
},{}],67:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EarlyError = exports.EarlyErrorState = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright 2014 Shape Security, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

require('es6-map/implement');

var _multimap = require('multimap');

var _multimap2 = _interopRequireDefault(_multimap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// FIXME: remove this when collections/multi-map is working
_multimap2.default.prototype.addEach = function (otherMap) {
  var _this = this;

  otherMap.forEachEntry(function (v, k) {
    _this.set.apply(_this, [k].concat(v));
  });
  return this;
};

var identity = void 0; // initialised below EarlyErrorState

var EarlyErrorState = exports.EarlyErrorState = function () {
  function EarlyErrorState() {
    _classCallCheck(this, EarlyErrorState);

    this.errors = [];
    // errors that are only errors in strict mode code
    this.strictErrors = [];

    // Label values used in LabeledStatement nodes; cleared at function boundaries
    this.usedLabelNames = [];

    // BreakStatement nodes; cleared at iteration; switch; and function boundaries
    this.freeBreakStatements = [];
    // ContinueStatement nodes; cleared at
    this.freeContinueStatements = [];

    // labeled BreakStatement nodes; cleared at LabeledStatement with same Label and function boundaries
    this.freeLabeledBreakStatements = [];
    // labeled ContinueStatement nodes; cleared at labeled iteration statement with same Label and function boundaries
    this.freeLabeledContinueStatements = [];

    // NewTargetExpression nodes; cleared at function (besides arrow expression) boundaries
    this.newTargetExpressions = [];

    // BindingIdentifier nodes; cleared at containing declaration node
    this.boundNames = new _multimap2.default();
    // BindingIdentifiers that were found to be in a lexical binding position
    this.lexicallyDeclaredNames = new _multimap2.default();
    // BindingIdentifiers that were the name of a FunctionDeclaration
    this.functionDeclarationNames = new _multimap2.default();
    // BindingIdentifiers that were found to be in a variable binding position
    this.varDeclaredNames = new _multimap2.default();
    // BindingIdentifiers that were found to be in a variable binding position
    this.forOfVarDeclaredNames = [];

    // Names that this module exports
    this.exportedNames = new _multimap2.default();
    // Locally declared names that are referenced in export declarations
    this.exportedBindings = new _multimap2.default();

    // CallExpressions with Super callee
    this.superCallExpressions = [];
    // SuperCall expressions in the context of a Method named "constructor"
    this.superCallExpressionsInConstructorMethod = [];
    // MemberExpressions with Super object
    this.superPropertyExpressions = [];

    // YieldExpression and YieldGeneratorExpression nodes; cleared at function boundaries
    this.yieldExpressions = [];
  }

  _createClass(EarlyErrorState, [{
    key: 'addFreeBreakStatement',
    value: function addFreeBreakStatement(s) {
      this.freeBreakStatements.push(s);
      return this;
    }
  }, {
    key: 'addFreeLabeledBreakStatement',
    value: function addFreeLabeledBreakStatement(s) {
      this.freeLabeledBreakStatements.push(s);
      return this;
    }
  }, {
    key: 'clearFreeBreakStatements',
    value: function clearFreeBreakStatements() {
      this.freeBreakStatements = [];
      return this;
    }
  }, {
    key: 'addFreeContinueStatement',
    value: function addFreeContinueStatement(s) {
      this.freeContinueStatements.push(s);
      return this;
    }
  }, {
    key: 'addFreeLabeledContinueStatement',
    value: function addFreeLabeledContinueStatement(s) {
      this.freeLabeledContinueStatements.push(s);
      return this;
    }
  }, {
    key: 'clearFreeContinueStatements',
    value: function clearFreeContinueStatements() {
      this.freeContinueStatements = [];
      return this;
    }
  }, {
    key: 'enforceFreeBreakStatementErrors',
    value: function enforceFreeBreakStatementErrors(createError) {
      [].push.apply(this.errors, this.freeBreakStatements.map(createError));
      this.freeBreakStatements = [];
      return this;
    }
  }, {
    key: 'enforceFreeLabeledBreakStatementErrors',
    value: function enforceFreeLabeledBreakStatementErrors(createError) {
      [].push.apply(this.errors, this.freeLabeledBreakStatements.map(createError));
      this.freeLabeledBreakStatements = [];
      return this;
    }
  }, {
    key: 'enforceFreeContinueStatementErrors',
    value: function enforceFreeContinueStatementErrors(createError) {
      [].push.apply(this.errors, this.freeContinueStatements.map(createError));
      this.freeContinueStatements = [];
      return this;
    }
  }, {
    key: 'enforceFreeLabeledContinueStatementErrors',
    value: function enforceFreeLabeledContinueStatementErrors(createError) {
      [].push.apply(this.errors, this.freeLabeledContinueStatements.map(createError));
      this.freeLabeledContinueStatements = [];
      return this;
    }
  }, {
    key: 'observeIterationLabel',
    value: function observeIterationLabel(label) {
      this.usedLabelNames.push(label);
      this.freeLabeledBreakStatements = this.freeLabeledBreakStatements.filter(function (s) {
        return s.label !== label;
      });
      this.freeLabeledContinueStatements = this.freeLabeledContinueStatements.filter(function (s) {
        return s.label !== label;
      });
      return this;
    }
  }, {
    key: 'observeNonIterationLabel',
    value: function observeNonIterationLabel(label) {
      this.usedLabelNames.push(label);
      this.freeLabeledBreakStatements = this.freeLabeledBreakStatements.filter(function (s) {
        return s.label !== label;
      });
      return this;
    }
  }, {
    key: 'clearUsedLabelNames',
    value: function clearUsedLabelNames() {
      this.usedLabelNames = [];
      return this;
    }
  }, {
    key: 'observeSuperCallExpression',
    value: function observeSuperCallExpression(node) {
      this.superCallExpressions.push(node);
      return this;
    }
  }, {
    key: 'observeConstructorMethod',
    value: function observeConstructorMethod() {
      this.superCallExpressionsInConstructorMethod = this.superCallExpressions;
      this.superCallExpressions = [];
      return this;
    }
  }, {
    key: 'clearSuperCallExpressionsInConstructorMethod',
    value: function clearSuperCallExpressionsInConstructorMethod() {
      this.superCallExpressionsInConstructorMethod = [];
      return this;
    }
  }, {
    key: 'enforceSuperCallExpressions',
    value: function enforceSuperCallExpressions(createError) {
      [].push.apply(this.errors, this.superCallExpressions.map(createError));
      [].push.apply(this.errors, this.superCallExpressionsInConstructorMethod.map(createError));
      this.superCallExpressions = [];
      this.superCallExpressionsInConstructorMethod = [];
      return this;
    }
  }, {
    key: 'enforceSuperCallExpressionsInConstructorMethod',
    value: function enforceSuperCallExpressionsInConstructorMethod(createError) {
      [].push.apply(this.errors, this.superCallExpressionsInConstructorMethod.map(createError));
      this.superCallExpressionsInConstructorMethod = [];
      return this;
    }
  }, {
    key: 'observeSuperPropertyExpression',
    value: function observeSuperPropertyExpression(node) {
      this.superPropertyExpressions.push(node);
      return this;
    }
  }, {
    key: 'clearSuperPropertyExpressions',
    value: function clearSuperPropertyExpressions() {
      this.superPropertyExpressions = [];
      return this;
    }
  }, {
    key: 'enforceSuperPropertyExpressions',
    value: function enforceSuperPropertyExpressions(createError) {
      [].push.apply(this.errors, this.superPropertyExpressions.map(createError));
      this.superPropertyExpressions = [];
      return this;
    }
  }, {
    key: 'observeNewTargetExpression',
    value: function observeNewTargetExpression(node) {
      this.newTargetExpressions.push(node);
      return this;
    }
  }, {
    key: 'clearNewTargetExpressions',
    value: function clearNewTargetExpressions() {
      this.newTargetExpressions = [];
      return this;
    }
  }, {
    key: 'bindName',
    value: function bindName(name, node) {
      this.boundNames.set(name, node);
      return this;
    }
  }, {
    key: 'clearBoundNames',
    value: function clearBoundNames() {
      this.boundNames = new _multimap2.default();
      return this;
    }
  }, {
    key: 'observeLexicalDeclaration',
    value: function observeLexicalDeclaration() {
      this.lexicallyDeclaredNames.addEach(this.boundNames);
      this.boundNames = new _multimap2.default();
      return this;
    }
  }, {
    key: 'observeLexicalBoundary',
    value: function observeLexicalBoundary() {
      this.previousLexicallyDeclaredNames = this.lexicallyDeclaredNames;
      this.lexicallyDeclaredNames = new _multimap2.default();
      this.functionDeclarationNames = new _multimap2.default();
      return this;
    }
  }, {
    key: 'enforceDuplicateLexicallyDeclaredNames',
    value: function enforceDuplicateLexicallyDeclaredNames(createError) {
      var _this2 = this;

      this.lexicallyDeclaredNames.forEachEntry(function (nodes /* , bindingName*/) {
        if (nodes.length > 1) {
          nodes.slice(1).forEach(function (dupeNode) {
            _this2.addError(createError(dupeNode));
          });
        }
      });
      return this;
    }
  }, {
    key: 'enforceConflictingLexicallyDeclaredNames',
    value: function enforceConflictingLexicallyDeclaredNames(otherNames, createError) {
      var _this3 = this;

      this.lexicallyDeclaredNames.forEachEntry(function (nodes, bindingName) {
        if (otherNames.has(bindingName)) {
          nodes.forEach(function (conflictingNode) {
            _this3.addError(createError(conflictingNode));
          });
        }
      });
      return this;
    }
  }, {
    key: 'observeFunctionDeclaration',
    value: function observeFunctionDeclaration() {
      this.observeVarBoundary();
      this.functionDeclarationNames.addEach(this.boundNames);
      this.boundNames = new _multimap2.default();
      return this;
    }
  }, {
    key: 'functionDeclarationNamesAreLexical',
    value: function functionDeclarationNamesAreLexical() {
      this.lexicallyDeclaredNames.addEach(this.functionDeclarationNames);
      this.functionDeclarationNames = new _multimap2.default();
      return this;
    }
  }, {
    key: 'observeVarDeclaration',
    value: function observeVarDeclaration() {
      this.varDeclaredNames.addEach(this.boundNames);
      this.boundNames = new _multimap2.default();
      return this;
    }
  }, {
    key: 'recordForOfVars',
    value: function recordForOfVars() {
      var _this4 = this;

      this.varDeclaredNames.forEach(function (bindingIdentifier) {
        _this4.forOfVarDeclaredNames.push(bindingIdentifier);
      });
      return this;
    }
  }, {
    key: 'observeVarBoundary',
    value: function observeVarBoundary() {
      this.lexicallyDeclaredNames = new _multimap2.default();
      this.functionDeclarationNames = new _multimap2.default();
      this.varDeclaredNames = new _multimap2.default();
      this.forOfVarDeclaredNames = [];
      return this;
    }
  }, {
    key: 'exportName',
    value: function exportName(name, node) {
      this.exportedNames.set(name, node);
      return this;
    }
  }, {
    key: 'exportDeclaredNames',
    value: function exportDeclaredNames() {
      this.exportedNames.addEach(this.lexicallyDeclaredNames).addEach(this.varDeclaredNames);
      this.exportedBindings.addEach(this.lexicallyDeclaredNames).addEach(this.varDeclaredNames);
      return this;
    }
  }, {
    key: 'exportBinding',
    value: function exportBinding(name, node) {
      this.exportedBindings.set(name, node);
      return this;
    }
  }, {
    key: 'clearExportedBindings',
    value: function clearExportedBindings() {
      this.exportedBindings = new _multimap2.default();
      return this;
    }
  }, {
    key: 'observeYieldExpression',
    value: function observeYieldExpression(node) {
      this.yieldExpressions.push(node);
      return this;
    }
  }, {
    key: 'clearYieldExpressions',
    value: function clearYieldExpressions() {
      this.yieldExpressions = [];
      return this;
    }
  }, {
    key: 'addError',
    value: function addError(e) {
      this.errors.push(e);
      return this;
    }
  }, {
    key: 'addStrictError',
    value: function addStrictError(e) {
      this.strictErrors.push(e);
      return this;
    }
  }, {
    key: 'enforceStrictErrors',
    value: function enforceStrictErrors() {
      [].push.apply(this.errors, this.strictErrors);
      this.strictErrors = [];
      return this;
    }

    // MONOID IMPLEMENTATION

  }, {
    key: 'concat',
    value: function concat(s) {
      if (this === identity) return s;
      if (s === identity) return this;
      [].push.apply(this.errors, s.errors);
      [].push.apply(this.strictErrors, s.strictErrors);
      [].push.apply(this.usedLabelNames, s.usedLabelNames);
      [].push.apply(this.freeBreakStatements, s.freeBreakStatements);
      [].push.apply(this.freeContinueStatements, s.freeContinueStatements);
      [].push.apply(this.freeLabeledBreakStatements, s.freeLabeledBreakStatements);
      [].push.apply(this.freeLabeledContinueStatements, s.freeLabeledContinueStatements);
      [].push.apply(this.newTargetExpressions, s.newTargetExpressions);
      this.boundNames.addEach(s.boundNames);
      this.lexicallyDeclaredNames.addEach(s.lexicallyDeclaredNames);
      this.functionDeclarationNames.addEach(s.functionDeclarationNames);
      this.varDeclaredNames.addEach(s.varDeclaredNames);
      [].push.apply(this.forOfVarDeclaredNames, s.forOfVarDeclaredNames);
      this.exportedNames.addEach(s.exportedNames);
      this.exportedBindings.addEach(s.exportedBindings);
      [].push.apply(this.superCallExpressions, s.superCallExpressions);
      [].push.apply(this.superCallExpressionsInConstructorMethod, s.superCallExpressionsInConstructorMethod);
      [].push.apply(this.superPropertyExpressions, s.superPropertyExpressions);
      [].push.apply(this.yieldExpressions, s.yieldExpressions);
      return this;
    }
  }], [{
    key: 'empty',
    value: function empty() {
      return identity;
    }
  }]);

  return EarlyErrorState;
}();

identity = new EarlyErrorState();
Object.getOwnPropertyNames(EarlyErrorState.prototype).forEach(function (methodName) {
  if (methodName === 'constructor') return;
  Object.defineProperty(identity, methodName, {
    value: function value() {
      return EarlyErrorState.prototype[methodName].apply(new EarlyErrorState(), arguments);
    },
    enumerable: false,
    writable: true,
    configurable: true
  });
});

var EarlyError = exports.EarlyError = function (_Error) {
  _inherits(EarlyError, _Error);

  function EarlyError(node, message) {
    _classCallCheck(this, EarlyError);

    var _this5 = _possibleConstructorReturn(this, (EarlyError.__proto__ || Object.getPrototypeOf(EarlyError)).call(this, message));

    _this5.node = node;
    _this5.message = message;
    return _this5;
  }

  return EarlyError;
}(Error);
},{"es6-map/implement":53,"multimap":65}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EarlyErrorChecker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _shiftReducer = require('shift-reducer');

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _utils = require('./utils');

var _earlyErrorState = require('./early-error-state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2014 Shape Security, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

function isStrictFunctionBody(_ref) {
  var directives = _ref.directives;

  return directives.some(function (directive) {
    return directive.rawValue === 'use strict';
  });
}

function isLabelledFunction(node) {
  return node.type === 'LabeledStatement' && (node.body.type === 'FunctionDeclaration' || isLabelledFunction(node.body));
}

function isIterationStatement(node) {
  switch (node.type) {
    case 'LabeledStatement':
      return isIterationStatement(node.body);
    case 'DoWhileStatement':
    case 'ForInStatement':
    case 'ForOfStatement':
    case 'ForStatement':
    case 'WhileStatement':
      return true;
  }
  return false;
}

function isSpecialMethod(methodDefinition) {
  if (methodDefinition.name.type !== 'StaticPropertyName' || methodDefinition.name.value !== 'constructor') {
    return false;
  }
  switch (methodDefinition.type) {
    case 'Getter':
    case 'Setter':
      return true;
    case 'Method':
      return methodDefinition.isGenerator;
  }
  /* istanbul ignore next */
  throw new Error('not reached');
}

function enforceDuplicateConstructorMethods(node, s) {
  var ctors = node.elements.filter(function (e) {
    return !e.isStatic && e.method.type === 'Method' && !e.method.isGenerator && e.method.name.type === 'StaticPropertyName' && e.method.name.value === 'constructor';
  });
  if (ctors.length > 1) {
    ctors.slice(1).forEach(function (ctor) {
      s = s.addError(new _earlyErrorState.EarlyError(ctor, 'Duplicate constructor method in class'));
    });
  }
  return s;
}

var SUPERCALL_ERROR = function SUPERCALL_ERROR(node) {
  return new _earlyErrorState.EarlyError(node, 'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass');
};
var SUPERPROPERTY_ERROR = function SUPERPROPERTY_ERROR(node) {
  return new _earlyErrorState.EarlyError(node, 'Member access on super must be in a method');
};
var DUPLICATE_BINDING = function DUPLICATE_BINDING(node) {
  return new _earlyErrorState.EarlyError(node, 'Duplicate binding ' + JSON.stringify(node.name));
};
var FREE_CONTINUE = function FREE_CONTINUE(node) {
  return new _earlyErrorState.EarlyError(node, 'Continue statement must be nested within an iteration statement');
};
var UNBOUND_CONTINUE = function UNBOUND_CONTINUE(node) {
  return new _earlyErrorState.EarlyError(node, 'Continue statement must be nested within an iteration statement with label ' + JSON.stringify(node.label));
};
var FREE_BREAK = function FREE_BREAK(node) {
  return new _earlyErrorState.EarlyError(node, 'Break statement must be nested within an iteration statement or a switch statement');
};
var UNBOUND_BREAK = function UNBOUND_BREAK(node) {
  return new _earlyErrorState.EarlyError(node, 'Break statement must be nested within a statement with label ' + JSON.stringify(node.label));
};

var EarlyErrorChecker = exports.EarlyErrorChecker = function (_MonoidalReducer) {
  _inherits(EarlyErrorChecker, _MonoidalReducer);

  function EarlyErrorChecker() {
    _classCallCheck(this, EarlyErrorChecker);

    return _possibleConstructorReturn(this, (EarlyErrorChecker.__proto__ || Object.getPrototypeOf(EarlyErrorChecker)).call(this, _earlyErrorState.EarlyErrorState));
  }

  _createClass(EarlyErrorChecker, [{
    key: 'reduceAssignmentExpression',
    value: function reduceAssignmentExpression() {
      return _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceAssignmentExpression', this).apply(this, arguments).clearBoundNames();
    }
  }, {
    key: 'reduceAssignmentTargetIdentifier',
    value: function reduceAssignmentTargetIdentifier(node) {
      var s = this.identity;
      if (node.name === 'eval' || node.name === 'arguments' || (0, _utils.isStrictModeReservedWord)(node.name)) {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, 'The identifier ' + JSON.stringify(node.name) + ' must not be in binding position in strict mode'));
      }
      return s;
    }
  }, {
    key: 'reduceArrowExpression',
    value: function reduceArrowExpression(node, _ref2) {
      var params = _ref2.params,
          body = _ref2.body;

      var isSimpleParameterList = node.params.rest == null && node.params.items.every(function (i) {
        return i.type === 'BindingIdentifier';
      });
      params = params.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      if (node.body.type === 'FunctionBody') {
        body = body.enforceConflictingLexicallyDeclaredNames(params.lexicallyDeclaredNames, DUPLICATE_BINDING);
        if (isStrictFunctionBody(node.body)) {
          params = params.enforceStrictErrors();
          body = body.enforceStrictErrors();
        }
      }
      params.yieldExpressions.forEach(function (node) {
        params = params.addError(new _earlyErrorState.EarlyError(node, 'Arrow parameters must not contain yield expressions'));
      });
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceArrowExpression', this).call(this, node, { params: params, body: body });
      if (!isSimpleParameterList && node.body.type === 'FunctionBody' && isStrictFunctionBody(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node, 'Functions with non-simple parameter lists may not contain a "use strict" directive'));
      }
      s = s.clearYieldExpressions();
      s = s.observeVarBoundary();
      return s;
    }
  }, {
    key: 'reduceBindingIdentifier',
    value: function reduceBindingIdentifier(node) {
      var s = this.identity;
      if (node.name === 'eval' || node.name === 'arguments' || (0, _utils.isStrictModeReservedWord)(node.name)) {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, 'The identifier ' + JSON.stringify(node.name) + ' must not be in binding position in strict mode'));
      }
      s = s.bindName(node.name, node);
      return s;
    }
  }, {
    key: 'reduceBlock',
    value: function reduceBlock() {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceBlock', this).apply(this, arguments);
      s = s.functionDeclarationNamesAreLexical();
      s = s.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      s = s.enforceConflictingLexicallyDeclaredNames(s.varDeclaredNames, DUPLICATE_BINDING);
      s = s.observeLexicalBoundary();
      return s;
    }
  }, {
    key: 'reduceBreakStatement',
    value: function reduceBreakStatement(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceBreakStatement', this).apply(this, arguments);
      s = node.label == null ? s.addFreeBreakStatement(node) : s.addFreeLabeledBreakStatement(node);
      return s;
    }
  }, {
    key: 'reduceCallExpression',
    value: function reduceCallExpression(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceCallExpression', this).apply(this, arguments);
      if (node.callee.type === 'Super') {
        s = s.observeSuperCallExpression(node);
      }
      return s;
    }
  }, {
    key: 'reduceCatchClause',
    value: function reduceCatchClause(node, _ref3) {
      var binding = _ref3.binding,
          body = _ref3.body;

      binding = binding.observeLexicalDeclaration();
      binding = binding.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      binding = binding.enforceConflictingLexicallyDeclaredNames(body.previousLexicallyDeclaredNames, DUPLICATE_BINDING);
      binding.lexicallyDeclaredNames.forEachEntry(function (nodes, bindingName) {
        if (body.varDeclaredNames.has(bindingName)) {
          body.varDeclaredNames.get(bindingName).forEach(function (conflictingNode) {
            if (body.forOfVarDeclaredNames.indexOf(conflictingNode) >= 0) {
              binding = binding.addError(DUPLICATE_BINDING(conflictingNode));
            }
          });
        }
      });
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceCatchClause', this).call(this, node, { binding: binding, body: body });
      s = s.observeLexicalBoundary();
      return s;
    }
  }, {
    key: 'reduceClassDeclaration',
    value: function reduceClassDeclaration(node, _ref4) {
      var name = _ref4.name,
          _super = _ref4.super,
          elements = _ref4.elements;

      var s = name;
      var sElements = this.fold(elements);
      sElements = sElements.enforceStrictErrors();
      if (node.super != null) {
        _super = _super.enforceStrictErrors();
        s = this.append(s, _super);
        sElements = sElements.clearSuperCallExpressionsInConstructorMethod();
      }
      s = this.append(s, sElements);
      s = enforceDuplicateConstructorMethods(node, s);
      s = s.observeLexicalDeclaration();
      return s;
    }
  }, {
    key: 'reduceClassElement',
    value: function reduceClassElement(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceClassElement', this).apply(this, arguments);
      if (!node.isStatic && isSpecialMethod(node.method)) {
        s = s.addError(new _earlyErrorState.EarlyError(node, 'Constructors cannot be generators, getters or setters'));
      }
      if (node.isStatic && node.method.name.type === 'StaticPropertyName' && node.method.name.value === 'prototype') {
        s = s.addError(new _earlyErrorState.EarlyError(node, 'Static class methods cannot be named "prototype"'));
      }
      return s;
    }
  }, {
    key: 'reduceClassExpression',
    value: function reduceClassExpression(node, _ref5) {
      var name = _ref5.name,
          _super = _ref5.super,
          elements = _ref5.elements;

      var s = node.name == null ? this.identity : name;
      var sElements = this.fold(elements);
      sElements = sElements.enforceStrictErrors();
      if (node.super != null) {
        _super = _super.enforceStrictErrors();
        s = this.append(s, _super);
        sElements = sElements.clearSuperCallExpressionsInConstructorMethod();
      }
      s = this.append(s, sElements);
      s = enforceDuplicateConstructorMethods(node, s);
      s = s.clearBoundNames();
      return s;
    }
  }, {
    key: 'reduceCompoundAssignmentExpression',
    value: function reduceCompoundAssignmentExpression() {
      return _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceCompoundAssignmentExpression', this).apply(this, arguments).clearBoundNames();
    }
  }, {
    key: 'reduceComputedMemberExpression',
    value: function reduceComputedMemberExpression(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceComputedMemberExpression', this).apply(this, arguments);
      if (node.object.type === 'Super') {
        s = s.observeSuperPropertyExpression(node);
      }
      return s;
    }
  }, {
    key: 'reduceContinueStatement',
    value: function reduceContinueStatement(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceContinueStatement', this).apply(this, arguments);
      s = node.label == null ? s.addFreeContinueStatement(node) : s.addFreeLabeledContinueStatement(node);
      return s;
    }
  }, {
    key: 'reduceDoWhileStatement',
    value: function reduceDoWhileStatement(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceDoWhileStatement', this).apply(this, arguments);
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, 'The body of a do-while statement must not be a labeled function declaration'));
      }
      s = s.clearFreeContinueStatements();
      s = s.clearFreeBreakStatements();
      return s;
    }
  }, {
    key: 'reduceExport',
    value: function reduceExport() {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceExport', this).apply(this, arguments);
      s = s.functionDeclarationNamesAreLexical();
      s = s.exportDeclaredNames();
      return s;
    }
  }, {
    key: 'reduceExportFrom',
    value: function reduceExportFrom(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceExportFrom', this).apply(this, arguments);
      s = s.clearExportedBindings();
      return s;
    }
  }, {
    key: 'reduceExportFromSpecifier',
    value: function reduceExportFromSpecifier(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceExportFromSpecifier', this).apply(this, arguments);
      s = s.exportName(node.exportedName || node.name, node);
      s = s.exportBinding(node.name, node);
      return s;
    }
  }, {
    key: 'reduceExportLocalSpecifier',
    value: function reduceExportLocalSpecifier(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceExportLocalSpecifier', this).apply(this, arguments);
      s = s.exportName(node.exportedName || node.name.name, node);
      s = s.exportBinding(node.name.name, node);
      return s;
    }
  }, {
    key: 'reduceExportDefault',
    value: function reduceExportDefault(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceExportDefault', this).apply(this, arguments);
      s = s.functionDeclarationNamesAreLexical();
      s = s.exportName('default', node);
      return s;
    }
  }, {
    key: 'reduceFormalParameters',
    value: function reduceFormalParameters() {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceFormalParameters', this).apply(this, arguments);
      s = s.observeLexicalDeclaration();
      return s;
    }
  }, {
    key: 'reduceForStatement',
    value: function reduceForStatement(node, _ref6) {
      var init = _ref6.init,
          test = _ref6.test,
          update = _ref6.update,
          body = _ref6.body;

      if (init != null) {
        init = init.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
        init = init.enforceConflictingLexicallyDeclaredNames(body.varDeclaredNames, DUPLICATE_BINDING);
      }
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceForStatement', this).call(this, node, { init: init, test: test, update: update, body: body });
      if (node.init != null && node.init.type === 'VariableDeclaration' && node.init.kind === 'const') {
        node.init.declarators.forEach(function (declarator) {
          if (declarator.init == null) {
            s = s.addError(new _earlyErrorState.EarlyError(declarator, 'Constant lexical declarations must have an initialiser'));
          }
        });
      }
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, 'The body of a for statement must not be a labeled function declaration'));
      }
      s = s.clearFreeContinueStatements();
      s = s.clearFreeBreakStatements();
      s = s.observeLexicalBoundary();
      return s;
    }
  }, {
    key: 'reduceForInStatement',
    value: function reduceForInStatement(node, _ref7) {
      var left = _ref7.left,
          right = _ref7.right,
          body = _ref7.body;

      left = left.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      left = left.enforceConflictingLexicallyDeclaredNames(body.varDeclaredNames, DUPLICATE_BINDING);
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceForInStatement', this).call(this, node, { left: left, right: right, body: body });
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, 'The body of a for-in statement must not be a labeled function declaration'));
      }
      s = s.clearFreeContinueStatements();
      s = s.clearFreeBreakStatements();
      s = s.observeLexicalBoundary();
      return s;
    }
  }, {
    key: 'reduceForOfStatement',
    value: function reduceForOfStatement(node, _ref8) {
      var left = _ref8.left,
          right = _ref8.right,
          body = _ref8.body;

      left = left.recordForOfVars();
      left = left.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      left = left.enforceConflictingLexicallyDeclaredNames(body.varDeclaredNames, DUPLICATE_BINDING);
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceForOfStatement', this).call(this, node, { left: left, right: right, body: body });
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, 'The body of a for-of statement must not be a labeled function declaration'));
      }
      s = s.clearFreeContinueStatements();
      s = s.clearFreeBreakStatements();
      s = s.observeLexicalBoundary();
      return s;
    }
  }, {
    key: 'reduceFunctionBody',
    value: function reduceFunctionBody(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceFunctionBody', this).apply(this, arguments);
      s = s.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      s = s.enforceConflictingLexicallyDeclaredNames(s.varDeclaredNames, DUPLICATE_BINDING);
      s = s.enforceFreeContinueStatementErrors(FREE_CONTINUE);
      s = s.enforceFreeLabeledContinueStatementErrors(UNBOUND_CONTINUE);
      s = s.enforceFreeBreakStatementErrors(FREE_BREAK);
      s = s.enforceFreeLabeledBreakStatementErrors(UNBOUND_BREAK);
      s = s.clearUsedLabelNames();
      s = s.clearYieldExpressions();
      if (isStrictFunctionBody(node)) {
        s = s.enforceStrictErrors();
      }
      return s;
    }
  }, {
    key: 'reduceFunctionDeclaration',
    value: function reduceFunctionDeclaration(node, _ref9) {
      var name = _ref9.name,
          params = _ref9.params,
          body = _ref9.body;

      var isSimpleParameterList = node.params.rest == null && node.params.items.every(function (i) {
        return i.type === 'BindingIdentifier';
      });
      var addError = !isSimpleParameterList || node.isGenerator ? 'addError' : 'addStrictError';
      params.lexicallyDeclaredNames.forEachEntry(function (nodes /* , bindingName*/) {
        if (nodes.length > 1) {
          nodes.slice(1).forEach(function (dupeNode) {
            params = params[addError](DUPLICATE_BINDING(dupeNode));
          });
        }
      });
      body = body.enforceConflictingLexicallyDeclaredNames(params.lexicallyDeclaredNames, DUPLICATE_BINDING);
      body = body.enforceSuperCallExpressions(SUPERCALL_ERROR);
      body = body.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      params = params.enforceSuperCallExpressions(SUPERCALL_ERROR);
      params = params.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      if (node.isGenerator) {
        params.yieldExpressions.forEach(function (node) {
          params = params.addError(new _earlyErrorState.EarlyError(node, 'Generator parameters must not contain yield expressions'));
        });
      }
      params = params.clearNewTargetExpressions();
      body = body.clearNewTargetExpressions();
      if (isStrictFunctionBody(node.body)) {
        params = params.enforceStrictErrors();
        body = body.enforceStrictErrors();
      }
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceFunctionDeclaration', this).call(this, node, { name: name, params: params, body: body });
      if (!isSimpleParameterList && isStrictFunctionBody(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node, 'Functions with non-simple parameter lists may not contain a "use strict" directive'));
      }
      s = s.clearYieldExpressions();
      s = s.observeFunctionDeclaration();
      return s;
    }
  }, {
    key: 'reduceFunctionExpression',
    value: function reduceFunctionExpression(node, _ref10) {
      var name = _ref10.name,
          params = _ref10.params,
          body = _ref10.body;

      var isSimpleParameterList = node.params.rest == null && node.params.items.every(function (i) {
        return i.type === 'BindingIdentifier';
      });
      var addError = !isSimpleParameterList || node.isGenerator ? 'addError' : 'addStrictError';
      params.lexicallyDeclaredNames.forEachEntry(function (nodes, bindingName) {
        if (nodes.length > 1) {
          nodes.slice(1).forEach(function (dupeNode) {
            params = params[addError](new _earlyErrorState.EarlyError(dupeNode, 'Duplicate binding ' + JSON.stringify(bindingName)));
          });
        }
      });
      body = body.enforceConflictingLexicallyDeclaredNames(params.lexicallyDeclaredNames, DUPLICATE_BINDING);
      body = body.enforceSuperCallExpressions(SUPERCALL_ERROR);
      body = body.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      params = params.enforceSuperCallExpressions(SUPERCALL_ERROR);
      params = params.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      if (node.isGenerator) {
        params.yieldExpressions.forEach(function (node) {
          params = params.addError(new _earlyErrorState.EarlyError(node, 'Generator parameters must not contain yield expressions'));
        });
      }
      params = params.clearNewTargetExpressions();
      body = body.clearNewTargetExpressions();
      if (isStrictFunctionBody(node.body)) {
        params = params.enforceStrictErrors();
        body = body.enforceStrictErrors();
      }
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceFunctionExpression', this).call(this, node, { name: name, params: params, body: body });
      if (!isSimpleParameterList && isStrictFunctionBody(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node, 'Functions with non-simple parameter lists may not contain a "use strict" directive'));
      }
      s = s.clearBoundNames();
      s = s.clearYieldExpressions();
      s = s.observeVarBoundary();
      return s;
    }
  }, {
    key: 'reduceGetter',
    value: function reduceGetter(node, _ref11) {
      var name = _ref11.name,
          body = _ref11.body;

      body = body.enforceSuperCallExpressions(SUPERCALL_ERROR);
      body = body.clearSuperPropertyExpressions();
      body = body.clearNewTargetExpressions();
      if (isStrictFunctionBody(node.body)) {
        body = body.enforceStrictErrors();
      }
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceGetter', this).call(this, node, { name: name, body: body });
      s = s.observeVarBoundary();
      return s;
    }
  }, {
    key: 'reduceIdentifierExpression',
    value: function reduceIdentifierExpression(node) {
      var s = this.identity;
      if ((0, _utils.isStrictModeReservedWord)(node.name)) {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, 'The identifier ' + JSON.stringify(node.name) + ' must not be in expression position in strict mode'));
      }
      return s;
    }
  }, {
    key: 'reduceIfStatement',
    value: function reduceIfStatement(node, _ref12) {
      var test = _ref12.test,
          consequent = _ref12.consequent,
          alternate = _ref12.alternate;

      if (isLabelledFunction(node.consequent)) {
        consequent = consequent.addError(new _earlyErrorState.EarlyError(node.consequent, 'The consequent of an if statement must not be a labeled function declaration'));
      }
      if (node.alternate != null && isLabelledFunction(node.alternate)) {
        alternate = alternate.addError(new _earlyErrorState.EarlyError(node.alternate, 'The alternate of an if statement must not be a labeled function declaration'));
      }
      if (node.consequent.type === 'FunctionDeclaration') {
        consequent = consequent.addStrictError(new _earlyErrorState.EarlyError(node.consequent, 'FunctionDeclarations in IfStatements are disallowed in strict mode'));
        consequent = consequent.observeLexicalBoundary();
      }
      if (node.alternate != null && node.alternate.type === 'FunctionDeclaration') {
        alternate = alternate.addStrictError(new _earlyErrorState.EarlyError(node.alternate, 'FunctionDeclarations in IfStatements are disallowed in strict mode'));
        alternate = alternate.observeLexicalBoundary();
      }
      return _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceIfStatement', this).call(this, node, { test: test, consequent: consequent, alternate: alternate });
    }
  }, {
    key: 'reduceImport',
    value: function reduceImport() {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceImport', this).apply(this, arguments);
      s = s.observeLexicalDeclaration();
      return s;
    }
  }, {
    key: 'reduceImportNamespace',
    value: function reduceImportNamespace() {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceImportNamespace', this).apply(this, arguments);
      s = s.observeLexicalDeclaration();
      return s;
    }
  }, {
    key: 'reduceLabeledStatement',
    value: function reduceLabeledStatement(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceLabeledStatement', this).apply(this, arguments);
      if (node.label === 'yield' || (0, _utils.isStrictModeReservedWord)(node.label)) {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, 'The identifier ' + JSON.stringify(node.label) + ' must not be in label position in strict mode'));
      }
      if (s.usedLabelNames.indexOf(node.label) >= 0) {
        s = s.addError(new _earlyErrorState.EarlyError(node, 'Label ' + JSON.stringify(node.label) + ' has already been declared'));
      }
      if (node.body.type === 'FunctionDeclaration') {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, 'Labeled FunctionDeclarations are disallowed in strict mode'));
      }
      s = isIterationStatement(node.body) ? s.observeIterationLabel(node.label) : s.observeNonIterationLabel(node.label);
      return s;
    }
  }, {
    key: 'reduceLiteralRegExpExpression',
    value: function reduceLiteralRegExpExpression(node) {
      var s = this.identity;
      // NOTE: the RegExp pattern acceptor is disabled until we have more confidence in its correctness (more tests)
      // if (!PatternAcceptor.test(node.pattern, node.flags.indexOf("u") >= 0)) {
      //  s = s.addError(new EarlyError(node, "Invalid regular expression pattern"));
      // }
      return s;
    }
  }, {
    key: 'reduceMethod',
    value: function reduceMethod(node, _ref13) {
      var name = _ref13.name,
          params = _ref13.params,
          body = _ref13.body;

      var isSimpleParameterList = node.params.rest == null && node.params.items.every(function (i) {
        return i.type === 'BindingIdentifier';
      });
      params = params.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      body = body.enforceConflictingLexicallyDeclaredNames(params.lexicallyDeclaredNames, DUPLICATE_BINDING);
      if (node.name.type === 'StaticPropertyName' && node.name.value === 'constructor') {
        body = body.observeConstructorMethod();
        params = params.observeConstructorMethod();
      } else {
        body = body.enforceSuperCallExpressions(SUPERCALL_ERROR);
        params = params.enforceSuperCallExpressions(SUPERCALL_ERROR);
      }
      if (node.isGenerator) {
        params.yieldExpressions.forEach(function (node) {
          params = params.addError(new _earlyErrorState.EarlyError(node, 'Generator parameters must not contain yield expressions'));
        });
      }
      body = body.clearSuperPropertyExpressions();
      params = params.clearSuperPropertyExpressions();
      params = params.clearNewTargetExpressions();
      body = body.clearNewTargetExpressions();
      if (isStrictFunctionBody(node.body)) {
        params = params.enforceStrictErrors();
        body = body.enforceStrictErrors();
      }
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceMethod', this).call(this, node, { name: name, params: params, body: body });
      if (!isSimpleParameterList && isStrictFunctionBody(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node, 'Functions with non-simple parameter lists may not contain a "use strict" directive'));
      }
      s = s.clearYieldExpressions();
      s = s.observeVarBoundary();
      return s;
    }
  }, {
    key: 'reduceModule',
    value: function reduceModule() {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceModule', this).apply(this, arguments);
      s = s.functionDeclarationNamesAreLexical();
      s = s.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      s = s.enforceConflictingLexicallyDeclaredNames(s.varDeclaredNames, DUPLICATE_BINDING);
      s.exportedNames.forEachEntry(function (nodes, bindingName) {
        if (nodes.length > 1) {
          nodes.slice(1).forEach(function (dupeNode) {
            s = s.addError(new _earlyErrorState.EarlyError(dupeNode, 'Duplicate export ' + JSON.stringify(bindingName)));
          });
        }
      });
      s.exportedBindings.forEachEntry(function (nodes, bindingName) {
        if (!s.lexicallyDeclaredNames.has(bindingName) && !s.varDeclaredNames.has(bindingName)) {
          nodes.forEach(function (undeclaredNode) {
            s = s.addError(new _earlyErrorState.EarlyError(undeclaredNode, 'Exported binding ' + JSON.stringify(bindingName) + ' is not declared'));
          });
        }
      });
      s.newTargetExpressions.forEach(function (node) {
        s = s.addError(new _earlyErrorState.EarlyError(node, 'new.target must be within function (but not arrow expression) code'));
      });
      s = s.enforceFreeContinueStatementErrors(FREE_CONTINUE);
      s = s.enforceFreeLabeledContinueStatementErrors(UNBOUND_CONTINUE);
      s = s.enforceFreeBreakStatementErrors(FREE_BREAK);
      s = s.enforceFreeLabeledBreakStatementErrors(UNBOUND_BREAK);
      s = s.enforceSuperCallExpressions(SUPERCALL_ERROR);
      s = s.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      s = s.enforceStrictErrors();
      return s;
    }
  }, {
    key: 'reduceNewTargetExpression',
    value: function reduceNewTargetExpression(node) {
      return this.identity.observeNewTargetExpression(node);
    }
  }, {
    key: 'reduceObjectExpression',
    value: function reduceObjectExpression(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceObjectExpression', this).apply(this, arguments);
      s = s.enforceSuperCallExpressionsInConstructorMethod(SUPERCALL_ERROR);
      var protos = node.properties.filter(function (p) {
        return p.type === 'DataProperty' && p.name.type === 'StaticPropertyName' && p.name.value === '__proto__';
      });
      protos.slice(1).forEach(function (n) {
        s = s.addError(new _earlyErrorState.EarlyError(n, 'Duplicate __proto__ property in object literal not allowed'));
      });
      return s;
    }
  }, {
    key: 'reduceUpdateExpression',
    value: function reduceUpdateExpression(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceUpdateExpression', this).apply(this, arguments);
      s = s.clearBoundNames();
      return s;
    }
  }, {
    key: 'reduceUnaryExpression',
    value: function reduceUnaryExpression(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceUnaryExpression', this).apply(this, arguments);
      if (node.operator === 'delete' && node.operand.type === 'IdentifierExpression') {
        s = s.addStrictError(new _earlyErrorState.EarlyError(node, 'Identifier expressions must not be deleted in strict mode'));
      }
      return s;
    }
  }, {
    key: 'reduceScript',
    value: function reduceScript(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceScript', this).apply(this, arguments);
      s = s.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      s = s.enforceConflictingLexicallyDeclaredNames(s.varDeclaredNames, DUPLICATE_BINDING);
      s.newTargetExpressions.forEach(function (node) {
        s = s.addError(new _earlyErrorState.EarlyError(node, 'new.target must be within function (but not arrow expression) code'));
      });
      s = s.enforceFreeContinueStatementErrors(FREE_CONTINUE);
      s = s.enforceFreeLabeledContinueStatementErrors(UNBOUND_CONTINUE);
      s = s.enforceFreeBreakStatementErrors(FREE_BREAK);
      s = s.enforceFreeLabeledBreakStatementErrors(UNBOUND_BREAK);
      s = s.enforceSuperCallExpressions(SUPERCALL_ERROR);
      s = s.enforceSuperPropertyExpressions(SUPERPROPERTY_ERROR);
      if (isStrictFunctionBody(node)) {
        s = s.enforceStrictErrors();
      }
      return s;
    }
  }, {
    key: 'reduceSetter',
    value: function reduceSetter(node, _ref14) {
      var name = _ref14.name,
          param = _ref14.param,
          body = _ref14.body;

      var isSimpleParameterList = node.param.type === 'BindingIdentifier';
      param = param.observeLexicalDeclaration();
      param = param.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      body = body.enforceConflictingLexicallyDeclaredNames(param.lexicallyDeclaredNames, DUPLICATE_BINDING);
      param = param.enforceSuperCallExpressions(SUPERCALL_ERROR);
      body = body.enforceSuperCallExpressions(SUPERCALL_ERROR);
      param = param.clearSuperPropertyExpressions();
      body = body.clearSuperPropertyExpressions();
      param = param.clearNewTargetExpressions();
      body = body.clearNewTargetExpressions();
      if (isStrictFunctionBody(node.body)) {
        param = param.enforceStrictErrors();
        body = body.enforceStrictErrors();
      }
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceSetter', this).call(this, node, { name: name, param: param, body: body });
      if (!isSimpleParameterList && isStrictFunctionBody(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node, 'Functions with non-simple parameter lists may not contain a "use strict" directive'));
      }
      s = s.observeVarBoundary();
      return s;
    }
  }, {
    key: 'reduceStaticMemberExpression',
    value: function reduceStaticMemberExpression(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceStaticMemberExpression', this).apply(this, arguments);
      if (node.object.type === 'Super') {
        s = s.observeSuperPropertyExpression(node);
      }
      return s;
    }
  }, {
    key: 'reduceSwitchStatement',
    value: function reduceSwitchStatement(node, _ref15) {
      var discriminant = _ref15.discriminant,
          cases = _ref15.cases;

      var sCases = this.fold(cases);
      sCases = sCases.functionDeclarationNamesAreLexical();
      sCases = sCases.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      sCases = sCases.enforceConflictingLexicallyDeclaredNames(sCases.varDeclaredNames, DUPLICATE_BINDING);
      sCases = sCases.observeLexicalBoundary();
      var s = this.append(discriminant, sCases);
      s = s.clearFreeBreakStatements();
      return s;
    }
  }, {
    key: 'reduceSwitchStatementWithDefault',
    value: function reduceSwitchStatementWithDefault(node, _ref16) {
      var discriminant = _ref16.discriminant,
          preDefaultCases = _ref16.preDefaultCases,
          defaultCase = _ref16.defaultCase,
          postDefaultCases = _ref16.postDefaultCases;

      var sCases = this.append(defaultCase, this.append(this.fold(preDefaultCases), this.fold(postDefaultCases)));
      sCases = sCases.functionDeclarationNamesAreLexical();
      sCases = sCases.enforceDuplicateLexicallyDeclaredNames(DUPLICATE_BINDING);
      sCases = sCases.enforceConflictingLexicallyDeclaredNames(sCases.varDeclaredNames, DUPLICATE_BINDING);
      sCases = sCases.observeLexicalBoundary();
      var s = this.append(discriminant, sCases);
      s = s.clearFreeBreakStatements();
      return s;
    }
  }, {
    key: 'reduceVariableDeclaration',
    value: function reduceVariableDeclaration(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceVariableDeclaration', this).apply(this, arguments);
      switch (node.kind) {
        case 'const':
        case 'let':
          {
            s = s.observeLexicalDeclaration();
            if (s.lexicallyDeclaredNames.has('let')) {
              s.lexicallyDeclaredNames.get('let').forEach(function (n) {
                s = s.addError(new _earlyErrorState.EarlyError(n, 'Lexical declarations must not have a binding named "let"'));
              });
            }
            break;
          }
        case 'var':
          s = s.observeVarDeclaration();
          break;
      }
      return s;
    }
  }, {
    key: 'reduceVariableDeclarationStatement',
    value: function reduceVariableDeclarationStatement(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceVariableDeclarationStatement', this).apply(this, arguments);
      if (node.declaration.kind === 'const') {
        node.declaration.declarators.forEach(function (declarator) {
          if (declarator.init == null) {
            s = s.addError(new _earlyErrorState.EarlyError(declarator, 'Constant lexical declarations must have an initialiser'));
          }
        });
      }
      return s;
    }
  }, {
    key: 'reduceWhileStatement',
    value: function reduceWhileStatement(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceWhileStatement', this).apply(this, arguments);
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, 'The body of a while statement must not be a labeled function declaration'));
      }
      s = s.clearFreeContinueStatements().clearFreeBreakStatements();
      return s;
    }
  }, {
    key: 'reduceWithStatement',
    value: function reduceWithStatement(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceWithStatement', this).apply(this, arguments);
      if (isLabelledFunction(node.body)) {
        s = s.addError(new _earlyErrorState.EarlyError(node.body, 'The body of a with statement must not be a labeled function declaration'));
      }
      s = s.addStrictError(new _earlyErrorState.EarlyError(node, 'Strict mode code must not include a with statement'));
      return s;
    }
  }, {
    key: 'reduceYieldExpression',
    value: function reduceYieldExpression(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceYieldExpression', this).apply(this, arguments);
      s = s.observeYieldExpression(node);
      return s;
    }
  }, {
    key: 'reduceYieldGeneratorExpression',
    value: function reduceYieldGeneratorExpression(node) {
      var s = _get(EarlyErrorChecker.prototype.__proto__ || Object.getPrototypeOf(EarlyErrorChecker.prototype), 'reduceYieldGeneratorExpression', this).apply(this, arguments);
      s = s.observeYieldExpression(node);
      return s;
    }
  }], [{
    key: 'check',
    value: function check(node) {
      return (0, _shiftReducer2.default)(new EarlyErrorChecker(), node).errors;
    }
  }]);

  return EarlyErrorChecker;
}(_shiftReducer.MonoidalReducer);
},{"./early-error-state":67,"./utils":74,"shift-reducer":76}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Copyright 2014 Shape Security, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ErrorMessages = exports.ErrorMessages = {
  UNEXPECTED_TOKEN: function UNEXPECTED_TOKEN(id) {
    return 'Unexpected token ' + JSON.stringify(id);
  },
  UNEXPECTED_ILLEGAL_TOKEN: function UNEXPECTED_ILLEGAL_TOKEN(id) {
    return 'Unexpected ' + JSON.stringify(id);
  },

  UNEXPECTED_ESCAPED_KEYWORD: 'Unexpected escaped keyword',
  UNEXPECTED_NUMBER: 'Unexpected number',
  UNEXPECTED_STRING: 'Unexpected string',
  UNEXPECTED_IDENTIFIER: 'Unexpected identifier',
  UNEXPECTED_RESERVED_WORD: 'Unexpected reserved word',
  UNEXPECTED_TEMPLATE: 'Unexpected template',
  UNEXPECTED_EOS: 'Unexpected end of input',
  UNEXPECTED_LINE_TERMINATOR: 'Unexpected line terminator',
  UNEXPECTED_COMMA_AFTER_REST: 'Unexpected comma after rest',
  NEWLINE_AFTER_THROW: 'Illegal newline after throw',
  UNTERMINATED_REGEXP: 'Invalid regular expression: missing /',
  INVALID_REGEXP_FLAGS: 'Invalid regular expression flags',
  INVALID_LHS_IN_ASSIGNMENT: 'Invalid left-hand side in assignment',
  INVALID_LHS_IN_BINDING: 'Invalid left-hand side in binding', // todo collapse messages?
  INVALID_LHS_IN_FOR_IN: 'Invalid left-hand side in for-in',
  INVALID_LHS_IN_FOR_OF: 'Invalid left-hand side in for-of',
  INVALID_UPDATE_OPERAND: 'Increment/decrement target must be an identifier or member expression',
  INVALID_EXPONENTIATION_LHS: 'Unary expressions as the left operand of an exponentation expression ' + 'must be disambiguated with parentheses',
  MULTIPLE_DEFAULTS_IN_SWITCH: 'More than one default clause in switch statement',
  NO_CATCH_OR_FINALLY: 'Missing catch or finally after try',
  ILLEGAL_RETURN: 'Illegal return statement',
  ILLEGAL_ARROW_FUNCTION_PARAMS: 'Illegal arrow function parameter list',
  INVALID_VAR_INIT_FOR_IN: 'Invalid variable declaration in for-in statement',
  INVALID_VAR_INIT_FOR_OF: 'Invalid variable declaration in for-of statement',
  UNINITIALIZED_BINDINGPATTERN_IN_FOR_INIT: 'Binding pattern appears without initializer in for statement init',
  ILLEGAL_PROPERTY: 'Illegal property initializer',
  INVALID_ID_BINDING_STRICT_MODE: function INVALID_ID_BINDING_STRICT_MODE(id) {
    return 'The identifier ' + JSON.stringify(id) + ' must not be in binding position in strict mode';
  },
  INVALID_ID_IN_LABEL_STRICT_MODE: function INVALID_ID_IN_LABEL_STRICT_MODE(id) {
    return 'The identifier ' + JSON.stringify(id) + ' must not be in label position in strict mode';
  },
  INVALID_ID_IN_EXPRESSION_STRICT_MODE: function INVALID_ID_IN_EXPRESSION_STRICT_MODE(id) {
    return 'The identifier ' + JSON.stringify(id) + ' must not be in expression position in strict mode';
  },

  INVALID_CALL_TO_SUPER: 'Calls to super must be in the "constructor" method of a class expression ' + 'or class declaration that has a superclass',
  INVALID_DELETE_STRICT_MODE: 'Identifier expressions must not be deleted in strict mode',
  DUPLICATE_BINDING: function DUPLICATE_BINDING(id) {
    return 'Duplicate binding ' + JSON.stringify(id);
  },
  ILLEGAL_ID_IN_LEXICAL_DECLARATION: function ILLEGAL_ID_IN_LEXICAL_DECLARATION(id) {
    return 'Lexical declarations must not have a binding named ' + JSON.stringify(id);
  },

  UNITIALIZED_CONST: 'Constant lexical declarations must have an initialiser',
  ILLEGAL_LABEL_IN_BODY: function ILLEGAL_LABEL_IN_BODY(stmt) {
    return 'The body of a ' + stmt + ' statement must not be a labeled function declaration';
  },

  ILLEGEAL_LABEL_IN_IF: 'The consequent of an if statement must not be a labeled function declaration',
  ILLEGAL_LABEL_IN_ELSE: 'The alternate of an if statement must not be a labeled function declaration',
  ILLEGAL_CONTINUE_WITHOUT_ITERATION_WITH_ID: function ILLEGAL_CONTINUE_WITHOUT_ITERATION_WITH_ID(id) {
    return 'Continue statement must be nested within an iteration statement with label ' + JSON.stringify(id);
  },

  ILLEGAL_CONTINUE_WITHOUT_ITERATION: 'Continue statement must be nested within an iteration statement',
  ILLEGAL_BREAK_WITHOUT_ITERATION_OR_SWITCH: 'Break statement must be nested within an iteration statement or a switch statement',
  ILLEGAL_WITH_STRICT_MODE: 'Strict mode code must not include a with statement',
  ILLEGAL_ACCESS_SUPER_MEMBER: 'Member access on super must be in a method',
  DUPLICATE_LABEL_DECLARATION: function DUPLICATE_LABEL_DECLARATION(label) {
    return 'Label ' + JSON.stringify(label) + ' has already been declared';
  },
  ILLEGAL_BREAK_WITHIN_LABEL: function ILLEGAL_BREAK_WITHIN_LABEL(label) {
    return 'Break statement must be nested within a statement with label ' + JSON.stringify(label);
  },
  ILLEGAL_YIELD_EXPRESSIONS: function ILLEGAL_YIELD_EXPRESSIONS(paramType) {
    return paramType + ' parameters must not contain yield expressions';
  },

  ILLEGAL_YIELD_IDENTIFIER: '"yield" may not be used as an identifier in this context',
  DUPLICATE_CONSTRUCTOR: 'Duplicate constructor method in class',
  ILLEGAL_CONSTRUCTORS: 'Constructors cannot be generators, getters or setters',
  ILLEGAL_STATIC_CLASS_NAME: 'Static class methods cannot be named "prototype"',
  NEW_TARGET_ERROR: 'new.target must be within function (but not arrow expression) code',
  DUPLICATE_EXPORT: function DUPLICATE_EXPORT(id) {
    return 'Duplicate export ' + JSON.stringify(id);
  },
  UNDECLARED_BINDING: function UNDECLARED_BINDING(id) {
    return 'Exported binding ' + JSON.stringify(id) + ' is not declared';
  },

  DUPLICATE_PROPTO_PROP: 'Duplicate __proto__ property in object literal not allowed',
  ILLEGAL_LABEL_FUNC_DECLARATION: 'Labeled FunctionDeclarations are disallowed in strict mode',
  ILLEGAL_FUNC_DECL_IF: 'FunctionDeclarations in IfStatements are disallowed in strict mode',
  ILLEGAL_USE_STRICT: 'Functions with non-simple parameter lists may not contain a "use strict" directive',
  ILLEGAL_EXPORTED_NAME: 'Names of variables used in an export specifier from the current module must be identifiers'
};
},{}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenType = exports.TokenClass = exports.Tokenizer = exports.ParserWithLocation = exports.GenericParser = exports.EarlyErrorChecker = exports.parseScriptWithLocation = exports.parseModuleWithLocation = exports.parseScript = exports.parseModule = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _tokenizer = require('./tokenizer');

Object.defineProperty(exports, 'Tokenizer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_tokenizer).default;
  }
});
Object.defineProperty(exports, 'TokenClass', {
  enumerable: true,
  get: function get() {
    return _tokenizer.TokenClass;
  }
});
Object.defineProperty(exports, 'TokenType', {
  enumerable: true,
  get: function get() {
    return _tokenizer.TokenType;
  }
});

var _parser = require('./parser');

var _earlyErrors = require('./early-errors');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2016 Shape Security, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var ParserWithLocation = function (_GenericParser) {
  _inherits(ParserWithLocation, _GenericParser);

  function ParserWithLocation(source) {
    _classCallCheck(this, ParserWithLocation);

    var _this = _possibleConstructorReturn(this, (ParserWithLocation.__proto__ || Object.getPrototypeOf(ParserWithLocation)).call(this, source));

    _this.locations = new WeakMap();
    _this.comments = [];
    return _this;
  }

  _createClass(ParserWithLocation, [{
    key: 'startNode',
    value: function startNode() {
      return this.getLocation();
    }
  }, {
    key: 'finishNode',
    value: function finishNode(node, start) {
      this.locations.set(node, {
        start: start,
        end: this.getLocation()
      });
      return node;
    }
  }, {
    key: 'copyNode',
    value: function copyNode(src, dest) {
      this.locations.set(dest, this.locations.get(src)); // todo check undefined
      return dest;
    }
  }, {
    key: 'skipSingleLineComment',
    value: function skipSingleLineComment(offset) {
      // We're actually extending the *tokenizer*, here.
      var start = {
        line: this.line + 1,
        column: this.index - this.lineStart,
        offset: this.index
      };
      var c = this.source[this.index];
      var type = c === '/' ? 'SingleLine' : c === '<' ? 'HTMLOpen' : 'HTMLClose';

      _get(ParserWithLocation.prototype.__proto__ || Object.getPrototypeOf(ParserWithLocation.prototype), 'skipSingleLineComment', this).call(this, offset);

      var end = {
        line: this.line + 1,
        column: this.index - this.lineStart,
        offset: this.index
      };
      var trailingLineTerminatorCharacters = this.source[this.index - 2] === '\r' ? 2 : (0, _utils.isLineTerminator)(this.source.charCodeAt(this.index - 1)) ? 1 : 0;
      var text = this.source.substring(start.offset + offset, end.offset - trailingLineTerminatorCharacters);

      this.comments.push({ text: text, type: type, start: start, end: end });
    }
  }, {
    key: 'skipMultiLineComment',
    value: function skipMultiLineComment() {
      var start = {
        line: this.line + 1,
        column: this.index - this.lineStart,
        offset: this.index
      };
      var type = 'MultiLine';

      _get(ParserWithLocation.prototype.__proto__ || Object.getPrototypeOf(ParserWithLocation.prototype), 'skipMultiLineComment', this).call(this);

      var end = {
        line: this.line + 1,
        column: this.index - this.lineStart,
        offset: this.index
      };
      var text = this.source.substring(start.offset + 2, end.offset - 2);

      this.comments.push({ text: text, type: type, start: start, end: end });
    }
  }]);

  return ParserWithLocation;
}(_parser.GenericParser);

function generateInterface(parsingFunctionName) {
  return function parse(code) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$earlyErrors = _ref.earlyErrors,
        earlyErrors = _ref$earlyErrors === undefined ? true : _ref$earlyErrors;

    var parser = new _parser.GenericParser(code);
    var tree = parser[parsingFunctionName]();
    if (earlyErrors) {
      var errors = _earlyErrors.EarlyErrorChecker.check(tree);
      // for now, just throw the first error; we will handle multiple errors later
      if (errors.length > 0) {
        var _errors$ = errors[0],
            node = _errors$.node,
            message = _errors$.message;

        throw new _tokenizer.JsError(0, 1, 0, message);
      }
    }
    return tree;
  };
}

function generateInterfaceWithLocation(parsingFunctionName) {
  return function parse(code) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$earlyErrors = _ref2.earlyErrors,
        earlyErrors = _ref2$earlyErrors === undefined ? true : _ref2$earlyErrors;

    var parser = new ParserWithLocation(code);
    var tree = parser[parsingFunctionName]();
    if (earlyErrors) {
      var errors = _earlyErrors.EarlyErrorChecker.check(tree);
      // for now, just throw the first error; we will handle multiple errors later
      if (errors.length > 0) {
        var _errors$2 = errors[0],
            node = _errors$2.node,
            message = _errors$2.message;
        var _parser$locations$get = parser.locations.get(node).start,
            offset = _parser$locations$get.offset,
            line = _parser$locations$get.line,
            column = _parser$locations$get.column;

        throw new _tokenizer.JsError(offset, line, column, message);
      }
    }
    return { tree: tree, locations: parser.locations, comments: parser.comments };
  };
}

var parseModule = exports.parseModule = generateInterface('parseModule');
var parseScript = exports.parseScript = generateInterface('parseScript');
var parseModuleWithLocation = exports.parseModuleWithLocation = generateInterfaceWithLocation('parseModule');
var parseScriptWithLocation = exports.parseScriptWithLocation = generateInterfaceWithLocation('parseScript');
exports.default = parseScript;
exports.EarlyErrorChecker = _earlyErrors.EarlyErrorChecker;
exports.GenericParser = _parser.GenericParser;
exports.ParserWithLocation = ParserWithLocation;
},{"./early-errors":68,"./parser":71,"./tokenizer":72,"./utils":74}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericParser = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('./errors');

var _tokenizer = require('./tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

var _shiftAst = require('shift-ast');

var AST = _interopRequireWildcard(_shiftAst);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2014 Shape Security, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// Empty parameter list for ArrowExpression
var ARROW_EXPRESSION_PARAMS = 'CoverParenthesizedExpressionAndArrowParameterList';
var EXPORT_UNKNOWN_SPECIFIER = 'ExportNameOfUnknownType';

var Precedence = {
  Sequence: 0,
  Yield: 1,
  Assignment: 1,
  Conditional: 2,
  ArrowFunction: 2,
  LogicalOR: 3,
  LogicalAND: 4,
  BitwiseOR: 5,
  BitwiseXOR: 6,
  BitwiseAND: 7,
  Equality: 8,
  Relational: 9,
  BitwiseSHIFT: 10,
  Additive: 11,
  Multiplicative: 12,
  Unary: 13,
  Postfix: 14,
  Call: 15,
  New: 16,
  TaggedTemplate: 17,
  Member: 18,
  Primary: 19
};

var BinaryPrecedence = {
  '||': Precedence.LogicalOR,
  '&&': Precedence.LogicalAND,
  '|': Precedence.BitwiseOR,
  '^': Precedence.BitwiseXOR,
  '&': Precedence.BitwiseAND,
  '==': Precedence.Equality,
  '!=': Precedence.Equality,
  '===': Precedence.Equality,
  '!==': Precedence.Equality,
  '<': Precedence.Relational,
  '>': Precedence.Relational,
  '<=': Precedence.Relational,
  '>=': Precedence.Relational,
  'in': Precedence.Relational,
  'instanceof': Precedence.Relational,
  '<<': Precedence.BitwiseSHIFT,
  '>>': Precedence.BitwiseSHIFT,
  '>>>': Precedence.BitwiseSHIFT,
  '+': Precedence.Additive,
  '-': Precedence.Additive,
  '*': Precedence.Multiplicative,
  '%': Precedence.Multiplicative,
  '/': Precedence.Multiplicative
};

function isValidSimpleAssignmentTarget(node) {
  if (node == null) return false;
  switch (node.type) {
    case 'IdentifierExpression':
    case 'ComputedMemberExpression':
    case 'StaticMemberExpression':
      return true;
  }
  return false;
}

function isPrefixOperator(token) {
  switch (token.type) {
    case _tokenizer.TokenType.INC:
    case _tokenizer.TokenType.DEC:
    case _tokenizer.TokenType.ADD:
    case _tokenizer.TokenType.SUB:
    case _tokenizer.TokenType.BIT_NOT:
    case _tokenizer.TokenType.NOT:
    case _tokenizer.TokenType.DELETE:
    case _tokenizer.TokenType.VOID:
    case _tokenizer.TokenType.TYPEOF:
      return true;
  }
  return false;
}

function isUpdateOperator(token) {
  return token.type === _tokenizer.TokenType.INC || token.type === _tokenizer.TokenType.DEC;
}

var GenericParser = exports.GenericParser = function (_Tokenizer) {
  _inherits(GenericParser, _Tokenizer);

  function GenericParser(source) {
    _classCallCheck(this, GenericParser);

    var _this = _possibleConstructorReturn(this, (GenericParser.__proto__ || Object.getPrototypeOf(GenericParser)).call(this, source));

    _this.allowIn = true;
    _this.inFunctionBody = false;
    _this.inParameter = false;
    _this.allowYieldExpression = false;
    _this.module = false;
    _this.moduleIsTheGoalSymbol = false;
    _this.strict = false;

    // Cover grammar
    _this.isBindingElement = true;
    _this.isAssignmentTarget = true;
    _this.firstExprError = null;
    return _this;
  }

  _createClass(GenericParser, [{
    key: 'match',
    value: function match(subType) {
      return this.lookahead.type === subType;
    }
  }, {
    key: 'matchIdentifier',
    value: function matchIdentifier() {
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.IDENTIFIER:
        case _tokenizer.TokenType.LET:
        case _tokenizer.TokenType.YIELD:
          return true;
        case _tokenizer.TokenType.ESCAPED_KEYWORD:
          return this.lookahead.value === 'let' || this.lookahead.value === 'yield';
      }
      return false;
    }
  }, {
    key: 'eat',
    value: function eat(tokenType) {
      if (this.lookahead.type === tokenType) {
        return this.lex();
      }
    }
  }, {
    key: 'expect',
    value: function expect(tokenType) {
      if (this.lookahead.type === tokenType) {
        return this.lex();
      }
      throw this.createUnexpected(this.lookahead);
    }
  }, {
    key: 'matchContextualKeyword',
    value: function matchContextualKeyword(keyword) {
      return this.lookahead.type === _tokenizer.TokenType.IDENTIFIER && this.lookahead.value === keyword;
    }
  }, {
    key: 'expectContextualKeyword',
    value: function expectContextualKeyword(keyword) {
      if (this.lookahead.type === _tokenizer.TokenType.IDENTIFIER && this.lookahead.value === keyword) {
        return this.lex();
      } else {
        throw this.createUnexpected(this.lookahead);
      }
    }
  }, {
    key: 'eatContextualKeyword',
    value: function eatContextualKeyword(keyword) {
      if (this.lookahead.type === _tokenizer.TokenType.IDENTIFIER && this.lookahead.value === keyword) {
        return this.lex();
      }
    }
  }, {
    key: 'consumeSemicolon',
    value: function consumeSemicolon() {
      if (this.eat(_tokenizer.TokenType.SEMICOLON)) return;
      if (this.hasLineTerminatorBeforeNext) return;
      if (!this.eof() && !this.match(_tokenizer.TokenType.RBRACE)) {
        throw this.createUnexpected(this.lookahead);
      }
    }

    // this is a no-op, reserved for future use

  }, {
    key: 'startNode',
    value: function startNode(node) {
      return node;
    }
  }, {
    key: 'copyNode',
    value: function copyNode(src, dest) {
      return dest;
    }
  }, {
    key: 'finishNode',
    value: function finishNode(node, startState) {
      return node;
    }
  }, {
    key: 'parseModule',
    value: function parseModule() {
      this.moduleIsTheGoalSymbol = this.module = this.strict = true;
      this.lookahead = this.advance();

      var startState = this.startNode();

      var _parseBody = this.parseBody(),
          directives = _parseBody.directives,
          statements = _parseBody.statements;

      if (!this.match(_tokenizer.TokenType.EOS)) {
        throw this.createUnexpected(this.lookahead);
      }
      return this.finishNode(new AST.Module({ directives: directives, items: statements }), startState);
    }
  }, {
    key: 'parseScript',
    value: function parseScript() {
      this.lookahead = this.advance();

      var startState = this.startNode();

      var _parseBody2 = this.parseBody(),
          directives = _parseBody2.directives,
          statements = _parseBody2.statements;

      if (!this.match(_tokenizer.TokenType.EOS)) {
        throw this.createUnexpected(this.lookahead);
      }
      return this.finishNode(new AST.Script({ directives: directives, statements: statements }), startState);
    }
  }, {
    key: 'parseFunctionBody',
    value: function parseFunctionBody() {
      var startState = this.startNode();

      var oldInFunctionBody = this.inFunctionBody;
      var oldModule = this.module;
      var oldStrict = this.strict;
      this.inFunctionBody = true;
      this.module = false;

      this.expect(_tokenizer.TokenType.LBRACE);
      var body = new AST.FunctionBody(this.parseBody());
      this.expect(_tokenizer.TokenType.RBRACE);

      this.inFunctionBody = oldInFunctionBody;
      this.module = oldModule;
      this.strict = oldStrict;

      return this.finishNode(body, startState);
    }
  }, {
    key: 'parseBody',
    value: function parseBody() {
      var directives = [],
          statements = [],
          parsingDirectives = true,
          directiveOctal = null;

      while (true) {
        if (this.eof() || this.match(_tokenizer.TokenType.RBRACE)) break;
        var token = this.lookahead;
        var text = token.slice.text;
        var isStringLiteral = token.type === _tokenizer.TokenType.STRING;
        var isModule = this.module;
        var directiveLocation = this.getLocation();
        var directiveStartState = this.startNode();
        var stmt = isModule ? this.parseModuleItem() : this.parseStatementListItem();
        if (parsingDirectives) {
          if (isStringLiteral && stmt.type === 'ExpressionStatement' && stmt.expression.type === 'LiteralStringExpression') {
            if (!directiveOctal && token.octal) {
              directiveOctal = this.createErrorWithLocation(directiveLocation, 'Unexpected legacy octal escape sequence: \\' + token.octal);
            }
            var rawValue = text.slice(1, -1);
            if (rawValue === 'use strict') {
              this.strict = true;
            }
            directives.push(this.finishNode(new AST.Directive({ rawValue: rawValue }), directiveStartState));
          } else {
            parsingDirectives = false;
            if (directiveOctal && this.strict) {
              throw directiveOctal;
            }
            statements.push(stmt);
          }
        } else {
          statements.push(stmt);
        }
      }
      if (directiveOctal && this.strict) {
        throw directiveOctal;
      }

      return { directives: directives, statements: statements };
    }
  }, {
    key: 'parseImportSpecifier',
    value: function parseImportSpecifier() {
      var startState = this.startNode(),
          name = void 0;
      if (this.matchIdentifier()) {
        name = this.parseIdentifier();
        if (!this.eatContextualKeyword('as')) {
          return this.finishNode(new AST.ImportSpecifier({
            name: null,
            binding: this.finishNode(new AST.BindingIdentifier({ name: name }), startState)
          }), startState);
        }
      } else if (this.lookahead.type.klass.isIdentifierName) {
        name = this.parseIdentifierName();
        this.expectContextualKeyword('as');
      }

      return this.finishNode(new AST.ImportSpecifier({ name: name, binding: this.parseBindingIdentifier() }), startState);
    }
  }, {
    key: 'parseNameSpaceBinding',
    value: function parseNameSpaceBinding() {
      this.expect(_tokenizer.TokenType.MUL);
      this.expectContextualKeyword('as');
      return this.parseBindingIdentifier();
    }
  }, {
    key: 'parseNamedImports',
    value: function parseNamedImports() {
      var result = [];
      this.expect(_tokenizer.TokenType.LBRACE);
      while (!this.eat(_tokenizer.TokenType.RBRACE)) {
        result.push(this.parseImportSpecifier());
        if (!this.eat(_tokenizer.TokenType.COMMA)) {
          this.expect(_tokenizer.TokenType.RBRACE);
          break;
        }
      }
      return result;
    }
  }, {
    key: 'parseFromClause',
    value: function parseFromClause() {
      this.expectContextualKeyword('from');
      var value = this.expect(_tokenizer.TokenType.STRING).str;
      return value;
    }
  }, {
    key: 'parseImportDeclaration',
    value: function parseImportDeclaration() {
      var startState = this.startNode(),
          defaultBinding = null,
          moduleSpecifier = void 0;
      this.expect(_tokenizer.TokenType.IMPORT);
      if (this.match(_tokenizer.TokenType.STRING)) {
        moduleSpecifier = this.lex().str;
        this.consumeSemicolon();
        return this.finishNode(new AST.Import({ defaultBinding: null, namedImports: [], moduleSpecifier: moduleSpecifier }), startState);
      }
      if (this.matchIdentifier()) {
        defaultBinding = this.parseBindingIdentifier();
        if (!this.eat(_tokenizer.TokenType.COMMA)) {
          var decl = new AST.Import({ defaultBinding: defaultBinding, namedImports: [], moduleSpecifier: this.parseFromClause() });
          this.consumeSemicolon();
          return this.finishNode(decl, startState);
        }
      }
      if (this.match(_tokenizer.TokenType.MUL)) {
        var _decl = new AST.ImportNamespace({
          defaultBinding: defaultBinding,
          namespaceBinding: this.parseNameSpaceBinding(),
          moduleSpecifier: this.parseFromClause()
        });
        this.consumeSemicolon();
        return this.finishNode(_decl, startState);
      } else if (this.match(_tokenizer.TokenType.LBRACE)) {
        var _decl2 = new AST.Import({
          defaultBinding: defaultBinding,
          namedImports: this.parseNamedImports(),
          moduleSpecifier: this.parseFromClause()
        });
        this.consumeSemicolon();
        return this.finishNode(_decl2, startState);
      } else {
        throw this.createUnexpected(this.lookahead);
      }
    }
  }, {
    key: 'parseExportSpecifier',
    value: function parseExportSpecifier() {
      var startState = this.startNode();
      var name = this.finishNode({ type: EXPORT_UNKNOWN_SPECIFIER, isIdentifier: this.matchIdentifier(), value: this.parseIdentifierName() }, startState);
      if (this.eatContextualKeyword('as')) {
        var exportedName = this.parseIdentifierName();
        return this.finishNode({ name: name, exportedName: exportedName }, startState);
      }
      return this.finishNode({ name: name, exportedName: null }, startState);
    }
  }, {
    key: 'parseExportClause',
    value: function parseExportClause() {
      this.expect(_tokenizer.TokenType.LBRACE);
      var result = [];
      while (!this.eat(_tokenizer.TokenType.RBRACE)) {
        result.push(this.parseExportSpecifier());
        if (!this.eat(_tokenizer.TokenType.COMMA)) {
          this.expect(_tokenizer.TokenType.RBRACE);
          break;
        }
      }
      return result;
    }
  }, {
    key: 'parseExportDeclaration',
    value: function parseExportDeclaration() {
      var _this2 = this;

      var startState = this.startNode(),
          decl = void 0;
      this.expect(_tokenizer.TokenType.EXPORT);
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.MUL:
          this.lex();
          // export * FromClause ;
          decl = new AST.ExportAllFrom({ moduleSpecifier: this.parseFromClause() });
          this.consumeSemicolon();
          break;
        case _tokenizer.TokenType.LBRACE:
          {
            // export ExportClause FromClause ;
            // export ExportClause ;
            var namedExports = this.parseExportClause();
            var moduleSpecifier = null;
            if (this.matchContextualKeyword('from')) {
              moduleSpecifier = this.parseFromClause();
              decl = new AST.ExportFrom({ namedExports: namedExports.map(function (e) {
                  return _this2.copyNode(e, new AST.ExportFromSpecifier({ name: e.name.value, exportedName: e.exportedName }));
                }), moduleSpecifier: moduleSpecifier });
            } else {
              namedExports.forEach(function (_ref) {
                var name = _ref.name;

                if (!name.isIdentifier) {
                  throw _this2.createError(_errors.ErrorMessages.ILLEGAL_EXPORTED_NAME);
                }
              });
              decl = new AST.ExportLocals({ namedExports: namedExports.map(function (e) {
                  return _this2.copyNode(e, new AST.ExportLocalSpecifier({ name: _this2.copyNode(e.name, new AST.IdentifierExpression({ name: e.name.value })), exportedName: e.exportedName }));
                }) });
            }
            this.consumeSemicolon();
            break;
          }
        case _tokenizer.TokenType.CLASS:
          // export ClassDeclaration
          decl = new AST.Export({ declaration: this.parseClass({ isExpr: false, inDefault: false }) });
          break;
        case _tokenizer.TokenType.FUNCTION:
          // export HoistableDeclaration
          decl = new AST.Export({ declaration: this.parseFunction({ isExpr: false, inDefault: false, allowGenerator: true }) });
          break;
        case _tokenizer.TokenType.DEFAULT:
          this.lex();
          switch (this.lookahead.type) {
            case _tokenizer.TokenType.FUNCTION:
              // export default HoistableDeclaration[Default]
              decl = new AST.ExportDefault({
                body: this.parseFunction({ isExpr: false, inDefault: true, allowGenerator: true })
              });
              break;
            case _tokenizer.TokenType.CLASS:
              // export default ClassDeclaration[Default]
              decl = new AST.ExportDefault({ body: this.parseClass({ isExpr: false, inDefault: true }) });
              break;
            default:
              // export default [lookahead ∉ {function, class}] AssignmentExpression[In] ;
              decl = new AST.ExportDefault({ body: this.parseAssignmentExpression() });
              this.consumeSemicolon();
              break;
          }
          break;
        case _tokenizer.TokenType.VAR:
        case _tokenizer.TokenType.LET:
        case _tokenizer.TokenType.CONST:
          // export LexicalDeclaration
          decl = new AST.Export({ declaration: this.parseVariableDeclaration(true) });
          this.consumeSemicolon();
          break;
        default:
          throw this.createUnexpected(this.lookahead);
      }
      return this.finishNode(decl, startState);
    }
  }, {
    key: 'parseModuleItem',
    value: function parseModuleItem() {
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.IMPORT:
          return this.parseImportDeclaration();
        case _tokenizer.TokenType.EXPORT:
          return this.parseExportDeclaration();
        default:
          return this.parseStatementListItem();
      }
    }
  }, {
    key: 'lookaheadLexicalDeclaration',
    value: function lookaheadLexicalDeclaration() {
      if (this.match(_tokenizer.TokenType.LET) || this.match(_tokenizer.TokenType.CONST)) {
        var lexerState = this.saveLexerState();
        this.lex();
        if (this.matchIdentifier() || this.match(_tokenizer.TokenType.LBRACE) || this.match(_tokenizer.TokenType.LBRACK)) {
          this.restoreLexerState(lexerState);
          return true;
        } else {
          this.restoreLexerState(lexerState);
        }
      }
      return false;
    }
  }, {
    key: 'parseStatementListItem',
    value: function parseStatementListItem() {
      if (this.eof()) throw this.createUnexpected(this.lookahead);

      switch (this.lookahead.type) {
        case _tokenizer.TokenType.FUNCTION:
          return this.parseFunction({ isExpr: false, inDefault: false, allowGenerator: true });
        case _tokenizer.TokenType.CLASS:
          return this.parseClass({ isExpr: false, inDefault: false });
        default:
          if (this.lookaheadLexicalDeclaration()) {
            var startState = this.startNode();
            return this.finishNode(this.parseVariableDeclarationStatement(), startState);
          } else {
            return this.parseStatement();
          }
      }
    }
  }, {
    key: 'parseStatement',
    value: function parseStatement() {
      var startState = this.startNode();
      var stmt = this.isolateCoverGrammar(this.parseStatementHelper);
      return this.finishNode(stmt, startState);
    }
  }, {
    key: 'parseStatementHelper',
    value: function parseStatementHelper() {
      if (this.eof()) {
        throw this.createUnexpected(this.lookahead);
      }

      switch (this.lookahead.type) {
        case _tokenizer.TokenType.SEMICOLON:
          return this.parseEmptyStatement();
        case _tokenizer.TokenType.LBRACE:
          return this.parseBlockStatement();
        case _tokenizer.TokenType.LPAREN:
          return this.parseExpressionStatement();
        case _tokenizer.TokenType.BREAK:
          return this.parseBreakStatement();
        case _tokenizer.TokenType.CONTINUE:
          return this.parseContinueStatement();
        case _tokenizer.TokenType.DEBUGGER:
          return this.parseDebuggerStatement();
        case _tokenizer.TokenType.DO:
          return this.parseDoWhileStatement();
        case _tokenizer.TokenType.FOR:
          return this.parseForStatement();
        case _tokenizer.TokenType.IF:
          return this.parseIfStatement();
        case _tokenizer.TokenType.RETURN:
          return this.parseReturnStatement();
        case _tokenizer.TokenType.SWITCH:
          return this.parseSwitchStatement();
        case _tokenizer.TokenType.THROW:
          return this.parseThrowStatement();
        case _tokenizer.TokenType.TRY:
          return this.parseTryStatement();
        case _tokenizer.TokenType.VAR:
          return this.parseVariableDeclarationStatement();
        case _tokenizer.TokenType.WHILE:
          return this.parseWhileStatement();
        case _tokenizer.TokenType.WITH:
          return this.parseWithStatement();
        case _tokenizer.TokenType.FUNCTION:
        case _tokenizer.TokenType.CLASS:
          throw this.createUnexpected(this.lookahead);

        default:
          {
            if (this.lookaheadLexicalDeclaration()) {
              throw this.createUnexpected(this.lookahead);
            }
            var expr = this.parseExpression();
            // 12.12 Labelled Statements;
            if (expr.type === 'IdentifierExpression' && this.eat(_tokenizer.TokenType.COLON)) {
              var labeledBody = this.match(_tokenizer.TokenType.FUNCTION) ? this.parseFunction({ isExpr: false, inDefault: false, allowGenerator: false }) : this.parseStatement();
              return new AST.LabeledStatement({ label: expr.name, body: labeledBody });
            } else {
              this.consumeSemicolon();
              return new AST.ExpressionStatement({ expression: expr });
            }
          }
      }
    }
  }, {
    key: 'parseEmptyStatement',
    value: function parseEmptyStatement() {
      this.lex();
      return new AST.EmptyStatement();
    }
  }, {
    key: 'parseBlockStatement',
    value: function parseBlockStatement() {
      return new AST.BlockStatement({ block: this.parseBlock() });
    }
  }, {
    key: 'parseExpressionStatement',
    value: function parseExpressionStatement() {
      var expr = this.parseExpression();
      this.consumeSemicolon();
      return new AST.ExpressionStatement({ expression: expr });
    }
  }, {
    key: 'parseBreakStatement',
    value: function parseBreakStatement() {
      this.lex();

      // Catch the very common case first: immediately a semicolon (U+003B).
      if (this.eat(_tokenizer.TokenType.SEMICOLON) || this.hasLineTerminatorBeforeNext) {
        return new AST.BreakStatement({ label: null });
      }

      var label = null;
      if (this.matchIdentifier()) {
        label = this.parseIdentifier();
      }

      this.consumeSemicolon();

      return new AST.BreakStatement({ label: label });
    }
  }, {
    key: 'parseContinueStatement',
    value: function parseContinueStatement() {
      this.lex();

      // Catch the very common case first: immediately a semicolon (U+003B).
      if (this.eat(_tokenizer.TokenType.SEMICOLON) || this.hasLineTerminatorBeforeNext) {
        return new AST.ContinueStatement({ label: null });
      }

      var label = null;
      if (this.matchIdentifier()) {
        label = this.parseIdentifier();
      }

      this.consumeSemicolon();

      return new AST.ContinueStatement({ label: label });
    }
  }, {
    key: 'parseDebuggerStatement',
    value: function parseDebuggerStatement() {
      this.lex();
      this.consumeSemicolon();
      return new AST.DebuggerStatement();
    }
  }, {
    key: 'parseDoWhileStatement',
    value: function parseDoWhileStatement() {
      this.lex();
      var body = this.parseStatement();
      this.expect(_tokenizer.TokenType.WHILE);
      this.expect(_tokenizer.TokenType.LPAREN);
      var test = this.parseExpression();
      this.expect(_tokenizer.TokenType.RPAREN);
      this.eat(_tokenizer.TokenType.SEMICOLON);
      return new AST.DoWhileStatement({ body: body, test: test });
    }
  }, {
    key: 'parseForStatement',
    value: function parseForStatement() {
      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      var test = null;
      var right = null;
      if (this.eat(_tokenizer.TokenType.SEMICOLON)) {
        if (!this.match(_tokenizer.TokenType.SEMICOLON)) {
          test = this.parseExpression();
        }
        this.expect(_tokenizer.TokenType.SEMICOLON);
        if (!this.match(_tokenizer.TokenType.RPAREN)) {
          right = this.parseExpression();
        }
        return new AST.ForStatement({ init: null, test: test, update: right, body: this.getIteratorStatementEpilogue() });
      } else {
        var startsWithLet = this.match(_tokenizer.TokenType.LET);
        var isForDecl = this.lookaheadLexicalDeclaration();
        var leftStartState = this.startNode();
        if (this.match(_tokenizer.TokenType.VAR) || isForDecl) {
          var previousAllowIn = this.allowIn;
          this.allowIn = false;
          var init = this.parseVariableDeclaration(false);
          this.allowIn = previousAllowIn;

          if (init.declarators.length === 1 && (this.match(_tokenizer.TokenType.IN) || this.matchContextualKeyword('of'))) {
            var ctor = void 0;

            if (this.match(_tokenizer.TokenType.IN)) {
              if (init.declarators[0].init != null) {
                throw this.createError(_errors.ErrorMessages.INVALID_VAR_INIT_FOR_IN);
              }
              ctor = AST.ForInStatement;
              this.lex();
              right = this.parseExpression();
            } else {
              if (init.declarators[0].init != null) {
                throw this.createError(_errors.ErrorMessages.INVALID_VAR_INIT_FOR_OF);
              }
              ctor = AST.ForOfStatement;
              this.lex();
              right = this.parseAssignmentExpression();
            }

            var body = this.getIteratorStatementEpilogue();

            return new ctor({ left: init, right: right, body: body });
          } else {
            this.expect(_tokenizer.TokenType.SEMICOLON);
            if (init.declarators.some(function (decl) {
              return decl.binding.type !== 'BindingIdentifier' && decl.init === null;
            })) {
              throw this.createError(_errors.ErrorMessages.UNINITIALIZED_BINDINGPATTERN_IN_FOR_INIT);
            }
            if (!this.match(_tokenizer.TokenType.SEMICOLON)) {
              test = this.parseExpression();
            }
            this.expect(_tokenizer.TokenType.SEMICOLON);
            if (!this.match(_tokenizer.TokenType.RPAREN)) {
              right = this.parseExpression();
            }
            return new AST.ForStatement({ init: init, test: test, update: right, body: this.getIteratorStatementEpilogue() });
          }
        } else {
          var _previousAllowIn = this.allowIn;
          this.allowIn = false;
          var expr = this.inheritCoverGrammar(this.parseAssignmentExpressionOrTarget);
          this.allowIn = _previousAllowIn;

          if (this.isAssignmentTarget && expr.type !== 'AssignmentExpression' && (this.match(_tokenizer.TokenType.IN) || this.matchContextualKeyword('of'))) {
            if (expr.type === 'ObjectAssignmentTarget' || expr.type === 'ArrayAssignmentTarget') {
              this.firstExprError = null;
            }
            if (startsWithLet && this.matchContextualKeyword('of')) {
              throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_FOR_OF);
            }
            var _ctor = void 0;
            if (this.match(_tokenizer.TokenType.IN)) {
              _ctor = AST.ForInStatement;
              this.lex();
              right = this.parseExpression();
            } else {
              _ctor = AST.ForOfStatement;
              this.lex();
              right = this.parseAssignmentExpression();
            }

            return new _ctor({ left: this.transformDestructuring(expr), right: right, body: this.getIteratorStatementEpilogue() });
          } else {
            if (this.firstExprError) {
              throw this.firstExprError;
            }
            while (this.eat(_tokenizer.TokenType.COMMA)) {
              var rhs = this.parseAssignmentExpression();
              expr = this.finishNode(new AST.BinaryExpression({ left: expr, operator: ',', right: rhs }), leftStartState);
            }
            if (this.match(_tokenizer.TokenType.IN)) {
              throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_FOR_IN);
            }
            if (this.matchContextualKeyword('of')) {
              throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_FOR_OF);
            }
            this.expect(_tokenizer.TokenType.SEMICOLON);
            if (!this.match(_tokenizer.TokenType.SEMICOLON)) {
              test = this.parseExpression();
            }
            this.expect(_tokenizer.TokenType.SEMICOLON);
            if (!this.match(_tokenizer.TokenType.RPAREN)) {
              right = this.parseExpression();
            }
            return new AST.ForStatement({ init: expr, test: test, update: right, body: this.getIteratorStatementEpilogue() });
          }
        }
      }
    }
  }, {
    key: 'getIteratorStatementEpilogue',
    value: function getIteratorStatementEpilogue() {
      this.expect(_tokenizer.TokenType.RPAREN);
      var body = this.parseStatement();
      return body;
    }
  }, {
    key: 'parseIfStatementChild',
    value: function parseIfStatementChild() {
      return this.match(_tokenizer.TokenType.FUNCTION) ? this.parseFunction({ isExpr: false, inDefault: false, allowGenerator: false }) : this.parseStatement();
    }
  }, {
    key: 'parseIfStatement',
    value: function parseIfStatement() {
      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      var test = this.parseExpression();
      this.expect(_tokenizer.TokenType.RPAREN);
      var consequent = this.parseIfStatementChild();
      var alternate = null;
      if (this.eat(_tokenizer.TokenType.ELSE)) {
        alternate = this.parseIfStatementChild();
      }
      return new AST.IfStatement({ test: test, consequent: consequent, alternate: alternate });
    }
  }, {
    key: 'parseReturnStatement',
    value: function parseReturnStatement() {
      if (!this.inFunctionBody) {
        throw this.createError(_errors.ErrorMessages.ILLEGAL_RETURN);
      }

      this.lex();

      // Catch the very common case first: immediately a semicolon (U+003B).
      if (this.eat(_tokenizer.TokenType.SEMICOLON) || this.hasLineTerminatorBeforeNext) {
        return new AST.ReturnStatement({ expression: null });
      }

      var expression = null;
      if (!this.match(_tokenizer.TokenType.RBRACE) && !this.eof()) {
        expression = this.parseExpression();
      }

      this.consumeSemicolon();
      return new AST.ReturnStatement({ expression: expression });
    }
  }, {
    key: 'parseSwitchStatement',
    value: function parseSwitchStatement() {
      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      var discriminant = this.parseExpression();
      this.expect(_tokenizer.TokenType.RPAREN);
      this.expect(_tokenizer.TokenType.LBRACE);

      if (this.eat(_tokenizer.TokenType.RBRACE)) {
        return new AST.SwitchStatement({ discriminant: discriminant, cases: [] });
      }

      var cases = this.parseSwitchCases();
      if (this.match(_tokenizer.TokenType.DEFAULT)) {
        var defaultCase = this.parseSwitchDefault();
        var postDefaultCases = this.parseSwitchCases();
        if (this.match(_tokenizer.TokenType.DEFAULT)) {
          throw this.createError(_errors.ErrorMessages.MULTIPLE_DEFAULTS_IN_SWITCH);
        }
        this.expect(_tokenizer.TokenType.RBRACE);
        return new AST.SwitchStatementWithDefault({
          discriminant: discriminant,
          preDefaultCases: cases,
          defaultCase: defaultCase,
          postDefaultCases: postDefaultCases
        });
      } else {
        this.expect(_tokenizer.TokenType.RBRACE);
        return new AST.SwitchStatement({ discriminant: discriminant, cases: cases });
      }
    }
  }, {
    key: 'parseSwitchCases',
    value: function parseSwitchCases() {
      var result = [];
      while (!(this.eof() || this.match(_tokenizer.TokenType.RBRACE) || this.match(_tokenizer.TokenType.DEFAULT))) {
        result.push(this.parseSwitchCase());
      }
      return result;
    }
  }, {
    key: 'parseSwitchCase',
    value: function parseSwitchCase() {
      var startState = this.startNode();
      this.expect(_tokenizer.TokenType.CASE);
      return this.finishNode(new AST.SwitchCase({
        test: this.parseExpression(),
        consequent: this.parseSwitchCaseBody()
      }), startState);
    }
  }, {
    key: 'parseSwitchDefault',
    value: function parseSwitchDefault() {
      var startState = this.startNode();
      this.expect(_tokenizer.TokenType.DEFAULT);
      return this.finishNode(new AST.SwitchDefault({ consequent: this.parseSwitchCaseBody() }), startState);
    }
  }, {
    key: 'parseSwitchCaseBody',
    value: function parseSwitchCaseBody() {
      this.expect(_tokenizer.TokenType.COLON);
      return this.parseStatementListInSwitchCaseBody();
    }
  }, {
    key: 'parseStatementListInSwitchCaseBody',
    value: function parseStatementListInSwitchCaseBody() {
      var result = [];
      while (!(this.eof() || this.match(_tokenizer.TokenType.RBRACE) || this.match(_tokenizer.TokenType.DEFAULT) || this.match(_tokenizer.TokenType.CASE))) {
        result.push(this.parseStatementListItem());
      }
      return result;
    }
  }, {
    key: 'parseThrowStatement',
    value: function parseThrowStatement() {
      var token = this.lex();
      if (this.hasLineTerminatorBeforeNext) {
        throw this.createErrorWithLocation(token, _errors.ErrorMessages.NEWLINE_AFTER_THROW);
      }
      var expression = this.parseExpression();
      this.consumeSemicolon();
      return new AST.ThrowStatement({ expression: expression });
    }
  }, {
    key: 'parseTryStatement',
    value: function parseTryStatement() {
      this.lex();
      var body = this.parseBlock();

      if (this.match(_tokenizer.TokenType.CATCH)) {
        var catchClause = this.parseCatchClause();
        if (this.eat(_tokenizer.TokenType.FINALLY)) {
          var finalizer = this.parseBlock();
          return new AST.TryFinallyStatement({ body: body, catchClause: catchClause, finalizer: finalizer });
        }
        return new AST.TryCatchStatement({ body: body, catchClause: catchClause });
      }

      if (this.eat(_tokenizer.TokenType.FINALLY)) {
        var _finalizer = this.parseBlock();
        return new AST.TryFinallyStatement({ body: body, catchClause: null, finalizer: _finalizer });
      } else {
        throw this.createError(_errors.ErrorMessages.NO_CATCH_OR_FINALLY);
      }
    }
  }, {
    key: 'parseVariableDeclarationStatement',
    value: function parseVariableDeclarationStatement() {
      var declaration = this.parseVariableDeclaration(true);
      this.consumeSemicolon();
      return new AST.VariableDeclarationStatement({ declaration: declaration });
    }
  }, {
    key: 'parseWhileStatement',
    value: function parseWhileStatement() {
      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      var test = this.parseExpression();
      var body = this.getIteratorStatementEpilogue();
      return new AST.WhileStatement({ test: test, body: body });
    }
  }, {
    key: 'parseWithStatement',
    value: function parseWithStatement() {
      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      var object = this.parseExpression();
      this.expect(_tokenizer.TokenType.RPAREN);
      var body = this.parseStatement();
      return new AST.WithStatement({ object: object, body: body });
    }
  }, {
    key: 'parseCatchClause',
    value: function parseCatchClause() {
      var startState = this.startNode();

      this.lex();
      this.expect(_tokenizer.TokenType.LPAREN);
      if (this.match(_tokenizer.TokenType.RPAREN) || this.match(_tokenizer.TokenType.LPAREN)) {
        throw this.createUnexpected(this.lookahead);
      }
      var binding = this.parseBindingTarget();
      this.expect(_tokenizer.TokenType.RPAREN);
      var body = this.parseBlock();

      return this.finishNode(new AST.CatchClause({ binding: binding, body: body }), startState);
    }
  }, {
    key: 'parseBlock',
    value: function parseBlock() {
      var startState = this.startNode();
      this.expect(_tokenizer.TokenType.LBRACE);
      var body = [];
      while (!this.match(_tokenizer.TokenType.RBRACE)) {
        body.push(this.parseStatementListItem());
      }
      this.expect(_tokenizer.TokenType.RBRACE);
      return this.finishNode(new AST.Block({ statements: body }), startState);
    }
  }, {
    key: 'parseVariableDeclaration',
    value: function parseVariableDeclaration(bindingPatternsMustHaveInit) {
      var startState = this.startNode();
      var token = this.lex();

      // preceded by this.match(TokenSubType.VAR) || this.match(TokenSubType.LET);
      var kind = token.type === _tokenizer.TokenType.VAR ? 'var' : token.type === _tokenizer.TokenType.CONST ? 'const' : 'let';
      var declarators = this.parseVariableDeclaratorList(bindingPatternsMustHaveInit);
      return this.finishNode(new AST.VariableDeclaration({ kind: kind, declarators: declarators }), startState);
    }
  }, {
    key: 'parseVariableDeclaratorList',
    value: function parseVariableDeclaratorList(bindingPatternsMustHaveInit) {
      var result = [];
      do {
        result.push(this.parseVariableDeclarator(bindingPatternsMustHaveInit));
      } while (this.eat(_tokenizer.TokenType.COMMA));
      return result;
    }
  }, {
    key: 'parseVariableDeclarator',
    value: function parseVariableDeclarator(bindingPatternsMustHaveInit) {
      var startState = this.startNode();

      if (this.match(_tokenizer.TokenType.LPAREN)) {
        throw this.createUnexpected(this.lookahead);
      }

      var previousAllowIn = this.allowIn;
      this.allowIn = true;
      var binding = this.parseBindingTarget();
      this.allowIn = previousAllowIn;

      if (bindingPatternsMustHaveInit && binding.type !== 'BindingIdentifier' && !this.match(_tokenizer.TokenType.ASSIGN)) {
        this.expect(_tokenizer.TokenType.ASSIGN);
      }

      var init = null;
      if (this.eat(_tokenizer.TokenType.ASSIGN)) {
        init = this.parseAssignmentExpression();
      }

      return this.finishNode(new AST.VariableDeclarator({ binding: binding, init: init }), startState);
    }
  }, {
    key: 'isolateCoverGrammar',
    value: function isolateCoverGrammar(parser) {
      var oldIsBindingElement = this.isBindingElement,
          oldIsAssignmentTarget = this.isAssignmentTarget,
          oldFirstExprError = this.firstExprError,
          result = void 0;
      this.isBindingElement = this.isAssignmentTarget = true;
      this.firstExprError = null;
      result = parser.call(this);
      if (this.firstExprError !== null) {
        throw this.firstExprError;
      }
      this.isBindingElement = oldIsBindingElement;
      this.isAssignmentTarget = oldIsAssignmentTarget;
      this.firstExprError = oldFirstExprError;
      return result;
    }
  }, {
    key: 'inheritCoverGrammar',
    value: function inheritCoverGrammar(parser) {
      var oldIsBindingElement = this.isBindingElement,
          oldIsAssignmentTarget = this.isAssignmentTarget,
          oldFirstExprError = this.firstExprError,
          result = void 0;
      this.isBindingElement = this.isAssignmentTarget = true;
      this.firstExprError = null;
      result = parser.call(this);
      this.isBindingElement = this.isBindingElement && oldIsBindingElement;
      this.isAssignmentTarget = this.isAssignmentTarget && oldIsAssignmentTarget;
      this.firstExprError = oldFirstExprError || this.firstExprError;
      return result;
    }
  }, {
    key: 'parseExpression',
    value: function parseExpression() {
      var startState = this.startNode();

      var left = this.parseAssignmentExpression();
      if (this.match(_tokenizer.TokenType.COMMA)) {
        while (!this.eof()) {
          if (!this.match(_tokenizer.TokenType.COMMA)) break;
          this.lex();
          var right = this.parseAssignmentExpression();
          left = this.finishNode(new AST.BinaryExpression({ left: left, operator: ',', right: right }), startState);
        }
      }
      return left;
    }
  }, {
    key: 'parseArrowExpressionTail',
    value: function parseArrowExpressionTail(head, startState) {
      // Convert param list.
      var _head$params = head.params,
          params = _head$params === undefined ? null : _head$params,
          _head$rest = head.rest,
          rest = _head$rest === undefined ? null : _head$rest;

      if (head.type !== ARROW_EXPRESSION_PARAMS) {
        if (head.type === 'IdentifierExpression') {
          params = [this.targetToBinding(this.transformDestructuring(head))];
        } else {
          throw this.createUnexpected(this.lookahead);
        }
      }

      var paramsNode = this.finishNode(new AST.FormalParameters({ items: params, rest: rest }), startState);

      var arrow = this.expect(_tokenizer.TokenType.ARROW);

      var previousYield = this.allowYieldExpression;
      this.allowYieldExpression = false;

      var body = void 0;
      if (this.match(_tokenizer.TokenType.LBRACE)) {
        var previousAllowIn = this.allowIn;
        this.allowIn = true;
        body = this.parseFunctionBody();
        this.allowIn = previousAllowIn;
      } else {
        body = this.parseAssignmentExpression();
      }

      this.allowYieldExpression = previousYield;
      return this.finishNode(new AST.ArrowExpression({ params: paramsNode, body: body }), startState);
    }
  }, {
    key: 'parseAssignmentExpression',
    value: function parseAssignmentExpression() {
      return this.isolateCoverGrammar(this.parseAssignmentExpressionOrTarget);
    }
  }, {
    key: 'parseAssignmentExpressionOrTarget',
    value: function parseAssignmentExpressionOrTarget() {
      var startState = this.startNode();

      if (this.allowYieldExpression && this.match(_tokenizer.TokenType.YIELD)) {
        this.isBindingElement = this.isAssignmentTarget = false;
        return this.parseYieldExpression();
      }

      var expr = this.parseConditionalExpression();

      if (!this.hasLineTerminatorBeforeNext && this.match(_tokenizer.TokenType.ARROW)) {
        this.isBindingElement = this.isAssignmentTarget = false;
        this.firstExprError = null;
        return this.parseArrowExpressionTail(expr, startState);
      }

      var isAssignmentOperator = false;
      var operator = this.lookahead;
      switch (operator.type) {
        case _tokenizer.TokenType.ASSIGN_BIT_OR:
        case _tokenizer.TokenType.ASSIGN_BIT_XOR:
        case _tokenizer.TokenType.ASSIGN_BIT_AND:
        case _tokenizer.TokenType.ASSIGN_SHL:
        case _tokenizer.TokenType.ASSIGN_SHR:
        case _tokenizer.TokenType.ASSIGN_SHR_UNSIGNED:
        case _tokenizer.TokenType.ASSIGN_ADD:
        case _tokenizer.TokenType.ASSIGN_SUB:
        case _tokenizer.TokenType.ASSIGN_MUL:
        case _tokenizer.TokenType.ASSIGN_DIV:
        case _tokenizer.TokenType.ASSIGN_MOD:
        case _tokenizer.TokenType.ASSIGN_EXP:
          isAssignmentOperator = true;
          break;
      }
      if (isAssignmentOperator) {
        if (!this.isAssignmentTarget || !isValidSimpleAssignmentTarget(expr)) {
          throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_ASSIGNMENT);
        }
        expr = this.transformDestructuring(expr);
      } else if (operator.type === _tokenizer.TokenType.ASSIGN) {
        if (!this.isAssignmentTarget) {
          throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_ASSIGNMENT);
        }
        expr = this.transformDestructuring(expr);
      } else {
        return expr;
      }

      this.lex();
      var rhs = this.parseAssignmentExpression();

      this.firstExprError = null;
      var node = void 0;
      if (operator.type === _tokenizer.TokenType.ASSIGN) {
        node = new AST.AssignmentExpression({ binding: expr, expression: rhs });
      } else {
        node = new AST.CompoundAssignmentExpression({ binding: expr, operator: operator.type.name, expression: rhs });
        this.isBindingElement = this.isAssignmentTarget = false;
      }
      return this.finishNode(node, startState);
    }
  }, {
    key: 'targetToBinding',
    value: function targetToBinding(node) {
      var _this3 = this;

      if (node === null) {
        return null;
      }

      switch (node.type) {
        case 'AssignmentTargetIdentifier':
          return this.copyNode(node, new AST.BindingIdentifier({ name: node.name }));
        case 'ArrayAssignmentTarget':
          return this.copyNode(node, new AST.ArrayBinding({ elements: node.elements.map(function (e) {
              return _this3.targetToBinding(e);
            }), rest: this.targetToBinding(node.rest) }));
        case 'ObjectAssignmentTarget':
          return this.copyNode(node, new AST.ObjectBinding({ properties: node.properties.map(function (p) {
              return _this3.targetToBinding(p);
            }) }));
        case 'AssignmentTargetPropertyIdentifier':
          return this.copyNode(node, new AST.BindingPropertyIdentifier({ binding: this.targetToBinding(node.binding), init: node.init }));
        case 'AssignmentTargetPropertyProperty':
          return this.copyNode(node, new AST.BindingPropertyProperty({ name: node.name, binding: this.targetToBinding(node.binding) }));
        case 'AssignmentTargetWithDefault':
          return this.copyNode(node, new AST.BindingWithDefault({ binding: this.targetToBinding(node.binding), init: node.init }));
      }

      // istanbul ignore next
      throw new Error('Not reached');
    }
  }, {
    key: 'transformDestructuring',
    value: function transformDestructuring(node) {
      var _this4 = this;

      switch (node.type) {

        case 'DataProperty':
          return this.copyNode(node, new AST.AssignmentTargetPropertyProperty({
            name: node.name,
            binding: this.transformDestructuringWithDefault(node.expression)
          }));
        case 'ShorthandProperty':
          return this.copyNode(node, new AST.AssignmentTargetPropertyIdentifier({
            binding: this.copyNode(node, new AST.AssignmentTargetIdentifier({ name: node.name.name })),
            init: null
          }));

        case 'ObjectExpression':
          return this.copyNode(node, new AST.ObjectAssignmentTarget({
            properties: node.properties.map(function (x) {
              return _this4.transformDestructuring(x);
            })
          }));
        case 'ArrayExpression':
          var last = node.elements[node.elements.length - 1];
          if (last != null && last.type === 'SpreadElement') {
            return this.copyNode(node, new AST.ArrayAssignmentTarget({
              elements: node.elements.slice(0, -1).map(function (e) {
                return e && _this4.transformDestructuringWithDefault(e);
              }),
              rest: this.copyNode(last.expression, this.transformDestructuring(last.expression))
            }));
          } else {
            return this.copyNode(node, new AST.ArrayAssignmentTarget({
              elements: node.elements.map(function (e) {
                return e && _this4.transformDestructuringWithDefault(e);
              }),
              rest: null
            }));
          }
          /* istanbul ignore next */
          break;
        case 'IdentifierExpression':
          return this.copyNode(node, new AST.AssignmentTargetIdentifier({ name: node.name }));

        case 'StaticPropertyName':
          return this.copyNode(node, new AST.AssignmentTargetIdentifier({ name: node.value }));

        case 'ComputedMemberExpression':
          return this.copyNode(node, new AST.ComputedMemberAssignmentTarget({ object: node.object, expression: node.expression }));
        case 'StaticMemberExpression':
          return this.copyNode(node, new AST.StaticMemberAssignmentTarget({ object: node.object, property: node.property }));

        case 'ArrayAssignmentTarget':
        case 'ObjectAssignmentTarget':
        case 'ComputedMemberAssignmentTarget':
        case 'StaticMemberAssignmentTarget':
        case 'AssignmentTargetIdentifier':
        case 'AssignmentTargetPropertyIdentifier':
        case 'AssignmentTargetPropertyProperty':
        case 'AssignmentTargetWithDefault':
          return node;
      }

      // istanbul ignore next
      throw new Error('Not reached');
    }
  }, {
    key: 'transformDestructuringWithDefault',
    value: function transformDestructuringWithDefault(node) {
      switch (node.type) {
        case 'AssignmentExpression':
          return this.copyNode(node, new AST.AssignmentTargetWithDefault({
            binding: this.transformDestructuring(node.binding),
            init: node.expression
          }));
      }
      return this.transformDestructuring(node);
    }
  }, {
    key: 'lookaheadAssignmentExpression',
    value: function lookaheadAssignmentExpression() {
      if (this.matchIdentifier()) {
        return true;
      }
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.ADD:
        case _tokenizer.TokenType.ASSIGN_DIV:
        case _tokenizer.TokenType.BIT_NOT:
        case _tokenizer.TokenType.CLASS:
        case _tokenizer.TokenType.DEC:
        case _tokenizer.TokenType.DELETE:
        case _tokenizer.TokenType.DIV:
        case _tokenizer.TokenType.FALSE:
        case _tokenizer.TokenType.FUNCTION:
        case _tokenizer.TokenType.INC:
        case _tokenizer.TokenType.LBRACE:
        case _tokenizer.TokenType.LBRACK:
        case _tokenizer.TokenType.LPAREN:
        case _tokenizer.TokenType.NEW:
        case _tokenizer.TokenType.NOT:
        case _tokenizer.TokenType.NULL:
        case _tokenizer.TokenType.NUMBER:
        case _tokenizer.TokenType.STRING:
        case _tokenizer.TokenType.SUB:
        case _tokenizer.TokenType.SUPER:
        case _tokenizer.TokenType.THIS:
        case _tokenizer.TokenType.TRUE:
        case _tokenizer.TokenType.TYPEOF:
        case _tokenizer.TokenType.VOID:
        case _tokenizer.TokenType.TEMPLATE:
          return true;
      }
      return false;
    }
  }, {
    key: 'parseYieldExpression',
    value: function parseYieldExpression() {
      var startState = this.startNode();

      this.lex();
      if (this.hasLineTerminatorBeforeNext) {
        return this.finishNode(new AST.YieldExpression({ expression: null }), startState);
      }
      var isGenerator = !!this.eat(_tokenizer.TokenType.MUL);
      var expr = null;
      if (isGenerator || this.lookaheadAssignmentExpression()) {
        expr = this.parseAssignmentExpression();
      }
      var ctor = isGenerator ? AST.YieldGeneratorExpression : AST.YieldExpression;
      return this.finishNode(new ctor({ expression: expr }), startState);
    }
  }, {
    key: 'parseConditionalExpression',
    value: function parseConditionalExpression() {
      var startState = this.startNode();
      var test = this.parseBinaryExpression();
      if (this.firstExprError) return test;
      if (this.eat(_tokenizer.TokenType.CONDITIONAL)) {
        this.isBindingElement = this.isAssignmentTarget = false;
        var previousAllowIn = this.allowIn;
        this.allowIn = true;
        var consequent = this.isolateCoverGrammar(this.parseAssignmentExpression);
        this.allowIn = previousAllowIn;
        this.expect(_tokenizer.TokenType.COLON);
        var alternate = this.isolateCoverGrammar(this.parseAssignmentExpression);
        return this.finishNode(new AST.ConditionalExpression({ test: test, consequent: consequent, alternate: alternate }), startState);
      }
      return test;
    }
  }, {
    key: 'isBinaryOperator',
    value: function isBinaryOperator(type) {
      switch (type) {
        case _tokenizer.TokenType.OR:
        case _tokenizer.TokenType.AND:
        case _tokenizer.TokenType.BIT_OR:
        case _tokenizer.TokenType.BIT_XOR:
        case _tokenizer.TokenType.BIT_AND:
        case _tokenizer.TokenType.EQ:
        case _tokenizer.TokenType.NE:
        case _tokenizer.TokenType.EQ_STRICT:
        case _tokenizer.TokenType.NE_STRICT:
        case _tokenizer.TokenType.LT:
        case _tokenizer.TokenType.GT:
        case _tokenizer.TokenType.LTE:
        case _tokenizer.TokenType.GTE:
        case _tokenizer.TokenType.INSTANCEOF:
        case _tokenizer.TokenType.SHL:
        case _tokenizer.TokenType.SHR:
        case _tokenizer.TokenType.SHR_UNSIGNED:
        case _tokenizer.TokenType.ADD:
        case _tokenizer.TokenType.SUB:
        case _tokenizer.TokenType.MUL:
        case _tokenizer.TokenType.DIV:
        case _tokenizer.TokenType.MOD:
          return true;
        case _tokenizer.TokenType.IN:
          return this.allowIn;
        default:
          return false;
      }
    }
  }, {
    key: 'parseBinaryExpression',
    value: function parseBinaryExpression() {
      var _this5 = this;

      var startState = this.startNode();
      var left = this.parseExponentiationExpression();
      if (this.firstExprError) {
        return left;
      }

      var operator = this.lookahead.type;

      if (!this.isBinaryOperator(operator)) return left;

      this.isBindingElement = this.isAssignmentTarget = false;

      this.lex();
      var stack = [];
      stack.push({ startState: startState, left: left, operator: operator, precedence: BinaryPrecedence[operator.name] });
      startState = this.startNode();
      var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
      operator = this.lookahead.type;
      while (this.isBinaryOperator(operator)) {
        var precedence = BinaryPrecedence[operator.name];
        // Reduce: make a binary expression from the three topmost entries.
        while (stack.length && precedence <= stack[stack.length - 1].precedence) {
          var stackItem = stack[stack.length - 1];
          var stackOperator = stackItem.operator;
          left = stackItem.left;
          stack.pop();
          startState = stackItem.startState;
          right = this.finishNode(new AST.BinaryExpression({ left: left, operator: stackOperator.name, right: right }), startState);
        }

        this.lex();
        stack.push({ startState: startState, left: right, operator: operator, precedence: precedence });

        startState = this.startNode();
        right = this.isolateCoverGrammar(this.parseExponentiationExpression);
        operator = this.lookahead.type;
      }

      // Final reduce to clean-up the stack.
      return stack.reduceRight(function (expr, stackItem) {
        return _this5.finishNode(new AST.BinaryExpression({
          left: stackItem.left,
          operator: stackItem.operator.name,
          right: expr
        }), stackItem.startState);
      }, right);
    }
  }, {
    key: 'parseExponentiationExpression',
    value: function parseExponentiationExpression() {
      var startState = this.startNode();

      var leftIsParenthesized = this.lookahead.type === _tokenizer.TokenType.LPAREN;
      var left = this.parseUnaryExpression();
      if (this.lookahead.type !== _tokenizer.TokenType.EXP) {
        return left;
      }
      if (left.type === 'UnaryExpression' && !leftIsParenthesized) {
        throw this.createError(_errors.ErrorMessages.INVALID_EXPONENTIATION_LHS);
      }
      this.lex();

      this.isBindingElement = this.isAssignmentTarget = false;

      var right = this.isolateCoverGrammar(this.parseExponentiationExpression);
      return this.finishNode(new AST.BinaryExpression({ left: left, operator: '**', right: right }), startState);
    }
  }, {
    key: 'parseUnaryExpression',
    value: function parseUnaryExpression() {
      if (this.lookahead.type.klass !== _tokenizer.TokenClass.Punctuator && this.lookahead.type.klass !== _tokenizer.TokenClass.Keyword) {
        return this.parseUpdateExpression();
      }
      var startState = this.startNode();
      var operator = this.lookahead;
      if (!isPrefixOperator(operator)) {
        return this.parseUpdateExpression();
      }

      this.lex();
      this.isBindingElement = this.isAssignmentTarget = false;

      var node = void 0;
      if (isUpdateOperator(operator)) {
        var operandStartLocation = this.getLocation();
        var operand = this.isolateCoverGrammar(this.parseUnaryExpression);
        if (!isValidSimpleAssignmentTarget(operand)) {
          throw this.createErrorWithLocation(operandStartLocation, _errors.ErrorMessages.INVALID_UPDATE_OPERAND);
        }
        operand = this.transformDestructuring(operand);
        node = new AST.UpdateExpression({ isPrefix: true, operator: operator.value, operand: operand });
      } else {
        var _operand = this.isolateCoverGrammar(this.parseUnaryExpression);
        node = new AST.UnaryExpression({ operator: operator.value, operand: _operand });
      }

      return this.finishNode(node, startState);
    }
  }, {
    key: 'parseUpdateExpression',
    value: function parseUpdateExpression() {
      var startLocation = this.getLocation();
      var startState = this.startNode();

      var operand = this.parseLeftHandSideExpression({ allowCall: true });
      if (this.firstExprError || this.hasLineTerminatorBeforeNext) return operand;

      var operator = this.lookahead;
      if (!isUpdateOperator(operator)) return operand;
      this.lex();
      this.isBindingElement = this.isAssignmentTarget = false;
      if (!isValidSimpleAssignmentTarget(operand)) {
        throw this.createErrorWithLocation(startLocation, _errors.ErrorMessages.INVALID_UPDATE_OPERAND);
      }
      operand = this.transformDestructuring(operand);

      return this.finishNode(new AST.UpdateExpression({ isPrefix: false, operator: operator.value, operand: operand }), startState);
    }
  }, {
    key: 'parseLeftHandSideExpression',
    value: function parseLeftHandSideExpression(_ref2) {
      var allowCall = _ref2.allowCall;

      var startState = this.startNode();
      var previousAllowIn = this.allowIn;
      this.allowIn = true;

      var expr = void 0,
          token = this.lookahead;

      if (this.eat(_tokenizer.TokenType.SUPER)) {
        this.isBindingElement = false;
        this.isAssignmentTarget = false;
        expr = this.finishNode(new AST.Super(), startState);
        if (this.match(_tokenizer.TokenType.LPAREN)) {
          if (allowCall) {
            expr = this.finishNode(new AST.CallExpression({
              callee: expr,
              arguments: this.parseArgumentList()
            }), startState);
          } else {
            throw this.createUnexpected(token);
          }
        } else if (this.match(_tokenizer.TokenType.LBRACK)) {
          expr = this.finishNode(new AST.ComputedMemberExpression({
            object: expr,
            expression: this.parseComputedMember()
          }), startState);
          this.isAssignmentTarget = true;
        } else if (this.match(_tokenizer.TokenType.PERIOD)) {
          expr = this.finishNode(new AST.StaticMemberExpression({
            object: expr,
            property: this.parseStaticMember()
          }), startState);
          this.isAssignmentTarget = true;
        } else {
          throw this.createUnexpected(token);
        }
      } else if (this.match(_tokenizer.TokenType.NEW)) {
        this.isBindingElement = this.isAssignmentTarget = false;
        expr = this.parseNewExpression();
      } else {
        expr = this.parsePrimaryExpression();
        if (this.firstExprError) {
          return expr;
        }
      }

      while (true) {
        if (allowCall && this.match(_tokenizer.TokenType.LPAREN)) {
          this.isBindingElement = this.isAssignmentTarget = false;
          expr = this.finishNode(new AST.CallExpression({
            callee: expr,
            arguments: this.parseArgumentList()
          }), startState);
        } else if (this.match(_tokenizer.TokenType.LBRACK)) {
          this.isBindingElement = false;
          this.isAssignmentTarget = true;
          expr = this.finishNode(new AST.ComputedMemberExpression({
            object: expr,
            expression: this.parseComputedMember()
          }), startState);
        } else if (this.match(_tokenizer.TokenType.PERIOD)) {
          this.isBindingElement = false;
          this.isAssignmentTarget = true;
          expr = this.finishNode(new AST.StaticMemberExpression({
            object: expr,
            property: this.parseStaticMember()
          }), startState);
        } else if (this.match(_tokenizer.TokenType.TEMPLATE)) {
          this.isBindingElement = this.isAssignmentTarget = false;
          expr = this.finishNode(new AST.TemplateExpression({
            tag: expr,
            elements: this.parseTemplateElements()
          }), startState);
        } else {
          break;
        }
      }

      this.allowIn = previousAllowIn;

      return expr;
    }
  }, {
    key: 'parseTemplateElements',
    value: function parseTemplateElements() {
      var startState = this.startNode();
      var token = this.lookahead;
      if (token.tail) {
        this.lex();
        return [this.finishNode(new AST.TemplateElement({ rawValue: token.slice.text.slice(1, -1) }), startState)];
      }
      var result = [this.finishNode(new AST.TemplateElement({ rawValue: this.lex().slice.text.slice(1, -2) }), startState)];
      while (true) {
        result.push(this.parseExpression());
        if (!this.match(_tokenizer.TokenType.RBRACE)) {
          throw this.createILLEGAL();
        }
        this.index = this.startIndex;
        this.line = this.startLine;
        this.lineStart = this.startLineStart;
        this.lookahead = this.scanTemplateElement();
        startState = this.startNode();
        token = this.lex();
        if (token.tail) {
          result.push(this.finishNode(new AST.TemplateElement({ rawValue: token.slice.text.slice(1, -1) }), startState));
          return result;
        } else {
          result.push(this.finishNode(new AST.TemplateElement({ rawValue: token.slice.text.slice(1, -2) }), startState));
        }
      }
    }
  }, {
    key: 'parseStaticMember',
    value: function parseStaticMember() {
      this.lex();
      if (!this.lookahead.type.klass.isIdentifierName) {
        throw this.createUnexpected(this.lookahead);
      } else {
        return this.lex().value;
      }
    }
  }, {
    key: 'parseComputedMember',
    value: function parseComputedMember() {
      this.lex();
      var expr = this.parseExpression();
      this.expect(_tokenizer.TokenType.RBRACK);
      return expr;
    }
  }, {
    key: 'parseNewExpression',
    value: function parseNewExpression() {
      var _this6 = this;

      var startState = this.startNode();
      this.lex();
      if (this.eat(_tokenizer.TokenType.PERIOD)) {
        var ident = this.expect(_tokenizer.TokenType.IDENTIFIER);
        if (ident.value !== 'target') {
          throw this.createUnexpected(ident);
        }
        return this.finishNode(new AST.NewTargetExpression(), startState);
      }
      var callee = this.isolateCoverGrammar(function () {
        return _this6.parseLeftHandSideExpression({ allowCall: false });
      });
      return this.finishNode(new AST.NewExpression({
        callee: callee,
        arguments: this.match(_tokenizer.TokenType.LPAREN) ? this.parseArgumentList() : []
      }), startState);
    }
  }, {
    key: 'parseRegexFlags',
    value: function parseRegexFlags(flags) {
      var global = false,
          ignoreCase = false,
          multiLine = false,
          unicode = false,
          sticky = false;
      for (var i = 0; i < flags.length; ++i) {
        var f = flags[i];
        switch (f) {
          case 'g':
            if (global) {
              throw this.createError('Duplicate regular expression flag \'g\'');
            }
            global = true;
            break;
          case 'i':
            if (ignoreCase) {
              throw this.createError('Duplicate regular expression flag \'i\'');
            }
            ignoreCase = true;
            break;
          case 'm':
            if (multiLine) {
              throw this.createError('Duplicate regular expression flag \'m\'');
            }
            multiLine = true;
            break;
          case 'u':
            if (unicode) {
              throw this.createError('Duplicate regular expression flag \'u\'');
            }
            unicode = true;
            break;
          case 'y':
            if (sticky) {
              throw this.createError('Duplicate regular expression flag \'y\'');
            }
            sticky = true;
            break;
          default:
            throw this.createError('Invalid regular expression flag \'' + f + '\'');
        }
      }
      return { global: global, ignoreCase: ignoreCase, multiLine: multiLine, unicode: unicode, sticky: sticky };
    }
  }, {
    key: 'parsePrimaryExpression',
    value: function parsePrimaryExpression() {
      if (this.match(_tokenizer.TokenType.LPAREN)) {
        return this.parseGroupExpression();
      }

      var startState = this.startNode();

      if (this.matchIdentifier()) {
        return this.finishNode(new AST.IdentifierExpression({ name: this.parseIdentifier() }), startState);
      }
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.STRING:
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.parseStringLiteral();
        case _tokenizer.TokenType.NUMBER:
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.parseNumericLiteral();
        case _tokenizer.TokenType.THIS:
          this.lex();
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.finishNode(new AST.ThisExpression(), startState);
        case _tokenizer.TokenType.FUNCTION:
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.finishNode(this.parseFunction({ isExpr: true, inDefault: false, allowGenerator: true }), startState);
        case _tokenizer.TokenType.TRUE:
          this.lex();
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.finishNode(new AST.LiteralBooleanExpression({ value: true }), startState);
        case _tokenizer.TokenType.FALSE:
          this.lex();
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.finishNode(new AST.LiteralBooleanExpression({ value: false }), startState);
        case _tokenizer.TokenType.NULL:
          this.lex();
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.finishNode(new AST.LiteralNullExpression(), startState);
        case _tokenizer.TokenType.LBRACK:
          return this.parseArrayExpression();
        case _tokenizer.TokenType.LBRACE:
          return this.parseObjectExpression();
        case _tokenizer.TokenType.TEMPLATE:
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.finishNode(new AST.TemplateExpression({ tag: null, elements: this.parseTemplateElements() }), startState);
        case _tokenizer.TokenType.DIV:
        case _tokenizer.TokenType.ASSIGN_DIV:
          this.isBindingElement = this.isAssignmentTarget = false;
          this.lookahead = this.scanRegExp(this.match(_tokenizer.TokenType.DIV) ? '/' : '/=');
          var token = this.lex();
          var lastSlash = token.value.lastIndexOf('/');
          var pattern = token.value.slice(1, lastSlash);
          var flags = token.value.slice(lastSlash + 1);
          var ctorArgs = this.parseRegexFlags(flags);
          ctorArgs.pattern = pattern;
          return this.finishNode(new AST.LiteralRegExpExpression(ctorArgs), startState);
        case _tokenizer.TokenType.CLASS:
          this.isBindingElement = this.isAssignmentTarget = false;
          return this.parseClass({ isExpr: true, inDefault: false });
        default:
          throw this.createUnexpected(this.lookahead);
      }
    }
  }, {
    key: 'parseNumericLiteral',
    value: function parseNumericLiteral() {
      var startLocation = this.getLocation();
      var startState = this.startNode();
      var token = this.lex();
      if (token.octal && this.strict) {
        if (token.noctal) {
          throw this.createErrorWithLocation(startLocation, 'Unexpected noctal integer literal');
        } else {
          throw this.createErrorWithLocation(startLocation, 'Unexpected legacy octal integer literal');
        }
      }
      var node = token.value === 1 / 0 ? new AST.LiteralInfinityExpression() : new AST.LiteralNumericExpression({ value: token.value });
      return this.finishNode(node, startState);
    }
  }, {
    key: 'parseStringLiteral',
    value: function parseStringLiteral() {
      var startLocation = this.getLocation();
      var startState = this.startNode();
      var token = this.lex();
      if (token.octal != null && this.strict) {
        throw this.createErrorWithLocation(startLocation, 'Unexpected legacy octal escape sequence: \\' + token.octal);
      }
      return this.finishNode(new AST.LiteralStringExpression({ value: token.str }), startState);
    }
  }, {
    key: 'parseIdentifierName',
    value: function parseIdentifierName() {
      if (this.lookahead.type.klass.isIdentifierName) {
        return this.lex().value;
      } else {
        throw this.createUnexpected(this.lookahead);
      }
    }
  }, {
    key: 'parseBindingIdentifier',
    value: function parseBindingIdentifier() {
      var startState = this.startNode();
      return this.finishNode(new AST.BindingIdentifier({ name: this.parseIdentifier() }), startState);
    }
  }, {
    key: 'parseIdentifier',
    value: function parseIdentifier() {
      if (this.lookahead.value === 'yield' && this.allowYieldExpression) {
        throw this.createError(_errors.ErrorMessages.ILLEGAL_YIELD_IDENTIFIER);
      }
      if (this.matchIdentifier()) {
        return this.lex().value;
      }
      throw this.createUnexpected(this.lookahead);
    }
  }, {
    key: 'parseArgumentList',
    value: function parseArgumentList() {
      this.lex();
      var args = this.parseArguments();
      this.expect(_tokenizer.TokenType.RPAREN);
      return args;
    }
  }, {
    key: 'parseArguments',
    value: function parseArguments() {
      var result = [];
      while (true) {
        if (this.match(_tokenizer.TokenType.RPAREN) || this.eof()) {
          return result;
        }
        var arg = void 0;
        if (this.eat(_tokenizer.TokenType.ELLIPSIS)) {
          var startState = this.startNode();
          arg = this.finishNode(new AST.SpreadElement({ expression: this.parseAssignmentExpression() }), startState);
        } else {
          arg = this.parseAssignmentExpression();
        }
        result.push(arg);
        if (!this.eat(_tokenizer.TokenType.COMMA)) break;
      }
      return result;
    }

    // 11.2 Left-Hand-Side Expressions;

  }, {
    key: 'ensureArrow',
    value: function ensureArrow() {
      if (this.hasLineTerminatorBeforeNext) {
        throw this.createError(_errors.ErrorMessages.UNEXPECTED_LINE_TERMINATOR);
      }
      if (!this.match(_tokenizer.TokenType.ARROW)) {
        this.expect(_tokenizer.TokenType.ARROW);
      }
    }
  }, {
    key: 'parseGroupExpression',
    value: function parseGroupExpression() {
      // At this point, we need to parse 3 things:
      //  1. Group expression
      //  2. Assignment target of assignment expression
      //  3. Parameter list of arrow function
      var rest = null;
      var start = this.expect(_tokenizer.TokenType.LPAREN);
      if (this.eat(_tokenizer.TokenType.RPAREN)) {
        this.ensureArrow();
        this.isBindingElement = this.isAssignmentTarget = false;
        return {
          type: ARROW_EXPRESSION_PARAMS,
          params: [],
          rest: null
        };
      } else if (this.eat(_tokenizer.TokenType.ELLIPSIS)) {
        rest = this.parseBindingTarget();
        this.expect(_tokenizer.TokenType.RPAREN);
        this.ensureArrow();
        this.isBindingElement = this.isAssignmentTarget = false;
        return {
          type: ARROW_EXPRESSION_PARAMS,
          params: [],
          rest: rest
        };
      }

      var startState = this.startNode();
      var group = this.inheritCoverGrammar(this.parseAssignmentExpressionOrTarget);

      var params = this.isBindingElement ? [this.targetToBinding(this.transformDestructuringWithDefault(group))] : null;

      while (this.eat(_tokenizer.TokenType.COMMA)) {
        this.isAssignmentTarget = false;
        if (this.match(_tokenizer.TokenType.ELLIPSIS)) {
          if (!this.isBindingElement) {
            throw this.createUnexpected(this.lookahead);
          }
          this.lex();
          rest = this.parseBindingTarget();
          break;
        }

        if (!group) {
          // Can be only binding elements.
          var binding = this.parseBindingElement();
          params.push(binding);
        } else {
          // Can be either binding element or assignment target.
          var expr = this.inheritCoverGrammar(this.parseAssignmentExpressionOrTarget);
          if (!this.isBindingElement) {
            params = null;
          } else {
            params.push(this.targetToBinding(this.transformDestructuringWithDefault(expr)));
          }

          if (this.firstExprError) {
            group = null;
          } else {
            group = this.finishNode(new AST.BinaryExpression({
              left: group,
              operator: ',',
              right: expr
            }), startState);
          }
        }
      }

      this.expect(_tokenizer.TokenType.RPAREN);

      if (!this.hasLineTerminatorBeforeNext && this.match(_tokenizer.TokenType.ARROW)) {
        if (!this.isBindingElement) {
          throw this.createErrorWithLocation(start, _errors.ErrorMessages.ILLEGAL_ARROW_FUNCTION_PARAMS);
        }

        this.isBindingElement = false;
        return { type: ARROW_EXPRESSION_PARAMS, params: params, rest: rest };
      } else {
        // Ensure assignment pattern:
        if (rest) {
          this.ensureArrow();
        }
        this.isBindingElement = false;
        if (!isValidSimpleAssignmentTarget(group)) {
          this.isAssignmentTarget = false;
        }
        return group;
      }
    }
  }, {
    key: 'parseArrayExpression',
    value: function parseArrayExpression() {
      var _this7 = this;

      var startLocation = this.getLocation();
      var startState = this.startNode();

      this.lex();

      var exprs = [];
      var rest = null;

      while (true) {
        if (this.match(_tokenizer.TokenType.RBRACK)) {
          break;
        }
        if (this.eat(_tokenizer.TokenType.COMMA)) {
          exprs.push(null);
        } else {
          var elementStartState = this.startNode();
          var expr = void 0;
          if (this.eat(_tokenizer.TokenType.ELLIPSIS)) {
            // Spread/Rest element
            expr = this.inheritCoverGrammar(this.parseAssignmentExpressionOrTarget);
            if (!this.isAssignmentTarget && this.firstExprError) {
              throw this.firstExprError;
            }
            if (expr.type === 'ArrayAssignmentTarget' || expr.type === 'ObjectAssignmentTarget') {
              rest = expr;
              break;
            }
            if (expr.type !== 'ArrayExpression' && expr.type !== 'ObjectExpression' && !isValidSimpleAssignmentTarget(expr)) {
              this.isBindingElement = this.isAssignmentTarget = false;
            }
            expr = this.finishNode(new AST.SpreadElement({ expression: expr }), elementStartState);
            if (!this.match(_tokenizer.TokenType.RBRACK)) {
              this.isBindingElement = this.isAssignmentTarget = false;
            }
          } else {
            expr = this.inheritCoverGrammar(this.parseAssignmentExpressionOrTarget);
            if (!this.isAssignmentTarget && this.firstExprError) {
              throw this.firstExprError;
            }
          }
          exprs.push(expr);

          if (!this.match(_tokenizer.TokenType.RBRACK)) {
            this.expect(_tokenizer.TokenType.COMMA);
          }
        }
      }

      if (rest && this.match(_tokenizer.TokenType.COMMA)) {
        throw this.createErrorWithLocation(startLocation, _errors.ErrorMessages.UNEXPECTED_COMMA_AFTER_REST);
      }

      this.expect(_tokenizer.TokenType.RBRACK);

      if (rest) {
        // No need to check isAssignmentTarget: the only way to have something we know is a rest element is if we have ...Object/ArrayAssignmentTarget, which implies we have a firstExprError; as such, if isAssignmentTarget were false, we'd've thrown above before setting rest.
        return this.finishNode(new AST.ArrayAssignmentTarget({
          elements: exprs.map(function (e) {
            return e && _this7.transformDestructuringWithDefault(e);
          }),
          rest: rest
        }), startState);
      } else if (this.firstExprError) {
        var last = exprs[exprs.length - 1];
        if (last != null && last.type === 'SpreadElement') {
          return this.finishNode(new AST.ArrayAssignmentTarget({
            elements: exprs.slice(0, -1).map(function (e) {
              return e && _this7.transformDestructuringWithDefault(e);
            }),
            rest: this.transformDestructuring(last.expression)
          }), startState);
        } else {
          return this.finishNode(new AST.ArrayAssignmentTarget({
            elements: exprs.map(function (e) {
              return e && _this7.transformDestructuringWithDefault(e);
            }),
            rest: null
          }), startState);
        }
      } else {
        return this.finishNode(new AST.ArrayExpression({ elements: exprs }), startState);
      }
    }
  }, {
    key: 'parseObjectExpression',
    value: function parseObjectExpression() {
      var _this8 = this;

      var startState = this.startNode();

      this.lex();

      var properties = [];
      while (!this.match(_tokenizer.TokenType.RBRACE)) {
        var property = this.inheritCoverGrammar(this.parsePropertyDefinition);
        properties.push(property);
        if (!this.match(_tokenizer.TokenType.RBRACE)) {
          this.expect(_tokenizer.TokenType.COMMA);
        }
      }
      this.expect(_tokenizer.TokenType.RBRACE);
      if (this.firstExprError) {
        if (!this.isAssignmentTarget) {
          throw this.createError(_errors.ErrorMessages.INVALID_LHS_IN_BINDING);
        }
        return this.finishNode(new AST.ObjectAssignmentTarget({ properties: properties.map(function (p) {
            return _this8.transformDestructuring(p);
          }) }), startState);
      } else {
        return this.finishNode(new AST.ObjectExpression({ properties: properties }), startState);
      }
    }
  }, {
    key: 'parsePropertyDefinition',
    value: function parsePropertyDefinition() {
      var startLocation = this.getLocation();
      var startState = this.startNode();
      var token = this.lookahead;

      var _parseMethodDefinitio = this.parseMethodDefinition(),
          methodOrKey = _parseMethodDefinitio.methodOrKey,
          kind = _parseMethodDefinitio.kind;

      switch (kind) {
        case 'method':
          this.isBindingElement = this.isAssignmentTarget = false;
          return methodOrKey;
        case 'identifier':
          if (this.eat(_tokenizer.TokenType.ASSIGN)) {
            if (this.allowYieldExpression && token.value === 'yield') {
              throw this.createError(_errors.ErrorMessages.ILLEGAL_YIELD_IDENTIFIER);
            }
            // CoverInitializedName
            var init = this.isolateCoverGrammar(this.parseAssignmentExpression);
            this.firstExprError = this.createErrorWithLocation(startLocation, _errors.ErrorMessages.ILLEGAL_PROPERTY);
            return this.finishNode(new AST.AssignmentTargetPropertyIdentifier({
              binding: this.transformDestructuring(methodOrKey),
              init: init
            }), startState);
          } else if (!this.match(_tokenizer.TokenType.COLON)) {
            if (this.allowYieldExpression && token.value === 'yield') {
              throw this.createError(_errors.ErrorMessages.ILLEGAL_YIELD_IDENTIFIER);
            }
            if (token.type === _tokenizer.TokenType.IDENTIFIER || token.value === 'let' || token.value === 'yield') {
              return this.finishNode(new AST.ShorthandProperty({ name: this.finishNode(new AST.IdentifierExpression({ name: methodOrKey.value }), startState) }), startState);
            }
            throw this.createUnexpected(token);
          }
      }

      // property
      this.expect(_tokenizer.TokenType.COLON);

      var expr = this.inheritCoverGrammar(this.parseAssignmentExpressionOrTarget);
      if (this.firstExprError) {
        return this.finishNode(new AST.AssignmentTargetPropertyProperty({ name: methodOrKey, binding: expr }), startState);
      }
      return this.finishNode(new AST.DataProperty({ name: methodOrKey, expression: expr }), startState);
    }
  }, {
    key: 'parsePropertyName',
    value: function parsePropertyName() {
      // PropertyName[Yield,GeneratorParameter]:
      var token = this.lookahead;
      var startState = this.startNode();

      if (this.eof()) {
        throw this.createUnexpected(token);
      }

      switch (token.type) {
        case _tokenizer.TokenType.STRING:
          return {
            name: this.finishNode(new AST.StaticPropertyName({
              value: this.parseStringLiteral().value
            }), startState),
            binding: null
          };
        case _tokenizer.TokenType.NUMBER:
          var numLiteral = this.parseNumericLiteral();
          return {
            name: this.finishNode(new AST.StaticPropertyName({
              value: '' + (numLiteral.type === 'LiteralInfinityExpression' ? 1 / 0 : numLiteral.value)
            }), startState),
            binding: null
          };
        case _tokenizer.TokenType.LBRACK:
          var previousYield = this.allowYieldExpression;
          this.lex();
          var expr = this.parseAssignmentExpression();
          this.expect(_tokenizer.TokenType.RBRACK);
          this.allowYieldExpression = previousYield;
          return { name: this.finishNode(new AST.ComputedPropertyName({ expression: expr }), startState), binding: null };
      }

      var name = this.parseIdentifierName();
      return {
        name: this.finishNode(new AST.StaticPropertyName({ value: name }), startState),
        binding: this.finishNode(new AST.BindingIdentifier({ name: name }), startState)
      };
    }

    /**
     * Test if lookahead can be the beginning of a `PropertyName`.
     * @returns {boolean}
     */

  }, {
    key: 'lookaheadPropertyName',
    value: function lookaheadPropertyName() {
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.NUMBER:
        case _tokenizer.TokenType.STRING:
        case _tokenizer.TokenType.LBRACK:
          return true;
        default:
          return this.lookahead.type.klass.isIdentifierName;
      }
    }

    /**
     * Try to parse a method definition.
     *
     * If it turns out to be one of:
     *  * `IdentifierReference`
     *  * `CoverInitializedName` (`IdentifierReference "=" AssignmentExpression`)
     *  * `PropertyName : AssignmentExpression`
     * The parser will stop at the end of the leading `Identifier` or `PropertyName` and return it.
     *
     * @returns {{methodOrKey: (Method|PropertyName), kind: string}}
     */

  }, {
    key: 'parseMethodDefinition',
    value: function parseMethodDefinition() {
      var token = this.lookahead;
      var startState = this.startNode();

      var isGenerator = !!this.eat(_tokenizer.TokenType.MUL);

      var _parsePropertyName = this.parsePropertyName(),
          name = _parsePropertyName.name,
          binding = _parsePropertyName.binding;

      if (!isGenerator && token.type === _tokenizer.TokenType.IDENTIFIER) {
        var _name = token.value;
        if (_name.length === 3) {
          // Property Assignment: Getter and Setter.
          if (_name === 'get' && this.lookaheadPropertyName()) {
            var _parsePropertyName2 = this.parsePropertyName();

            _name = _parsePropertyName2.name;

            this.expect(_tokenizer.TokenType.LPAREN);
            this.expect(_tokenizer.TokenType.RPAREN);
            var previousYield = this.allowYieldExpression;
            this.allowYieldExpression = false;
            var body = this.parseFunctionBody();
            this.allowYieldExpression = previousYield;
            return {
              methodOrKey: this.finishNode(new AST.Getter({ name: _name, body: body }), startState),
              kind: 'method'
            };
          } else if (_name === 'set' && this.lookaheadPropertyName()) {
            var _parsePropertyName3 = this.parsePropertyName();

            _name = _parsePropertyName3.name;

            this.expect(_tokenizer.TokenType.LPAREN);
            var _previousYield = this.allowYieldExpression;
            this.allowYieldExpression = false;
            var param = this.parseBindingElement();
            this.expect(_tokenizer.TokenType.RPAREN);
            var _body = this.parseFunctionBody();
            this.allowYieldExpression = _previousYield;
            return {
              methodOrKey: this.finishNode(new AST.Setter({ name: _name, param: param, body: _body }), startState),
              kind: 'method'
            };
          }
        }
      }

      if (this.match(_tokenizer.TokenType.LPAREN)) {
        var _previousYield2 = this.allowYieldExpression;
        this.allowYieldExpression = isGenerator;
        var params = this.parseParams();
        this.allowYieldExpression = isGenerator;
        var _body2 = this.parseFunctionBody();
        this.allowYieldExpression = _previousYield2;

        return {
          methodOrKey: this.finishNode(new AST.Method({ isGenerator: isGenerator, name: name, params: params, body: _body2 }), startState),
          kind: 'method'
        };
      }

      if (isGenerator && this.match(_tokenizer.TokenType.COLON)) {
        throw this.createUnexpected(this.lookahead);
      }

      return {
        methodOrKey: name,
        kind: token.type.klass.isIdentifierName ? 'identifier' : 'property',
        binding: binding
      };
    }
  }, {
    key: 'parseClass',
    value: function parseClass(_ref3) {
      var _this9 = this;

      var isExpr = _ref3.isExpr,
          inDefault = _ref3.inDefault;

      var startState = this.startNode();

      this.lex();
      var name = null;
      var heritage = null;

      if (this.match(_tokenizer.TokenType.IDENTIFIER)) {
        name = this.parseBindingIdentifier();
      } else if (!isExpr) {
        if (inDefault) {
          name = new AST.BindingIdentifier({ name: '*default*' });
        } else {
          throw this.createUnexpected(this.lookahead);
        }
      }

      if (this.eat(_tokenizer.TokenType.EXTENDS)) {
        heritage = this.isolateCoverGrammar(function () {
          return _this9.parseLeftHandSideExpression({ allowCall: true });
        });
      }

      this.expect(_tokenizer.TokenType.LBRACE);
      var elements = [];
      while (!this.eat(_tokenizer.TokenType.RBRACE)) {
        if (this.eat(_tokenizer.TokenType.SEMICOLON)) {
          continue;
        }
        var isStatic = false;

        var _parseMethodDefinitio2 = this.parseMethodDefinition(),
            methodOrKey = _parseMethodDefinitio2.methodOrKey,
            kind = _parseMethodDefinitio2.kind;

        if (kind === 'identifier' && methodOrKey.value === 'static') {
          isStatic = true;

          var _parseMethodDefinitio3 = this.parseMethodDefinition();

          methodOrKey = _parseMethodDefinitio3.methodOrKey;
          kind = _parseMethodDefinitio3.kind;
        }
        if (kind === 'method') {
          elements.push(this.copyNode(methodOrKey, new AST.ClassElement({ isStatic: isStatic, method: methodOrKey })));
        } else {
          throw this.createError('Only methods are allowed in classes');
        }
      }
      return this.finishNode(new (isExpr ? AST.ClassExpression : AST.ClassDeclaration)({ name: name, super: heritage, elements: elements }), startState);
    }
  }, {
    key: 'parseFunction',
    value: function parseFunction(_ref4) {
      var isExpr = _ref4.isExpr,
          inDefault = _ref4.inDefault,
          allowGenerator = _ref4.allowGenerator;

      var startState = this.startNode();

      this.lex();

      var name = null;
      var isGenerator = allowGenerator && !!this.eat(_tokenizer.TokenType.MUL);

      var previousYield = this.allowYieldExpression;

      if (isExpr) {
        this.allowYieldExpression = isGenerator;
      }

      if (!this.match(_tokenizer.TokenType.LPAREN)) {
        name = this.parseBindingIdentifier();
      } else if (!isExpr) {
        if (inDefault) {
          name = new AST.BindingIdentifier({ name: '*default*' });
        } else {
          throw this.createUnexpected(this.lookahead);
        }
      }

      this.allowYieldExpression = isGenerator;
      var params = this.parseParams();
      this.allowYieldExpression = isGenerator;
      var body = this.parseFunctionBody();
      this.allowYieldExpression = previousYield;

      return this.finishNode(new (isExpr ? AST.FunctionExpression : AST.FunctionDeclaration)({ isGenerator: isGenerator, name: name, params: params, body: body }), startState);
    }
  }, {
    key: 'parseArrayBinding',
    value: function parseArrayBinding() {
      var startState = this.startNode();

      this.expect(_tokenizer.TokenType.LBRACK);

      var elements = [],
          rest = null;

      while (true) {
        if (this.match(_tokenizer.TokenType.RBRACK)) {
          break;
        }
        var el = void 0;

        if (this.eat(_tokenizer.TokenType.COMMA)) {
          el = null;
        } else {
          if (this.eat(_tokenizer.TokenType.ELLIPSIS)) {
            rest = this.parseBindingTarget();
            break;
          } else {
            el = this.parseBindingElement();
          }
          if (!this.match(_tokenizer.TokenType.RBRACK)) {
            this.expect(_tokenizer.TokenType.COMMA);
          }
        }
        elements.push(el);
      }

      this.expect(_tokenizer.TokenType.RBRACK);

      return this.finishNode(new AST.ArrayBinding({ elements: elements, rest: rest }), startState);
    }
  }, {
    key: 'parseBindingProperty',
    value: function parseBindingProperty() {
      var startState = this.startNode();
      var isIdentifier = this.matchIdentifier();
      var token = this.lookahead;

      var _parsePropertyName4 = this.parsePropertyName(),
          name = _parsePropertyName4.name,
          binding = _parsePropertyName4.binding;

      if (isIdentifier && name.type === 'StaticPropertyName') {
        if (!this.match(_tokenizer.TokenType.COLON)) {
          if (this.allowYieldExpression && token.value === 'yield') {
            throw this.createError(_errors.ErrorMessages.ILLEGAL_YIELD_IDENTIFIER);
          }
          var defaultValue = null;
          if (this.eat(_tokenizer.TokenType.ASSIGN)) {
            var previousAllowYieldExpression = this.allowYieldExpression;
            var expr = this.parseAssignmentExpression();
            defaultValue = expr;
            this.allowYieldExpression = previousAllowYieldExpression;
          }
          return this.finishNode(new AST.BindingPropertyIdentifier({
            binding: binding,
            init: defaultValue
          }), startState);
        }
      }
      this.expect(_tokenizer.TokenType.COLON);
      binding = this.parseBindingElement();
      return this.finishNode(new AST.BindingPropertyProperty({ name: name, binding: binding }), startState);
    }
  }, {
    key: 'parseObjectBinding',
    value: function parseObjectBinding() {
      var startState = this.startNode();

      this.expect(_tokenizer.TokenType.LBRACE);

      var properties = [];
      while (!this.match(_tokenizer.TokenType.RBRACE)) {
        properties.push(this.parseBindingProperty());
        if (!this.match(_tokenizer.TokenType.RBRACE)) {
          this.expect(_tokenizer.TokenType.COMMA);
        }
      }

      this.expect(_tokenizer.TokenType.RBRACE);

      return this.finishNode(new AST.ObjectBinding({ properties: properties }), startState);
    }
  }, {
    key: 'parseBindingTarget',
    value: function parseBindingTarget() {
      if (this.matchIdentifier()) {
        return this.parseBindingIdentifier();
      }
      switch (this.lookahead.type) {
        case _tokenizer.TokenType.LBRACK:
          return this.parseArrayBinding();
        case _tokenizer.TokenType.LBRACE:
          return this.parseObjectBinding();
      }
      throw this.createUnexpected(this.lookahead);
    }
  }, {
    key: 'parseBindingElement',
    value: function parseBindingElement() {
      var startState = this.startNode();
      var binding = this.parseBindingTarget();

      if (this.eat(_tokenizer.TokenType.ASSIGN)) {
        var previousYieldExpression = this.allowYieldExpression;
        var init = this.parseAssignmentExpression();
        binding = this.finishNode(new AST.BindingWithDefault({ binding: binding, init: init }), startState);
        this.allowYieldExpression = previousYieldExpression;
      }
      return binding;
    }
  }, {
    key: 'parseParam',
    value: function parseParam() {
      var previousInParameter = this.inParameter;
      this.inParameter = true;
      var param = this.parseBindingElement();
      this.inParameter = previousInParameter;
      return param;
    }
  }, {
    key: 'parseParams',
    value: function parseParams() {
      var startState = this.startNode();

      this.expect(_tokenizer.TokenType.LPAREN);

      var items = [],
          rest = null;
      if (!this.match(_tokenizer.TokenType.RPAREN)) {
        while (!this.eof()) {
          if (this.eat(_tokenizer.TokenType.ELLIPSIS)) {
            rest = this.parseBindingTarget();
            break;
          }
          items.push(this.parseParam());
          if (this.match(_tokenizer.TokenType.RPAREN)) break;
          this.expect(_tokenizer.TokenType.COMMA);
        }
      }

      this.expect(_tokenizer.TokenType.RPAREN);

      return this.finishNode(new AST.FormalParameters({ items: items, rest: rest }), startState);
    }
  }]);

  return GenericParser;
}(_tokenizer2.default);
},{"./errors":69,"./tokenizer":72,"shift-ast":66}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsError = exports.TokenType = exports.TokenClass = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _errors = require('./errors');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2014 Shape Security, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var TokenClass = exports.TokenClass = {
  Eof: { name: '<End>' },
  Ident: { name: 'Identifier', isIdentifierName: true },
  Keyword: { name: 'Keyword', isIdentifierName: true },
  NumericLiteral: { name: 'Numeric' },
  TemplateElement: { name: 'Template' },
  Punctuator: { name: 'Punctuator' },
  StringLiteral: { name: 'String' },
  RegularExpression: { name: 'RegularExpression' },
  Illegal: { name: 'Illegal' }
};

var TokenType = exports.TokenType = {
  EOS: { klass: TokenClass.Eof, name: 'EOS' },
  LPAREN: { klass: TokenClass.Punctuator, name: '(' },
  RPAREN: { klass: TokenClass.Punctuator, name: ')' },
  LBRACK: { klass: TokenClass.Punctuator, name: '[' },
  RBRACK: { klass: TokenClass.Punctuator, name: ']' },
  LBRACE: { klass: TokenClass.Punctuator, name: '{' },
  RBRACE: { klass: TokenClass.Punctuator, name: '}' },
  COLON: { klass: TokenClass.Punctuator, name: ':' },
  SEMICOLON: { klass: TokenClass.Punctuator, name: ';' },
  PERIOD: { klass: TokenClass.Punctuator, name: '.' },
  ELLIPSIS: { klass: TokenClass.Punctuator, name: '...' },
  ARROW: { klass: TokenClass.Punctuator, name: '=>' },
  CONDITIONAL: { klass: TokenClass.Punctuator, name: '?' },
  INC: { klass: TokenClass.Punctuator, name: '++' },
  DEC: { klass: TokenClass.Punctuator, name: '--' },
  ASSIGN: { klass: TokenClass.Punctuator, name: '=' },
  ASSIGN_BIT_OR: { klass: TokenClass.Punctuator, name: '|=' },
  ASSIGN_BIT_XOR: { klass: TokenClass.Punctuator, name: '^=' },
  ASSIGN_BIT_AND: { klass: TokenClass.Punctuator, name: '&=' },
  ASSIGN_SHL: { klass: TokenClass.Punctuator, name: '<<=' },
  ASSIGN_SHR: { klass: TokenClass.Punctuator, name: '>>=' },
  ASSIGN_SHR_UNSIGNED: { klass: TokenClass.Punctuator, name: '>>>=' },
  ASSIGN_ADD: { klass: TokenClass.Punctuator, name: '+=' },
  ASSIGN_SUB: { klass: TokenClass.Punctuator, name: '-=' },
  ASSIGN_MUL: { klass: TokenClass.Punctuator, name: '*=' },
  ASSIGN_DIV: { klass: TokenClass.Punctuator, name: '/=' },
  ASSIGN_MOD: { klass: TokenClass.Punctuator, name: '%=' },
  ASSIGN_EXP: { klass: TokenClass.Punctuator, name: '**=' },
  COMMA: { klass: TokenClass.Punctuator, name: ',' },
  OR: { klass: TokenClass.Punctuator, name: '||' },
  AND: { klass: TokenClass.Punctuator, name: '&&' },
  BIT_OR: { klass: TokenClass.Punctuator, name: '|' },
  BIT_XOR: { klass: TokenClass.Punctuator, name: '^' },
  BIT_AND: { klass: TokenClass.Punctuator, name: '&' },
  SHL: { klass: TokenClass.Punctuator, name: '<<' },
  SHR: { klass: TokenClass.Punctuator, name: '>>' },
  SHR_UNSIGNED: { klass: TokenClass.Punctuator, name: '>>>' },
  ADD: { klass: TokenClass.Punctuator, name: '+' },
  SUB: { klass: TokenClass.Punctuator, name: '-' },
  MUL: { klass: TokenClass.Punctuator, name: '*' },
  DIV: { klass: TokenClass.Punctuator, name: '/' },
  MOD: { klass: TokenClass.Punctuator, name: '%' },
  EXP: { klass: TokenClass.Punctuator, name: '**' },
  EQ: { klass: TokenClass.Punctuator, name: '==' },
  NE: { klass: TokenClass.Punctuator, name: '!=' },
  EQ_STRICT: { klass: TokenClass.Punctuator, name: '===' },
  NE_STRICT: { klass: TokenClass.Punctuator, name: '!==' },
  LT: { klass: TokenClass.Punctuator, name: '<' },
  GT: { klass: TokenClass.Punctuator, name: '>' },
  LTE: { klass: TokenClass.Punctuator, name: '<=' },
  GTE: { klass: TokenClass.Punctuator, name: '>=' },
  INSTANCEOF: { klass: TokenClass.Keyword, name: 'instanceof' },
  IN: { klass: TokenClass.Keyword, name: 'in' },
  NOT: { klass: TokenClass.Punctuator, name: '!' },
  BIT_NOT: { klass: TokenClass.Punctuator, name: '~' },
  AWAIT: { klass: TokenClass.Keyword, name: 'await' },
  ENUM: { klass: TokenClass.Keyword, name: 'enum' },
  DELETE: { klass: TokenClass.Keyword, name: 'delete' },
  TYPEOF: { klass: TokenClass.Keyword, name: 'typeof' },
  VOID: { klass: TokenClass.Keyword, name: 'void' },
  BREAK: { klass: TokenClass.Keyword, name: 'break' },
  CASE: { klass: TokenClass.Keyword, name: 'case' },
  CATCH: { klass: TokenClass.Keyword, name: 'catch' },
  CLASS: { klass: TokenClass.Keyword, name: 'class' },
  CONTINUE: { klass: TokenClass.Keyword, name: 'continue' },
  DEBUGGER: { klass: TokenClass.Keyword, name: 'debugger' },
  DEFAULT: { klass: TokenClass.Keyword, name: 'default' },
  DO: { klass: TokenClass.Keyword, name: 'do' },
  ELSE: { klass: TokenClass.Keyword, name: 'else' },
  EXPORT: { klass: TokenClass.Keyword, name: 'export' },
  EXTENDS: { klass: TokenClass.Keyword, name: 'extends' },
  FINALLY: { klass: TokenClass.Keyword, name: 'finally' },
  FOR: { klass: TokenClass.Keyword, name: 'for' },
  FUNCTION: { klass: TokenClass.Keyword, name: 'function' },
  IF: { klass: TokenClass.Keyword, name: 'if' },
  IMPORT: { klass: TokenClass.Keyword, name: 'import' },
  LET: { klass: TokenClass.Keyword, name: 'let' },
  NEW: { klass: TokenClass.Keyword, name: 'new' },
  RETURN: { klass: TokenClass.Keyword, name: 'return' },
  SUPER: { klass: TokenClass.Keyword, name: 'super' },
  SWITCH: { klass: TokenClass.Keyword, name: 'switch' },
  THIS: { klass: TokenClass.Keyword, name: 'this' },
  THROW: { klass: TokenClass.Keyword, name: 'throw' },
  TRY: { klass: TokenClass.Keyword, name: 'try' },
  VAR: { klass: TokenClass.Keyword, name: 'var' },
  WHILE: { klass: TokenClass.Keyword, name: 'while' },
  WITH: { klass: TokenClass.Keyword, name: 'with' },
  NULL: { klass: TokenClass.Keyword, name: 'null' },
  TRUE: { klass: TokenClass.Keyword, name: 'true' },
  FALSE: { klass: TokenClass.Keyword, name: 'false' },
  YIELD: { klass: TokenClass.Keyword, name: 'yield' },
  NUMBER: { klass: TokenClass.NumericLiteral, name: '' },
  STRING: { klass: TokenClass.StringLiteral, name: '' },
  REGEXP: { klass: TokenClass.RegularExpression, name: '' },
  IDENTIFIER: { klass: TokenClass.Ident, name: '' },
  CONST: { klass: TokenClass.Keyword, name: 'const' },
  TEMPLATE: { klass: TokenClass.TemplateElement, name: '' },
  ESCAPED_KEYWORD: { klass: TokenClass.Keyword, name: '' },
  ILLEGAL: { klass: TokenClass.Illegal, name: '' }
};

var TT = TokenType;
var I = TT.ILLEGAL;
var F = false;
var T = true;

var ONE_CHAR_PUNCTUATOR = [I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, TT.NOT, I, I, I, TT.MOD, TT.BIT_AND, I, TT.LPAREN, TT.RPAREN, TT.MUL, TT.ADD, TT.COMMA, TT.SUB, TT.PERIOD, TT.DIV, I, I, I, I, I, I, I, I, I, I, TT.COLON, TT.SEMICOLON, TT.LT, TT.ASSIGN, TT.GT, TT.CONDITIONAL, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, TT.LBRACK, I, TT.RBRACK, TT.BIT_XOR, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, I, TT.LBRACE, TT.BIT_OR, TT.RBRACE, TT.BIT_NOT];

var PUNCTUATOR_START = [F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, F, F, F, T, T, F, T, T, T, T, T, T, F, T, F, F, F, F, F, F, F, F, F, F, T, T, T, T, T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, F, T, T, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, F, T, T, T, T, F];

var JsError = exports.JsError = function (_Error) {
  _inherits(JsError, _Error);

  function JsError(index, line, column, msg) {
    _classCallCheck(this, JsError);

    var _this = _possibleConstructorReturn(this, (JsError.__proto__ || Object.getPrototypeOf(JsError)).call(this, msg));

    _this.index = index;
    // Safari defines these properties as non-writable and non-configurable on Error objects
    try {
      _this.line = line;
      _this.column = column;
    } catch (e) {}
    // define these as well so Safari still has access to this info
    _this.parseErrorLine = line;
    _this.parseErrorColumn = column;
    _this.description = msg;
    _this.message = '[' + line + ':' + column + ']: ' + msg;
    return _this;
  }

  return JsError;
}(Error);

function fromCodePoint(cp) {
  if (cp <= 0xFFFF) return String.fromCharCode(cp);
  var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
  var cu2 = String.fromCharCode((cp - 0x10000) % 0x400 + 0xDC00);
  return cu1 + cu2;
}

function decodeUtf16(lead, trail) {
  return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
}

var Tokenizer = function () {
  function Tokenizer(source) {
    _classCallCheck(this, Tokenizer);

    this.source = source;
    this.index = 0;
    this.line = 0;
    this.lineStart = 0;
    this.startIndex = 0;
    this.startLine = 0;
    this.startLineStart = 0;
    this.lastIndex = 0;
    this.lastLine = 0;
    this.lastLineStart = 0;
    this.hasLineTerminatorBeforeNext = false;
    this.tokenIndex = 0;
  }

  _createClass(Tokenizer, [{
    key: 'saveLexerState',
    value: function saveLexerState() {
      return {
        source: this.source,
        index: this.index,
        line: this.line,
        lineStart: this.lineStart,
        startIndex: this.startIndex,
        startLine: this.startLine,
        startLineStart: this.startLineStart,
        lastIndex: this.lastIndex,
        lastLine: this.lastLine,
        lastLineStart: this.lastLineStart,
        lookahead: this.lookahead,
        hasLineTerminatorBeforeNext: this.hasLineTerminatorBeforeNext,
        tokenIndex: this.tokenIndex
      };
    }
  }, {
    key: 'restoreLexerState',
    value: function restoreLexerState(state) {
      this.source = state.source;
      this.index = state.index;
      this.line = state.line;
      this.lineStart = state.lineStart;
      this.startIndex = state.startIndex;
      this.startLine = state.startLine;
      this.startLineStart = state.startLineStart;
      this.lastIndex = state.lastIndex;
      this.lastLine = state.lastLine;
      this.lastLineStart = state.lastLineStart;
      this.lookahead = state.lookahead;
      this.hasLineTerminatorBeforeNext = state.hasLineTerminatorBeforeNext;
      this.tokenIndex = state.tokenIndex;
    }
  }, {
    key: 'createILLEGAL',
    value: function createILLEGAL() {
      this.startIndex = this.index;
      this.startLine = this.line;
      this.startLineStart = this.lineStart;
      return this.index < this.source.length ? this.createError(_errors.ErrorMessages.UNEXPECTED_ILLEGAL_TOKEN, this.source.charAt(this.index)) : this.createError(_errors.ErrorMessages.UNEXPECTED_EOS);
    }
  }, {
    key: 'createUnexpected',
    value: function createUnexpected(token) {
      switch (token.type.klass) {
        case TokenClass.Eof:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_EOS);
        case TokenClass.Ident:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_IDENTIFIER);
        case TokenClass.Keyword:
          if (token.type === TokenType.ESCAPED_KEYWORD) {
            return this.createError(_errors.ErrorMessages.UNEXPECTED_ESCAPED_KEYWORD);
          }
          return this.createError(_errors.ErrorMessages.UNEXPECTED_TOKEN, token.slice.text);
        case TokenClass.NumericLiteral:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_NUMBER);
        case TokenClass.TemplateElement:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_TEMPLATE);
        case TokenClass.Punctuator:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_TOKEN, token.type.name);
        case TokenClass.StringLiteral:
          return this.createError(_errors.ErrorMessages.UNEXPECTED_STRING);
        // the other token classes are RegularExpression and Illegal, but they cannot reach here
      }
    }
  }, {
    key: 'createError',
    value: function createError(message) {
      var msg = void 0;
      if (typeof message === 'function') {
        for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          params[_key - 1] = arguments[_key];
        }

        msg = message.apply(undefined, params);
      } else {
        msg = message;
      }
      return new JsError(this.startIndex, this.startLine + 1, this.startIndex - this.startLineStart + 1, msg);
    }
  }, {
    key: 'createErrorWithLocation',
    value: function createErrorWithLocation(location, message) {
      var _arguments = arguments;

      /* istanbul ignore next */
      var msg = message.replace(/\{(\d+)\}/g, function (_, n) {
        return JSON.stringify(_arguments[+n + 2]);
      });
      if (location.slice && location.slice.startLocation) {
        location = location.slice.startLocation;
      }
      return new JsError(location.offset, location.line, location.column + 1, msg);
    }
  }, {
    key: 'getKeyword',
    value: function getKeyword(id) {
      if (id.length === 1 || id.length > 10) {
        return TokenType.IDENTIFIER;
      }

      /* istanbul ignore next */
      switch (id.length) {
        case 2:
          switch (id.charAt(0)) {
            case 'i':
              switch (id.charAt(1)) {
                case 'f':
                  return TokenType.IF;
                case 'n':
                  return TokenType.IN;
                default:
                  break;
              }
              break;
            case 'd':
              if (id.charAt(1) === 'o') {
                return TokenType.DO;
              }
              break;
          }
          break;
        case 3:
          switch (id.charAt(0)) {
            case 'v':
              if (Tokenizer.cse2(id, 'a', 'r')) {
                return TokenType.VAR;
              }
              break;
            case 'f':
              if (Tokenizer.cse2(id, 'o', 'r')) {
                return TokenType.FOR;
              }
              break;
            case 'n':
              if (Tokenizer.cse2(id, 'e', 'w')) {
                return TokenType.NEW;
              }
              break;
            case 't':
              if (Tokenizer.cse2(id, 'r', 'y')) {
                return TokenType.TRY;
              }
              break;
            case 'l':
              if (Tokenizer.cse2(id, 'e', 't')) {
                return TokenType.LET;
              }
              break;
          }
          break;
        case 4:
          switch (id.charAt(0)) {
            case 't':
              if (Tokenizer.cse3(id, 'h', 'i', 's')) {
                return TokenType.THIS;
              } else if (Tokenizer.cse3(id, 'r', 'u', 'e')) {
                return TokenType.TRUE;
              }
              break;
            case 'n':
              if (Tokenizer.cse3(id, 'u', 'l', 'l')) {
                return TokenType.NULL;
              }
              break;
            case 'e':
              if (Tokenizer.cse3(id, 'l', 's', 'e')) {
                return TokenType.ELSE;
              } else if (Tokenizer.cse3(id, 'n', 'u', 'm')) {
                return TokenType.ENUM;
              }
              break;
            case 'c':
              if (Tokenizer.cse3(id, 'a', 's', 'e')) {
                return TokenType.CASE;
              }
              break;
            case 'v':
              if (Tokenizer.cse3(id, 'o', 'i', 'd')) {
                return TokenType.VOID;
              }
              break;
            case 'w':
              if (Tokenizer.cse3(id, 'i', 't', 'h')) {
                return TokenType.WITH;
              }
              break;
          }
          break;
        case 5:
          switch (id.charAt(0)) {
            case 'a':
              if (this.moduleIsTheGoalSymbol && Tokenizer.cse4(id, 'w', 'a', 'i', 't')) {
                return TokenType.AWAIT;
              }
              break;
            case 'w':
              if (Tokenizer.cse4(id, 'h', 'i', 'l', 'e')) {
                return TokenType.WHILE;
              }
              break;
            case 'b':
              if (Tokenizer.cse4(id, 'r', 'e', 'a', 'k')) {
                return TokenType.BREAK;
              }
              break;
            case 'f':
              if (Tokenizer.cse4(id, 'a', 'l', 's', 'e')) {
                return TokenType.FALSE;
              }
              break;
            case 'c':
              if (Tokenizer.cse4(id, 'a', 't', 'c', 'h')) {
                return TokenType.CATCH;
              } else if (Tokenizer.cse4(id, 'o', 'n', 's', 't')) {
                return TokenType.CONST;
              } else if (Tokenizer.cse4(id, 'l', 'a', 's', 's')) {
                return TokenType.CLASS;
              }
              break;
            case 't':
              if (Tokenizer.cse4(id, 'h', 'r', 'o', 'w')) {
                return TokenType.THROW;
              }
              break;
            case 'y':
              if (Tokenizer.cse4(id, 'i', 'e', 'l', 'd')) {
                return TokenType.YIELD;
              }
              break;
            case 's':
              if (Tokenizer.cse4(id, 'u', 'p', 'e', 'r')) {
                return TokenType.SUPER;
              }
              break;
          }
          break;
        case 6:
          switch (id.charAt(0)) {
            case 'r':
              if (Tokenizer.cse5(id, 'e', 't', 'u', 'r', 'n')) {
                return TokenType.RETURN;
              }
              break;
            case 't':
              if (Tokenizer.cse5(id, 'y', 'p', 'e', 'o', 'f')) {
                return TokenType.TYPEOF;
              }
              break;
            case 'd':
              if (Tokenizer.cse5(id, 'e', 'l', 'e', 't', 'e')) {
                return TokenType.DELETE;
              }
              break;
            case 's':
              if (Tokenizer.cse5(id, 'w', 'i', 't', 'c', 'h')) {
                return TokenType.SWITCH;
              }
              break;
            case 'e':
              if (Tokenizer.cse5(id, 'x', 'p', 'o', 'r', 't')) {
                return TokenType.EXPORT;
              }
              break;
            case 'i':
              if (Tokenizer.cse5(id, 'm', 'p', 'o', 'r', 't')) {
                return TokenType.IMPORT;
              }
              break;
          }
          break;
        case 7:
          switch (id.charAt(0)) {
            case 'd':
              if (Tokenizer.cse6(id, 'e', 'f', 'a', 'u', 'l', 't')) {
                return TokenType.DEFAULT;
              }
              break;
            case 'f':
              if (Tokenizer.cse6(id, 'i', 'n', 'a', 'l', 'l', 'y')) {
                return TokenType.FINALLY;
              }
              break;
            case 'e':
              if (Tokenizer.cse6(id, 'x', 't', 'e', 'n', 'd', 's')) {
                return TokenType.EXTENDS;
              }
              break;
          }
          break;
        case 8:
          switch (id.charAt(0)) {
            case 'f':
              if (Tokenizer.cse7(id, 'u', 'n', 'c', 't', 'i', 'o', 'n')) {
                return TokenType.FUNCTION;
              }
              break;
            case 'c':
              if (Tokenizer.cse7(id, 'o', 'n', 't', 'i', 'n', 'u', 'e')) {
                return TokenType.CONTINUE;
              }
              break;
            case 'd':
              if (Tokenizer.cse7(id, 'e', 'b', 'u', 'g', 'g', 'e', 'r')) {
                return TokenType.DEBUGGER;
              }
              break;
          }
          break;
        case 10:
          if (id === 'instanceof') {
            return TokenType.INSTANCEOF;
          }
          break;
      }
      return TokenType.IDENTIFIER;
    }
  }, {
    key: 'skipSingleLineComment',
    value: function skipSingleLineComment(offset) {
      this.index += offset;
      while (this.index < this.source.length) {
        /**
         * @type {Number}
         */
        var chCode = this.source.charCodeAt(this.index);
        this.index++;
        if ((0, _utils.isLineTerminator)(chCode)) {
          this.hasLineTerminatorBeforeNext = true;
          if (chCode === 0xD /* "\r" */ && this.source.charCodeAt(this.index) === 0xA /* "\n" */) {
              this.index++;
            }
          this.lineStart = this.index;
          this.line++;
          return;
        }
      }
    }
  }, {
    key: 'skipMultiLineComment',
    value: function skipMultiLineComment() {
      this.index += 2;
      var length = this.source.length;
      var isLineStart = false;
      while (this.index < length) {
        var chCode = this.source.charCodeAt(this.index);
        if (chCode < 0x80) {
          switch (chCode) {
            case 42:
              // "*"
              // Block comment ends with "*/".
              if (this.source.charAt(this.index + 1) === '/') {
                this.index = this.index + 2;
                return isLineStart;
              }
              this.index++;
              break;
            case 10:
              // "\n"
              isLineStart = true;
              this.hasLineTerminatorBeforeNext = true;
              this.index++;
              this.lineStart = this.index;
              this.line++;
              break;
            case 13:
              // "\r":
              isLineStart = true;
              this.hasLineTerminatorBeforeNext = true;
              if (this.source.charAt(this.index + 1) === '\n') {
                this.index++;
              }
              this.index++;
              this.lineStart = this.index;
              this.line++;
              break;
            default:
              this.index++;
          }
        } else if (chCode === 0x2028 || chCode === 0x2029) {
          isLineStart = true;
          this.hasLineTerminatorBeforeNext = true;
          this.index++;
          this.lineStart = this.index;
          this.line++;
        } else {
          this.index++;
        }
      }
      throw this.createILLEGAL();
    }
  }, {
    key: 'skipComment',
    value: function skipComment() {
      this.hasLineTerminatorBeforeNext = false;

      var isLineStart = this.index === 0;
      var length = this.source.length;

      while (this.index < length) {
        var chCode = this.source.charCodeAt(this.index);
        if ((0, _utils.isWhiteSpace)(chCode)) {
          this.index++;
        } else if ((0, _utils.isLineTerminator)(chCode)) {
          this.hasLineTerminatorBeforeNext = true;
          this.index++;
          if (chCode === 13 /* "\r" */ && this.source.charAt(this.index) === '\n') {
            this.index++;
          }
          this.lineStart = this.index;
          this.line++;
          isLineStart = true;
        } else if (chCode === 47 /* "/" */) {
            if (this.index + 1 >= length) {
              break;
            }
            chCode = this.source.charCodeAt(this.index + 1);
            if (chCode === 47 /* "/" */) {
                this.skipSingleLineComment(2);
                isLineStart = true;
              } else if (chCode === 42 /* "*" */) {
                isLineStart = this.skipMultiLineComment() || isLineStart;
              } else {
              break;
            }
          } else if (!this.moduleIsTheGoalSymbol && isLineStart && chCode === 45 /* "-" */) {
            if (this.index + 2 >= length) {
              break;
            }
            // U+003E is ">"
            if (this.source.charAt(this.index + 1) === '-' && this.source.charAt(this.index + 2) === '>') {
              // "-->" is a single-line comment
              this.skipSingleLineComment(3);
            } else {
              break;
            }
          } else if (!this.moduleIsTheGoalSymbol && chCode === 60 /* "<" */) {
            if (this.source.slice(this.index + 1, this.index + 4) === '!--') {
              this.skipSingleLineComment(4);
            } else {
              break;
            }
          } else {
          break;
        }
      }
    }
  }, {
    key: 'scanHexEscape2',
    value: function scanHexEscape2() {
      if (this.index + 2 > this.source.length) {
        return -1;
      }
      var r1 = (0, _utils.getHexValue)(this.source.charAt(this.index));
      if (r1 === -1) {
        return -1;
      }
      var r2 = (0, _utils.getHexValue)(this.source.charAt(this.index + 1));
      if (r2 === -1) {
        return -1;
      }
      this.index += 2;
      return r1 << 4 | r2;
    }
  }, {
    key: 'scanUnicode',
    value: function scanUnicode() {
      if (this.source.charAt(this.index) === '{') {
        // \u{HexDigits}
        var i = this.index + 1;
        var hexDigits = 0,
            ch = void 0;
        while (i < this.source.length) {
          ch = this.source.charAt(i);
          var hex = (0, _utils.getHexValue)(ch);
          if (hex === -1) {
            break;
          }
          hexDigits = hexDigits << 4 | hex;
          if (hexDigits > 0x10FFFF) {
            throw this.createILLEGAL();
          }
          i++;
        }
        if (ch !== '}') {
          throw this.createILLEGAL();
        }
        if (i === this.index + 1) {
          ++this.index; // This is so that the error is 'Unexpected "}"' instead of 'Unexpected "{"'.
          throw this.createILLEGAL();
        }
        this.index = i + 1;
        return hexDigits;
      } else {
        // \uHex4Digits
        if (this.index + 4 > this.source.length) {
          return -1;
        }
        var r1 = (0, _utils.getHexValue)(this.source.charAt(this.index));
        if (r1 === -1) {
          return -1;
        }
        var r2 = (0, _utils.getHexValue)(this.source.charAt(this.index + 1));
        if (r2 === -1) {
          return -1;
        }
        var r3 = (0, _utils.getHexValue)(this.source.charAt(this.index + 2));
        if (r3 === -1) {
          return -1;
        }
        var r4 = (0, _utils.getHexValue)(this.source.charAt(this.index + 3));
        if (r4 === -1) {
          return -1;
        }
        this.index += 4;
        return r1 << 12 | r2 << 8 | r3 << 4 | r4;
      }
    }
  }, {
    key: 'getEscapedIdentifier',
    value: function getEscapedIdentifier() {
      var id = '';
      var check = _utils.isIdentifierStart;

      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        var code = ch.charCodeAt(0);
        var start = this.index;
        ++this.index;
        if (ch === '\\') {
          if (this.index >= this.source.length) {
            throw this.createILLEGAL();
          }
          if (this.source.charAt(this.index) !== 'u') {
            throw this.createILLEGAL();
          }
          ++this.index;
          code = this.scanUnicode();
          if (code < 0) {
            throw this.createILLEGAL();
          }
          ch = fromCodePoint(code);
        } else if (code >= 0xD800 && code <= 0xDBFF) {
          if (this.index >= this.source.length) {
            throw this.createILLEGAL();
          }
          var lowSurrogateCode = this.source.charCodeAt(this.index);
          ++this.index;
          if (!(lowSurrogateCode >= 0xDC00 && lowSurrogateCode <= 0xDFFF)) {
            throw this.createILLEGAL();
          }
          code = decodeUtf16(code, lowSurrogateCode);
          ch = fromCodePoint(code);
        }
        if (!check(code)) {
          if (id.length < 1) {
            throw this.createILLEGAL();
          }
          this.index = start;
          return id;
        }
        check = _utils.isIdentifierPart;
        id += ch;
      }
      return id;
    }
  }, {
    key: 'getIdentifier',
    value: function getIdentifier() {
      var start = this.index;
      var l = this.source.length;
      var i = this.index;
      var check = _utils.isIdentifierStart;
      while (i < l) {
        var ch = this.source.charAt(i);
        var code = ch.charCodeAt(0);
        if (ch === '\\' || code >= 0xD800 && code <= 0xDBFF) {
          // Go back and try the hard one.
          this.index = start;
          return this.getEscapedIdentifier();
        }
        if (!check(code)) {
          this.index = i;
          return this.source.slice(start, i);
        }
        ++i;
        check = _utils.isIdentifierPart;
      }
      this.index = i;
      return this.source.slice(start, i);
    }
  }, {
    key: 'scanIdentifier',
    value: function scanIdentifier() {
      var startLocation = this.getLocation();
      var start = this.index;

      // Backslash (U+005C) starts an escaped character.
      var id = this.source.charAt(this.index) === '\\' ? this.getEscapedIdentifier() : this.getIdentifier();

      var slice = this.getSlice(start, startLocation);
      slice.text = id;
      var hasEscape = this.index - start !== id.length;

      var type = this.getKeyword(id);
      if (hasEscape && type !== TokenType.IDENTIFIER) {
        type = TokenType.ESCAPED_KEYWORD;
      }
      return { type: type, value: id, slice: slice };
    }
  }, {
    key: 'getLocation',
    value: function getLocation() {
      return {
        line: this.startLine + 1,
        column: this.startIndex - this.startLineStart,
        offset: this.startIndex
      };
    }
  }, {
    key: 'getSlice',
    value: function getSlice(start, startLocation) {
      return { text: this.source.slice(start, this.index), start: start, startLocation: startLocation, end: this.index };
    }
  }, {
    key: 'scanPunctuatorHelper',
    value: function scanPunctuatorHelper() {
      var ch1 = this.source.charAt(this.index);

      switch (ch1) {
        // Check for most common single-character punctuators.
        case '.':
          var ch2 = this.source.charAt(this.index + 1);
          if (ch2 !== '.') return TokenType.PERIOD;
          var ch3 = this.source.charAt(this.index + 2);
          if (ch3 !== '.') return TokenType.PERIOD;
          return TokenType.ELLIPSIS;
        case '(':
          return TokenType.LPAREN;
        case ')':
        case ';':
        case ',':
          return ONE_CHAR_PUNCTUATOR[ch1.charCodeAt(0)];
        case '{':
          return TokenType.LBRACE;
        case '}':
        case '[':
        case ']':
        case ':':
        case '?':
        case '~':
          return ONE_CHAR_PUNCTUATOR[ch1.charCodeAt(0)];
        default:
          // "=" (U+003D) marks an assignment or comparison operator.
          if (this.index + 1 < this.source.length && this.source.charAt(this.index + 1) === '=') {
            switch (ch1) {
              case '=':
                if (this.index + 2 < this.source.length && this.source.charAt(this.index + 2) === '=') {
                  return TokenType.EQ_STRICT;
                }
                return TokenType.EQ;
              case '!':
                if (this.index + 2 < this.source.length && this.source.charAt(this.index + 2) === '=') {
                  return TokenType.NE_STRICT;
                }
                return TokenType.NE;
              case '|':
                return TokenType.ASSIGN_BIT_OR;
              case '+':
                return TokenType.ASSIGN_ADD;
              case '-':
                return TokenType.ASSIGN_SUB;
              case '*':
                return TokenType.ASSIGN_MUL;
              case '<':
                return TokenType.LTE;
              case '>':
                return TokenType.GTE;
              case '/':
                return TokenType.ASSIGN_DIV;
              case '%':
                return TokenType.ASSIGN_MOD;
              case '^':
                return TokenType.ASSIGN_BIT_XOR;
              case '&':
                return TokenType.ASSIGN_BIT_AND;
              // istanbul ignore next
              default:
                break; // failed
            }
          }
      }

      if (this.index + 1 < this.source.length) {
        var _ch = this.source.charAt(this.index + 1);
        if (ch1 === _ch) {
          if (this.index + 2 < this.source.length) {
            var _ch2 = this.source.charAt(this.index + 2);
            if (ch1 === '>' && _ch2 === '>') {
              // 4-character punctuator: >>>=
              if (this.index + 3 < this.source.length && this.source.charAt(this.index + 3) === '=') {
                return TokenType.ASSIGN_SHR_UNSIGNED;
              }
              return TokenType.SHR_UNSIGNED;
            }

            if (ch1 === '<' && _ch2 === '=') {
              return TokenType.ASSIGN_SHL;
            }

            if (ch1 === '>' && _ch2 === '=') {
              return TokenType.ASSIGN_SHR;
            }

            if (ch1 === '*' && _ch2 === '=') {
              return TokenType.ASSIGN_EXP;
            }
          }
          // Other 2-character punctuators: ++ -- << >> && ||
          switch (ch1) {
            case '*':
              return TokenType.EXP;
            case '+':
              return TokenType.INC;
            case '-':
              return TokenType.DEC;
            case '<':
              return TokenType.SHL;
            case '>':
              return TokenType.SHR;
            case '&':
              return TokenType.AND;
            case '|':
              return TokenType.OR;
            // istanbul ignore next
            default:
              break; // failed
          }
        } else if (ch1 === '=' && _ch === '>') {
          return TokenType.ARROW;
        }
      }

      return ONE_CHAR_PUNCTUATOR[ch1.charCodeAt(0)];
    }

    // 7.7 Punctuators

  }, {
    key: 'scanPunctuator',
    value: function scanPunctuator() {
      var startLocation = this.getLocation();
      var start = this.index;
      var subType = this.scanPunctuatorHelper();
      this.index += subType.name.length;
      return { type: subType, value: subType.name, slice: this.getSlice(start, startLocation) };
    }
  }, {
    key: 'scanHexLiteral',
    value: function scanHexLiteral(start, startLocation) {
      var i = this.index;
      while (i < this.source.length) {
        var ch = this.source.charAt(i);
        var hex = (0, _utils.getHexValue)(ch);
        if (hex === -1) {
          break;
        }
        i++;
      }

      if (this.index === i) {
        throw this.createILLEGAL();
      }

      if (i < this.source.length && (0, _utils.isIdentifierStart)(this.source.charCodeAt(i))) {
        throw this.createILLEGAL();
      }

      this.index = i;

      var slice = this.getSlice(start, startLocation);
      return { type: TokenType.NUMBER, value: parseInt(slice.text.substr(2), 16), slice: slice };
    }
  }, {
    key: 'scanBinaryLiteral',
    value: function scanBinaryLiteral(start, startLocation) {
      var offset = this.index - start;

      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        if (ch !== '0' && ch !== '1') {
          break;
        }
        this.index++;
      }

      if (this.index - start <= offset) {
        throw this.createILLEGAL();
      }

      if (this.index < this.source.length && ((0, _utils.isIdentifierStart)(this.source.charCodeAt(this.index)) || (0, _utils.isDecimalDigit)(this.source.charCodeAt(this.index)))) {
        throw this.createILLEGAL();
      }

      return {
        type: TokenType.NUMBER,
        value: parseInt(this.getSlice(start, startLocation).text.substr(offset), 2),
        slice: this.getSlice(start, startLocation),
        octal: false,
        noctal: false
      };
    }
  }, {
    key: 'scanOctalLiteral',
    value: function scanOctalLiteral(start, startLocation) {
      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        if (ch >= '0' && ch <= '7') {
          this.index++;
        } else if ((0, _utils.isIdentifierPart)(ch.charCodeAt(0))) {
          throw this.createILLEGAL();
        } else {
          break;
        }
      }

      if (this.index - start === 2) {
        throw this.createILLEGAL();
      }

      return {
        type: TokenType.NUMBER,
        value: parseInt(this.getSlice(start, startLocation).text.substr(2), 8),
        slice: this.getSlice(start, startLocation),
        octal: false,
        noctal: false
      };
    }
  }, {
    key: 'scanLegacyOctalLiteral',
    value: function scanLegacyOctalLiteral(start, startLocation) {
      var isOctal = true;

      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        if (ch >= '0' && ch <= '7') {
          this.index++;
        } else if (ch === '8' || ch === '9') {
          isOctal = false;
          this.index++;
        } else if ((0, _utils.isIdentifierPart)(ch.charCodeAt(0))) {
          throw this.createILLEGAL();
        } else {
          break;
        }
      }

      var slice = this.getSlice(start, startLocation);
      if (!isOctal) {
        this.eatDecimalLiteralSuffix();
        return {
          type: TokenType.NUMBER,
          slice: slice,
          value: +slice.text,
          octal: true,
          noctal: !isOctal
        };
      }

      return {
        type: TokenType.NUMBER,
        slice: slice,
        value: parseInt(slice.text.substr(1), 8),
        octal: true,
        noctal: !isOctal
      };
    }
  }, {
    key: 'scanNumericLiteral',
    value: function scanNumericLiteral() {
      var ch = this.source.charAt(this.index);
      // assert(ch === "." || "0" <= ch && ch <= "9")
      var startLocation = this.getLocation();
      var start = this.index;

      if (ch === '0') {
        this.index++;
        if (this.index < this.source.length) {
          ch = this.source.charAt(this.index);
          if (ch === 'x' || ch === 'X') {
            this.index++;
            return this.scanHexLiteral(start, startLocation);
          } else if (ch === 'b' || ch === 'B') {
            this.index++;
            return this.scanBinaryLiteral(start, startLocation);
          } else if (ch === 'o' || ch === 'O') {
            this.index++;
            return this.scanOctalLiteral(start, startLocation);
          } else if (ch >= '0' && ch <= '9') {
            return this.scanLegacyOctalLiteral(start, startLocation);
          }
        } else {
          var _slice = this.getSlice(start, startLocation);
          return {
            type: TokenType.NUMBER,
            value: +_slice.text,
            slice: _slice,
            octal: false,
            noctal: false
          };
        }
      } else if (ch !== '.') {
        // Must be "1".."9"
        ch = this.source.charAt(this.index);
        while (ch >= '0' && ch <= '9') {
          this.index++;
          if (this.index === this.source.length) {
            var _slice2 = this.getSlice(start, startLocation);
            return {
              type: TokenType.NUMBER,
              value: +_slice2.text,
              slice: _slice2,
              octal: false,
              noctal: false
            };
          }
          ch = this.source.charAt(this.index);
        }
      }

      this.eatDecimalLiteralSuffix();

      if (this.index !== this.source.length && (0, _utils.isIdentifierStart)(this.source.charCodeAt(this.index))) {
        throw this.createILLEGAL();
      }

      var slice = this.getSlice(start, startLocation);
      return {
        type: TokenType.NUMBER,
        value: +slice.text,
        slice: slice,
        octal: false,
        noctal: false
      };
    }
  }, {
    key: 'eatDecimalLiteralSuffix',
    value: function eatDecimalLiteralSuffix() {
      var ch = this.source.charAt(this.index);
      if (ch === '.') {
        this.index++;
        if (this.index === this.source.length) {
          return;
        }

        ch = this.source.charAt(this.index);
        while (ch >= '0' && ch <= '9') {
          this.index++;
          if (this.index === this.source.length) {
            return;
          }
          ch = this.source.charAt(this.index);
        }
      }

      // EOF not reached here
      if (ch === 'e' || ch === 'E') {
        this.index++;
        if (this.index === this.source.length) {
          throw this.createILLEGAL();
        }

        ch = this.source.charAt(this.index);
        if (ch === '+' || ch === '-') {
          this.index++;
          if (this.index === this.source.length) {
            throw this.createILLEGAL();
          }
          ch = this.source.charAt(this.index);
        }

        if (ch >= '0' && ch <= '9') {
          while (ch >= '0' && ch <= '9') {
            this.index++;
            if (this.index === this.source.length) {
              break;
            }
            ch = this.source.charAt(this.index);
          }
        } else {
          throw this.createILLEGAL();
        }
      }
    }
  }, {
    key: 'scanStringEscape',
    value: function scanStringEscape(str, octal) {
      this.index++;
      if (this.index === this.source.length) {
        throw this.createILLEGAL();
      }
      var ch = this.source.charAt(this.index);
      if (!(0, _utils.isLineTerminator)(ch.charCodeAt(0))) {
        switch (ch) {
          case 'n':
            str += '\n';
            this.index++;
            break;
          case 'r':
            str += '\r';
            this.index++;
            break;
          case 't':
            str += '\t';
            this.index++;
            break;
          case 'u':
          case 'x':
            var unescaped = void 0;
            this.index++;
            if (this.index >= this.source.length) {
              throw this.createILLEGAL();
            }
            unescaped = ch === 'u' ? this.scanUnicode() : this.scanHexEscape2();
            if (unescaped < 0) {
              throw this.createILLEGAL();
            }
            str += fromCodePoint(unescaped);
            break;
          case 'b':
            str += '\b';
            this.index++;
            break;
          case 'f':
            str += '\f';
            this.index++;
            break;
          case 'v':
            str += '\x0B';
            this.index++;
            break;
          default:
            if (ch >= '0' && ch <= '7') {
              var octalStart = this.index;
              var octLen = 1;
              // 3 digits are only allowed when string starts
              // with 0, 1, 2, 3
              if (ch >= '0' && ch <= '3') {
                octLen = 0;
              }
              var code = 0;
              while (octLen < 3 && ch >= '0' && ch <= '7') {
                this.index++;
                if (octLen > 0 || ch !== '0') {
                  octal = this.source.slice(octalStart, this.index);
                }
                code *= 8;
                code += ch - '0';
                octLen++;
                if (this.index === this.source.length) {
                  throw this.createILLEGAL();
                }
                ch = this.source.charAt(this.index);
              }
              str += String.fromCharCode(code);
            } else if (ch === '8' || ch === '9') {
              throw this.createILLEGAL();
            } else {
              str += ch;
              this.index++;
            }
        }
      } else {
        this.index++;
        if (ch === '\r' && this.source.charAt(this.index) === '\n') {
          this.index++;
        }
        this.lineStart = this.index;
        this.line++;
      }
      return [str, octal];
    }
    // 7.8.4 String Literals

  }, {
    key: 'scanStringLiteral',
    value: function scanStringLiteral() {
      var str = '';

      var quote = this.source.charAt(this.index);
      //  assert((quote === "\"" || quote === """), "String literal must starts with a quote")

      var startLocation = this.getLocation();
      var start = this.index;
      this.index++;

      var octal = null;
      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        if (ch === quote) {
          this.index++;
          return { type: TokenType.STRING, slice: this.getSlice(start, startLocation), str: str, octal: octal };
        } else if (ch === '\\') {
          var _scanStringEscape = this.scanStringEscape(str, octal);

          var _scanStringEscape2 = _slicedToArray(_scanStringEscape, 2);

          str = _scanStringEscape2[0];
          octal = _scanStringEscape2[1];
        } else if ((0, _utils.isLineTerminator)(ch.charCodeAt(0))) {
          throw this.createILLEGAL();
        } else {
          str += ch;
          this.index++;
        }
      }

      throw this.createILLEGAL();
    }
  }, {
    key: 'scanTemplateElement',
    value: function scanTemplateElement() {
      var startLocation = this.getLocation();
      var start = this.index;
      this.index++;
      while (this.index < this.source.length) {
        var ch = this.source.charCodeAt(this.index);
        switch (ch) {
          case 0x60:
            // `
            this.index++;
            return { type: TokenType.TEMPLATE, tail: true, slice: this.getSlice(start, startLocation) };
          case 0x24:
            // $
            if (this.source.charCodeAt(this.index + 1) === 0x7B) {
              // {
              this.index += 2;
              return { type: TokenType.TEMPLATE, tail: false, slice: this.getSlice(start, startLocation) };
            }
            this.index++;
            break;
          case 0x5C:
            // \\
            {
              var octal = this.scanStringEscape('', null)[1];
              if (octal != null) {
                throw this.createILLEGAL();
              }
              break;
            }
          default:
            this.index++;
        }
      }

      throw this.createILLEGAL();
    }
  }, {
    key: 'scanRegExp',
    value: function scanRegExp(str) {
      var startLocation = this.getLocation();
      var start = this.index;

      var terminated = false;
      var classMarker = false;
      while (this.index < this.source.length) {
        var ch = this.source.charAt(this.index);
        if (ch === '\\') {
          str += ch;
          this.index++;
          ch = this.source.charAt(this.index);
          // ECMA-262 7.8.5
          if ((0, _utils.isLineTerminator)(ch.charCodeAt(0))) {
            throw this.createError(_errors.ErrorMessages.UNTERMINATED_REGEXP);
          }
          str += ch;
          this.index++;
        } else if ((0, _utils.isLineTerminator)(ch.charCodeAt(0))) {
          throw this.createError(_errors.ErrorMessages.UNTERMINATED_REGEXP);
        } else {
          if (classMarker) {
            if (ch === ']') {
              classMarker = false;
            }
          } else if (ch === '/') {
            terminated = true;
            str += ch;
            this.index++;
            break;
          } else if (ch === '[') {
            classMarker = true;
          }
          str += ch;
          this.index++;
        }
      }

      if (!terminated) {
        throw this.createError(_errors.ErrorMessages.UNTERMINATED_REGEXP);
      }

      while (this.index < this.source.length) {
        var _ch3 = this.source.charAt(this.index);
        if (_ch3 === '\\') {
          throw this.createError(_errors.ErrorMessages.INVALID_REGEXP_FLAGS);
        }
        if (!(0, _utils.isIdentifierPart)(_ch3.charCodeAt(0))) {
          break;
        }
        this.index++;
        str += _ch3;
      }
      return { type: TokenType.REGEXP, value: str, slice: this.getSlice(start, startLocation) };
    }
  }, {
    key: 'advance',
    value: function advance() {
      var startLocation = this.getLocation();

      this.lastIndex = this.index;
      this.lastLine = this.line;
      this.lastLineStart = this.lineStart;

      this.skipComment();

      this.startIndex = this.index;
      this.startLine = this.line;
      this.startLineStart = this.lineStart;

      if (this.lastIndex === 0) {
        this.lastIndex = this.index;
        this.lastLine = this.line;
        this.lastLineStart = this.lineStart;
      }

      if (this.index >= this.source.length) {
        return { type: TokenType.EOS, slice: this.getSlice(this.index, startLocation) };
      }

      var charCode = this.source.charCodeAt(this.index);

      if (charCode < 0x80) {
        if (PUNCTUATOR_START[charCode]) {
          return this.scanPunctuator();
        }

        if ((0, _utils.isIdentifierStart)(charCode) || charCode === 0x5C /* backslash (\) */) {
            return this.scanIdentifier();
          }

        // Dot (.) U+002E can also start a floating-point number, hence the need
        // to check the next character.
        if (charCode === 0x2E) {
          if (this.index + 1 < this.source.length && (0, _utils.isDecimalDigit)(this.source.charCodeAt(this.index + 1))) {
            return this.scanNumericLiteral();
          }
          return this.scanPunctuator();
        }

        // String literal starts with single quote (U+0027) or double quote (U+0022).
        if (charCode === 0x27 || charCode === 0x22) {
          return this.scanStringLiteral();
        }

        // Template literal starts with back quote (U+0060)
        if (charCode === 0x60) {
          return this.scanTemplateElement();
        }

        if (charCode /* "0" */ >= 0x30 && charCode <= 0x39 /* "9" */) {
            return this.scanNumericLiteral();
          }

        // Slash (/) U+002F can also start a regex.
        throw this.createILLEGAL();
      } else {
        if ((0, _utils.isIdentifierStart)(charCode) || charCode >= 0xD800 && charCode <= 0xDBFF) {
          return this.scanIdentifier();
        }

        throw this.createILLEGAL();
      }
    }
  }, {
    key: 'eof',
    value: function eof() {
      return this.lookahead.type === TokenType.EOS;
    }
  }, {
    key: 'lex',
    value: function lex() {
      var prevToken = this.lookahead;
      this.lookahead = this.advance();
      this.tokenIndex++;
      return prevToken;
    }
  }], [{
    key: 'cse2',
    value: function cse2(id, ch1, ch2) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2;
    }
  }, {
    key: 'cse3',
    value: function cse3(id, ch1, ch2, ch3) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3;
    }
  }, {
    key: 'cse4',
    value: function cse4(id, ch1, ch2, ch3, ch4) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4;
    }
  }, {
    key: 'cse5',
    value: function cse5(id, ch1, ch2, ch3, ch4, ch5) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4 && id.charAt(5) === ch5;
    }
  }, {
    key: 'cse6',
    value: function cse6(id, ch1, ch2, ch3, ch4, ch5, ch6) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4 && id.charAt(5) === ch5 && id.charAt(6) === ch6;
    }
  }, {
    key: 'cse7',
    value: function cse7(id, ch1, ch2, ch3, ch4, ch5, ch6, ch7) {
      return id.charAt(1) === ch1 && id.charAt(2) === ch2 && id.charAt(3) === ch3 && id.charAt(4) === ch4 && id.charAt(5) === ch5 && id.charAt(6) === ch6 && id.charAt(7) === ch7;
    }
  }]);

  return Tokenizer;
}();

exports.default = Tokenizer;
},{"./errors":69,"./utils":74}],73:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Generated by scripts/generate-unicode-data.js

var whitespaceArray = exports.whitespaceArray = [5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288, 65279];
var whitespaceBool = exports.whitespaceBool = [false, false, false, false, false, false, false, false, false, true, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

var idStartLargeRegex = exports.idStartLargeRegex = /^[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]$/;
var idStartBool = exports.idStartBool = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false];

var idContinueLargeRegex = exports.idContinueLargeRegex = /^[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]$/;
var idContinueBool = exports.idContinueBool = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false];
},{}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStrictModeReservedWord = isStrictModeReservedWord;
exports.isWhiteSpace = isWhiteSpace;
exports.isLineTerminator = isLineTerminator;
exports.isIdentifierStart = isIdentifierStart;
exports.isIdentifierPart = isIdentifierPart;
exports.isDecimalDigit = isDecimalDigit;
exports.getHexValue = getHexValue;

var _unicode = require('./unicode');

var strictReservedWords = ['null', 'true', 'false', 'implements', 'interface', 'package', 'private', 'protected', 'public', 'static', 'let', 'if', 'in', 'do', 'var', 'for', 'new', 'try', 'this', 'else', 'case', 'void', 'with', 'enum', 'while', 'break', 'catch', 'throw', 'const', 'yield', 'class', 'super', 'return', 'typeof', 'delete', 'switch', 'export', 'import', 'default', 'finally', 'extends', 'function', 'continue', 'debugger', 'instanceof']; /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * Copyright 2017 Shape Security, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * Licensed under the Apache License, Version 2.0 (the "License")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    */

function isStrictModeReservedWord(id) {
  return strictReservedWords.indexOf(id) !== -1;
}

function isWhiteSpace(ch) {
  return ch < 128 ? _unicode.whitespaceBool[ch] : ch === 0xA0 || ch > 0x167F && _unicode.whitespaceArray.indexOf(ch) !== -1;
}

function isLineTerminator(ch) {
  return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
}

function isIdentifierStart(ch) {
  return ch < 128 ? _unicode.idStartBool[ch] : _unicode.idStartLargeRegex.test(String.fromCodePoint(ch));
}

function isIdentifierPart(ch) {
  return ch < 128 ? _unicode.idContinueBool[ch] : _unicode.idContinueLargeRegex.test(String.fromCodePoint(ch));
}

function isDecimalDigit(ch) {
  return ch >= 48 && ch <= 57;
}

function getHexValue(rune) {
  if (rune >= '0' && rune <= '9') {
    return rune.charCodeAt(0) - 48;
  }
  if (rune >= 'a' && rune <= 'f') {
    return rune.charCodeAt(0) - 87;
  }
  if (rune >= 'A' && rune <= 'F') {
    return rune.charCodeAt(0) - 55;
  }
  return -1;
}
},{"./unicode":73}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright 2016 Shape Security, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _shiftAst = require('shift-ast');

var Shift = _interopRequireWildcard(_shiftAst);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CloneReducer = function () {
  function CloneReducer() {
    _classCallCheck(this, CloneReducer);
  }

  _createClass(CloneReducer, [{
    key: 'reduceArrayAssignmentTarget',
    value: function reduceArrayAssignmentTarget(node, _ref) {
      var elements = _ref.elements,
          rest = _ref.rest;

      return new Shift.ArrayAssignmentTarget({ elements: elements, rest: rest });
    }
  }, {
    key: 'reduceArrayBinding',
    value: function reduceArrayBinding(node, _ref2) {
      var elements = _ref2.elements,
          rest = _ref2.rest;

      return new Shift.ArrayBinding({ elements: elements, rest: rest });
    }
  }, {
    key: 'reduceArrayExpression',
    value: function reduceArrayExpression(node, _ref3) {
      var elements = _ref3.elements;

      return new Shift.ArrayExpression({ elements: elements });
    }
  }, {
    key: 'reduceArrowExpression',
    value: function reduceArrowExpression(node, _ref4) {
      var params = _ref4.params,
          body = _ref4.body;

      return new Shift.ArrowExpression({ params: params, body: body });
    }
  }, {
    key: 'reduceAssignmentExpression',
    value: function reduceAssignmentExpression(node, _ref5) {
      var binding = _ref5.binding,
          expression = _ref5.expression;

      return new Shift.AssignmentExpression({ binding: binding, expression: expression });
    }
  }, {
    key: 'reduceAssignmentTargetIdentifier',
    value: function reduceAssignmentTargetIdentifier(node) {
      return new Shift.AssignmentTargetIdentifier({ name: node.name });
    }
  }, {
    key: 'reduceAssignmentTargetPropertyIdentifier',
    value: function reduceAssignmentTargetPropertyIdentifier(node, _ref6) {
      var binding = _ref6.binding,
          init = _ref6.init;

      return new Shift.AssignmentTargetPropertyIdentifier({ binding: binding, init: init });
    }
  }, {
    key: 'reduceAssignmentTargetPropertyProperty',
    value: function reduceAssignmentTargetPropertyProperty(node, _ref7) {
      var name = _ref7.name,
          binding = _ref7.binding;

      return new Shift.AssignmentTargetPropertyProperty({ name: name, binding: binding });
    }
  }, {
    key: 'reduceAssignmentTargetWithDefault',
    value: function reduceAssignmentTargetWithDefault(node, _ref8) {
      var binding = _ref8.binding,
          init = _ref8.init;

      return new Shift.AssignmentTargetWithDefault({ binding: binding, init: init });
    }
  }, {
    key: 'reduceBinaryExpression',
    value: function reduceBinaryExpression(node, _ref9) {
      var left = _ref9.left,
          right = _ref9.right;

      return new Shift.BinaryExpression({ left: left, operator: node.operator, right: right });
    }
  }, {
    key: 'reduceBindingIdentifier',
    value: function reduceBindingIdentifier(node) {
      return new Shift.BindingIdentifier({ name: node.name });
    }
  }, {
    key: 'reduceBindingPropertyIdentifier',
    value: function reduceBindingPropertyIdentifier(node, _ref10) {
      var binding = _ref10.binding,
          init = _ref10.init;

      return new Shift.BindingPropertyIdentifier({ binding: binding, init: init });
    }
  }, {
    key: 'reduceBindingPropertyProperty',
    value: function reduceBindingPropertyProperty(node, _ref11) {
      var name = _ref11.name,
          binding = _ref11.binding;

      return new Shift.BindingPropertyProperty({ name: name, binding: binding });
    }
  }, {
    key: 'reduceBindingWithDefault',
    value: function reduceBindingWithDefault(node, _ref12) {
      var binding = _ref12.binding,
          init = _ref12.init;

      return new Shift.BindingWithDefault({ binding: binding, init: init });
    }
  }, {
    key: 'reduceBlock',
    value: function reduceBlock(node, _ref13) {
      var statements = _ref13.statements;

      return new Shift.Block({ statements: statements });
    }
  }, {
    key: 'reduceBlockStatement',
    value: function reduceBlockStatement(node, _ref14) {
      var block = _ref14.block;

      return new Shift.BlockStatement({ block: block });
    }
  }, {
    key: 'reduceBreakStatement',
    value: function reduceBreakStatement(node) {
      return new Shift.BreakStatement({ label: node.label });
    }
  }, {
    key: 'reduceCallExpression',
    value: function reduceCallExpression(node, _ref15) {
      var callee = _ref15.callee,
          _arguments = _ref15.arguments;

      return new Shift.CallExpression({ callee: callee, arguments: _arguments });
    }
  }, {
    key: 'reduceCatchClause',
    value: function reduceCatchClause(node, _ref16) {
      var binding = _ref16.binding,
          body = _ref16.body;

      return new Shift.CatchClause({ binding: binding, body: body });
    }
  }, {
    key: 'reduceClassDeclaration',
    value: function reduceClassDeclaration(node, _ref17) {
      var name = _ref17.name,
          _super = _ref17.super,
          elements = _ref17.elements;

      return new Shift.ClassDeclaration({ name: name, super: _super, elements: elements });
    }
  }, {
    key: 'reduceClassElement',
    value: function reduceClassElement(node, _ref18) {
      var method = _ref18.method;

      return new Shift.ClassElement({ isStatic: node.isStatic, method: method });
    }
  }, {
    key: 'reduceClassExpression',
    value: function reduceClassExpression(node, _ref19) {
      var name = _ref19.name,
          _super = _ref19.super,
          elements = _ref19.elements;

      return new Shift.ClassExpression({ name: name, super: _super, elements: elements });
    }
  }, {
    key: 'reduceCompoundAssignmentExpression',
    value: function reduceCompoundAssignmentExpression(node, _ref20) {
      var binding = _ref20.binding,
          expression = _ref20.expression;

      return new Shift.CompoundAssignmentExpression({ binding: binding, operator: node.operator, expression: expression });
    }
  }, {
    key: 'reduceComputedMemberAssignmentTarget',
    value: function reduceComputedMemberAssignmentTarget(node, _ref21) {
      var object = _ref21.object,
          expression = _ref21.expression;

      return new Shift.ComputedMemberAssignmentTarget({ object: object, expression: expression });
    }
  }, {
    key: 'reduceComputedMemberExpression',
    value: function reduceComputedMemberExpression(node, _ref22) {
      var object = _ref22.object,
          expression = _ref22.expression;

      return new Shift.ComputedMemberExpression({ object: object, expression: expression });
    }
  }, {
    key: 'reduceComputedPropertyName',
    value: function reduceComputedPropertyName(node, _ref23) {
      var expression = _ref23.expression;

      return new Shift.ComputedPropertyName({ expression: expression });
    }
  }, {
    key: 'reduceConditionalExpression',
    value: function reduceConditionalExpression(node, _ref24) {
      var test = _ref24.test,
          consequent = _ref24.consequent,
          alternate = _ref24.alternate;

      return new Shift.ConditionalExpression({ test: test, consequent: consequent, alternate: alternate });
    }
  }, {
    key: 'reduceContinueStatement',
    value: function reduceContinueStatement(node) {
      return new Shift.ContinueStatement({ label: node.label });
    }
  }, {
    key: 'reduceDataProperty',
    value: function reduceDataProperty(node, _ref25) {
      var name = _ref25.name,
          expression = _ref25.expression;

      return new Shift.DataProperty({ name: name, expression: expression });
    }
  }, {
    key: 'reduceDebuggerStatement',
    value: function reduceDebuggerStatement(node) {
      return new Shift.DebuggerStatement();
    }
  }, {
    key: 'reduceDirective',
    value: function reduceDirective(node) {
      return new Shift.Directive({ rawValue: node.rawValue });
    }
  }, {
    key: 'reduceDoWhileStatement',
    value: function reduceDoWhileStatement(node, _ref26) {
      var body = _ref26.body,
          test = _ref26.test;

      return new Shift.DoWhileStatement({ body: body, test: test });
    }
  }, {
    key: 'reduceEmptyStatement',
    value: function reduceEmptyStatement(node) {
      return new Shift.EmptyStatement();
    }
  }, {
    key: 'reduceExport',
    value: function reduceExport(node, _ref27) {
      var declaration = _ref27.declaration;

      return new Shift.Export({ declaration: declaration });
    }
  }, {
    key: 'reduceExportAllFrom',
    value: function reduceExportAllFrom(node) {
      return new Shift.ExportAllFrom({ moduleSpecifier: node.moduleSpecifier });
    }
  }, {
    key: 'reduceExportDefault',
    value: function reduceExportDefault(node, _ref28) {
      var body = _ref28.body;

      return new Shift.ExportDefault({ body: body });
    }
  }, {
    key: 'reduceExportFrom',
    value: function reduceExportFrom(node, _ref29) {
      var namedExports = _ref29.namedExports;

      return new Shift.ExportFrom({ namedExports: namedExports, moduleSpecifier: node.moduleSpecifier });
    }
  }, {
    key: 'reduceExportFromSpecifier',
    value: function reduceExportFromSpecifier(node) {
      return new Shift.ExportFromSpecifier({ name: node.name, exportedName: node.exportedName });
    }
  }, {
    key: 'reduceExportLocalSpecifier',
    value: function reduceExportLocalSpecifier(node, _ref30) {
      var name = _ref30.name;

      return new Shift.ExportLocalSpecifier({ name: name, exportedName: node.exportedName });
    }
  }, {
    key: 'reduceExportLocals',
    value: function reduceExportLocals(node, _ref31) {
      var namedExports = _ref31.namedExports;

      return new Shift.ExportLocals({ namedExports: namedExports });
    }
  }, {
    key: 'reduceExpressionStatement',
    value: function reduceExpressionStatement(node, _ref32) {
      var expression = _ref32.expression;

      return new Shift.ExpressionStatement({ expression: expression });
    }
  }, {
    key: 'reduceForInStatement',
    value: function reduceForInStatement(node, _ref33) {
      var left = _ref33.left,
          right = _ref33.right,
          body = _ref33.body;

      return new Shift.ForInStatement({ left: left, right: right, body: body });
    }
  }, {
    key: 'reduceForOfStatement',
    value: function reduceForOfStatement(node, _ref34) {
      var left = _ref34.left,
          right = _ref34.right,
          body = _ref34.body;

      return new Shift.ForOfStatement({ left: left, right: right, body: body });
    }
  }, {
    key: 'reduceForStatement',
    value: function reduceForStatement(node, _ref35) {
      var init = _ref35.init,
          test = _ref35.test,
          update = _ref35.update,
          body = _ref35.body;

      return new Shift.ForStatement({ init: init, test: test, update: update, body: body });
    }
  }, {
    key: 'reduceFormalParameters',
    value: function reduceFormalParameters(node, _ref36) {
      var items = _ref36.items,
          rest = _ref36.rest;

      return new Shift.FormalParameters({ items: items, rest: rest });
    }
  }, {
    key: 'reduceFunctionBody',
    value: function reduceFunctionBody(node, _ref37) {
      var directives = _ref37.directives,
          statements = _ref37.statements;

      return new Shift.FunctionBody({ directives: directives, statements: statements });
    }
  }, {
    key: 'reduceFunctionDeclaration',
    value: function reduceFunctionDeclaration(node, _ref38) {
      var name = _ref38.name,
          params = _ref38.params,
          body = _ref38.body;

      return new Shift.FunctionDeclaration({ isGenerator: node.isGenerator, name: name, params: params, body: body });
    }
  }, {
    key: 'reduceFunctionExpression',
    value: function reduceFunctionExpression(node, _ref39) {
      var name = _ref39.name,
          params = _ref39.params,
          body = _ref39.body;

      return new Shift.FunctionExpression({ isGenerator: node.isGenerator, name: name, params: params, body: body });
    }
  }, {
    key: 'reduceGetter',
    value: function reduceGetter(node, _ref40) {
      var name = _ref40.name,
          body = _ref40.body;

      return new Shift.Getter({ name: name, body: body });
    }
  }, {
    key: 'reduceIdentifierExpression',
    value: function reduceIdentifierExpression(node) {
      return new Shift.IdentifierExpression({ name: node.name });
    }
  }, {
    key: 'reduceIfStatement',
    value: function reduceIfStatement(node, _ref41) {
      var test = _ref41.test,
          consequent = _ref41.consequent,
          alternate = _ref41.alternate;

      return new Shift.IfStatement({ test: test, consequent: consequent, alternate: alternate });
    }
  }, {
    key: 'reduceImport',
    value: function reduceImport(node, _ref42) {
      var defaultBinding = _ref42.defaultBinding,
          namedImports = _ref42.namedImports;

      return new Shift.Import({ defaultBinding: defaultBinding, namedImports: namedImports, moduleSpecifier: node.moduleSpecifier });
    }
  }, {
    key: 'reduceImportNamespace',
    value: function reduceImportNamespace(node, _ref43) {
      var defaultBinding = _ref43.defaultBinding,
          namespaceBinding = _ref43.namespaceBinding;

      return new Shift.ImportNamespace({ defaultBinding: defaultBinding, namespaceBinding: namespaceBinding, moduleSpecifier: node.moduleSpecifier });
    }
  }, {
    key: 'reduceImportSpecifier',
    value: function reduceImportSpecifier(node, _ref44) {
      var binding = _ref44.binding;

      return new Shift.ImportSpecifier({ name: node.name, binding: binding });
    }
  }, {
    key: 'reduceLabeledStatement',
    value: function reduceLabeledStatement(node, _ref45) {
      var body = _ref45.body;

      return new Shift.LabeledStatement({ label: node.label, body: body });
    }
  }, {
    key: 'reduceLiteralBooleanExpression',
    value: function reduceLiteralBooleanExpression(node) {
      return new Shift.LiteralBooleanExpression({ value: node.value });
    }
  }, {
    key: 'reduceLiteralInfinityExpression',
    value: function reduceLiteralInfinityExpression(node) {
      return new Shift.LiteralInfinityExpression();
    }
  }, {
    key: 'reduceLiteralNullExpression',
    value: function reduceLiteralNullExpression(node) {
      return new Shift.LiteralNullExpression();
    }
  }, {
    key: 'reduceLiteralNumericExpression',
    value: function reduceLiteralNumericExpression(node) {
      return new Shift.LiteralNumericExpression({ value: node.value });
    }
  }, {
    key: 'reduceLiteralRegExpExpression',
    value: function reduceLiteralRegExpExpression(node) {
      return new Shift.LiteralRegExpExpression({ pattern: node.pattern, global: node.global, ignoreCase: node.ignoreCase, multiLine: node.multiLine, sticky: node.sticky, unicode: node.unicode });
    }
  }, {
    key: 'reduceLiteralStringExpression',
    value: function reduceLiteralStringExpression(node) {
      return new Shift.LiteralStringExpression({ value: node.value });
    }
  }, {
    key: 'reduceMethod',
    value: function reduceMethod(node, _ref46) {
      var name = _ref46.name,
          params = _ref46.params,
          body = _ref46.body;

      return new Shift.Method({ isGenerator: node.isGenerator, name: name, params: params, body: body });
    }
  }, {
    key: 'reduceModule',
    value: function reduceModule(node, _ref47) {
      var directives = _ref47.directives,
          items = _ref47.items;

      return new Shift.Module({ directives: directives, items: items });
    }
  }, {
    key: 'reduceNewExpression',
    value: function reduceNewExpression(node, _ref48) {
      var callee = _ref48.callee,
          _arguments = _ref48.arguments;

      return new Shift.NewExpression({ callee: callee, arguments: _arguments });
    }
  }, {
    key: 'reduceNewTargetExpression',
    value: function reduceNewTargetExpression(node) {
      return new Shift.NewTargetExpression();
    }
  }, {
    key: 'reduceObjectAssignmentTarget',
    value: function reduceObjectAssignmentTarget(node, _ref49) {
      var properties = _ref49.properties;

      return new Shift.ObjectAssignmentTarget({ properties: properties });
    }
  }, {
    key: 'reduceObjectBinding',
    value: function reduceObjectBinding(node, _ref50) {
      var properties = _ref50.properties;

      return new Shift.ObjectBinding({ properties: properties });
    }
  }, {
    key: 'reduceObjectExpression',
    value: function reduceObjectExpression(node, _ref51) {
      var properties = _ref51.properties;

      return new Shift.ObjectExpression({ properties: properties });
    }
  }, {
    key: 'reduceReturnStatement',
    value: function reduceReturnStatement(node, _ref52) {
      var expression = _ref52.expression;

      return new Shift.ReturnStatement({ expression: expression });
    }
  }, {
    key: 'reduceScript',
    value: function reduceScript(node, _ref53) {
      var directives = _ref53.directives,
          statements = _ref53.statements;

      return new Shift.Script({ directives: directives, statements: statements });
    }
  }, {
    key: 'reduceSetter',
    value: function reduceSetter(node, _ref54) {
      var name = _ref54.name,
          param = _ref54.param,
          body = _ref54.body;

      return new Shift.Setter({ name: name, param: param, body: body });
    }
  }, {
    key: 'reduceShorthandProperty',
    value: function reduceShorthandProperty(node, _ref55) {
      var name = _ref55.name;

      return new Shift.ShorthandProperty({ name: name });
    }
  }, {
    key: 'reduceSpreadElement',
    value: function reduceSpreadElement(node, _ref56) {
      var expression = _ref56.expression;

      return new Shift.SpreadElement({ expression: expression });
    }
  }, {
    key: 'reduceStaticMemberAssignmentTarget',
    value: function reduceStaticMemberAssignmentTarget(node, _ref57) {
      var object = _ref57.object;

      return new Shift.StaticMemberAssignmentTarget({ object: object, property: node.property });
    }
  }, {
    key: 'reduceStaticMemberExpression',
    value: function reduceStaticMemberExpression(node, _ref58) {
      var object = _ref58.object;

      return new Shift.StaticMemberExpression({ object: object, property: node.property });
    }
  }, {
    key: 'reduceStaticPropertyName',
    value: function reduceStaticPropertyName(node) {
      return new Shift.StaticPropertyName({ value: node.value });
    }
  }, {
    key: 'reduceSuper',
    value: function reduceSuper(node) {
      return new Shift.Super();
    }
  }, {
    key: 'reduceSwitchCase',
    value: function reduceSwitchCase(node, _ref59) {
      var test = _ref59.test,
          consequent = _ref59.consequent;

      return new Shift.SwitchCase({ test: test, consequent: consequent });
    }
  }, {
    key: 'reduceSwitchDefault',
    value: function reduceSwitchDefault(node, _ref60) {
      var consequent = _ref60.consequent;

      return new Shift.SwitchDefault({ consequent: consequent });
    }
  }, {
    key: 'reduceSwitchStatement',
    value: function reduceSwitchStatement(node, _ref61) {
      var discriminant = _ref61.discriminant,
          cases = _ref61.cases;

      return new Shift.SwitchStatement({ discriminant: discriminant, cases: cases });
    }
  }, {
    key: 'reduceSwitchStatementWithDefault',
    value: function reduceSwitchStatementWithDefault(node, _ref62) {
      var discriminant = _ref62.discriminant,
          preDefaultCases = _ref62.preDefaultCases,
          defaultCase = _ref62.defaultCase,
          postDefaultCases = _ref62.postDefaultCases;

      return new Shift.SwitchStatementWithDefault({ discriminant: discriminant, preDefaultCases: preDefaultCases, defaultCase: defaultCase, postDefaultCases: postDefaultCases });
    }
  }, {
    key: 'reduceTemplateElement',
    value: function reduceTemplateElement(node) {
      return new Shift.TemplateElement({ rawValue: node.rawValue });
    }
  }, {
    key: 'reduceTemplateExpression',
    value: function reduceTemplateExpression(node, _ref63) {
      var tag = _ref63.tag,
          elements = _ref63.elements;

      return new Shift.TemplateExpression({ tag: tag, elements: elements });
    }
  }, {
    key: 'reduceThisExpression',
    value: function reduceThisExpression(node) {
      return new Shift.ThisExpression();
    }
  }, {
    key: 'reduceThrowStatement',
    value: function reduceThrowStatement(node, _ref64) {
      var expression = _ref64.expression;

      return new Shift.ThrowStatement({ expression: expression });
    }
  }, {
    key: 'reduceTryCatchStatement',
    value: function reduceTryCatchStatement(node, _ref65) {
      var body = _ref65.body,
          catchClause = _ref65.catchClause;

      return new Shift.TryCatchStatement({ body: body, catchClause: catchClause });
    }
  }, {
    key: 'reduceTryFinallyStatement',
    value: function reduceTryFinallyStatement(node, _ref66) {
      var body = _ref66.body,
          catchClause = _ref66.catchClause,
          finalizer = _ref66.finalizer;

      return new Shift.TryFinallyStatement({ body: body, catchClause: catchClause, finalizer: finalizer });
    }
  }, {
    key: 'reduceUnaryExpression',
    value: function reduceUnaryExpression(node, _ref67) {
      var operand = _ref67.operand;

      return new Shift.UnaryExpression({ operator: node.operator, operand: operand });
    }
  }, {
    key: 'reduceUpdateExpression',
    value: function reduceUpdateExpression(node, _ref68) {
      var operand = _ref68.operand;

      return new Shift.UpdateExpression({ isPrefix: node.isPrefix, operator: node.operator, operand: operand });
    }
  }, {
    key: 'reduceVariableDeclaration',
    value: function reduceVariableDeclaration(node, _ref69) {
      var declarators = _ref69.declarators;

      return new Shift.VariableDeclaration({ kind: node.kind, declarators: declarators });
    }
  }, {
    key: 'reduceVariableDeclarationStatement',
    value: function reduceVariableDeclarationStatement(node, _ref70) {
      var declaration = _ref70.declaration;

      return new Shift.VariableDeclarationStatement({ declaration: declaration });
    }
  }, {
    key: 'reduceVariableDeclarator',
    value: function reduceVariableDeclarator(node, _ref71) {
      var binding = _ref71.binding,
          init = _ref71.init;

      return new Shift.VariableDeclarator({ binding: binding, init: init });
    }
  }, {
    key: 'reduceWhileStatement',
    value: function reduceWhileStatement(node, _ref72) {
      var test = _ref72.test,
          body = _ref72.body;

      return new Shift.WhileStatement({ test: test, body: body });
    }
  }, {
    key: 'reduceWithStatement',
    value: function reduceWithStatement(node, _ref73) {
      var object = _ref73.object,
          body = _ref73.body;

      return new Shift.WithStatement({ object: object, body: body });
    }
  }, {
    key: 'reduceYieldExpression',
    value: function reduceYieldExpression(node, _ref74) {
      var expression = _ref74.expression;

      return new Shift.YieldExpression({ expression: expression });
    }
  }, {
    key: 'reduceYieldGeneratorExpression',
    value: function reduceYieldGeneratorExpression(node, _ref75) {
      var expression = _ref75.expression;

      return new Shift.YieldGeneratorExpression({ expression: expression });
    }
  }]);

  return CloneReducer;
}();

exports.default = CloneReducer;
},{"shift-ast":66}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reduce;

var _cloneReducer = require("./clone-reducer");

Object.defineProperty(exports, "CloneReducer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_cloneReducer).default;
  }
});

var _monoidalReducer = require("./monoidal-reducer");

Object.defineProperty(exports, "MonoidalReducer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_monoidalReducer).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright 2016 Shape Security, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var director = {
  ArrayAssignmentTarget: function ArrayAssignmentTarget(reducer, node) {
    var _this = this;

    return reducer.reduceArrayAssignmentTarget(node, { elements: node.elements.map(function (v) {
        return v && _this[v.type](reducer, v);
      }), rest: node.rest && this[node.rest.type](reducer, node.rest) });
  },
  ArrayBinding: function ArrayBinding(reducer, node) {
    var _this2 = this;

    return reducer.reduceArrayBinding(node, { elements: node.elements.map(function (v) {
        return v && _this2[v.type](reducer, v);
      }), rest: node.rest && this[node.rest.type](reducer, node.rest) });
  },
  ArrayExpression: function ArrayExpression(reducer, node) {
    var _this3 = this;

    return reducer.reduceArrayExpression(node, { elements: node.elements.map(function (v) {
        return v && _this3[v.type](reducer, v);
      }) });
  },
  ArrowExpression: function ArrowExpression(reducer, node) {
    return reducer.reduceArrowExpression(node, { params: this.FormalParameters(reducer, node.params), body: this[node.body.type](reducer, node.body) });
  },
  AssignmentExpression: function AssignmentExpression(reducer, node) {
    return reducer.reduceAssignmentExpression(node, { binding: this[node.binding.type](reducer, node.binding), expression: this[node.expression.type](reducer, node.expression) });
  },
  AssignmentTargetIdentifier: function AssignmentTargetIdentifier(reducer, node) {
    return reducer.reduceAssignmentTargetIdentifier(node);
  },
  AssignmentTargetPropertyIdentifier: function AssignmentTargetPropertyIdentifier(reducer, node) {
    return reducer.reduceAssignmentTargetPropertyIdentifier(node, { binding: this.AssignmentTargetIdentifier(reducer, node.binding), init: node.init && this[node.init.type](reducer, node.init) });
  },
  AssignmentTargetPropertyProperty: function AssignmentTargetPropertyProperty(reducer, node) {
    return reducer.reduceAssignmentTargetPropertyProperty(node, { name: this[node.name.type](reducer, node.name), binding: this[node.binding.type](reducer, node.binding) });
  },
  AssignmentTargetWithDefault: function AssignmentTargetWithDefault(reducer, node) {
    return reducer.reduceAssignmentTargetWithDefault(node, { binding: this[node.binding.type](reducer, node.binding), init: this[node.init.type](reducer, node.init) });
  },
  BinaryExpression: function BinaryExpression(reducer, node) {
    return reducer.reduceBinaryExpression(node, { left: this[node.left.type](reducer, node.left), right: this[node.right.type](reducer, node.right) });
  },
  BindingIdentifier: function BindingIdentifier(reducer, node) {
    return reducer.reduceBindingIdentifier(node);
  },
  BindingPropertyIdentifier: function BindingPropertyIdentifier(reducer, node) {
    return reducer.reduceBindingPropertyIdentifier(node, { binding: this.BindingIdentifier(reducer, node.binding), init: node.init && this[node.init.type](reducer, node.init) });
  },
  BindingPropertyProperty: function BindingPropertyProperty(reducer, node) {
    return reducer.reduceBindingPropertyProperty(node, { name: this[node.name.type](reducer, node.name), binding: this[node.binding.type](reducer, node.binding) });
  },
  BindingWithDefault: function BindingWithDefault(reducer, node) {
    return reducer.reduceBindingWithDefault(node, { binding: this[node.binding.type](reducer, node.binding), init: this[node.init.type](reducer, node.init) });
  },
  Block: function Block(reducer, node) {
    var _this4 = this;

    return reducer.reduceBlock(node, { statements: node.statements.map(function (v) {
        return _this4[v.type](reducer, v);
      }) });
  },
  BlockStatement: function BlockStatement(reducer, node) {
    return reducer.reduceBlockStatement(node, { block: this.Block(reducer, node.block) });
  },
  BreakStatement: function BreakStatement(reducer, node) {
    return reducer.reduceBreakStatement(node);
  },
  CallExpression: function CallExpression(reducer, node) {
    var _this5 = this;

    return reducer.reduceCallExpression(node, { callee: this[node.callee.type](reducer, node.callee), arguments: node.arguments.map(function (v) {
        return _this5[v.type](reducer, v);
      }) });
  },
  CatchClause: function CatchClause(reducer, node) {
    return reducer.reduceCatchClause(node, { binding: this[node.binding.type](reducer, node.binding), body: this.Block(reducer, node.body) });
  },
  ClassDeclaration: function ClassDeclaration(reducer, node) {
    var _this6 = this;

    return reducer.reduceClassDeclaration(node, { name: this.BindingIdentifier(reducer, node.name), super: node.super && this[node.super.type](reducer, node.super), elements: node.elements.map(function (v) {
        return _this6.ClassElement(reducer, v);
      }) });
  },
  ClassElement: function ClassElement(reducer, node) {
    return reducer.reduceClassElement(node, { method: this[node.method.type](reducer, node.method) });
  },
  ClassExpression: function ClassExpression(reducer, node) {
    var _this7 = this;

    return reducer.reduceClassExpression(node, { name: node.name && this.BindingIdentifier(reducer, node.name), super: node.super && this[node.super.type](reducer, node.super), elements: node.elements.map(function (v) {
        return _this7.ClassElement(reducer, v);
      }) });
  },
  CompoundAssignmentExpression: function CompoundAssignmentExpression(reducer, node) {
    return reducer.reduceCompoundAssignmentExpression(node, { binding: this[node.binding.type](reducer, node.binding), expression: this[node.expression.type](reducer, node.expression) });
  },
  ComputedMemberAssignmentTarget: function ComputedMemberAssignmentTarget(reducer, node) {
    return reducer.reduceComputedMemberAssignmentTarget(node, { object: this[node.object.type](reducer, node.object), expression: this[node.expression.type](reducer, node.expression) });
  },
  ComputedMemberExpression: function ComputedMemberExpression(reducer, node) {
    return reducer.reduceComputedMemberExpression(node, { object: this[node.object.type](reducer, node.object), expression: this[node.expression.type](reducer, node.expression) });
  },
  ComputedPropertyName: function ComputedPropertyName(reducer, node) {
    return reducer.reduceComputedPropertyName(node, { expression: this[node.expression.type](reducer, node.expression) });
  },
  ConditionalExpression: function ConditionalExpression(reducer, node) {
    return reducer.reduceConditionalExpression(node, { test: this[node.test.type](reducer, node.test), consequent: this[node.consequent.type](reducer, node.consequent), alternate: this[node.alternate.type](reducer, node.alternate) });
  },
  ContinueStatement: function ContinueStatement(reducer, node) {
    return reducer.reduceContinueStatement(node);
  },
  DataProperty: function DataProperty(reducer, node) {
    return reducer.reduceDataProperty(node, { name: this[node.name.type](reducer, node.name), expression: this[node.expression.type](reducer, node.expression) });
  },
  DebuggerStatement: function DebuggerStatement(reducer, node) {
    return reducer.reduceDebuggerStatement(node);
  },
  Directive: function Directive(reducer, node) {
    return reducer.reduceDirective(node);
  },
  DoWhileStatement: function DoWhileStatement(reducer, node) {
    return reducer.reduceDoWhileStatement(node, { body: this[node.body.type](reducer, node.body), test: this[node.test.type](reducer, node.test) });
  },
  EmptyStatement: function EmptyStatement(reducer, node) {
    return reducer.reduceEmptyStatement(node);
  },
  Export: function Export(reducer, node) {
    return reducer.reduceExport(node, { declaration: this[node.declaration.type](reducer, node.declaration) });
  },
  ExportAllFrom: function ExportAllFrom(reducer, node) {
    return reducer.reduceExportAllFrom(node);
  },
  ExportDefault: function ExportDefault(reducer, node) {
    return reducer.reduceExportDefault(node, { body: this[node.body.type](reducer, node.body) });
  },
  ExportFrom: function ExportFrom(reducer, node) {
    var _this8 = this;

    return reducer.reduceExportFrom(node, { namedExports: node.namedExports.map(function (v) {
        return _this8.ExportFromSpecifier(reducer, v);
      }) });
  },
  ExportFromSpecifier: function ExportFromSpecifier(reducer, node) {
    return reducer.reduceExportFromSpecifier(node);
  },
  ExportLocalSpecifier: function ExportLocalSpecifier(reducer, node) {
    return reducer.reduceExportLocalSpecifier(node, { name: this.IdentifierExpression(reducer, node.name) });
  },
  ExportLocals: function ExportLocals(reducer, node) {
    var _this9 = this;

    return reducer.reduceExportLocals(node, { namedExports: node.namedExports.map(function (v) {
        return _this9.ExportLocalSpecifier(reducer, v);
      }) });
  },
  ExpressionStatement: function ExpressionStatement(reducer, node) {
    return reducer.reduceExpressionStatement(node, { expression: this[node.expression.type](reducer, node.expression) });
  },
  ForInStatement: function ForInStatement(reducer, node) {
    return reducer.reduceForInStatement(node, { left: this[node.left.type](reducer, node.left), right: this[node.right.type](reducer, node.right), body: this[node.body.type](reducer, node.body) });
  },
  ForOfStatement: function ForOfStatement(reducer, node) {
    return reducer.reduceForOfStatement(node, { left: this[node.left.type](reducer, node.left), right: this[node.right.type](reducer, node.right), body: this[node.body.type](reducer, node.body) });
  },
  ForStatement: function ForStatement(reducer, node) {
    return reducer.reduceForStatement(node, { init: node.init && this[node.init.type](reducer, node.init), test: node.test && this[node.test.type](reducer, node.test), update: node.update && this[node.update.type](reducer, node.update), body: this[node.body.type](reducer, node.body) });
  },
  FormalParameters: function FormalParameters(reducer, node) {
    var _this10 = this;

    return reducer.reduceFormalParameters(node, { items: node.items.map(function (v) {
        return _this10[v.type](reducer, v);
      }), rest: node.rest && this[node.rest.type](reducer, node.rest) });
  },
  FunctionBody: function FunctionBody(reducer, node) {
    var _this11 = this;

    return reducer.reduceFunctionBody(node, { directives: node.directives.map(function (v) {
        return _this11.Directive(reducer, v);
      }), statements: node.statements.map(function (v) {
        return _this11[v.type](reducer, v);
      }) });
  },
  FunctionDeclaration: function FunctionDeclaration(reducer, node) {
    return reducer.reduceFunctionDeclaration(node, { name: this.BindingIdentifier(reducer, node.name), params: this.FormalParameters(reducer, node.params), body: this.FunctionBody(reducer, node.body) });
  },
  FunctionExpression: function FunctionExpression(reducer, node) {
    return reducer.reduceFunctionExpression(node, { name: node.name && this.BindingIdentifier(reducer, node.name), params: this.FormalParameters(reducer, node.params), body: this.FunctionBody(reducer, node.body) });
  },
  Getter: function Getter(reducer, node) {
    return reducer.reduceGetter(node, { name: this[node.name.type](reducer, node.name), body: this.FunctionBody(reducer, node.body) });
  },
  IdentifierExpression: function IdentifierExpression(reducer, node) {
    return reducer.reduceIdentifierExpression(node);
  },
  IfStatement: function IfStatement(reducer, node) {
    return reducer.reduceIfStatement(node, { test: this[node.test.type](reducer, node.test), consequent: this[node.consequent.type](reducer, node.consequent), alternate: node.alternate && this[node.alternate.type](reducer, node.alternate) });
  },
  Import: function Import(reducer, node) {
    var _this12 = this;

    return reducer.reduceImport(node, { defaultBinding: node.defaultBinding && this.BindingIdentifier(reducer, node.defaultBinding), namedImports: node.namedImports.map(function (v) {
        return _this12.ImportSpecifier(reducer, v);
      }) });
  },
  ImportNamespace: function ImportNamespace(reducer, node) {
    return reducer.reduceImportNamespace(node, { defaultBinding: node.defaultBinding && this.BindingIdentifier(reducer, node.defaultBinding), namespaceBinding: this.BindingIdentifier(reducer, node.namespaceBinding) });
  },
  ImportSpecifier: function ImportSpecifier(reducer, node) {
    return reducer.reduceImportSpecifier(node, { binding: this.BindingIdentifier(reducer, node.binding) });
  },
  LabeledStatement: function LabeledStatement(reducer, node) {
    return reducer.reduceLabeledStatement(node, { body: this[node.body.type](reducer, node.body) });
  },
  LiteralBooleanExpression: function LiteralBooleanExpression(reducer, node) {
    return reducer.reduceLiteralBooleanExpression(node);
  },
  LiteralInfinityExpression: function LiteralInfinityExpression(reducer, node) {
    return reducer.reduceLiteralInfinityExpression(node);
  },
  LiteralNullExpression: function LiteralNullExpression(reducer, node) {
    return reducer.reduceLiteralNullExpression(node);
  },
  LiteralNumericExpression: function LiteralNumericExpression(reducer, node) {
    return reducer.reduceLiteralNumericExpression(node);
  },
  LiteralRegExpExpression: function LiteralRegExpExpression(reducer, node) {
    return reducer.reduceLiteralRegExpExpression(node);
  },
  LiteralStringExpression: function LiteralStringExpression(reducer, node) {
    return reducer.reduceLiteralStringExpression(node);
  },
  Method: function Method(reducer, node) {
    return reducer.reduceMethod(node, { name: this[node.name.type](reducer, node.name), params: this.FormalParameters(reducer, node.params), body: this.FunctionBody(reducer, node.body) });
  },
  Module: function Module(reducer, node) {
    var _this13 = this;

    return reducer.reduceModule(node, { directives: node.directives.map(function (v) {
        return _this13.Directive(reducer, v);
      }), items: node.items.map(function (v) {
        return _this13[v.type](reducer, v);
      }) });
  },
  NewExpression: function NewExpression(reducer, node) {
    var _this14 = this;

    return reducer.reduceNewExpression(node, { callee: this[node.callee.type](reducer, node.callee), arguments: node.arguments.map(function (v) {
        return _this14[v.type](reducer, v);
      }) });
  },
  NewTargetExpression: function NewTargetExpression(reducer, node) {
    return reducer.reduceNewTargetExpression(node);
  },
  ObjectAssignmentTarget: function ObjectAssignmentTarget(reducer, node) {
    var _this15 = this;

    return reducer.reduceObjectAssignmentTarget(node, { properties: node.properties.map(function (v) {
        return _this15[v.type](reducer, v);
      }) });
  },
  ObjectBinding: function ObjectBinding(reducer, node) {
    var _this16 = this;

    return reducer.reduceObjectBinding(node, { properties: node.properties.map(function (v) {
        return _this16[v.type](reducer, v);
      }) });
  },
  ObjectExpression: function ObjectExpression(reducer, node) {
    var _this17 = this;

    return reducer.reduceObjectExpression(node, { properties: node.properties.map(function (v) {
        return _this17[v.type](reducer, v);
      }) });
  },
  ReturnStatement: function ReturnStatement(reducer, node) {
    return reducer.reduceReturnStatement(node, { expression: node.expression && this[node.expression.type](reducer, node.expression) });
  },
  Script: function Script(reducer, node) {
    var _this18 = this;

    return reducer.reduceScript(node, { directives: node.directives.map(function (v) {
        return _this18.Directive(reducer, v);
      }), statements: node.statements.map(function (v) {
        return _this18[v.type](reducer, v);
      }) });
  },
  Setter: function Setter(reducer, node) {
    return reducer.reduceSetter(node, { name: this[node.name.type](reducer, node.name), param: this[node.param.type](reducer, node.param), body: this.FunctionBody(reducer, node.body) });
  },
  ShorthandProperty: function ShorthandProperty(reducer, node) {
    return reducer.reduceShorthandProperty(node, { name: this.IdentifierExpression(reducer, node.name) });
  },
  SpreadElement: function SpreadElement(reducer, node) {
    return reducer.reduceSpreadElement(node, { expression: this[node.expression.type](reducer, node.expression) });
  },
  StaticMemberAssignmentTarget: function StaticMemberAssignmentTarget(reducer, node) {
    return reducer.reduceStaticMemberAssignmentTarget(node, { object: this[node.object.type](reducer, node.object) });
  },
  StaticMemberExpression: function StaticMemberExpression(reducer, node) {
    return reducer.reduceStaticMemberExpression(node, { object: this[node.object.type](reducer, node.object) });
  },
  StaticPropertyName: function StaticPropertyName(reducer, node) {
    return reducer.reduceStaticPropertyName(node);
  },
  Super: function Super(reducer, node) {
    return reducer.reduceSuper(node);
  },
  SwitchCase: function SwitchCase(reducer, node) {
    var _this19 = this;

    return reducer.reduceSwitchCase(node, { test: this[node.test.type](reducer, node.test), consequent: node.consequent.map(function (v) {
        return _this19[v.type](reducer, v);
      }) });
  },
  SwitchDefault: function SwitchDefault(reducer, node) {
    var _this20 = this;

    return reducer.reduceSwitchDefault(node, { consequent: node.consequent.map(function (v) {
        return _this20[v.type](reducer, v);
      }) });
  },
  SwitchStatement: function SwitchStatement(reducer, node) {
    var _this21 = this;

    return reducer.reduceSwitchStatement(node, { discriminant: this[node.discriminant.type](reducer, node.discriminant), cases: node.cases.map(function (v) {
        return _this21.SwitchCase(reducer, v);
      }) });
  },
  SwitchStatementWithDefault: function SwitchStatementWithDefault(reducer, node) {
    var _this22 = this;

    return reducer.reduceSwitchStatementWithDefault(node, { discriminant: this[node.discriminant.type](reducer, node.discriminant), preDefaultCases: node.preDefaultCases.map(function (v) {
        return _this22.SwitchCase(reducer, v);
      }), defaultCase: this.SwitchDefault(reducer, node.defaultCase), postDefaultCases: node.postDefaultCases.map(function (v) {
        return _this22.SwitchCase(reducer, v);
      }) });
  },
  TemplateElement: function TemplateElement(reducer, node) {
    return reducer.reduceTemplateElement(node);
  },
  TemplateExpression: function TemplateExpression(reducer, node) {
    var _this23 = this;

    return reducer.reduceTemplateExpression(node, { tag: node.tag && this[node.tag.type](reducer, node.tag), elements: node.elements.map(function (v) {
        return _this23[v.type](reducer, v);
      }) });
  },
  ThisExpression: function ThisExpression(reducer, node) {
    return reducer.reduceThisExpression(node);
  },
  ThrowStatement: function ThrowStatement(reducer, node) {
    return reducer.reduceThrowStatement(node, { expression: this[node.expression.type](reducer, node.expression) });
  },
  TryCatchStatement: function TryCatchStatement(reducer, node) {
    return reducer.reduceTryCatchStatement(node, { body: this.Block(reducer, node.body), catchClause: this.CatchClause(reducer, node.catchClause) });
  },
  TryFinallyStatement: function TryFinallyStatement(reducer, node) {
    return reducer.reduceTryFinallyStatement(node, { body: this.Block(reducer, node.body), catchClause: node.catchClause && this.CatchClause(reducer, node.catchClause), finalizer: this.Block(reducer, node.finalizer) });
  },
  UnaryExpression: function UnaryExpression(reducer, node) {
    return reducer.reduceUnaryExpression(node, { operand: this[node.operand.type](reducer, node.operand) });
  },
  UpdateExpression: function UpdateExpression(reducer, node) {
    return reducer.reduceUpdateExpression(node, { operand: this[node.operand.type](reducer, node.operand) });
  },
  VariableDeclaration: function VariableDeclaration(reducer, node) {
    var _this24 = this;

    return reducer.reduceVariableDeclaration(node, { declarators: node.declarators.map(function (v) {
        return _this24.VariableDeclarator(reducer, v);
      }) });
  },
  VariableDeclarationStatement: function VariableDeclarationStatement(reducer, node) {
    return reducer.reduceVariableDeclarationStatement(node, { declaration: this.VariableDeclaration(reducer, node.declaration) });
  },
  VariableDeclarator: function VariableDeclarator(reducer, node) {
    return reducer.reduceVariableDeclarator(node, { binding: this[node.binding.type](reducer, node.binding), init: node.init && this[node.init.type](reducer, node.init) });
  },
  WhileStatement: function WhileStatement(reducer, node) {
    return reducer.reduceWhileStatement(node, { test: this[node.test.type](reducer, node.test), body: this[node.body.type](reducer, node.body) });
  },
  WithStatement: function WithStatement(reducer, node) {
    return reducer.reduceWithStatement(node, { object: this[node.object.type](reducer, node.object), body: this[node.body.type](reducer, node.body) });
  },
  YieldExpression: function YieldExpression(reducer, node) {
    return reducer.reduceYieldExpression(node, { expression: node.expression && this[node.expression.type](reducer, node.expression) });
  },
  YieldGeneratorExpression: function YieldGeneratorExpression(reducer, node) {
    return reducer.reduceYieldGeneratorExpression(node, { expression: this[node.expression.type](reducer, node.expression) });
  }
};

function reduce(reducer, node) {
  return director[node.type](reducer, node);
}
},{"./clone-reducer":75,"./monoidal-reducer":77}],77:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright 2016 Shape Security, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _shiftAst = require('shift-ast');

var _shiftAst2 = _interopRequireDefault(_shiftAst);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MonoidalReducer = function () {
  function MonoidalReducer(monoid) {
    _classCallCheck(this, MonoidalReducer);

    this.identity = monoid.empty();
    var concat = monoid.prototype && monoid.prototype.concat || monoid.concat;
    this.append = function (a, b) {
      return concat.call(a, b);
    };
  }

  _createClass(MonoidalReducer, [{
    key: 'fold',
    value: function fold(list, a) {
      var _this = this;

      return list.reduce(function (memo, x) {
        return _this.append(memo, x);
      }, a == null ? this.identity : a);
    }
  }, {
    key: 'reduceArrayAssignmentTarget',
    value: function reduceArrayAssignmentTarget(node, _ref) {
      var elements = _ref.elements,
          rest = _ref.rest;

      return this.append(this.fold(elements.filter(function (n) {
        return n !== null;
      })), rest === null ? this.identity : rest);
    }
  }, {
    key: 'reduceArrayBinding',
    value: function reduceArrayBinding(node, _ref2) {
      var elements = _ref2.elements,
          rest = _ref2.rest;

      return this.append(this.fold(elements.filter(function (n) {
        return n !== null;
      })), rest === null ? this.identity : rest);
    }
  }, {
    key: 'reduceArrayExpression',
    value: function reduceArrayExpression(node, _ref3) {
      var elements = _ref3.elements;

      return this.fold(elements.filter(function (n) {
        return n !== null;
      }));
    }
  }, {
    key: 'reduceArrowExpression',
    value: function reduceArrowExpression(node, _ref4) {
      var params = _ref4.params,
          body = _ref4.body;

      return this.append(params, body);
    }
  }, {
    key: 'reduceAssignmentExpression',
    value: function reduceAssignmentExpression(node, _ref5) {
      var binding = _ref5.binding,
          expression = _ref5.expression;

      return this.append(binding, expression);
    }
  }, {
    key: 'reduceAssignmentTargetIdentifier',
    value: function reduceAssignmentTargetIdentifier(node) {
      return this.identity;
    }
  }, {
    key: 'reduceAssignmentTargetPropertyIdentifier',
    value: function reduceAssignmentTargetPropertyIdentifier(node, _ref6) {
      var binding = _ref6.binding,
          init = _ref6.init;

      return this.append(binding, init === null ? this.identity : init);
    }
  }, {
    key: 'reduceAssignmentTargetPropertyProperty',
    value: function reduceAssignmentTargetPropertyProperty(node, _ref7) {
      var name = _ref7.name,
          binding = _ref7.binding;

      return this.append(name, binding);
    }
  }, {
    key: 'reduceAssignmentTargetWithDefault',
    value: function reduceAssignmentTargetWithDefault(node, _ref8) {
      var binding = _ref8.binding,
          init = _ref8.init;

      return this.append(binding, init);
    }
  }, {
    key: 'reduceBinaryExpression',
    value: function reduceBinaryExpression(node, _ref9) {
      var left = _ref9.left,
          right = _ref9.right;

      return this.append(left, right);
    }
  }, {
    key: 'reduceBindingIdentifier',
    value: function reduceBindingIdentifier(node) {
      return this.identity;
    }
  }, {
    key: 'reduceBindingPropertyIdentifier',
    value: function reduceBindingPropertyIdentifier(node, _ref10) {
      var binding = _ref10.binding,
          init = _ref10.init;

      return this.append(binding, init === null ? this.identity : init);
    }
  }, {
    key: 'reduceBindingPropertyProperty',
    value: function reduceBindingPropertyProperty(node, _ref11) {
      var name = _ref11.name,
          binding = _ref11.binding;

      return this.append(name, binding);
    }
  }, {
    key: 'reduceBindingWithDefault',
    value: function reduceBindingWithDefault(node, _ref12) {
      var binding = _ref12.binding,
          init = _ref12.init;

      return this.append(binding, init);
    }
  }, {
    key: 'reduceBlock',
    value: function reduceBlock(node, _ref13) {
      var statements = _ref13.statements;

      return this.fold(statements);
    }
  }, {
    key: 'reduceBlockStatement',
    value: function reduceBlockStatement(node, _ref14) {
      var block = _ref14.block;

      return block;
    }
  }, {
    key: 'reduceBreakStatement',
    value: function reduceBreakStatement(node) {
      return this.identity;
    }
  }, {
    key: 'reduceCallExpression',
    value: function reduceCallExpression(node, _ref15) {
      var callee = _ref15.callee,
          _arguments = _ref15.arguments;

      return this.append(callee, this.fold(_arguments));
    }
  }, {
    key: 'reduceCatchClause',
    value: function reduceCatchClause(node, _ref16) {
      var binding = _ref16.binding,
          body = _ref16.body;

      return this.append(binding, body);
    }
  }, {
    key: 'reduceClassDeclaration',
    value: function reduceClassDeclaration(node, _ref17) {
      var name = _ref17.name,
          _super = _ref17.super,
          elements = _ref17.elements;

      return this.fold([name, _super === null ? this.identity : _super, this.fold(elements)]);
    }
  }, {
    key: 'reduceClassElement',
    value: function reduceClassElement(node, _ref18) {
      var method = _ref18.method;

      return method;
    }
  }, {
    key: 'reduceClassExpression',
    value: function reduceClassExpression(node, _ref19) {
      var name = _ref19.name,
          _super = _ref19.super,
          elements = _ref19.elements;

      return this.fold([name === null ? this.identity : name, _super === null ? this.identity : _super, this.fold(elements)]);
    }
  }, {
    key: 'reduceCompoundAssignmentExpression',
    value: function reduceCompoundAssignmentExpression(node, _ref20) {
      var binding = _ref20.binding,
          expression = _ref20.expression;

      return this.append(binding, expression);
    }
  }, {
    key: 'reduceComputedMemberAssignmentTarget',
    value: function reduceComputedMemberAssignmentTarget(node, _ref21) {
      var object = _ref21.object,
          expression = _ref21.expression;

      return this.append(object, expression);
    }
  }, {
    key: 'reduceComputedMemberExpression',
    value: function reduceComputedMemberExpression(node, _ref22) {
      var object = _ref22.object,
          expression = _ref22.expression;

      return this.append(object, expression);
    }
  }, {
    key: 'reduceComputedPropertyName',
    value: function reduceComputedPropertyName(node, _ref23) {
      var expression = _ref23.expression;

      return expression;
    }
  }, {
    key: 'reduceConditionalExpression',
    value: function reduceConditionalExpression(node, _ref24) {
      var test = _ref24.test,
          consequent = _ref24.consequent,
          alternate = _ref24.alternate;

      return this.fold([test, consequent, alternate]);
    }
  }, {
    key: 'reduceContinueStatement',
    value: function reduceContinueStatement(node) {
      return this.identity;
    }
  }, {
    key: 'reduceDataProperty',
    value: function reduceDataProperty(node, _ref25) {
      var name = _ref25.name,
          expression = _ref25.expression;

      return this.append(name, expression);
    }
  }, {
    key: 'reduceDebuggerStatement',
    value: function reduceDebuggerStatement(node) {
      return this.identity;
    }
  }, {
    key: 'reduceDirective',
    value: function reduceDirective(node) {
      return this.identity;
    }
  }, {
    key: 'reduceDoWhileStatement',
    value: function reduceDoWhileStatement(node, _ref26) {
      var body = _ref26.body,
          test = _ref26.test;

      return this.append(body, test);
    }
  }, {
    key: 'reduceEmptyStatement',
    value: function reduceEmptyStatement(node) {
      return this.identity;
    }
  }, {
    key: 'reduceExport',
    value: function reduceExport(node, _ref27) {
      var declaration = _ref27.declaration;

      return declaration;
    }
  }, {
    key: 'reduceExportAllFrom',
    value: function reduceExportAllFrom(node) {
      return this.identity;
    }
  }, {
    key: 'reduceExportDefault',
    value: function reduceExportDefault(node, _ref28) {
      var body = _ref28.body;

      return body;
    }
  }, {
    key: 'reduceExportFrom',
    value: function reduceExportFrom(node, _ref29) {
      var namedExports = _ref29.namedExports;

      return this.fold(namedExports);
    }
  }, {
    key: 'reduceExportFromSpecifier',
    value: function reduceExportFromSpecifier(node) {
      return this.identity;
    }
  }, {
    key: 'reduceExportLocalSpecifier',
    value: function reduceExportLocalSpecifier(node, _ref30) {
      var name = _ref30.name;

      return name;
    }
  }, {
    key: 'reduceExportLocals',
    value: function reduceExportLocals(node, _ref31) {
      var namedExports = _ref31.namedExports;

      return this.fold(namedExports);
    }
  }, {
    key: 'reduceExpressionStatement',
    value: function reduceExpressionStatement(node, _ref32) {
      var expression = _ref32.expression;

      return expression;
    }
  }, {
    key: 'reduceForInStatement',
    value: function reduceForInStatement(node, _ref33) {
      var left = _ref33.left,
          right = _ref33.right,
          body = _ref33.body;

      return this.fold([left, right, body]);
    }
  }, {
    key: 'reduceForOfStatement',
    value: function reduceForOfStatement(node, _ref34) {
      var left = _ref34.left,
          right = _ref34.right,
          body = _ref34.body;

      return this.fold([left, right, body]);
    }
  }, {
    key: 'reduceForStatement',
    value: function reduceForStatement(node, _ref35) {
      var init = _ref35.init,
          test = _ref35.test,
          update = _ref35.update,
          body = _ref35.body;

      return this.fold([init === null ? this.identity : init, test === null ? this.identity : test, update === null ? this.identity : update, body]);
    }
  }, {
    key: 'reduceFormalParameters',
    value: function reduceFormalParameters(node, _ref36) {
      var items = _ref36.items,
          rest = _ref36.rest;

      return this.append(this.fold(items), rest === null ? this.identity : rest);
    }
  }, {
    key: 'reduceFunctionBody',
    value: function reduceFunctionBody(node, _ref37) {
      var directives = _ref37.directives,
          statements = _ref37.statements;

      return this.append(this.fold(directives), this.fold(statements));
    }
  }, {
    key: 'reduceFunctionDeclaration',
    value: function reduceFunctionDeclaration(node, _ref38) {
      var name = _ref38.name,
          params = _ref38.params,
          body = _ref38.body;

      return this.fold([name, params, body]);
    }
  }, {
    key: 'reduceFunctionExpression',
    value: function reduceFunctionExpression(node, _ref39) {
      var name = _ref39.name,
          params = _ref39.params,
          body = _ref39.body;

      return this.fold([name === null ? this.identity : name, params, body]);
    }
  }, {
    key: 'reduceGetter',
    value: function reduceGetter(node, _ref40) {
      var name = _ref40.name,
          body = _ref40.body;

      return this.append(name, body);
    }
  }, {
    key: 'reduceIdentifierExpression',
    value: function reduceIdentifierExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceIfStatement',
    value: function reduceIfStatement(node, _ref41) {
      var test = _ref41.test,
          consequent = _ref41.consequent,
          alternate = _ref41.alternate;

      return this.fold([test, consequent, alternate === null ? this.identity : alternate]);
    }
  }, {
    key: 'reduceImport',
    value: function reduceImport(node, _ref42) {
      var defaultBinding = _ref42.defaultBinding,
          namedImports = _ref42.namedImports;

      return this.append(defaultBinding === null ? this.identity : defaultBinding, this.fold(namedImports));
    }
  }, {
    key: 'reduceImportNamespace',
    value: function reduceImportNamespace(node, _ref43) {
      var defaultBinding = _ref43.defaultBinding,
          namespaceBinding = _ref43.namespaceBinding;

      return this.append(defaultBinding === null ? this.identity : defaultBinding, namespaceBinding);
    }
  }, {
    key: 'reduceImportSpecifier',
    value: function reduceImportSpecifier(node, _ref44) {
      var binding = _ref44.binding;

      return binding;
    }
  }, {
    key: 'reduceLabeledStatement',
    value: function reduceLabeledStatement(node, _ref45) {
      var body = _ref45.body;

      return body;
    }
  }, {
    key: 'reduceLiteralBooleanExpression',
    value: function reduceLiteralBooleanExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceLiteralInfinityExpression',
    value: function reduceLiteralInfinityExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceLiteralNullExpression',
    value: function reduceLiteralNullExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceLiteralNumericExpression',
    value: function reduceLiteralNumericExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceLiteralRegExpExpression',
    value: function reduceLiteralRegExpExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceLiteralStringExpression',
    value: function reduceLiteralStringExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceMethod',
    value: function reduceMethod(node, _ref46) {
      var name = _ref46.name,
          params = _ref46.params,
          body = _ref46.body;

      return this.fold([name, params, body]);
    }
  }, {
    key: 'reduceModule',
    value: function reduceModule(node, _ref47) {
      var directives = _ref47.directives,
          items = _ref47.items;

      return this.append(this.fold(directives), this.fold(items));
    }
  }, {
    key: 'reduceNewExpression',
    value: function reduceNewExpression(node, _ref48) {
      var callee = _ref48.callee,
          _arguments = _ref48.arguments;

      return this.append(callee, this.fold(_arguments));
    }
  }, {
    key: 'reduceNewTargetExpression',
    value: function reduceNewTargetExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceObjectAssignmentTarget',
    value: function reduceObjectAssignmentTarget(node, _ref49) {
      var properties = _ref49.properties;

      return this.fold(properties);
    }
  }, {
    key: 'reduceObjectBinding',
    value: function reduceObjectBinding(node, _ref50) {
      var properties = _ref50.properties;

      return this.fold(properties);
    }
  }, {
    key: 'reduceObjectExpression',
    value: function reduceObjectExpression(node, _ref51) {
      var properties = _ref51.properties;

      return this.fold(properties);
    }
  }, {
    key: 'reduceReturnStatement',
    value: function reduceReturnStatement(node, _ref52) {
      var expression = _ref52.expression;

      return expression === null ? this.identity : expression;
    }
  }, {
    key: 'reduceScript',
    value: function reduceScript(node, _ref53) {
      var directives = _ref53.directives,
          statements = _ref53.statements;

      return this.append(this.fold(directives), this.fold(statements));
    }
  }, {
    key: 'reduceSetter',
    value: function reduceSetter(node, _ref54) {
      var name = _ref54.name,
          param = _ref54.param,
          body = _ref54.body;

      return this.fold([name, param, body]);
    }
  }, {
    key: 'reduceShorthandProperty',
    value: function reduceShorthandProperty(node, _ref55) {
      var name = _ref55.name;

      return name;
    }
  }, {
    key: 'reduceSpreadElement',
    value: function reduceSpreadElement(node, _ref56) {
      var expression = _ref56.expression;

      return expression;
    }
  }, {
    key: 'reduceStaticMemberAssignmentTarget',
    value: function reduceStaticMemberAssignmentTarget(node, _ref57) {
      var object = _ref57.object;

      return object;
    }
  }, {
    key: 'reduceStaticMemberExpression',
    value: function reduceStaticMemberExpression(node, _ref58) {
      var object = _ref58.object;

      return object;
    }
  }, {
    key: 'reduceStaticPropertyName',
    value: function reduceStaticPropertyName(node) {
      return this.identity;
    }
  }, {
    key: 'reduceSuper',
    value: function reduceSuper(node) {
      return this.identity;
    }
  }, {
    key: 'reduceSwitchCase',
    value: function reduceSwitchCase(node, _ref59) {
      var test = _ref59.test,
          consequent = _ref59.consequent;

      return this.append(test, this.fold(consequent));
    }
  }, {
    key: 'reduceSwitchDefault',
    value: function reduceSwitchDefault(node, _ref60) {
      var consequent = _ref60.consequent;

      return this.fold(consequent);
    }
  }, {
    key: 'reduceSwitchStatement',
    value: function reduceSwitchStatement(node, _ref61) {
      var discriminant = _ref61.discriminant,
          cases = _ref61.cases;

      return this.append(discriminant, this.fold(cases));
    }
  }, {
    key: 'reduceSwitchStatementWithDefault',
    value: function reduceSwitchStatementWithDefault(node, _ref62) {
      var discriminant = _ref62.discriminant,
          preDefaultCases = _ref62.preDefaultCases,
          defaultCase = _ref62.defaultCase,
          postDefaultCases = _ref62.postDefaultCases;

      return this.fold([discriminant, this.fold(preDefaultCases), defaultCase, this.fold(postDefaultCases)]);
    }
  }, {
    key: 'reduceTemplateElement',
    value: function reduceTemplateElement(node) {
      return this.identity;
    }
  }, {
    key: 'reduceTemplateExpression',
    value: function reduceTemplateExpression(node, _ref63) {
      var tag = _ref63.tag,
          elements = _ref63.elements;

      return this.append(tag === null ? this.identity : tag, this.fold(elements));
    }
  }, {
    key: 'reduceThisExpression',
    value: function reduceThisExpression(node) {
      return this.identity;
    }
  }, {
    key: 'reduceThrowStatement',
    value: function reduceThrowStatement(node, _ref64) {
      var expression = _ref64.expression;

      return expression;
    }
  }, {
    key: 'reduceTryCatchStatement',
    value: function reduceTryCatchStatement(node, _ref65) {
      var body = _ref65.body,
          catchClause = _ref65.catchClause;

      return this.append(body, catchClause);
    }
  }, {
    key: 'reduceTryFinallyStatement',
    value: function reduceTryFinallyStatement(node, _ref66) {
      var body = _ref66.body,
          catchClause = _ref66.catchClause,
          finalizer = _ref66.finalizer;

      return this.fold([body, catchClause === null ? this.identity : catchClause, finalizer]);
    }
  }, {
    key: 'reduceUnaryExpression',
    value: function reduceUnaryExpression(node, _ref67) {
      var operand = _ref67.operand;

      return operand;
    }
  }, {
    key: 'reduceUpdateExpression',
    value: function reduceUpdateExpression(node, _ref68) {
      var operand = _ref68.operand;

      return operand;
    }
  }, {
    key: 'reduceVariableDeclaration',
    value: function reduceVariableDeclaration(node, _ref69) {
      var declarators = _ref69.declarators;

      return this.fold(declarators);
    }
  }, {
    key: 'reduceVariableDeclarationStatement',
    value: function reduceVariableDeclarationStatement(node, _ref70) {
      var declaration = _ref70.declaration;

      return declaration;
    }
  }, {
    key: 'reduceVariableDeclarator',
    value: function reduceVariableDeclarator(node, _ref71) {
      var binding = _ref71.binding,
          init = _ref71.init;

      return this.append(binding, init === null ? this.identity : init);
    }
  }, {
    key: 'reduceWhileStatement',
    value: function reduceWhileStatement(node, _ref72) {
      var test = _ref72.test,
          body = _ref72.body;

      return this.append(test, body);
    }
  }, {
    key: 'reduceWithStatement',
    value: function reduceWithStatement(node, _ref73) {
      var object = _ref73.object,
          body = _ref73.body;

      return this.append(object, body);
    }
  }, {
    key: 'reduceYieldExpression',
    value: function reduceYieldExpression(node, _ref74) {
      var expression = _ref74.expression;

      return expression === null ? this.identity : expression;
    }
  }, {
    key: 'reduceYieldGeneratorExpression',
    value: function reduceYieldGeneratorExpression(node, _ref75) {
      var expression = _ref75.expression;

      return expression;
    }
  }]);

  return MonoidalReducer;
}();

exports.default = MonoidalReducer;
},{"shift-ast":66}],78:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

exports.default = isValid;

var _shiftParser = require("shift-parser");

var _shiftReducer = require("shift-reducer");

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _esutils = require("esutils");

var _validationContext = require("./validation-context");

var _validationErrors = require("./validation-errors");

var _validationErrors2 = _interopRequireDefault(_validationErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright 2016 Shape Security, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Licensed under the Apache License, Version 2.0 (the "License")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var isIdentifierNameES6 = _esutils.keyword.isIdentifierNameES6;
var isReservedWordES6 = _esutils.keyword.isReservedWordES6;
var isIdentifierStart = _esutils.code.isIdentifierStartES6;
var isIdentifierPart = _esutils.code.isIdentifierPartES6;
function isValid(node) {
  return Validator.validate(node).length === 0;
}

function isIterationStatement(type) {
  switch (type) {
    case "DoWhileStatement":
    case "WhileStatement":
    case "ForStatement":
    case "ForInStatement":
      return true;
  }
  return false;
}

function trailingStatement(node) {
  switch (node.type) {
    case "IfStatement":
      if (node.alternate != null) {
        return node.alternate;
      }
      return node.consequent;
    case "LabeledStatement":
    case "ForStatement":
    case "ForInStatement":
    case "ForOfStatement":
    case "WhileStatement":
    case "WithStatement":
      return node.body;
  }
  return null;
}

function isProblematicIfStatement(node) {
  if (node.type !== "IfStatement") {
    return false;
  }
  if (node.alternate == null) {
    return false;
  }
  var current = node.consequent;
  do {
    if (current.type === "IfStatement" && current.alternate == null) {
      return true;
    }
    current = trailingStatement(current);
  } while (current != null);
  return false;
}

function isValidIdentifier(name) {
  return name === 'let' || name === 'yield' || name === 'enum' || isIdentifierNameES6(name) && !isReservedWordES6(name);
  if (name.length === 0) {
    return false;
  }
  try {
    var res = new _shiftParser.Tokenizer(name).scanIdentifier();
    return (res.type === _shiftParser.TokenType.IDENTIFIER || res.type === _shiftParser.TokenType.LET || res.type === _shiftParser.TokenType.YIELD) && res.value === name;
  } catch (e) {
    return false;
  }
}

function isValidIdentifierName(name) {
  return name.length > 0 && isIdentifierStart(name.charCodeAt(0)) && Array.prototype.every.call(name, function (c) {
    return isIdentifierPart(c.charCodeAt(0));
  });
}

function isValidStaticPropertyName(name) {
  return isIdentifierNameES6(name);
}

function isValidRegex(pattern, flags) {
  return true; // TODO fix this when pattern-acceptor is fixed
}

function isTemplateElement(rawValue) {
  try {
    var tokenizer = new _shiftParser.Tokenizer('`' + rawValue + '`');
    tokenizer.lookahead = tokenizer.advance();
    var token = tokenizer.lex();
    if (token.type !== _shiftParser.TokenType.TEMPLATE) {
      return false;
    }
    return tokenizer.eof();
  } catch (e) {
    return false;
  }
}

function isDirective(rawValue) {
  var stringify = function stringify(c) {
    try {
      var tokenizer = new _shiftParser.Tokenizer(c + rawValue + c);
      tokenizer.lookahead = tokenizer.advance();
      var token = tokenizer.lex();
      if (token.type !== _shiftParser.TokenType.STRING) {
        return false;
      }
      return tokenizer.eof();
    } catch (e) {
      return false;
    }
  };
  return stringify('"') || stringify("'");
}

function checkIllegalBody(node, s) {
  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref$allowFunctions = _ref.allowFunctions;
  var allowFunctions = _ref$allowFunctions === undefined ? false : _ref$allowFunctions;

  if (node.body.type === 'FunctionDeclaration' && !allowFunctions) {
    return s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.FUNCTION_DECLARATION_AS_STATEMENT));
  } else if (node.body.type === 'ClassDeclaration' || node.body.type === 'FunctionDeclaration' && node.body.isGenerator || node.body.type === 'VariableDeclarationStatement' && (node.body.declaration.kind === 'let' || node.body.declaration.kind === 'const')) {
    return s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.PROPER_DECLARATION_AS_STATEMENT));
  }
  return s;
}

var Validator = exports.Validator = function (_MonoidalReducer) {
  _inherits(Validator, _MonoidalReducer);

  function Validator() {
    _classCallCheck(this, Validator);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Validator).call(this, _validationContext.ValidationContext));
  }

  _createClass(Validator, [{
    key: "reduceArrowExpression",
    value: function reduceArrowExpression(node, _ref2) {
      var params = _ref2.params;
      var body = _ref2.body;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceArrowExpression", this).call(this, node, { params: params, body: body.enforceYields() });
      return s;
    }
  }, {
    key: "reduceAssignmentTargetIdentifier",
    value: function reduceAssignmentTargetIdentifier(node) {
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceAssignmentTargetIdentifier", this).call(this, node);
      if (!isValidIdentifier(node.name)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_BINDING_IDENTIFIER_NAME));
      }
      return s;
    }
  }, {
    key: "reduceBindingIdentifier",
    value: function reduceBindingIdentifier(node) {
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceBindingIdentifier", this).call(this, node);
      if (!isValidIdentifier(node.name)) {
        if (node.name == "*default*") {
          s = s.addBindingIdentifierCalledDefault(node);
        } else {
          s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_BINDING_IDENTIFIER_NAME));
        }
      }
      return s;
    }
  }, {
    key: "reduceBreakStatement",
    value: function reduceBreakStatement(node) {
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceBreakStatement", this).call(this, node);
      if (node.label !== null && !isValidIdentifier(node.label)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_BREAK_STATEMENT_LABEL));
      }
      return s;
    }
  }, {
    key: "reduceContinueStatement",
    value: function reduceContinueStatement(node) {
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceContinueStatement", this).call(this, node);
      if (node.label !== null && !isValidIdentifier(node.label)) {
        s = s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_CONTINUE_STATEMENT_LABEL));
      }
      return s;
    }
  }, {
    key: "reduceDoWhileStatement",
    value: function reduceDoWhileStatement(node, _ref3) {
      var body = _ref3.body;
      var test = _ref3.test;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceDoWhileStatement", this).call(this, node, { body: body, test: test });
      s = checkIllegalBody(node, s);
      return s;
    }
  }, {
    key: "reduceDirective",
    value: function reduceDirective(node) {
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceDirective", this).call(this, node);
      if (!isDirective(node.rawValue)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_DIRECTIVE));
      }
      return s;
    }
  }, {
    key: "reduceExportDefault",
    value: function reduceExportDefault(node, _ref4) {
      var body = _ref4.body;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceExportDefault", this).call(this, node, { body: body });
      if (node.body.type === 'FunctionDeclaration' || node.body.type == 'ClassDeclaration') {
        s = s.clearBindingIdentifiersCalledDefault();
      }
      return s;
    }
  }, {
    key: "reduceExportFromSpecifier",
    value: function reduceExportFromSpecifier(node) {
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceExportFromSpecifier", this).call(this, node);
      if (!isValidIdentifierName(node.name)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_EXPORT_SPECIFIER_NAME));
      }
      if (node.exportedName !== null && !isValidIdentifierName(node.exportedName)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_EXPORTED_NAME));
      }
      return s;
    }
  }, {
    key: "reduceExportLocalSpecifier",
    value: function reduceExportLocalSpecifier(node, _ref5) {
      var name = _ref5.name;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceExportLocalSpecifier", this).call(this, node, { name: name });
      if (node.exportedName !== null && !isIdentifierNameES6(node.exportedName)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_EXPORTED_NAME));
      }
      return s;
    }
  }, {
    key: "reduceForInStatement",
    value: function reduceForInStatement(node, _ref6) {
      var left = _ref6.left;
      var right = _ref6.right;
      var body = _ref6.body;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceForInStatement", this).call(this, node, { left: left, right: right, body: body });
      if (node.left.type === 'VariableDeclaration') {
        if (node.left.declarators.length != 1) {
          s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.ONE_VARIABLE_DECLARATOR_IN_FOR_IN));
        }
        if (node.left.declarators.length > 0 && node.left.declarators[0].init !== null) {
          s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.NO_INIT_IN_VARIABLE_DECLARATOR_IN_FOR_IN));
        }
      }
      s = checkIllegalBody(node, s);
      return s;
    }
  }, {
    key: "reduceForOfStatement",
    value: function reduceForOfStatement(node, _ref7) {
      var left = _ref7.left;
      var right = _ref7.right;
      var body = _ref7.body;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceForOfStatement", this).call(this, node, { left: left, right: right, body: body });
      if (node.left.type === 'VariableDeclaration') {
        if (node.left.declarators.length != 1) {
          s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.ONE_VARIABLE_DECLARATOR_IN_FOR_OF));
        }
        if (node.left.declarators.length > 0 && node.left.declarators[0].init !== null) {
          s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.NO_INIT_IN_VARIABLE_DECLARATOR_IN_FOR_OF));
        }
      }
      s = checkIllegalBody(node, s);
      return s;
    }
  }, {
    key: "reduceForStatement",
    value: function reduceForStatement(node, _ref8) {
      var init = _ref8.init;
      var update = _ref8.update;
      var test = _ref8.test;
      var body = _ref8.body;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceForStatement", this).call(this, node, { init: init, update: update, test: test, body: body });
      s = checkIllegalBody(node, s);
      return s;
    }
  }, {
    key: "reduceFormalParameters",
    value: function reduceFormalParameters(node, _ref9) {
      var items = _ref9.items;
      var rest = _ref9.rest;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceFormalParameters", this).call(this, node, { items: items, rest: rest });
      s = s.enforceYields();
      return s;
    }
  }, {
    key: "reduceFunctionBody",
    value: function reduceFunctionBody(node, _ref10) {
      var directives = _ref10.directives;
      var statements = _ref10.statements;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceFunctionBody", this).call(this, node, { directives: directives, statements: statements });
      s = s.clearFreeReturnStatements();
      return s;
    }
  }, {
    key: "reduceFunctionDeclaration",
    value: function reduceFunctionDeclaration(node, _ref11) {
      var name = _ref11.name;
      var params = _ref11.params;
      var body = _ref11.body;

      body = node.isGenerator ? body.clearYields() : body.enforceYields();
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceFunctionDeclaration", this).call(this, node, { name: name, params: params, body: body });
      return s;
    }
  }, {
    key: "reduceFunctionExpression",
    value: function reduceFunctionExpression(node, _ref12) {
      var name = _ref12.name;
      var params = _ref12.params;
      var body = _ref12.body;

      body = node.isGenerator ? body.clearYields() : body.enforceYields();
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceFunctionExpression", this).call(this, node, { name: name, params: params, body: body });
      return s;
    }
  }, {
    key: "reduceGetter",
    value: function reduceGetter(node, _ref13) {
      var name = _ref13.name;
      var body = _ref13.body;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceGetter", this).call(this, node, { name: name, body: body.enforceYields() });
      return s;
    }
  }, {
    key: "reduceIdentifierExpression",
    value: function reduceIdentifierExpression(node) {
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceIdentifierExpression", this).call(this, node);
      if (!isValidIdentifier(node.name)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_IDENTIFIER_NAME));
      }
      return s;
    }
  }, {
    key: "reduceIfStatement",
    value: function reduceIfStatement(node, _ref14) {
      var test = _ref14.test;
      var consequent = _ref14.consequent;
      var alternate = _ref14.alternate;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceIfStatement", this).call(this, node, { test: test, consequent: consequent, alternate: alternate });
      if (isProblematicIfStatement(node)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_IF_STATEMENT));
      }
      if (node.consequent.type === 'ClassDeclaration' || node.consequent.type === 'FunctionDeclaration' && node.consequent.isGenerator || node.consequent.type === 'VariableDeclarationStatement' && (node.consequent.declaration.kind === 'let' || node.consequent.declaration.kind === 'const')) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.PROPER_DECLARATION_AS_STATEMENT));
      }
      if (node.alternate && (node.alternate.type === 'ClassDeclaration' || node.alternate.type === 'FunctionDeclaration' && node.alternate.isGenerator || node.alternate.type === 'VariableDeclarationStatement' && (node.alternate.declaration.kind === 'let' || node.alternate.declaration.kind === 'const'))) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.PROPER_DECLARATION_AS_STATEMENT));
      }
      return s;
    }
  }, {
    key: "reduceImportSpecifier",
    value: function reduceImportSpecifier(node, _ref15) {
      var binding = _ref15.binding;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceImportSpecifier", this).call(this, node, { binding: binding });
      if (node.name !== null && !isIdentifierNameES6(node.name)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_IMPORT_SPECIFIER_NAME));
      }
      return s;
    }
  }, {
    key: "reduceLabeledStatement",
    value: function reduceLabeledStatement(node, _ref16) {
      var body = _ref16.body;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceLabeledStatement", this).call(this, node, { body: body });
      if (!isValidIdentifier(node.label)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_LABEL));
      }
      s = checkIllegalBody(node, s, { allowFunctions: true });
      return s;
    }
  }, {
    key: "reduceLiteralNumericExpression",
    value: function reduceLiteralNumericExpression(node) {
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceLiteralNumericExpression", this).call(this, node);
      if (isNaN(node.value)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.LITERAL_NUMERIC_VALUE_NOT_NAN));
      }
      if (node.value < 0 || node.value == 0 && 1 / node.value < 0) {
        // second case is for -0
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.LITERAL_NUMERIC_VALUE_NOT_NEGATIVE));
      }
      if (!isNaN(node.value) && !isFinite(node.value)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.LITERAL_NUMERIC_VALUE_NOT_INFINITE));
      }
      return s;
    }
  }, {
    key: "reduceLiteralRegExpExpression",
    value: function reduceLiteralRegExpExpression(node) {
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceLiteralRegExpExpression", this).call(this, node);
      if (!isValidRegex(node.pattern, node.flags)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_REG_EX_PATTERN));
      }
      return s;
    }
  }, {
    key: "reduceMethod",
    value: function reduceMethod(node, _ref17) {
      var params = _ref17.params;
      var body = _ref17.body;
      var name = _ref17.name;

      body = node.isGenerator ? body.clearYields() : body.enforceYields();
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceMethod", this).call(this, node, { params: params, body: body, name: name });
      return s;
    }
  }, {
    key: "reduceModule",
    value: function reduceModule(node, _ref18) {
      var directives = _ref18.directives;
      var items = _ref18.items;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceModule", this).call(this, node, { directives: directives, items: items });
      s = s.enforceFreeReturnStatements();
      s = s.enforceBindingIdentifiersCalledDefault();
      s = s.enforceYields();
      return s;
    }
  }, {
    key: "reduceReturnStatement",
    value: function reduceReturnStatement(node, _ref19) {
      var expression = _ref19.expression;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceReturnStatement", this).call(this, node, { expression: expression });
      s = s.addFreeReturnStatement(node);
      return s;
    }
  }, {
    key: "reduceScript",
    value: function reduceScript(node, _ref20) {
      var directives = _ref20.directives;
      var statements = _ref20.statements;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceScript", this).call(this, node, { directives: directives, statements: statements });
      s = s.enforceFreeReturnStatements();
      s = s.enforceBindingIdentifiersCalledDefault();
      s = s.enforceYields();
      return s;
    }
  }, {
    key: "reduceSetter",
    value: function reduceSetter(node, _ref21) {
      var name = _ref21.name;
      var param = _ref21.param;
      var body = _ref21.body;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceSetter", this).call(this, node, { name: name, param: param, body: body.enforceYields() });
      return s;
    }
  }, {
    key: "reduceStaticMemberExpression",
    value: function reduceStaticMemberExpression(node, _ref22) {
      var object = _ref22.object;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceStaticMemberExpression", this).call(this, node, { object: object });
      if (!isIdentifierNameES6(node.property)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_STATIC_MEMBER_EXPRESSION_PROPERTY_NAME));
      }
      return s;
    }
  }, {
    key: "reduceTemplateElement",
    value: function reduceTemplateElement(node) {
      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceTemplateElement", this).call(this, node);
      if (!isTemplateElement(node.rawValue)) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.VALID_TEMPLATE_ELEMENT_VALUE));
      }
      return s;
    }
  }, {
    key: "reduceTemplateExpression",
    value: function reduceTemplateExpression(node, _ref23) {
      var tag = _ref23.tag;
      var elements = _ref23.elements;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceTemplateExpression", this).call(this, node, { tag: tag, elements: elements });
      if (node.elements.length > 0) {
        if (node.elements.length % 2 == 0) {
          s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.ALTERNATING_TEMPLATE_EXPRESSION_ELEMENTS));
        } else {
          node.elements.forEach(function (x, i) {
            if (i % 2 == 0) {
              if (!(x.type === 'TemplateElement')) {
                s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.ALTERNATING_TEMPLATE_EXPRESSION_ELEMENTS));
              }
            } else {
              if (x.type === 'TemplateElement') {
                s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.ALTERNATING_TEMPLATE_EXPRESSION_ELEMENTS));
              }
            }
          });
        }
      }
      return s;
    }
  }, {
    key: "reduceVariableDeclaration",
    value: function reduceVariableDeclaration(node, _ref24) {
      var declarators = _ref24.declarators;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceVariableDeclaration", this).call(this, node, { declarators: declarators });
      if (node.declarators.length == 0) {
        s = s.addError(new _validationContext.ValidationError(node, _validationErrors2.default.NOT_EMPTY_VARIABLE_DECLARATORS_LIST));
      }
      return s;
    }
  }, {
    key: "reduceWhileStatement",
    value: function reduceWhileStatement(node, _ref25) {
      var test = _ref25.test;
      var body = _ref25.body;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceWhileStatement", this).call(this, node, { test: test, body: body });
      s = checkIllegalBody(node, s);
      return s;
    }
  }, {
    key: "reduceWithStatement",
    value: function reduceWithStatement(node, _ref26) {
      var object = _ref26.object;
      var body = _ref26.body;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceWithStatement", this).call(this, node, { object: object, body: body });
      s = checkIllegalBody(node, s);
      return s;
    }
  }, {
    key: "reduceYieldExpression",
    value: function reduceYieldExpression(node, _ref27) {
      var expression = _ref27.expression;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceYieldExpression", this).call(this, node, { expression: expression });
      s = s.addYieldExpressionNotInGeneratorContext(node);
      return s;
    }
  }, {
    key: "reduceYieldGeneratorExpression",
    value: function reduceYieldGeneratorExpression(node, _ref28) {
      var expression = _ref28.expression;

      var s = _get(Object.getPrototypeOf(Validator.prototype), "reduceYieldGeneratorExpression", this).call(this, node, { expression: expression });
      s = s.addYieldGeneratorExpressionNotInGeneratorContext(node);
      return s;
    }
  }], [{
    key: "validate",
    value: function validate(node) {
      return (0, _shiftReducer2.default)(new Validator(), node).errors.concat(_shiftParser.EarlyErrorChecker.check(node));
    }
  }]);

  return Validator;
}(_shiftReducer.MonoidalReducer);
},{"./validation-context":79,"./validation-errors":80,"esutils":84,"shift-parser":70,"shift-reducer":76}],79:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = exports.ValidationContext = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright 2016 Shape Security, Inc.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Licensed under the Apache License, Version 2.0 (the "License")
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * you may not use this file except in compliance with the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * You may obtain a copy of the License at
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *     http://www.apache.org/licenses/LICENSE-2.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Unless required by applicable law or agreed to in writing, software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * distributed under the License is distributed on an "AS IS" BASIS,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * See the License for the specific language governing permissions and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * limitations under the License.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _validationErrors = require("./validation-errors");

var _validationErrors2 = _interopRequireDefault(_validationErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ValidationContext = exports.ValidationContext = function () {
  function ValidationContext() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$errors = _ref.errors;
    var errors = _ref$errors === undefined ? [] : _ref$errors;
    var _ref$freeReturnStatem = _ref.freeReturnStatements;
    var freeReturnStatements = _ref$freeReturnStatem === undefined ? [] : _ref$freeReturnStatem;
    var _ref$bindingIdentifie = _ref.bindingIdentifiersCalledDefault;
    var bindingIdentifiersCalledDefault = _ref$bindingIdentifie === undefined ? [] : _ref$bindingIdentifie;
    var _ref$yieldExpressions = _ref.yieldExpressionsNotInGeneratorContext;
    var yieldExpressionsNotInGeneratorContext = _ref$yieldExpressions === undefined ? [] : _ref$yieldExpressions;
    var _ref$yieldGeneratorEx = _ref.yieldGeneratorExpressionsNotInGeneratorContext;
    var yieldGeneratorExpressionsNotInGeneratorContext = _ref$yieldGeneratorEx === undefined ? [] : _ref$yieldGeneratorEx;

    _classCallCheck(this, ValidationContext);

    this.errors = errors;
    this.freeReturnStatements = freeReturnStatements;
    this.bindingIdentifiersCalledDefault = bindingIdentifiersCalledDefault;
    this.yieldExpressionsNotInGeneratorContext = yieldExpressionsNotInGeneratorContext;
    this.yieldGeneratorExpressionsNotInGeneratorContext = yieldGeneratorExpressionsNotInGeneratorContext;
  }

  _createClass(ValidationContext, [{
    key: "concat",
    value: function concat(b) {
      return new ValidationContext({
        errors: this.errors.concat(b.errors),
        freeReturnStatements: this.freeReturnStatements.concat(b.freeReturnStatements),
        bindingIdentifiersCalledDefault: this.bindingIdentifiersCalledDefault.concat(b.bindingIdentifiersCalledDefault),
        yieldExpressionsNotInGeneratorContext: this.yieldExpressionsNotInGeneratorContext.concat(b.yieldExpressionsNotInGeneratorContext),
        yieldGeneratorExpressionsNotInGeneratorContext: this.yieldGeneratorExpressionsNotInGeneratorContext.concat(b.yieldGeneratorExpressionsNotInGeneratorContext)
      });
    }
  }, {
    key: "addError",
    value: function addError(e) {
      var s = new ValidationContext(this);
      s.errors = s.errors.concat([e]);
      return s;
    }
  }, {
    key: "addFreeReturnStatement",
    value: function addFreeReturnStatement(r) {
      var s = new ValidationContext(this);
      s.freeReturnStatements = s.freeReturnStatements.concat([r]);
      return s;
    }
  }, {
    key: "enforceFreeReturnStatements",
    value: function enforceFreeReturnStatements() {
      var errors = [];
      this.freeReturnStatements.forEach(function (r) {
        return errors.push(new ValidationError(r, _validationErrors2.default.RETURN_STATEMENT_IN_FUNCTION_BODY));
      });
      var s = new ValidationContext(this);
      s.errors = s.errors.concat(errors);
      s.freeReturnStatements = [];
      return s;
    }
  }, {
    key: "clearFreeReturnStatements",
    value: function clearFreeReturnStatements() {
      var s = new ValidationContext(this);
      s.freeReturnStatements = [];
      return s;
    }
  }, {
    key: "addBindingIdentifierCalledDefault",
    value: function addBindingIdentifierCalledDefault(b) {
      var s = new ValidationContext(this);
      s.bindingIdentifiersCalledDefault = s.bindingIdentifiersCalledDefault.concat([b]);
      return s;
    }
  }, {
    key: "enforceBindingIdentifiersCalledDefault",
    value: function enforceBindingIdentifiersCalledDefault() {
      var errors = [];
      this.bindingIdentifiersCalledDefault.forEach(function (r) {
        return errors.push(new ValidationError(r, _validationErrors2.default.BINDING_IDENTIFIERS_CALLED_DEFAULT));
      });
      var s = new ValidationContext(this);
      s.errors = s.errors.concat(errors);
      s.bindingIdentifiersCalledDefault = [];
      return s;
    }
  }, {
    key: "clearBindingIdentifiersCalledDefault",
    value: function clearBindingIdentifiersCalledDefault() {
      var s = new ValidationContext(this);
      s.bindingIdentifiersCalledDefault = [];
      return s;
    }
  }, {
    key: "addYieldExpressionNotInGeneratorContext",
    value: function addYieldExpressionNotInGeneratorContext(e) {
      var s = new ValidationContext(this);
      s.yieldExpressionsNotInGeneratorContext = s.yieldExpressionsNotInGeneratorContext.concat([e]);
      return s;
    }
  }, {
    key: "enforceYieldExpressionsNotInGeneratorContext",
    value: function enforceYieldExpressionsNotInGeneratorContext() {
      var errors = [];
      this.yieldExpressionsNotInGeneratorContext.forEach(function (r) {
        return errors.push(new ValidationError(r, _validationErrors2.default.VALID_YIELD_EXPRESSION_POSITION));
      });
      var s = new ValidationContext(this);
      s.errors = s.errors.concat(errors);
      s.yieldExpressionsNotInGeneratorContext = [];
      return s;
    }
  }, {
    key: "clearYieldExpressionsNotInGeneratorContext",
    value: function clearYieldExpressionsNotInGeneratorContext() {
      var s = new ValidationContext(this);
      s.yieldExpressionsNotInGeneratorContext = [];
      return s;
    }
  }, {
    key: "addYieldGeneratorExpressionNotInGeneratorContext",
    value: function addYieldGeneratorExpressionNotInGeneratorContext(e) {
      var s = new ValidationContext(this);
      s.yieldGeneratorExpressionsNotInGeneratorContext = s.yieldGeneratorExpressionsNotInGeneratorContext.concat([e]);
      return s;
    }
  }, {
    key: "enforceYieldGeneratorExpressionsNotInGeneratorContext",
    value: function enforceYieldGeneratorExpressionsNotInGeneratorContext() {
      var errors = [];
      this.yieldGeneratorExpressionsNotInGeneratorContext.forEach(function (r) {
        return errors.push(new ValidationError(r, _validationErrors2.default.VALID_YIELD_GENERATOR_EXPRESSION_POSITION));
      });
      var s = new ValidationContext(this);
      s.errors = s.errors.concat(errors);
      s.yieldGeneratorExpressionsNotInGeneratorContext = [];
      return s;
    }
  }, {
    key: "clearYieldGeneratorExpressionsNotInGeneratorContext",
    value: function clearYieldGeneratorExpressionsNotInGeneratorContext() {
      var s = new ValidationContext(this);
      s.yieldGeneratorExpressionsNotInGeneratorContext = [];
      return s;
    }
  }, {
    key: "enforceYields",
    value: function enforceYields() {
      return this.enforceYieldExpressionsNotInGeneratorContext().enforceYieldGeneratorExpressionsNotInGeneratorContext();
    }
  }, {
    key: "clearYields",
    value: function clearYields() {
      return this.clearYieldExpressionsNotInGeneratorContext().clearYieldGeneratorExpressionsNotInGeneratorContext();
    }
  }], [{
    key: "empty",
    value: function empty() {
      return new ValidationContext();
    }
  }]);

  return ValidationContext;
}();

var ValidationError = exports.ValidationError = function (_Error) {
  _inherits(ValidationError, _Error);

  function ValidationError(node, message) {
    _classCallCheck(this, ValidationError);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ValidationError).call(this));

    _this.node = node;
    _this.message = message;
    return _this;
  }

  return ValidationError;
}(Error);
},{"./validation-errors":80}],80:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Copyright 2016 Shape Security, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

exports.default = {
  VALID_BINDING_IDENTIFIER_NAME: "The name field of BindingIdentifier must be a valid identifier name",
  VALID_BREAK_STATEMENT_LABEL: "The label field of BreakStatement exists and must be a valid identifier name",
  VALID_CONTINUE_STATEMENT_LABEL: "The label field of ContinueStatement exists and must be a valid identifier name",
  VALID_DIRECTIVE: "The raw value field of Directive must either be an empty string, or match the ES6 grammar production DoubleStringCharacter or SingleStringCharacter",
  VALID_EXPORT_SPECIFIER_NAME: "The name field of ExportSpecifier exists and must be a valid identifier name",
  VALID_EXPORTED_NAME: "The exported name field of ExportSpecifier must be a valid identifier name",
  ONE_VARIABLE_DECLARATOR_IN_FOR_IN: "VariableDeclaration in ForInStatement can only have one VariableDeclarator",
  NO_INIT_IN_VARIABLE_DECLARATOR_IN_FOR_IN: "The VariableDeclarator in ForInStatement should not have an initializer",
  ONE_VARIABLE_DECLARATOR_IN_FOR_OF: "VariableDeclaration in ForOfStatement can only have one VariableDeclarator",
  NO_INIT_IN_VARIABLE_DECLARATOR_IN_FOR_OF: "The VariableDeclarator in ForOfStatement should not have an initializer",
  VALID_IDENTIFIER_NAME: "The name field of IdentifierExpression must be a valid identifier name",
  VALID_IF_STATEMENT: "IfStatement with null 'alternate' must not be the 'consequent' of an IfStatement with a non-null 'alternate'",
  VALID_IMPORT_SPECIFIER_NAME: "The name field of ImportSpecifier exists and must be a valid identifier name",
  VALID_LABEL: "The label field of LabeledStatement must be a valid identifier name",
  LITERAL_NUMERIC_VALUE_NOT_NAN: "The value field of LiteralNumericExpression must not be NaN",
  LITERAL_NUMERIC_VALUE_NOT_NEGATIVE: "The value field of LiteralNumericExpression must be non-negative",
  LITERAL_NUMERIC_VALUE_NOT_INFINITE: "The value field of LiteralNumericExpression must be finite",
  VALID_REG_EX_PATTERN: "pattern field of LiteralRegExpExpression must match the ES6 grammar production Pattern (21.2.1)",
  VALID_REG_EX_FLAG: "flags field of LiteralRegExpExpression must not contain characters other than 'g', 'i', 'm', 'u', or 'y'",
  NO_DUPLICATE_REG_EX_FLAG: "flags field of LiteralRegExpExpression must not contain duplicate flag characters",
  RETURN_STATEMENT_IN_FUNCTION_BODY: "ReturnStatement must be within a FunctionBody",
  BINDING_IDENTIFIERS_CALLED_DEFAULT: "BindingIdentifier may only be called \"*default*\" within a FunctionDeclaration or ClassDeclaration",
  VALID_YIELD_EXPRESSION_POSITION: "YieldExpression is only allowed within a generator function or method",
  VALID_YIELD_GENERATOR_EXPRESSION_POSITION: "YieldGeneratorExpression is only allowed within a generator function or method",
  VALID_STATIC_MEMBER_EXPRESSION_PROPERTY_NAME: "The property field of StaticMemberExpression must be a valid identifier name",
  VALID_TEMPLATE_ELEMENT_VALUE: "The raw value field of TemplateElement must match the ES6 grammar production TemplateCharacters",
  ALTERNATING_TEMPLATE_EXPRESSION_ELEMENTS: "The elements field of TemplateExpression must be an alternating list of TemplateElement and Expression, starting and ending with a TemplateElement",
  NOT_EMPTY_VARIABLE_DECLARATORS_LIST: "The declarators field in VariableDeclaration must not be an empty list",
  CONST_VARIABLE_DECLARATION_MUST_HAVE_INIT: "VariableDeclarationStatements with a VariableDeclaration of kind const cannot have a VariableDeclarator with no initializer",
  FUNCTION_DECLARATION_AS_STATEMENT: "Function declarations may not be the body of a WithStatement or loop",
  PROPER_DECLARATION_AS_STATEMENT: "Class, generator function, and let/const declarations may not be the consequent or alternate of an IfStatement or the body of a LabeledStatement, WithStatement, or loop"
};
},{}],81:[function(require,module,exports){
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    function isExpression(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'ArrayExpression':
            case 'AssignmentExpression':
            case 'BinaryExpression':
            case 'CallExpression':
            case 'ConditionalExpression':
            case 'FunctionExpression':
            case 'Identifier':
            case 'Literal':
            case 'LogicalExpression':
            case 'MemberExpression':
            case 'NewExpression':
            case 'ObjectExpression':
            case 'SequenceExpression':
            case 'ThisExpression':
            case 'UnaryExpression':
            case 'UpdateExpression':
                return true;
        }
        return false;
    }

    function isIterationStatement(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'DoWhileStatement':
            case 'ForInStatement':
            case 'ForStatement':
            case 'WhileStatement':
                return true;
        }
        return false;
    }

    function isStatement(node) {
        if (node == null) { return false; }
        switch (node.type) {
            case 'BlockStatement':
            case 'BreakStatement':
            case 'ContinueStatement':
            case 'DebuggerStatement':
            case 'DoWhileStatement':
            case 'EmptyStatement':
            case 'ExpressionStatement':
            case 'ForInStatement':
            case 'ForStatement':
            case 'IfStatement':
            case 'LabeledStatement':
            case 'ReturnStatement':
            case 'SwitchStatement':
            case 'ThrowStatement':
            case 'TryStatement':
            case 'VariableDeclaration':
            case 'WhileStatement':
            case 'WithStatement':
                return true;
        }
        return false;
    }

    function isSourceElement(node) {
      return isStatement(node) || node != null && node.type === 'FunctionDeclaration';
    }

    function trailingStatement(node) {
        switch (node.type) {
        case 'IfStatement':
            if (node.alternate != null) {
                return node.alternate;
            }
            return node.consequent;

        case 'LabeledStatement':
        case 'ForStatement':
        case 'ForInStatement':
        case 'WhileStatement':
        case 'WithStatement':
            return node.body;
        }
        return null;
    }

    function isProblematicIfStatement(node) {
        var current;

        if (node.type !== 'IfStatement') {
            return false;
        }
        if (node.alternate == null) {
            return false;
        }
        current = node.consequent;
        do {
            if (current.type === 'IfStatement') {
                if (current.alternate == null)  {
                    return true;
                }
            }
            current = trailingStatement(current);
        } while (current);

        return false;
    }

    module.exports = {
        isExpression: isExpression,
        isStatement: isStatement,
        isIterationStatement: isIterationStatement,
        isSourceElement: isSourceElement,
        isProblematicIfStatement: isProblematicIfStatement,

        trailingStatement: trailingStatement
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{}],82:[function(require,module,exports){
/*
  Copyright (C) 2013-2014 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch;

    // See `tools/generate-identifier-regex.js`.
    ES5Regex = {
        // ECMAScript 5.1/Unicode v7.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        // ECMAScript 5.1/Unicode v7.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
    };

    ES6Regex = {
        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/,
        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
    };

    function isDecimalDigit(ch) {
        return 0x30 <= ch && ch <= 0x39;  // 0..9
    }

    function isHexDigit(ch) {
        return 0x30 <= ch && ch <= 0x39 ||  // 0..9
            0x61 <= ch && ch <= 0x66 ||     // a..f
            0x41 <= ch && ch <= 0x46;       // A..F
    }

    function isOctalDigit(ch) {
        return ch >= 0x30 && ch <= 0x37;  // 0..7
    }

    // 7.2 White Space

    NON_ASCII_WHITESPACES = [
        0x1680, 0x180E,
        0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
        0x202F, 0x205F,
        0x3000,
        0xFEFF
    ];

    function isWhiteSpace(ch) {
        return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 ||
            ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
    }

    // 7.6 Identifier Names and Identifiers

    function fromCodePoint(cp) {
        if (cp <= 0xFFFF) { return String.fromCharCode(cp); }
        var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
        var cu2 = String.fromCharCode(((cp - 0x10000) % 0x400) + 0xDC00);
        return cu1 + cu2;
    }

    IDENTIFIER_START = new Array(0x80);
    for(ch = 0; ch < 0x80; ++ch) {
        IDENTIFIER_START[ch] =
            ch >= 0x61 && ch <= 0x7A ||  // a..z
            ch >= 0x41 && ch <= 0x5A ||  // A..Z
            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
    }

    IDENTIFIER_PART = new Array(0x80);
    for(ch = 0; ch < 0x80; ++ch) {
        IDENTIFIER_PART[ch] =
            ch >= 0x61 && ch <= 0x7A ||  // a..z
            ch >= 0x41 && ch <= 0x5A ||  // A..Z
            ch >= 0x30 && ch <= 0x39 ||  // 0..9
            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
    }

    function isIdentifierStartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }

    function isIdentifierPartES5(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }

    function isIdentifierStartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_START[ch] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
    }

    function isIdentifierPartES6(ch) {
        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
    }

    module.exports = {
        isDecimalDigit: isDecimalDigit,
        isHexDigit: isHexDigit,
        isOctalDigit: isOctalDigit,
        isWhiteSpace: isWhiteSpace,
        isLineTerminator: isLineTerminator,
        isIdentifierStartES5: isIdentifierStartES5,
        isIdentifierPartES5: isIdentifierPartES5,
        isIdentifierStartES6: isIdentifierStartES6,
        isIdentifierPartES6: isIdentifierPartES6
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{}],83:[function(require,module,exports){
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    var code = require('./code');

    function isStrictModeReservedWordES6(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isKeywordES5(id, strict) {
        // yield should not be treated as keyword under non-strict mode.
        if (!strict && id === 'yield') {
            return false;
        }
        return isKeywordES6(id, strict);
    }

    function isKeywordES6(id, strict) {
        if (strict && isStrictModeReservedWordES6(id)) {
            return true;
        }

        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    function isReservedWordES5(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES5(id, strict);
    }

    function isReservedWordES6(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES6(id, strict);
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    function isIdentifierNameES5(id) {
        var i, iz, ch;

        if (id.length === 0) { return false; }

        ch = id.charCodeAt(0);
        if (!code.isIdentifierStartES5(ch)) {
            return false;
        }

        for (i = 1, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (!code.isIdentifierPartES5(ch)) {
                return false;
            }
        }
        return true;
    }

    function decodeUtf16(lead, trail) {
        return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
    }

    function isIdentifierNameES6(id) {
        var i, iz, ch, lowCh, check;

        if (id.length === 0) { return false; }

        check = code.isIdentifierStartES6;
        for (i = 0, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (0xD800 <= ch && ch <= 0xDBFF) {
                ++i;
                if (i >= iz) { return false; }
                lowCh = id.charCodeAt(i);
                if (!(0xDC00 <= lowCh && lowCh <= 0xDFFF)) {
                    return false;
                }
                ch = decodeUtf16(ch, lowCh);
            }
            if (!check(ch)) {
                return false;
            }
            check = code.isIdentifierPartES6;
        }
        return true;
    }

    function isIdentifierES5(id, strict) {
        return isIdentifierNameES5(id) && !isReservedWordES5(id, strict);
    }

    function isIdentifierES6(id, strict) {
        return isIdentifierNameES6(id) && !isReservedWordES6(id, strict);
    }

    module.exports = {
        isKeywordES5: isKeywordES5,
        isKeywordES6: isKeywordES6,
        isReservedWordES5: isReservedWordES5,
        isReservedWordES6: isReservedWordES6,
        isRestrictedWord: isRestrictedWord,
        isIdentifierNameES5: isIdentifierNameES5,
        isIdentifierNameES6: isIdentifierNameES6,
        isIdentifierES5: isIdentifierES5,
        isIdentifierES6: isIdentifierES6
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{"./code":82}],84:[function(require,module,exports){
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


(function () {
    'use strict';

    exports.ast = require('./ast');
    exports.code = require('./code');
    exports.keyword = require('./keyword');
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{"./ast":81,"./code":82,"./keyword":83}]},{},[1]);
