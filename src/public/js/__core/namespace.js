(function($, _){

    /**
     * @summary A reference to the jQuery object the plugin is registered with.
     * @memberof FooBox
     * @function $
     * @type {jQuery}
     * @description This is used internally for all jQuery operations to help work around issues where multiple jQuery libraries have been included in a single page.
     * @example {@caption The following shows the issue when multiple jQuery's are included in a single page.}{@lang xml}
     * <script src="jquery-1.12.4.js"></script>
     * <script src="foobox.js"></script>
     * <script src="jquery-2.2.4.js"></script>
     * <script>
     * 	jQuery(function($){
     * 		$(".selector").foobox(); // => This would throw a TypeError: $(...).foobox is not a function
     * 	});
     * </script>
     * @example {@caption The reason the above throws an error is that the `$.fn.foobox` function is registered to the first instance of jQuery in the page however the instance used to create the ready callback and actually try to execute `$(...).FooBox()` is the second. To resolve this issue ideally you would remove the second instance of jQuery however you can use the `FooBox.$` member to ensure you are always working with the instance of jQuery the plugin was registered with.}{@lang xml}
     * <script src="jquery-1.12.4.js"></script>
     * <script src="foobox.js"></script>
     * <script src="jquery-2.2.4.js"></script>
     * <script>
     * 	FooBox.$(function($){
     * 		$(".selector").foobox(); // => It works!
     * 	});
     * </script>
     */
    _.$ = $;

    /**
     * @summary The jQuery plugin namespace.
     * @external "jQuery.fn"
     * @see {@link http://learn.jquery.com/plugins/basic-plugin-creation/|How to Create a Basic Plugin | jQuery Learning Center}
     */

})(
    // dependencies
    jQuery,
    /**
     * @summary The core namespace for the plugin containing all its code.
     * @namespace FooBox
     * @description This plugin houses all it's code within a single `FooBox` global variable to prevent polluting the global namespace and to make accessing its various members simpler.
     * @example {@caption As this namespace is registered as a global on the `window` object, it can be accessed using the `window.` prefix.}
     * var fg = window.FooBox;
     * @example {@caption Or without it.}
     * var fg = FooBox;
     * @example {@caption When using this namespace I would recommend aliasing it to a short variable name such as `fg` or as used internally `_`.}
     * // alias the FooBox namespace
     * var _ = FooBox;
     * @example {@caption This is not required but lets us write less code and allows the alias to be minified by compressors like UglifyJS. How you choose to alias the namespace is up to you. You can use the simple `var` method as seen above or supply the namespace as a parameter when creating a new scope as seen below.}
     * // create a new scope to work in passing the namespace as a parameter
     * (function(_){
     *
     * 	// use `_.` to access members and methods
     *
     * })(FooBox);
     */
    window.FooBox = window.FooBox || {}
);