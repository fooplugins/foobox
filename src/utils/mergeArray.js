import {isFunction} from "./is";

/**
 * @template T
 * @param {Array<T>} target
 * @param {Array<T>} source
 * @param {function(T, T):boolean} [equalityComparer]
 * @returns {Array<T>}
 */
function mergeArray(target, source, equalityComparer){
    if (isFunction(equalityComparer)){
        return [...target, ...source.filter((sourceValue) => !target.some((targetValue) => equalityComparer(targetValue, sourceValue)))];
    }
    return [...target, ...source.filter((targetValue) => !target.includes(targetValue))];
}

export default mergeArray;