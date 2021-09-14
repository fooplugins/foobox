(function ($, _, _utils, _is, _fn, _str, _obj) {

    /**
     * @summary A string array of supported EXIF properties.
     * @memberof FooBox.
     * @name supportedExifProperties
     * @type {string[]}
     */
    _.supportedExifProperties = ["camera","aperture","created_timestamp","shutter_speed","focal_length","iso","orientation"];

    /**
     * @memberof FooBox.utils.is.
     * @function exif
     * @param {*} value - The value to check.
     * @returns {boolean} `true` if the `value` contains any supported and valid EXIF properties.
     */
    _is.exif = function(value){
        if (_is.object(value)){
            const keys = Object.keys(value);
            return keys.length > 0 && keys.some(function(key){
                return _.supportedExifProperties.indexOf(key) !== -1 && !_is.empty(value[key]);
            });
        }
        return false;
    };

    /**
     * @summary Checks if the supplied element matches the specified selector.
     * @memberof FooBox.utils.is.
     * @function selector
     * @param {Element} element - The element to check.
     * @param {string} selector - The CSS selector to match.
     * @returns {boolean} `true` if the element matches the selector.
     */
    _is.selector = function(element, selector){
        if (element.matches) return element.matches(selector);
        if (element.webkitMatchesSelector) return element.webkitMatchesSelector(selector);
        return false;
    };

    /**
     * @summary Checks if the element or any of its' parents match the supplied selector.
     * @memberof FooBox.utils.is.
     * @function selectorOrChildOf
     * @param {Element} element - The element to check.
     * @param {string} selector - The CSS selector to match.
     * @returns {boolean|*}
     */
    _is.selectorOrChildOf = function(element, selector){
        if (_is.selector(element, selector)) return true;
        if (element.parentElement) return _is.selectorOrChildOf(element.parentElement, selector);
        return false;
    }

    /**
     * @summary Trims the value if it exceeds the specified length and appends the suffix.
     * @memberof FooBox.utils.str.
     * @function trimTo
     * @param {string} value - The value to trim if required.
     * @param {number} length - The length to trim the string to.
     * @param {string} [suffix="&hellip;"] - The suffix to append to a trimmed value.
     * @returns {string|null}
     */
    _str.trimTo = function(value, length, suffix){
        if (_is.string(value) && _is.number(length) && length > 0 && value.length > length) {
            return value.substr(0, length) + (_is.string(suffix) ? suffix : "&hellip;");
        }
        return value;
    };

    /**
     * @summary Converts an iterable object into a proper Array.
     * @memberof FooBox.utils.
     * @function toArray
     * @param {Iterable.<T>} iterable
     * @returns {T[]}
     * @template T
     */
    _utils.toArray = function(iterable){
        return Array.prototype.slice.call(iterable);
    };

    /**
     * @typedef {Object} ResizeObserverSize
     * @property {number} inlineSize
     * @property {number} blockSize
     * @property {number} width
     * @property {number} height
     */
    /**
     * @typedef {Object} ResizeObserverEntry
     * @property {ResizeObserverSize|Array<ResizeObserverSize>|undefined} contentBoxSize
     * @property {DOMRect} contentRect
     */
    /**
     * @summary Gets the width and height from the ResizeObserverEntry
     * @memberof FooBox.utils.
     * @function getResizeObserverSize
     * @param {ResizeObserverEntry} entry - The entry to retrieve the size from.
     * @returns {{width: Number,height: Number}}
     */
    _utils.getResizeObserverSize = function(entry){
        let width, height;
        if(entry.contentBoxSize) {
            // Checking for chrome as using a non-standard array
            if (entry.contentBoxSize[0]) {
                width = entry.contentBoxSize[0].inlineSize;
                height = entry.contentBoxSize[0].blockSize;
            } else {
                width = entry.contentBoxSize.inlineSize;
                height = entry.contentBoxSize.blockSize;
            }
        } else {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
        }
        return {
            width: width,
            height: height
        };
    };

    /**
     * Returns an object containing the computed width and height for the supplied element.
     * @memberof FooBox.utils.
     * @function getElementSize
     * @param {Element} element - The element for which to retrieve the computed size.
     * @param {string|null} [pseudoElt] - A string specifying the pseudo-element to match. Omitted (or null) for real elements.
     * @returns {{width: String,height: String}}
     */
    _utils.getElementSize = function(element, pseudoElt){
        let width = '0', height = '0';
        if (element instanceof Element){
            if (!_is.string(pseudoElt)) pseudoElt = null;
            const cs = getComputedStyle(element, pseudoElt);
            width = cs.width;
            height = cs.height;
        }
        return {
            width: width,
            height: height
        };
    };

    /**
     * @summary Returns a JSON object created from an attributes encoded JSON string value.
     * @memberof FooBox.utils.
     * @function getJsonAttribute
     * @param {Element} element - The element to retrieve the value from.
     * @param {string} qualifiedName - The fully qualified attribute name to retrieve the value from.
     * @param {Object} [defaults] - An optional object containing default values for the return value.
     * @returns {Object} Returns a JSON object created from an attributes encoded JSON string value.
     */
    _utils.getJsonAttribute = function(element, qualifiedName, defaults){
        const jsonString = element.getAttribute(qualifiedName) || null;
        if (_is.string(jsonString)){
            try {
                return _obj.extend({}, defaults, JSON.parse(jsonString));
            } catch (err){
                console.debug("Error parsing '" + qualifiedName + "' attribute.", {"json": jsonString, "error": err});
            }
        }
        return _obj.extend({}, defaults);
    };

    /**
     * @summary Toggles CSS classes on an element.
     * @memberof FooBox.utils.
     * @function toggleClass
     * @param {HTMLElement} element - The element to modify.
     * @param {string|string[]} classes - A space seperated string or an array of space separated strings.
     * @param {boolean} [state] - A boolean value specifying whether to add or remove the supplied classes.
     */
    _utils.toggleClass = function(element, classes, state){
        const applyClasses = function(className){
            if (_is.boolean(state) ? state : !element.classList.contains(className)){
                element.classList.add(className);
            } else {
                element.classList.remove(className);
            }
        };
        if (_is.string(classes)){
            classes.split(" ").forEach(applyClasses);
        }
        if (_is.array(classes)){
            classes.forEach(function(tmp){
                if (_is.string(tmp)){
                    tmp.split(" ").forEach(applyClasses);
                }
            });
        }
    };

    /**
     * @summary Adds CSS classes to an element.
     * @memberof FooBox.utils.
     * @function addClass
     * @param {HTMLElement} element - The element to modify.
     * @param {string|string[]} classes - A space seperated string or an array of space separated strings.
     */
    _utils.addClass = function(element, classes){
        if (_is.string(classes)){
            classes.split(" ").forEach(function(className){
                element.classList.add(className);
            });
        }
        if (_is.array(classes)){
            classes.forEach(function(tmp){
                if (_is.string(tmp)){
                    tmp.split(" ").forEach(function(className){
                        element.classList.add(className);
                    });
                }
            });
        }
    };

    /**
     * @summary Removes CSS classes from an element.
     * @memberof FooBox.utils.
     * @function removeClass
     * @param {HTMLElement} element - The element to modify.
     * @param {string|string[]} classes - A space seperated string or an array of space separated strings.
     */
    _utils.removeClass = function(element, classes){
        if (_is.string(classes)){
            classes.split(" ").forEach(function(className){
                element.classList.remove(className);
            });
        }
        if (_is.array(classes)){
            classes.forEach(function(tmp){
                if (_is.string(tmp)){
                    tmp.split(" ").forEach(function(className){
                        element.classList.remove(className);
                    });
                }
            });
        }
    };

    /**
     * @summary Adds multiple attributes to an element.
     * @memberof FooBox.utils.
     * @function setAttributes
     * @param {HTMLElement} element - The element to modify.
     * @param {Object} attributes - An object containing the attribute names as properties along with there values. Non-string values are JSON stringified.
     */
    _utils.setAttributes = function(element, attributes){
        Object.keys(attributes).forEach(function(key){
            if (!_is.empty(attributes[key])){
                element.setAttribute(key, _is.string(attributes[key]) ? attributes[key] : JSON.stringify(attributes[key]));
            }
        });
    };

    /**
     * @summary Parse the supplied string into a DocumentFragment.
     * @memberof FooBox.utils.
     * @name parseHTML
     * @param {string} html - The string to parse.
     * @param {Document} [context] - The document to use.
     * @returns {DocumentFragment}
     */
    _utils.parseHTML = function(html, context) {
        const t = (context || document).createElement('template');
        t.innerHTML = html;
        return t.content;
    };

    _utils.onTransition = function(el, trigger, waitForProperties){

        waitForProperties = _is.array(waitForProperties) ? waitForProperties : [];

        return new Promise(function(resolve, reject){

            const seen = [];

            function ended(){
                el.removeEventListener("transitioncancel", ontransitioncancel);
                el.removeEventListener("transitionend", ontransitionend);
                resolve();
            }

            function cancelled(){
                el.removeEventListener("transitioncancel", ontransitioncancel);
                el.removeEventListener("transitionend", ontransitionend);
                reject("transitioncancel");
            }

            function ontransitioncancel(e){
                if (e.target === el) {
                    if (waitForProperties.length){
                        if (waitForProperties.includes(e.propertyName)){
                            cancelled();
                        }
                    } else {
                        cancelled();
                    }
                }
            }

            function ontransitionend(e){
                if (e.target === el){
                    if (waitForProperties.length){
                        seen.push(e.propertyName);
                        if (waitForProperties.every(function(prop){ return seen.includes(prop); })){
                            ended();
                        }
                    } else {
                        ended();
                    }
                }
            }

            el.addEventListener("transitioncancel", ontransitioncancel);
            el.addEventListener("transitionend", ontransitionend);

            _utils.nextFrame(function(){
                trigger.call(trigger, el);
            });
        });
    };

    /**
     * @summary Executed while an elements transitions are disabled allowing changes to be made immediately.
     * @callback FooBox.utils~doWhileDisabled
     * @param {Element} element - The element with transitions disabled.
     */

    /**
     * @summary Disable transitions temporarily on the provided element so changes can be made immediately within the provided callback.
     * @memberof FooBox.utils.
     * @function disableTransitions
     * @param {HTMLElement} element - The element to disable transitions on.
     * @param {FooBox.utils~doWhileDisabled} callback - A function to execute while the elements transitions are disabled.
     * @param {*} [thisArg] - The `this` value within the `callback`. Defaults to the callback itself.
     */
    _utils.disableTransitions = function(element, callback, thisArg){
        if (_is.element(element) && _is.fn(callback)){
            thisArg = _is.undef(thisArg) ? callback : thisArg;
            element.classList.add("fbx-disable-transitions");
            callback.call(thisArg, element);
            element.offsetHeight;
            element.classList.remove("fbx-disable-transitions");
        }
    };

    /**
     * @summary A simple wrapper around a promise that allows for the state to be monitored.
     * @memberof FooBox.utils.
     * @class PromiseState
     * @param {Promise<*>} promise - The promise object to monitor.
     */
    _utils.PromiseState = _utils.Class.extend(/** @lends FooBox.utils.PromiseState.prototype */{
        /**
         * @constructs
         * @param {Promise<*>} promise - The promise object to monitor.
         */
        construct: function(promise){
            const self = this;
            /**
             * @summary A function called if the Promise is fulfilled.
             * @callback FooBox.utils.PromiseState~onFulfilled
             * @param {*} [value] - The fulfillment value of the promise.
             */
            /**
             * @summary A function called if the Promise is rejected.
             * @callback FooBox.utils.PromiseState~onRejected
             * @param {*} [reason] - The rejection reason of the promise.
             */
            /**
             * @summary A function called when the Promise is settled.
             * @callback FooBox.utils.PromiseState~onFinally
             */
            /**
             * @summary The state of the promise.
             * @memberof FooBox.utils.PromiseState#
             * @name state
             * @readonly
             * @type {string}
             */
            self.state = "pending";
            /**
             * @summary The promise being monitored.
             * @memberof FooBox.utils.PromiseState#
             * @name promise
             * @readonly
             * @type {Promise<*>}
             */
            self.promise = promise.then(function(){
                self.state = "resolved";
            }, function(){
                self.state = "rejected";
            });
        },
        /**
         * @summary Whether or not the promise is fulfilled, either resolved or rejected.
         * @memberof FooBox.utils.PromiseState#
         * @function isFulfilled
         * @returns {boolean}
         */
        isFulfilled: function(){
            return this.state !== "pending";
        },
        /**
         * @summary Whether or not the promise is resolved.
         * @memberof FooBox.utils.PromiseState#
         * @function isResolved
         * @returns {boolean}
         */
        isResolved: function(){
            return this.state === "resolved";
        },
        /**
         * @summary Whether or not the promise is rejected.
         * @memberof FooBox.utils.PromiseState#
         * @function isRejected
         * @returns {boolean}
         */
        isRejected: function(){
            return this.state === "rejected";
        },
        /**
         * @summary The then() method returns a Promise. It takes up to two arguments: callback functions for the success and failure cases of the Promise.
         * @memberof FooBox.utils.PromiseState#
         * @function then
         * @param {FooBox.utils.PromiseState~onFulfilled} onFulfilled - A function called when the Promise is fulfilled.
         * @param {FooBox.utils.PromiseState~onRejected} onRejected - A function called when the Promise is rejected.
         * @returns {Promise<*>}
         */
        then: function(onFulfilled, onRejected){
            return this.promise.then(onFulfilled, onRejected);
        },
        /**
         * @summary The catch() method returns a Promise and deals with rejected cases only.
         * @memberof FooBox.utils.PromiseState#
         * @function catch
         * @param {FooBox.utils.PromiseState~onRejected} onRejected - A function called when the Promise is rejected.
         * @returns {Promise<*>}
         */
        catch: function(onRejected){
            return this.promise.catch(onRejected);
        },
        /**
         * @summary The finally() method returns a Promise. When the promise is settled, i.e either fulfilled or rejected, the specified callback function is executed.
         * @memberof FooBox.utils.PromiseState#
         * @function finally
         * @param {FooBox.utils.PromiseState~onFinally} onFinally - A function called when the Promise is settled.
         * @returns {Promise<*>}
         */
        finally: function(onFinally){
            return this.promise.finally(onFinally);
        }
    });

    /**
     * @summary Checks if the supplied value is an instance of the FooBox.Item class.
     * @memberof FooBox.utils.is.
     * @function item
     * @param {*} value - The value to checked.
     * @returns {boolean}
     */
    _is.item = function(value){
        return value instanceof _.Item;
    };

    /**
     * @summary Checks if the supplied value is an instance of the FooBox.Modal class.
     * @memberof FooBox.utils.is.
     * @function modal
     * @param {*} value - The value to checked.
     * @returns {boolean}
     */
    _is.modal = function(value){
        return value instanceof _.Modal;
    };

    /**
     * @summary Whether or not the current browser supports "webp" images.
     * @memberof FooBox.
     * @name supportsWebP
     * @type {boolean}
     * @default false
     */
    _.supportsWebP = false;

    const webp = new Image();
    webp.onload = function(){
        _.supportsWebP = 0 < webp.width && 0 < webp.height;
    };
    webp.onerror=function(){
        _.supportsWebP = false;
    };
    webp.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';

})(
    FooBox.$,
    FooBox,
    FooBox.utils,
    FooBox.utils.is,
    FooBox.utils.fn,
    FooBox.utils.str,
    FooBox.utils.obj
);