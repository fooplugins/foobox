(function(_, _utils, _is, _obj){

    /**
     * @summary The base class for all components of the modal.
     * @memberof FooBox.
     * @class Component
     * @param {FooBox.Modal} modal
     * @param {Object} options
     */
    _.Component = _utils.EventClass.extend(/** @lends FooBox.Component */{
        /**
         * @ignore
         * @constructs
         * @param {string} name - The name of the component.
         * @param {FooBox.Component~Configuration} config
         * @param {FooBox.Component} parent
         */
        construct: function(name, config, parent){
            const self = this;
            self._super();
            /**
             * @summary The default configuration object used by all components.
             * @typedef {?Object} FooBox.Component~Configuration
             * @property {FooBox.Component~Options} [options] - An object containing any options for a component.
             * @property {Object} [i18n] - An object containing any i18n strings for a component.
             * @property {Object} [classes] - An object containing any CSS classes for a component.
             */
            /**
             * @summary The default options object used by all components.
             * @typedef {?Object} FooBox.Component~Options
             * @property {boolean} [domEvents=false] - Whether or not this component should also trigger events on its DOM {@link FooBox.Component#el|element}.
             * @property {boolean} [bubbleEvents=true] - Whether or not this component should bubble events.
             */

            /**
             * @summary The name of this component.
             * @memberof FooBox.Component#
             * @name name
             * @type {string}
             */
            self.name = name;
            if (!_is.string(self.name)) throw "Invalid argument `name`.";
            /**
             * @summary The raw configuration object as it was supplied to this components constructor.
             * @memberof FooBox.Component#
             * @name raw
             * @type {FooBox.Component~Configuration}
             */
            self.raw = _is.hash(config) ? config : {};
            /**
             * @summary The parent component for this component.
             * @memberof FooBox.Component#
             * @name parent
             * @type {?FooBox.Component}
             * @default null
             */
            self.parent = parent instanceof _.Component ? parent : null;
            /**
             * @summary The options for this component.
             * @memberof FooBox.Component#
             * @name opt
             * @type {FooBox.Component~Options}
             */
            self.opt = _obj.extend({
                domEvents: false,
                bubbleEvents: true
            }, self.raw.options);
            /**
             * @summary The i18n strings for this component.
             * @memberof FooBox.Component#
             * @name i18n
             * @type {Object}
             */
            self.i18n = _is.hash(self.raw.i18n) ? self.raw.i18n : {};
            /**
             * @summary The CSS classes for this component.
             * @memberof FooBox.Component#
             * @name cls
             * @type {Object}
             */
            self.cls = _is.hash(self.raw.classes) ? self.raw.classes : {};
            /**
             * @summary The CSS selectors for this component.
             * @memberof FooBox.Component#
             * @name sel
             * @type {Object}
             */
            self.sel = _is.hash(self.raw.classes) ? _utils.selectify(self.raw.classes) : {};
            /**
             * @summary The Promise object returned from the {@link FooBox.Component#init|init} method.
             * @memberof FooBox.Component#
             * @name __initialize
             * @type {?Promise}
             * @private
             */
            self.__initialize = null;
            /**
             * @summary Whether or not this component is being initialized.
             * @memberof FooBox.Component#
             * @name isInitializing
             * @type {boolean}
             */
            self.isInitializing = false;
            /**
             * @summary Whether or not this component has been initialized.
             * @memberof FooBox.Component#
             * @name isInitialized
             * @type {boolean}
             */
            self.isInitialized = false;
            /**
             * @summary Whether or not this component is being destroyed.
             * @memberof FooBox.Component#
             * @name isDestroying
             * @type {boolean}
             */
            self.isDestroying = false;
            /**
             * @summary Whether or not this component has been destroyed.
             * @memberof FooBox.Component#
             * @name isDestroyed
             * @type {boolean}
             */
            self.isDestroyed = false;
        },
        /**
         * @summary Merges the supplied config into the component updating various properties.
         * @memberof FooBar.utils.Component#
         * @function configure
         * @param {FooBox.Component~Configuration} config - The configuration object to merge.
         */
        configure: function(config){
            if (!_is.hash(config)) return;
            const self = this;
            _obj.merge(self.raw, config);
            if (_is.hash(config.options)) _obj.merge(self.opt, config.options);
            if (_is.hash(config.i18n)) _obj.merge(self.i18n, config.i18n);
            if (_is.hash(config.classes)){
                _obj.merge(self.cls, config.classes);
                self.sel = _.selectify(self.cls);
            }
            self.trigger("configure", [config]);
        },
        /**
         * @summary Initializes the component adding extra functionality to the {@link FooBox.Component#$el|element}.
         * @memberof FooBox.Component#
         * @function init
         * @returns {Promise}
         */
        init: function(){
            const self = this;
            if (self.__initialize instanceof Promise) return self.__initialize;
            self.isInitializing = true;
            self.trigger("initializing");
            return self.__initialize = Promise.resolve().then(function(){
                self.trigger("before-setup");
                return self.beforeSetup();
            }).then(function(){
                self.trigger("setup");
                return self.setup();
            }).then(function(){
                self.trigger("after-setup");
                return self.afterSetup();
            }).then(function(){
                self.isInitializing = false;
                self.isInitialized = true;
                self.trigger("initialized");
            }).catch(function(err){
                self.isInitializing = false;
                self.isInitialized = false;
                self.trigger("setup-error", err);
                return Promise.reject(err);
            });
        },
        /**
         * @summary Used by subclasses to perform any internal work before the component setup is called.
         * @memberof FooBox.Component#
         * @function beforeSetup
         * @returns {(Promise|void)}
         */
        beforeSetup: function(){},
        /**
         * @summary Used by subclasses to perform any additional setup the component requires.
         * @memberof FooBox.Component#
         * @function setup
         * @returns {(Promise|void)}
         */
        setup: function(){},
        /**
         * @summary Used by subclasses to perform any internal work after the component setup is called.
         * @memberof FooBox.Component#
         * @function afterSetup
         * @returns {(Promise|void)}
         */
        afterSetup: function(){},
        /**
         * @summary Destroys the component removing any added functionality and returning the {@link FooBox.Component#$el|element} to its original state.
         * @memberof FooBox.Component#
         * @function destroy
         */
        destroy: function(){
            const self = this;
            self.isDestroying = true;
            self.trigger("destroying");
            self.trigger("before-teardown");
            self.beforeTeardown();
            self.trigger("teardown");
            self.teardown();
            self.trigger("after-teardown");
            self.afterTeardown();
            self.__initialize = null;
            self.isInitialized = false;
            self.isDestroying = false;
            self.isDestroyed = true;
            self.trigger("destroyed");
            self._super();
        },
        /**
         * @summary Used by subclasses to perform any internal work before the component teardown is called.
         * @memberof FooBox.Component#
         * @function beforeTeardown
         */
        beforeTeardown: function(){},
        /**
         * @summary Used by subclasses to perform any additional teardown the component requires.
         * @memberof FooBox.Component#
         * @function teardown
         */
        teardown: function(){},
        /**
         * @summary Used by subclasses to perform any internal work after the component teardown is called.
         * @memberof FooBox.Component#
         * @function afterTeardown
         */
        afterTeardown: function(){},
        /**
         * @summary Emits the supplied event on the current class.
         * @memberof FooBox.Component#
         * @function emit
         * @param {FooBox.utils.Event} event - The event object to emit.
         * @param {Array} [args] - An array of additional arguments to supply to the listener after the event object.
         */
        emit: function(event, args){
            const self = this;
            if (event instanceof _utils.Event){
                const bubbled = event.target !== null && event.target !== self;
                if (!bubbled || (bubbled && self.opt.bubbleEvents)){
                    self._super(event, args);
                    if (self.opt.domEvents){
                        let eventName = event.type;
                        if (_is.string(event.namespace)) eventName += "." + event.namespace;
                        self.$el.trigger(eventName, args);
                    }
                }
                if (self.opt.bubbleEvents && self.parent instanceof _.Component){
                    self.parent.emit(event, args);
                }
            }
        }
    });

})(
    FooBox,
    FooBox.utils,
    FooBox.utils.is,
    FooBox.utils.obj
);