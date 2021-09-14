(function(_){

    _.configuration = {
        /**
         * @summary The options used by the parser to find items to display within FooBox.
         * @type {Object}
         */
        parser: {
            /**
             * @summary An array of CSS selectors the plugin uses to find containers of items.
             * @description The order of these selectors is important! FooBox will initialized itself based on the order of the
             * selectors within this array. Lower index selectors have priority on items so if a selector at indexes `0`
             * and `1` both match an element then the FooBox instance created by the index `0` selector will win the item.
             *
             * Selectors that match multiple elements like `"[data-foobox],.foobox"` also have an inherent priority order
             * that they follow however it may not seem straight forward at first. They do not follow the order
             * specified in the selector, instead they follow the order in which the matched elements are found within
             * the DOM, from top to bottom. Those found first within the DOM take priority and will receive any items
             * matched by any following selectors.
             *
             * The idea here is that the first selector is the specific selector targeting elements that should be
             * FooBox instances. The second selector, `"body"`, is a generic selector that can be removed if required. It
             * is run after the specific selectors and picks up random items that exist within the page if they do not
             * already belong to a FooBox instance and match any of defined types.
             * @type {String[]}
             */
            containers: [
                "[data-foobox],.foobox",
                "body"
            ],
            items: "a,button,area",
            exclude: ".nolightbox",
            types: {
                image: {
                    regex: /^https?:\/\/.*?\/.*?\.(jpg|jpeg|png|gif|bmp|webp|svg)/i,
                    exclude: null,
                    selector: null,
                    defaults: {

                    }
                },
                video: {
                    regex: /(youtube(-nocookie)?\.com\/(watch|v|embed)|youtu\.be|vimeo\.com(?!(\/user))|\.mp4|\.ogv|\.wmv|\.webm|(.+)?(wistia\.(com|net)|wi\.st)\/.*|(www.)?dailymotion\.com|dai\.ly)/i,
                    exclude: null,
                    selector: null
                },
                iframe: {
                    regex: /^https?:/i,
                    exclude: null,
                    selector: "[target='foobox']"
                }
            }
        },
        modal: {

        },
        defaults: {
            id: null,
            layout: null,
            loop: true
        },
        i18n: {},
        classes: {}
    };

    /**
     * @typedef {?Object} FooBox~Configuration
     * @property {FooBox.Parser~Options} [parser]
     * @property {FooBox.Modal~Options} [defaults]
     * @property {FooBox.Modal~i18n} [i18n]
     * @property {FooBox.Modal~CSSClasses} [classes]
     */

})(
    FooBox
);