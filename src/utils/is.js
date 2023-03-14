/**
 * Check if the value is a boolean.
 * @param {*} value
 * @returns {boolean}
 */
function isBoolean(value){
    return value != null && '[object Boolean]' === Object.prototype.toString.call(value);
}

/**
 * Check if the value is a function.
 * @param {*} value
 * @returns {boolean}
 */
function isFunction(value){
    return value != null && (Object.prototype.toString.call(value) === "[object Function]" || typeof value === "function" || value instanceof Function);
}

/**
 * Check if the value is a number.
 * @param {*} value
 * @returns {boolean}
 */
function isNumber(value){
    return value != null && '[object Number]' === Object.prototype.toString.call(value) && !isNaN(value);
}

/**
 * Check if the value is an object.
 * @param {*} value
 * @returns {boolean}
 */
function isObject(value){
    return value != null && typeof value === "object";
}

/**
 * Check if the value is a plain object.
 * @param {*} value
 * @returns {boolean}
 */
function isPlainObject(value){
    if (isObject(value)){
        const proto = Object.getPrototypeOf(value);
        return proto === Object.prototype || proto === null;
    }
    return false;
}

/**
 * Check if the value is a promise.
 * @param {*} value
 * @returns {boolean}
 */
function isPromise(value){
    return value != null && value instanceof Promise;
}

/**
 * Check if the value is a string.
 * @param {*} value
 * @returns {boolean}
 */
function isString(value){
    return value != null && '[object String]' === Object.prototype.toString.call(value);
}

const isEmptyString = /^\s*$/;
/**
 * Check if the value is a string and is not empty.
 * @param {*} value
 * @returns {boolean}
 */
function isStringNotEmpty(value){
    return isString(value) && !isEmptyString.test(value);
}

/**
 * Check if the value is a undefined.
 * @param {*} value
 * @returns {boolean}
 */
function isUndefined(value){
    return typeof value === "undefined";
}

export {
    isBoolean,
    isFunction,
    isNumber,
    isObject,
    isPlainObject,
    isPromise,
    isString,
    isStringNotEmpty,
    isUndefined
};