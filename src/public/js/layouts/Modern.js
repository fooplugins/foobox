(function(_, _utils){

    _.Modal.Modern = _.Modal.extend(/** @lend FooBox.Modal.Modern.prototype */{
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

        }
    });

    _.layouts.register("modern", _.Modal.Modern, {
        options: {
            icons: {
                close: "cross2",
                info: "info2",
                toggle: "cross-small",
                prev: "arrow-left2",
                next: "arrow-right2",
                loading: "spinner"
            }
        },
        i18n: {},
        classes: {
            layouts: { modern: "fbx-modern" }
        }
    });

})(
    FooBox,
    FooBox.utils
);