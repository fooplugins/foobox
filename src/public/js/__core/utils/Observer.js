(function(_){

    /**
     * @summary A simple wrapper around a ResizeObserver to allow for a callback to be registered at the time of observing.
     * @memberof FooBox.
     * @class Observer
     * @extends FooBox.utils.Class
     */
    _.Observer = _.Class.extend(/** @lends FooBox.Observer.prototype */{
        /**
         * @ignore
         * @constructs
         */
        construct: function(){
            const self = this;
            /**
             * @summary A map containing all element to callback mappings.
             * @memberof FooBox.Observer#
             * @name observed
             * @type {Map<Element, FooBox.Observer~observeCallback>}
             */
            self.observed = new Map();
            /**
             * @summary The ResizeObserver used internally by this wrapper.
             * @memberof FooBox.Observer#
             * @name resizeObserver
             * @type {ResizeObserver}
             */
            self.resizeObserver = new ResizeObserver(self.onResizeObserved.bind(self));
        },
        /**
         * @callback FooBox.Observer~observeCallback
         * @param {ResizeObserverEntry} entry - The entry that can be used to access the new dimensions.
         * @param {{width: Number,height: Number}} size - The standardized size reported by the entry.
         * @param {FooBox.Observer} [observer] - A reference to the FooBox.Observer itself, so it can definitely be accessible from inside the callback.
         */
        /**
         * @summary Start observing the specified element.
         * @memberof FooBox.Observer#
         * @function observe
         * @param {Element|SVGElement} target - A reference to an Element or SVGElement to be observed.
         * @param {FooBox.Observer~observeCallback} callback - A callback to execute when the dimensions of the target change.
         * @param {ResizeObserverOptions} [options] - An options object allowing you to set the options for the observation.
         */
        observe: function(target, callback, options){
            const self = this;
            self.observed.set(target, callback);
            self.resizeObserver.observe(target, options);
        },
        /**
         * @summary Stop observing the specified element.
         * @memberof FooBox.Observer#
         * @function unobserve
         * @param {Element|SVGElement} target - A reference to an Element or SVGElement to be unobserved.
         */
        unobserve: function(target){
            const self = this;
            self.observed.delete(target);
            self.resizeObserver.unobserve(target);
        },
        /**
         * @summary Stops observing all elements.
         * @memberof FooBox.Observer#
         * @function disconnect
         */
        disconnect: function(){
            const self = this;
            self.observed.clear();
            self.resizeObserver.disconnect();
        },
        /**
         * @summary Handles the standard ResizeObserver callback.
         * @memberof FooBox.Observer#
         * @function onResizeObserved
         * @param {ResizeObserverEntry[]} entries - An array of ResizeObserverEntry objects that can be used to access the new dimensions of the element after each change.
         */
        onResizeObserved: function(entries){
            const self = this;
            entries.forEach(function(entry){
                if (self.observed.has(entry.target)){
                    const callback = self.observed.get(entry.target),
                        size = _.getResizeObserverSize(entry);
                    callback.call(callback, entry, size);
                }
            });
        }
    });

})(
    FooBox.utils
);