/**
 *
 * @param {function} callback
 * @param {...*} [args]
 * @returns {Promise<*>}
 */
async function doCallback(callback, ...args){
    return new Promise((resolve) => {
        setTimeout(()=>{
            resolve(callback(...args));
        }, 0);
    });
}

/**
 *
 * @param callback
 */
function enqueue(callback){
    setTimeout(callback, 0);
}

/**
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @param {function(T)} callback
 * @returns {Promise<void>}
 */
async function asyncForEach(iterable, callback){
    for (const i of iterable){
        await doCallback(callback, i);
    }
}

export {
    enqueue,
    asyncForEach
};