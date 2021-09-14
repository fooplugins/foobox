(function($, _, _utils, _is, _fn, _obj){

    // noinspection JSCheckFunctionSignatures
    /**
     * @summary The core plugin class for the plugin.
     * @memberof FooBox.
     * @class Plugin
     * @param {string} name
     * @param {FooBox~Configuration} config
     * @param {Element} rootElement
     * @augments FooBox.Component
     */
    _.Plugin = _.Component.extend(/** @lends FooBox.Plugin.prototype */{
        /**
         * @ignore
         * @constructs
         * @param {string} name
         * @param {FooBox~Configuration} config
         * @param {Element} rootElement
         */
        construct: function(name, config, rootElement){
            const self = this;
            self._super(name, config, null);
            self.root = rootElement;
            self.parser = new _.Parser();
            self.parserResult = [];
            self.modals = new Map();
            self.visible = [];
        },
        beforeSetup: function(){
            const self = this;
            self.trigger("parse", [self.root, self.raw]);
            self.parserResult = self.parser.parse(self.root, self.raw);
            self.trigger("parsed", [self.parserResult]);
        },
        setup: function(){
            const self = this;
            self.parserResult.forEach(function(config){
                const modal = _.layouts.create(config.type, config, self);
                modal.on({
                    "initialized": self.onModalInitialized,
                    "destroyed": self.onModalDestroyed,
                    "attached": self.onModalAttached,
                    "detached": self.onModalDetached
                }, self);
                modal.init();
            });
        },
        onModalInitialized: function(e){
            if (e.target instanceof _.Modal){
                this.modals.set(e.target.raw.parsedFrom, e.target);
            }
        },
        onModalDestroyed: function(e){
            if (e.target instanceof _.Modal){
                this.modals.delete(e.target.raw.parsedFrom);
            }
        },
        onModalAttached: function(e){
            if (e.target instanceof _.Modal){
                this.visible.push(e.target);
            }
        },
        onModalDetached: function(e){
            if (e.target instanceof _.Modal){
                const index = this.visible.indexOf(e.target);
                if (index !== -1){
                    this.visible.splice(index, 1);
                }
            }
        }
    });

    _.plugin = new _.Plugin("foobox", _.configuration, document.documentElement);

    // expose certain methods directly from the FooBox.plugin instance
    _fn.expose(_.plugin, _, ["on","off","trigger","destroy","configure"]);
    /**
     * @summary Add an event listener to the core plugin.
     * @memberof FooBox.
     * @function on
     * @see FooBox.utils.EventClass#on
     */
    /**
     * @summary Remove an event listener from the core plugin.
     * @memberof FooBox.
     * @function off
     * @see FooBox.utils.EventClass#off
     */
    /**
     * @summary Trigger an event on the core plugin.
     * @memberof FooBox.
     * @function trigger
     * @see FooBox.utils.EventClass#trigger
     */
    /**
     * @summary Destroy the plugin.
     * @memberof FooBox.
     * @function destroy
     * @see FooBox.utils.EventClass#destroy
     */
    /**
     * @summary Configure the plugin.
     * @memberof FooBox.
     * @function defaults
     * @see FooBox.utils.EventClass#defaults
     */

})(
    FooBox.$,
    FooBox,
    FooBox.utils,
    FooBox.utils.is,
    FooBox.utils.fn,
    FooBox.utils.obj
);