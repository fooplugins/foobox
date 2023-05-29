import { isObject, isPlainObject, isStringNotEmpty, isUndefined } from "./is";

function hasProperty(target, propertyName){
    if (isPlainObject(target) && isStringNotEmpty(propertyName)){
        if (propertyName.indexOf(".") !== -1){
            const names = propertyName.split("."), length = names.length, last = length - 1;
            let index = 0, currentTarget = target;
            for (; index < length; index++){
                const name = names[index];
                if (index === last){
                    return currentTarget.hasOwnProperty(name);
                } else if (isPlainObject(currentTarget[name])) {
                    currentTarget = currentTarget[name];
                } else {
                    return false;
                }
            }
        } else {
            return target.hasOwnProperty(propertyName);
        }
    }
    return false;
}

/**
 * Remove a property from an object.
 * @param {object} target
 * @param {string} propertyName
 */
function removeProperty(target, propertyName){
    if (isPlainObject(target) && isStringNotEmpty(propertyName)){
        if (propertyName.indexOf(".") !== -1){
            const names = propertyName.split("."), length = names.length, last = length - 1;
            let index = 0, currentTarget = target;
            for (; index < length; index++){
                const name = names[index];
                if (index === last){
                    delete currentTarget[name];
                } else if (isPlainObject(currentTarget[name])) {
                    currentTarget = currentTarget[name];
                }
            }
        } else {
            delete target[propertyName];
        }
    }
}

/**
 * Get the value of a property from an object.
 * @param {object} target
 * @param {string} propertyName
 * @param {*} [defaultValue]
 * @returns {*}
 */
function getProperty(target, propertyName, defaultValue){
    if (isPlainObject(target) && isStringNotEmpty(propertyName)){
        if (propertyName.indexOf(".") !== -1){
            const names = propertyName.split("."), length = names.length, last = length - 1;
            let index = 0, currentTarget = target;
            for (; index < length; index++){
                const name = names[index];
                if (index === last){
                    if (currentTarget.hasOwnProperty(name)){
                        return currentTarget[name];
                    }
                } else if (isPlainObject(currentTarget[name])) {
                    currentTarget = currentTarget[name];
                } else {
                    break;
                }
            }

        } else if (target.hasOwnProperty(propertyName)){
            return target[propertyName];
        }
    }
    return defaultValue;
}

/**
 * Set the value of a property in an object.
 * @param {object} target
 * @param {string} propertyName
 * @param {*} value
 * @returns {boolean}
 */
function setProperty(target, propertyName, value){
    if (isPlainObject(target) && isStringNotEmpty(propertyName) && !isUndefined(value)){
        if (propertyName.indexOf(".") !== -1){
            const names = propertyName.split("."), length = names.length, last = length - 1;
            let index = 0, currentTarget = target;
            for (; index < length; index++){
                const name = names[index];
                if (index === last){
                    currentTarget[name] = value;
                    return true;
                } else if (isPlainObject(currentTarget[name])) {
                    currentTarget = currentTarget[name];
                } else if (isUndefined(currentTarget[name])) {
                    currentTarget = currentTarget[name] = {};
                } else {
                    break;
                }
            }
        } else {
            target[propertyName] = value;
            return true;
        }
    }
    return false;
}

/**
 * Merge the properties of the source object into the target object replacing existing values.
 * @param {object} target - The object that will receive the properties.
 * @param {object} source - The object to extract properties from.
 * @returns {object}
 */
function merge(target, source) {
    target = isPlainObject(target) ? target : {};
    if (isPlainObject(target) && isPlainObject(source)){
        objForEach(source, (key, value) => {
            if (isPlainObject(value)){
                // if the source value is an object, merge it into the target key
                target[key] = merge(target[key], value);
            } else if (Array.isArray(value)){
                // if the source value is an array, replace the target key with a shallow copy of it
                target[key] = value.slice();
            } else {
                // otherwise replace the target key with the source value
                target[key] = value;
            }
        });
    }
    // always return the original target object
    return target;
}

/**
 * Merge the properties of all source objects into the target object replacing existing values.
 * @param {object} target
 * @param {...object} sources
 * @returns {object}
 */
function extend(target, ...sources) {
    target = isPlainObject(target) ? target : {};
    return sources.reduce((result, source) => merge(result, source), target);
}

/**
 * Merge the properties of the source object into the target object if they do not exist.
 * @param {object} target - The object that will receive the properties.
 * @param {object} source - The object to extract properties from.
 * @returns {object}
 */
function mergeMissing(target, source){
    target = isPlainObject(target) ? target : {};
    if (isPlainObject(source)){
        objForEach(source, (key, value) => {
            const missing = !target.hasOwnProperty(key);
            if (isPlainObject(value)){ // if the source value is an object
                if (isPlainObject(target[key])){ // and the target key is an object, merge the missing source properties
                    target[key] = mergeMissing(target[key], value);
                } else if (missing) { // otherwise if its missing, set the target key to the source value
                    target[key] = merge({}, value);
                }
            } else if (missing) {
                // if its just missing and not a special case, set the target key with the missing source value
                target[key] = value;
            }
        });
    }
    // always return the original target object
    return target;
}

/**
 * Merge the properties of all source objects into the target object if they do not exist.
 * @param {object} target
 * @param {...object} sources
 * @returns {object}
 */
function defaults(target, ...sources){
    target = isPlainObject(target) ? target : {};
    return sources.reduce((result, source) => mergeMissing(result, source), target);
}

/**
 * @callback objForEach~callback
 * @param {string} key
 * @param {*} value
 */

/**
 * Iterates all keys of the target and executes the callback for each supplying the current key and value.
 * @param {object} target - The target object to iterate.
 * @param {objForEach~callback} callback - The callback to execute.
 */
function objForEach(target, callback){
    if ( !isObject( target ) ) return;
    Object.keys(target).forEach((key) => {
        callback.call(this, key, target[key]);
    });
}

/**
 * A "reducer" function that can take up to four arguments.
 * @callback objReduce~callback
 * @template T
 * @param {T} previousValue - The value resulting from the previous call to the callback.
 * @param {*} value - The value of the current key.
 * @param {string} [key] - The current key of the object.
 * @param {object} [object] - The object being iterated.
 * @returns {T}
 */
/**
 * The objReduce() method executes a user-supplied “reducer” callback function on each key~value pair of the target object,
 * passing in the return value from the calculation on the preceding pair. The final result of running the reducer across
 * all key~value pairs of the target object is a single value.
 * @template T
 * @param {object} target - The object to reduce.
 * @param {objReduce~callback<T>} callbackFn - A "reducer" function that takes four arguments.
 * @param {T} [initialValue] - A value to which "previousValue" is initialized the first time the callback is called.
 * @returns {T} The value that results from running the “reducer” callback function to completion over the entire object.
 */
function objReduce(target, callbackFn, initialValue){
    return isObject( target ) ? Object.keys(target).reduce((previousValue, key) => {
        return callbackFn.call(this, previousValue, target[key], key);
    }, initialValue) : initialValue;
}

export {
    objForEach,
    objReduce,
    hasProperty,
    removeProperty,
    getProperty,
    setProperty,
    merge,
    extend,
    mergeMissing,
    defaults
};