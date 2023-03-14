import {isStringNotEmpty} from "./is";

/**
 * If the value is a string it is returned, if it's a string array the values are joined using a comma, otherwise null is returned.
 * @param {*} value
 * @returns {?string}
 */
function makeSelector(value){
    if (isStringNotEmpty(value)) {
        return value;
    }
    if (Array.isArray(value) && value.length) {
        const result = value.filter((val) => isStringNotEmpty(val)).join(",");
        return isStringNotEmpty(result) ? result : null;
    }
    return null;
}

export default makeSelector;