import {isPromise} from "./is.js";
let promise = null;
/**
 * Returns a promise that is resolved once the DOMContentLoaded event has been fired. Multiple calls to this method will return the same promise.
 * @returns {Promise}
 */
function domReady(){
    if (!isPromise(promise)){
        promise = new Promise((resolved) => {
            setTimeout(()=>{
                if (document.readyState !== "loading") resolved();
                else document.addEventListener('DOMContentLoaded', resolved, false);
            }, 0);
        });
    }
    return promise;
}

export default domReady;