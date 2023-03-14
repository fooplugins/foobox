/**
 * Check if the target starts with the value.
 * @param {string} target
 * @param {string} value
 * @returns {boolean}
 */
function startsWith(target, value){
    return target.slice(0, value.length) === value;
}

/**
 * Check if the target ends with the value.
 * @param {string} target
 * @param {string} value
 * @returns {boolean}
 */
function endsWith(target, value){
    return target.slice(-value.length) === value;
}

/**
 * Convert the target to camel case.
 * @param {string} target
 * @returns {string}
 */
function camelCase(target){
    // if the string is all caps just return it lower cased
    if (target.toLocaleUpperCase() === target) return target.toLocaleLowerCase();
    // otherwise match all capitals or other separator chars and perform a replacement
    return target.replace(/^([A-Z])|[-\s_]+(\w)/g, function (match, p1, p2) {
        if (p2 != null) return p2.toLocaleUpperCase();
        return p1.toLocaleLowerCase();
    });
}

export {
    startsWith,
    endsWith,
    camelCase
};