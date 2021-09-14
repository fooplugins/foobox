(function($, _, _utils, _is, _fn, _obj){

    // noinspection JSCheckFunctionSignatures
    /**
     * @summary The core plugin class for the plugin.
     * @memberof FooBox.
     * @class Modal
     * @param {string} name
     * @param {FooBox.Modal~Configuration} config
     * @param {FooBox.Plugin} parent
     * @augments FooBox.Component
     */
    _.Modal = _.Component.extend(/** @lends FooBox.Modal.prototype */{
        /**
         * @ignore
         * @constructs
         * @param {string} name
         * @param {FooBox.Modal~Configuration} config
         * @param {FooBox.Plugin} parent
         */
        construct: function(name, config, parent){
            const self = this;
            self._super(name, config, parent);
            /**
             * @typedef {FooBox.Component~Configuration} FooBox.Modal~Configuration
             * @property {string} [id=null]
             * @property {HTMLElement} parsedFrom - The element this modal was created for.
             * @property {string} trigger
             * @property {FooBox.Item~Configuration[]} items
             * @property {FooBox.Modal~Options} options
             * @property {FooBox.Modal~Classes} classes
             */
            /**
             * @typedef {Object} FooBox.Modal~Options
             * @property {string} id - The id to apply to the modal.
             * @property {string} layout - The layout for the modal. Currently supports: "fbx-modern", "fbx-classic", "fbx-metro" and "fbx-flat". If the supplied value is not supported "modern"  is used.
             * @property {string|string[]} classes - Additional CSS classes to apply to the modal element. Can be supplied as either a space seperated string or an array of strings.
             */
            /**
             * @typedef {Object} FooBox.Modal~Elements
             * @property {?HTMLElement} owner - The element this modal was parsed from.
             * @property {?HTMLDivElement} modal - The root element for the entire modal.
             * @property {?HTMLDivElement} overlay - The overlay element for the modal.
             * @property {?HTMLDivElement} thumbs - The thumbs element for the modal.
             * @property {?HTMLDivElement} inner - The inner element for the overlay.
             * @property {?HTMLDivElement} content - The content element for the inner.
             * @property {?HTMLDivElement} info - The info element for the inner.
             * @property {?HTMLDivElement} buttons - The buttons element for the content.
             * @property {?HTMLButtonElement} buttonClose - The close button element for the buttons.
             * @property {?HTMLButtonElement} buttonPrev - The previous button element for the buttons.
             * @property {?HTMLButtonElement} buttonNext - The next button element for the buttons.
             * @property {?HTMLDivElement} items - The items element for the content.
             * @property {?HTMLDivElement} loader - The loader element for the items.
             */
            /**
             * @memberof FooBox.Modal#
             * @name raw
             * @type {FooBox.Modal~Configuration}
             */
            /**
             * @memberof FooBox.Modal#
             * @name opt
             * @type {FooBox.Modal~Options}
             */
            /**
             * @memberof FooBox.Modal#
             * @name isCreated
             * @type {boolean}
             */
            self.isCreated = false;
            /**
             * @memberof FooBox.Modal#
             * @name isVisible
             * @type {boolean}
             */
            self.isVisible = false;
            /**
             * @memberof FooBox.Modal#
             * @name isTrigger
             * @type {boolean}
             */
            self.isTrigger = self.raw.trigger === "element" && _is.element(self.raw.parsedFrom);
            /**
             * @memberof FooBox.Modal#
             * @name hasTransition
             * @type {boolean}
             */
            self.hasTransition = self.cls.transitions.hasOwnProperty(self.opt.transition);
            /**
             * @memberof FooBox.Modal#
             * @name observer
             * @type {FooBox.utils.Observer}
             */
            self.observer = new _utils.Observer();
            /**
             * @memberof FooBox.Modal#
             * @name el
             * @type {FooBox.Modal~Elements}
             */
            self.el = {
                owner: self.raw.parsedFrom,
                modal: null,
                overlay: null,
                thumbs: null,
                inner: null,
                content: null,
                info: null,
                buttons: null,
                buttonClose: null,
                buttonPrev: null,
                buttonNext: null,
                items: null,
                loader: null
            };

            self.mqlLargeScreen = matchMedia("(min-width: 601px) and (min-height: 601px)");

            // /**
            //  * @memberof FooBox.Modal#
            //  * @name breakpoints
            //  * @type {FooBox.Modal.Breakpoints}
            //  */
            // self.breakpoints = new _.Modal.Breakpoints(self);
            /**
             * @memberof FooBox.Modal#
             * @name items
             * @type {FooBox.Item[]}
             */
            self.items = [];

            self.onClicked = self.onClicked.bind(self);
            self.onCloseClicked = self.onCloseClicked.bind(self);
            self.onPrevClicked = self.onPrevClicked.bind(self);
            self.onNextClicked = self.onNextClicked.bind(self);
            self.onInfoClicked = self.onInfoClicked.bind(self);
            self.onScreenChanged = self.onScreenChanged.bind(self);

            self.isInfoVisible = self.opt.infoVisible;

            self._loadingIcon = null;
        },
        isLargeScreen: function(){
            return this.mqlLargeScreen.matches;
        },
        getIcon: function(name, svgName, classes){
            const self = this;
            if (!_is.string(svgName)) svgName = self.opt.svg;
            if (!_is.array(classes)) classes = [];
            // first see if this is a named icon and use the mapped value
            if (self.opt.icons.hasOwnProperty(name)){
                return _.icons.get(self.opt.icons[name], svgName, classes.concat([self.cls.icons[name]]));
            }
            // otherwise just query the icons registry
            return _.icons.get(name, svgName, classes);
        },
        beforeSetup: function(){
            const self = this;
            self.items = self.raw.items.map(function (item, i){
                return _.items.create(item.options.type, item, self, i);
            });
        },
        setup: function(){
            const self = this;
            self.items.forEach(function(item){
                item.init();
            });
        },
        afterSetup: function(){
            const self = this;
            if (self.isTrigger) self.el.owner.addEventListener("click", self.onClicked);
            self._super();
        },
        beforeTeardown: function(){
            const self = this;
            self.observer.disconnect();
            self._super();
        },
        afterTeardown: function(){
            const self = this;
            if (self.isTrigger) self.el.owner.removeEventListener("click", self.onClicked);
            self._super();
        },
        create: function(){
            const self = this;
            if (!self.isCreated){
                self.trigger("create");
                self.isCreated = self.doCreate();
                if (self.isCreated){
                    self.trigger("created");
                }
            }
            return self.isCreated;
        },
        doCreate: function(){
            const self = this;
            try {
                self.el.modal = document.createElement("div");
                _utils.addClass(self.el.modal, self.cls.modal);

                const layout = _obj.prop(self.cls.layouts, self.opt.layout);
                if (_is.string(layout)){
                    _utils.addClass(self.el.modal, layout);
                }

                const transition = _obj.prop(self.cls.transitions, self.opt.transition);
                if (_is.string(transition)){
                    _utils.addClass(self.el.modal, [self.cls.hasTransition, transition]);
                }

                if (self.opt.noMobile){
                    _utils.addClass(self.el.modal, self.cls.noMobile);
                }

                if (self.opt.infoInline){
                    _utils.addClass(self.el.modal, self.cls.infoInline);
                }

                if (self.isLargeScreen()){
                    _utils.addClass(self.el.modal, self.cls.largeUI);
                }

                const infoPosition = _obj.prop(self.cls.infoPosition, self.opt.info);
                if (_is.string(infoPosition)){
                    _utils.addClass(self.el.modal, infoPosition);
                }

                _utils.addClass(self.el.modal, self.opt.classes);
                if (_is.string(self.opt.id)){
                    self.el.modal.id = self.opt.id;
                }

                self.el.overlay = document.createElement("div");
                _utils.addClass(self.el.overlay, self.cls.overlay);

                self.el.inner = document.createElement("div");
                _utils.addClass(self.el.inner, self.cls.inner);

                self.el.count = document.createElement("div");
                _utils.addClass(self.el.count, self.cls.count);

                self.el.items = document.createElement("div");
                _utils.addClass(self.el.items, self.cls.items);

                self.el.buttons = document.createElement("div");
                _utils.addClass(self.el.buttons, self.cls.buttons);

                self.el.buttonClose = document.createElement("button");
                _utils.addClass(self.el.buttonClose, [self.cls.button, self.cls.buttonClose]);
                self.el.buttonClose.addEventListener("click", self.onCloseClicked);
                self.el.buttonClose.appendChild(self.getIcon("close"));

                self.el.buttonPrev = document.createElement("button");
                _utils.addClass(self.el.buttonPrev, [self.cls.button, self.cls.buttonPrev]);
                self.el.buttonPrev.addEventListener("click", self.onPrevClicked);
                self.el.buttonPrev.appendChild(self.getIcon("prev"));

                self.el.buttonNext = document.createElement("button");
                _utils.addClass(self.el.buttonNext, [self.cls.button, self.cls.buttonNext]);
                self.el.buttonNext.addEventListener("click", self.onNextClicked);
                self.el.buttonNext.appendChild(self.getIcon("next"));

                self.el.buttonInfo = document.createElement("button");
                _utils.addClass(self.el.buttonInfo, [self.cls.button, self.cls.buttonInfo]);
                self.el.buttonInfo.addEventListener("click", self.onInfoClicked);
                self.el.buttonInfo.appendChild(self.getIcon("info"));

                self.el.modal.appendChild(self.el.overlay);
                self.el.overlay.appendChild(self.el.inner);
                self.el.inner.appendChild(self.el.items);
                self.el.inner.appendChild(self.el.buttons);
                self.el.inner.appendChild(self.el.count);
                self.el.buttons.appendChild(self.el.buttonPrev);
                self.el.buttons.appendChild(self.el.buttonNext);
                self.el.buttons.appendChild(self.el.buttonInfo);
                self.el.buttons.appendChild(self.el.buttonClose);

                return true;
            } catch(err) {
                console.debug("An error occurred creating the modal.", err);
                return false;
            }
        },
        attach: function(){
            const self = this;
            if (!self.isCreated) self.create();
            if (self.isCreated && !self.isAttached){
                self.trigger("attach");
                self.isAttached = self.doAttach();
                if (self.isAttached){
                    self.trigger("attached");
                }
            }
            return self.isAttached;
        },
        doAttach: function(){
            const self = this;
            try {
                self.onScreenChanged(self.mqlLargeScreen)
                self.mqlLargeScreen.addEventListener("change", self.onScreenChanged);
                self.parent.root.appendChild(self.el.modal);
                // self.breakpoints.observe();
                return true;
            } catch (err) {
                console.debug("An error occurred attaching the modal to the DOM.", err);
                return false;
            }
        },
        detach: function(){
            const self = this;
            if (self.isAttached){
                self.trigger("detach");
                self.isAttached = !self.doDetach();
                if (!self.isAttached){
                    self.trigger("detached");
                }
            }
            return !self.isAttached;
        },
        doDetach: function(){
            const self = this;
            try {
                self.mqlLargeScreen.removeEventListener("change", self.onScreenChanged);
                self.parent.root.removeChild(self.el.modal);
                return true;
            } catch (err) {
                console.debug("An error occurred detaching the modal from the DOM.", err);
                return false;
            }
        },
        show: function(value){
            const self = this;
            if (_is.undef(value)) value = "first";
            const current = self.find(value);
            if (_is.item(current)){
                if (self.attach()){
                    if (self.current === current){
                        // Current item is the same as the new item so just resolve
                        return Promise.resolve();
                    }
                    const previous = self.current;
                    self.current = current;
                    _utils.toggleClass(self.el.items, self.cls.reverseTransition, self.shouldReverseTransition(current, previous));
                    _utils.toggleClass(self.el.buttonInfo, self.cls.disabled, !current.hasCaption);
                    return Promise.resolve().then(function(){
                        return self.doBeforeShow(current, previous);
                    }).then(function(){
                        self.el.count.innerHTML = _utils.str.format(self.opt.countFormat, {current: self.items.indexOf(current) + 1, total: self.items.length});
                        return self.doShow(current, previous);
                    }).then(function(){
                        return self.doAfterShow(current, previous);
                    }).finally(function(){
                        _utils.removeClass(self.el.items, self.cls.reverseTransition);
                    });
                }
                return Promise.reject(new Error("Unable to attach the modal to the DOM."));
            }
            return Promise.reject(new Error("No item to display."));
        },
        doBeforeShow: function(current, previous){
            if (_is.item(previous)){
                return Promise.all([previous.doBeforeHide(), current.doBeforeShow()]);
            }
            return current.doBeforeShow();
        },
        doShow: function(current, previous){
            current.load();
            if (_is.item(previous)){
                return Promise.all([previous.doHide(), current.doShow()]);
            }
            return current.doShow();
        },
        doAfterShow: function(current, previous){
            if (_is.item(previous)){
                return Promise.all([previous.doAfterHide(), current.doAfterShow()]);
            }
            return current.doAfterShow();
        },
        close: function(){
            const self = this;
            self.detach();
        },
        toggleInfo: function(){
            const self = this;
            if (self.current instanceof _.Item){
                self.isInfoVisible = self.current.toggleInfo();
            }
        },
        shouldReverseTransition: function(current, previous){
            if (!_is.item(previous) || !_is.item(current)) return true;
            const self = this,
                currentIndex = self.items.indexOf(current),
                previousIndex = self.items.indexOf(previous),
                lastIndex = self.items.length - 1;

            let result = previousIndex < currentIndex;
            if ((currentIndex === 0 && previousIndex === lastIndex) || (currentIndex === lastIndex && previousIndex === 0)){
                result = !result;
            }
            return result;
        },
        find: function(value){
            const self = this;
            if (_is.item(value)) return value;
            if (_is.string(value)){
                switch (value){
                    case "first":
                        value = 0;
                        break;
                    case "last":
                        value = self.items.length - 1;
                        break;
                    case "next":
                        if (self.current instanceof _.Item){
                            value = self.current.index + 1;
                            if (value > self.items.length - 1){
                                if (self.opt.loop){
                                    value = 0;
                                } else {
                                    value = self.current.index;
                                }
                            }
                        }
                        break;
                    case "previous":
                        if (self.current instanceof _.Item){
                            value = self.current.index - 1;
                            if (value < 0){
                                if (self.opt.loop){
                                    value = self.items.length - 1;
                                } else {
                                    value = self.current.index;
                                }
                            }
                        }
                        break;
                    default:
                        value = parseInt(value);
                        break;
                }
            }
            if (_is.number(value) && value >= 0 && value < self.items.length) {
                return self.items[value];
            }
        },
        createLoader: function(){
            const self = this, loader = document.createElement("div");
            _utils.addClass(loader, self.cls.loader);
            if (self._loadingIcon === null) self._loadingIcon = self.getIcon("loading");
            if (self._loadingIcon instanceof Element){
                loader.appendChild(self._loadingIcon.cloneNode(true));
            }
            return loader;
        },
        onClicked: function(e){
            e.preventDefault();
            this.show("first");
        },
        onCloseClicked: function(e){
            e.preventDefault();
            this.close();
        },
        onPrevClicked: function(e){
            e.preventDefault();
            this.show("previous");
        },
        onNextClicked: function(e){
            e.preventDefault();
            this.show("next");
        },
        onInfoClicked: function(e){
            e.preventDefault();
            this.toggleInfo();
        },
        onScreenChanged: function(e){
            const self = this;
            _utils.toggleClass(self.el.modal, self.cls.largeUI, e.matches);
        }
    });

    _.layouts.register("default", _.Modal, {
        options: {
            id: null,
            layout: null,
            loop: true,
            transition: null,
            info: "bottom",
            infoVisible: true,
            infoInline: false,
            cssPrefix: "fbx-",
            noMobile: false,
            loaderDelay: 400,
            showCount: true,
            countFormat: "{current} / {total}",
            icons: {
                close: "cross",
                info: "info",
                toggle: "cross-small",
                prev: "arrow-left",
                next: "arrow-right",
                loading: "spinner"
            },
            svg: "defaults"
        },
        i18n: {
            close: "Close modal",
            prev: "Show previous item",
            next: "Show next item"
        },
        classes: {
            modal: "fbx-modal",
            layouts: {},
            noMobile: "fbx-no-mobile",
            largeUI: "fbx-large-ui",
            overlay: "fbx-overlay",
            inner: "fbx-inner",
            count: "fbx-count",
            buttons: "fbx-buttons",
            info: "fbx-info",
            infoHead: "fbx-info-head",
            infoBody: "fbx-info-body",
            infoFoot: "fbx-info-foot",
            infoPosition: {
                top: "fbx-info-top",
                right: "fbx-info-right",
                bottom: "fbx-info-bottom",
                left: "fbx-info-left"
            },
            infoInline: "fbx-info-inline",
            thumbs: "fbx-thumbs",
            items: "fbx-items",
            loader: "fbx-loader",
            button: "fbx-button",
            buttonClose: "fbx-btn-close",
            buttonPrev: "fbx-btn-prev",
            buttonNext: "fbx-btn-next",
            buttonInfo: "fbx-btn-info",
            transitions: {
                fade: "fbx-transition-fade",
                horizontal: "fbx-transition-horizontal"
            },
            hasTransition: "fbx-has-transition",
            disableTransitions: "fbx-disable-transitions",
            reverseTransition: "fbx-reverse-transition",
            loading: "fbx-loading",
            visible: "fbx-visible",
            disabled: "fbx-disabled",
            icons: {
                close: "fbx-close-icon",
                prev: "fbx-prev-icon",
                next: "fbx-next-icon",
                loading: "fbx-loading-icon"
            }
        }
    }, -1);

})(
    FooBox.$,
    FooBox,
    FooBox.utils,
    FooBox.utils.is,
    FooBox.utils.fn,
    FooBox.utils.obj
);