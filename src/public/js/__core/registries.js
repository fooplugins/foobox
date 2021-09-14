(function(_, _utils){

    /**
     * @memberOf FooBox.
     * @name items
     * @type {FooBox.utils.ClassRegistry}
     */
    _.items = new _utils.ClassRegistry({allowBase: false});

    /**
     * @memberOf FooBox.
     * @name layouts
     * @type {FooBox.utils.ClassRegistry}
     */
    _.layouts = new _utils.ClassRegistry({allowBase: true});

    /**
     * @memberOf FooBox.
     * @name icons
     * @type {FooBox.utils.SVGRegistry}
     */
    _.icons = new _utils.SVGRegistry({
        id: "foobox-icons",
        iconClass: "fbx-icon"
    });

})(
    FooBox,
    FooBox.utils
);