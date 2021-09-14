(function($, _, _utils, _is, _fn){

    /**
     * @summary The base item class for all FooBox items.
     * @memberof FooBox.
     * @class Item
     * @param {string} type
     * @param {FooBox.Item~Configuration} config
     * @param {FooBox.Modal} modal
     * @param {number} index
     * @augments FooBox.Component
     */
    _.Item = _.Component.extend(/** @lends FooBox.Item.prototype */{
        /**
         * @ignore
         * @constructs
         * @param {string} type
         * @param {FooBox.Item~Configuration} config
         * @param {FooBox.Modal} modal
         * @param {number} index
         */
        construct: function(type, config, modal, index){
            const self = this;
            self._super(type, config, modal);
            /**
             * @typedef {FooBox.Component~Configuration} FooBox.Item~Configuration
             * @property {HTMLElement|Object} parsedFrom
             * @property {FooBox.Item~Options} options
             * @property {FooBox.Item~Classes} classes
             */
            /**
             * @typedef {Object} FooBox.Item~Options
             * @property {string} id - The id to apply to the item.
             * @property {string} url - The primary url this item displays within the modal.
             * @property {string} type - The type specifies how the url is displayed within the modal.
             */
            /**
             * @typedef {Object} FooBox.Item~Classes
             * @property {string} el - The CSS class(es) to apply to the element.
             * @property {string} type - The type specific CSS class to apply to the element.
             */

            /**
             * @summary The index of this item within the modal.
             * @memberof FooBox.Item#
             * @name index
             * @type {number}
             */
            self.index = index;
            /**
             * @memberof FooBox.Item#
             * @name isCreated
             * @type {boolean}
             */
            self.isCreated = false;
            /**
             * @memberof FooBox.Item#
             * @name isVisible
             * @type {boolean}
             */
            self.isVisible = false;
            /**
             * @memberof FooBox.Item#
             * @name hasTitle
             * @type {boolean}
             */
            self.hasTitle = _is.string(self.opt.title);
            /**
             * @memberof FooBox.Item#
             * @name hasDescription
             * @type {boolean}
             */
            self.hasDescription = _is.string(self.opt.description);
            /**
             * @memberof FooBox.Item#
             * @name hasCaption
             * @type {boolean}
             */
            self.hasCaption = self.hasTitle || self.hasDescription;
            /**
             * @memberof FooBox.Item#
             * @name isTrigger
             * @type {boolean}
             */
            self.isTrigger = modal.raw.trigger === "items" && _is.element(self.raw.parsedFrom);
            /**
             * @memberof FooBox.Item#
             * @name isLoading
             * @type {boolean}
             */
            self.isLoading = false;
            /**
             * @memberof FooBox.Item#
             * @name isLoaded
             * @type {boolean}
             */
            self.isLoaded = false;

            self.el = {
                owner: self.raw.parsedFrom,
                item: null,
                content: null,
                info: null,
                loader: null
            };

            self._loaded = null;

            self.onClicked = self.onClicked.bind(self);
            self.onToggleInfoClicked = self.onToggleInfoClicked.bind(self);
        },
        afterSetup: function(){
            const self = this;
            if (self.isTrigger) self.el.owner.addEventListener("click", self.onClicked);
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
                self.el.item = document.createElement("div");
                _utils.addClass(self.el.item, self.cls.el);

                self.el.content = self.doCreateContent();
                _utils.addClass(self.el.content, [self.cls.content, self.cls.type]);
                self.el.item.appendChild(self.el.content);

                if (self.hasCaption){
                    self.el.info = self.doCreateInfo();
                    self.el.item.appendChild(self.el.info);
                }

                self.el.loader = self.parent.createLoader();
                self.el.item.appendChild(self.el.loader);

                return true;
            } catch(err) {
                console.debug("An error occurred creating the item.", err);
                return false;
            }
        },
        doCreateContent: function(){
            throw "This method must be overridden by a child class!";
        },
        doCreateInfo: function(){
            const self = this;
            const info = document.createElement("div");
            _utils.addClass(info, self.cls.info);
            const infoToggle = document.createElement("button");
            _utils.addClass(infoToggle, [self.cls.toggle, self.cls.infoToggle]);
            infoToggle.appendChild(self.parent.getIcon("toggle"));
            infoToggle.addEventListener("click", self.onToggleInfoClicked);
            info.appendChild(infoToggle);

            if (self.hasTitle){
                const infoHead = document.createElement("div");
                _utils.addClass(infoHead, self.cls.infoHead);
                infoHead.innerHTML = self.opt.title;
                info.appendChild(infoHead);
            }
            if (self.hasDescription){
                const infoBody = document.createElement("div");
                _utils.addClass(infoBody, self.cls.infoBody);
                infoBody.innerHTML = self.opt.description;
                info.appendChild(infoBody);
            }
            if (self.hasExif){
                const infoFoot = document.createElement("div");
                _utils.addClass(infoFoot, self.cls.infoFoot);
            }
            return info;
        },
        load: function(){
            const self = this;
            if (self._loaded !== null) return self._loaded;
            self.isLoading = true;
            self.trigger("load");
            _utils.addClass(self.el.item, self.cls.loading);
            _utils.addClass(self.el.content, self.cls.loading);
            if (self.hasCaption) _utils.addClass(self.el.info, self.cls.loading);
            const loaderDelay = setTimeout(function(){
                _utils.addClass(self.el.loader, self.cls.loading);
            }, self.parent.opt.loaderDelay);
            return self._loaded = Promise.resolve().then(function(){
                return self.doLoadContent(self.el.content);
            }).then(function(){
                clearTimeout(loaderDelay);
                _utils.removeClass(self.el.loader, self.cls.loading);
                _utils.removeClass(self.el.content, self.cls.loading);
                _utils.removeClass(self.el.item, self.cls.loading);
                if (self.hasCaption) _utils.removeClass(self.el.info, self.cls.loading);
                self.isLoading = false;
                self.isLoaded = true;
                self.trigger("loaded");
            }, function(reason){
                clearTimeout(loaderDelay);
                _utils.removeClass(self.el.loader, self.cls.loading);
                _utils.removeClass(self.el.content, self.cls.loading);
                _utils.removeClass(self.el.item, self.cls.loading);
                if (self.hasCaption) _utils.removeClass(self.el.info, self.cls.loading);
                self.isLoading = false;
                self.trigger("load-error", [reason]);
            });
        },
        doLoadContent: function(element){
            return Promise.resolve();
        },
        /**
         *
         * @returns {Promise}
         */
        show: function(){
            const self = this;
            return Promise.resolve().then(function(){
                return self.doBeforeShow();
            }).then(function(){
                return self.doShow();
            }).catch(function(reason){
                if (reason === "transitioncancel"){
                    console.debug("cancelled-show", self.index);
                    return Promise.resolve();
                }
            }).finally(function(){
                self.doAfterShow();
            });
        },
        doBeforeShow: function(){
            const self = this;
            if (self.create()){
                _utils.addClass(self.el.item, self.cls.transitionIn);
                self.parent.el.items.appendChild(self.el.item);
                if (self.hasCaption){
                    _utils.addClass(self.el.info, self.cls.transitionIn);
                    self.parent.el.items.appendChild(self.el.info);
                }
            } else {
                return Promise.reject(new Error("Unable to create item."));
            }
        },
        doShow: function(){
            const self = this;
            function makeVisible(el){
                _utils.addClass(el, self.cls.visible);
            }
            if (self.parent.hasTransition){
                if (self.hasCaption && self.parent.isInfoVisible){
                    return Promise.all([
                        _utils.onTransition(self.el.item, makeVisible),
                        _utils.onTransition(self.el.info, makeVisible)
                    ]);
                }
                return _utils.onTransition(self.el.item, makeVisible);
            }
            makeVisible(self.el.item);
            if (self.hasCaption && self.parent.isInfoVisible) makeVisible(self.el.info);
        },
        doAfterShow: function(){
            const self = this;
            if (self.isCreated){
                _utils.removeClass(self.el.item, self.cls.transitionIn);
                if (self.hasCaption) _utils.removeClass(self.el.info, self.cls.transitionIn);
            }
        },
        /**
         *
         * @returns {Promise}
         */
        hide: function(){
            const self = this;
            return Promise.resolve().then(function(){
                return self.doBeforeHide();
            }).then(function(){
                return self.doHide();
            }).catch(function(reason){
                if (reason === "transitioncancel"){
                    console.debug("cancelled-hide", self.index);
                    return Promise.resolve();
                }
            }).finally(function(){
                self.doAfterHide();
            });
        },
        doBeforeHide: function(){
            const self = this;
            if (self.isCreated){
                _utils.addClass(self.el.item, self.cls.transitionOut);
                if (self.hasCaption) _utils.addClass(self.el.info, self.cls.transitionOut);
            }
        },
        doHide: function(){
            const self = this;
            function makeHidden(el){
                _utils.removeClass(el, self.cls.visible);
            }
            if (self.parent.hasTransition){
                if (self.hasCaption && self.parent.isInfoVisible){
                    return Promise.all([
                        _utils.onTransition(self.el.item, makeHidden),
                        _utils.onTransition(self.el.info, makeHidden)
                    ]);
                }
                return _utils.onTransition(self.el.item, makeHidden);
            }
            makeHidden(self.el.item);
            if (self.hasCaption && self.parent.isInfoVisible) makeHidden(self.el.info);
        },
        doAfterHide: function(){
            const self = this;
            _utils.removeClass(self.el.item, self.cls.transitionOut);
            self.parent.el.items.removeChild(self.el.item);
            if (self.hasCaption){
                _utils.removeClass(self.el.info, self.cls.transitionOut);
                self.parent.el.items.removeChild(self.el.info);
            }
        },
        toggleInfo: function(){
            const self = this;
            return self.hasCaption && self.el.info.classList.toggle(self.cls.visible);
        },
        getContentSize: function(){
            const self = this;
            return _utils.getElementSize(self.el.content);
        },
        onClicked: function(e){
            e.preventDefault();
            this.parent.show(this);
        },
        onToggleInfoClicked: function(e){
            e.preventDefault();
            this.parent.toggleInfo();
        }
    });


    _.items.register("base", _.Item, {
        options: {
            id: null,
            type: null,
            url: null,
            width: null,
            height: null,
            aspectRatio: null,
            title: null,
            description: null
        },
        classes: {
            el: "fbx-item",
            content: "fbx-item-content",
            type: "fbx-unknown",
            visible: "fbx-visible",
            hidden: "fbx-hidden",
            loading: "fbx-loading",
            transitionOut: "fbx-transition-out",
            transitionIn: "fbx-transition-in",
            info: "fbx-info",
            infoToggle: "fbx-info-toggle",
            infoHead: "fbx-info-head",
            infoBody: "fbx-info-body",
            infoFoot: "fbx-info-foot"
        }
    }, -1);

})(
    FooBox.$,
    FooBox,
    FooBox.utils,
    FooBox.utils.is,
    FooBox.utils.fn
);