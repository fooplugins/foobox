"use strict";

(function ($, _) {
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
})( // dependencies
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
window.FooBox = window.FooBox || {});
"use strict";

(function (_) {
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
      containers: ["[data-foobox],.foobox", "body"],
      items: "a,button,area",
      exclude: ".nolightbox",
      types: {
        image: {
          regex: /^https?:\/\/.*?\/.*?\.(jpg|jpeg|png|gif|bmp|webp|svg)/i,
          exclude: null,
          selector: null,
          defaults: {}
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
    modal: {},
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
})(FooBox);
"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}
/*!
* FooBox.utils - Contains common utility methods and classes used in our plugins.
* @version 1.0.0
* @link https://github.com/steveush/foo-utils#readme
* @copyright Steve Usher 2021
* @license Released under the GPL-3.0 license.
*/

/**
 * @file This creates the global FooBox.utils namespace
 */


(function ($) {
  if (!$) {
    console.warn('jQuery must be included in the page prior to the FooBox.utils library.');
    return;
  }

  function __exists() {
    try {
      return !!window.FooBox.utils; // does the namespace already exist?
    } catch (err) {
      return false;
    }
  }

  if (!__exists()) {
    /**
     * @summary This namespace contains common utility methods and code shared between our plugins.
     * @global
     * @namespace FooBox.utils
     * @description This namespace relies on jQuery being included in the page prior to it being loaded.
     */
    window.FooBox.utils = {
      /**
       * @summary A reference to the jQuery object the library is registered with.
       * @memberof FooBox.utils.
       * @name $
       * @type {jQuery}
       * @description This is used internally for all jQuery operations to help work around issues where multiple jQuery libraries have been included in a single page.
       * @example {@caption The following shows the issue when multiple jQuery's are included in a single page.}{@lang html}
       * <script src="jquery-1.12.4.js"></script>
       * <script src="my-plugin.js"></script>
       * <script src="jquery-2.2.4.js"></script>
       * <script>
       * 	jQuery(function($){
       * 		$(".selector").myPlugin(); // => This would throw a TypeError: $(...).myPlugin is not a function
       * 	});
       * </script>
       * @example {@caption The reason the above throws an error is that the `$.fn.myPlugin` function is registered to the first instance of jQuery in the page however the instance used to create the ready callback and actually try to execute `$(...).myPlugin()` is the second. To resolve this issue ideally you would remove the second instance of jQuery however you can use the `FooBox.utils.$` member to ensure you are always working with the instance of jQuery the library was registered with.}{@lang html}
       * <script src="jquery-1.12.4.js"></script>
       * <script src="my-plugin.js"></script>
       * <script src="jquery-2.2.4.js"></script>
       * <script>
       * 	FooBox.utils.$(function($){
       * 		$(".selector").myPlugin(); // => It works!
       * 	});
       * </script>
       */
      $: $,

      /**
       * @summary The version of this library.
       * @memberof FooBox.utils.
       * @name version
       * @type {string}
       */
      version: '1.0.0'
    };
  } // at this point there will always be a FooBox.utils namespace registered to the global scope.

})(jQuery);

(function ($, _) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return;
  /**
   * @summary Contains common type checking utility methods.
   * @memberof FooBox.utils.
   * @namespace is
   */

  _.is = {};
  /**
   * @summary Checks if the `value` is an array.
   * @memberof FooBox.utils.is.
   * @function array
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the supplied `value` is an array.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * console.log( _is.array( [] ) ); // => true
   * console.log( _is.array( null ) ); // => false
   * console.log( _is.array( 123 ) ); // => false
   * console.log( _is.array( "" ) ); // => false
   */

  _.is.array = function (value) {
    return '[object Array]' === Object.prototype.toString.call(value);
  };
  /**
   * @summary Checks if the `value` is a boolean.
   * @memberof FooBox.utils.is.
   * @function boolean
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the supplied `value` is a boolean.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * console.log( _is.boolean( true ) ); // => true
   * console.log( _is.boolean( false ) ); // => true
   * console.log( _is.boolean( "true" ) ); // => false
   * console.log( _is.boolean( "false" ) ); // => false
   * console.log( _is.boolean( 1 ) ); // => false
   * console.log( _is.boolean( 0 ) ); // => false
   */


  _.is.boolean = function (value) {
    return '[object Boolean]' === Object.prototype.toString.call(value);
  };
  /**
   * @summary Checks if the `value` is an element.
   * @memberof FooBox.utils.is.
   * @function element
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the supplied `value` is an element.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is,
   * 	// create an element to test
   * 	el = document.createElement("span");
   *
   * console.log( _is.element( el ) ); // => true
   * console.log( _is.element( $(el) ) ); // => false
   * console.log( _is.element( null ) ); // => false
   * console.log( _is.element( {} ) ); // => false
   */


  _.is.element = function (value) {
    return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === 'object' ? value instanceof HTMLElement : !!value && _typeof(value) === 'object' && value.nodeType === 1 && typeof value.nodeName === 'string';
  };
  /**
   * @summary Checks if the `value` is empty.
   * @memberof FooBox.utils.is.
   * @function empty
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the supplied `value` is empty.
   * @description The following values are considered to be empty by this method:
   *
   * <ul><!--
   * --><li>`""`			- An empty string</li><!--
   * --><li>`0`			- 0 as an integer</li><!--
   * --><li>`0.0`		- 0 as a float</li><!--
   * --><li>`[]`			- An empty array</li><!--
   * --><li>`{}`			- An empty object</li><!--
   * --><li>`$()`		- An empty jQuery object</li><!--
   * --><li>`false`</li><!--
   * --><li>`null`</li><!--
   * --><li>`undefined`</li><!--
   * --></ul>
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * console.log( _is.empty( undefined ) ); // => true
   * console.log( _is.empty( null ) ); // => true
   * console.log( _is.empty( 0 ) ); // => true
   * console.log( _is.empty( 0.0 ) ); // => true
   * console.log( _is.empty( "" ) ); // => true
   * console.log( _is.empty( [] ) ); // => true
   * console.log( _is.empty( {} ) ); // => true
   * console.log( _is.empty( 1 ) ); // => false
   * console.log( _is.empty( 0.1 ) ); // => false
   * console.log( _is.empty( "one" ) ); // => false
   * console.log( _is.empty( ["one"] ) ); // => false
   * console.log( _is.empty( { "name": "My Object" } ) ); // => false
   */


  _.is.empty = function (value) {
    if (_.is.undef(value) || value === null) return true;
    if (_.is.number(value) && value === 0) return true;
    if (_.is.boolean(value) && value === false) return true;
    if (_.is.string(value) && value.length === 0) return true;
    if (_.is.array(value) && value.length === 0) return true;
    if (_.is.jq(value) && value.length === 0) return true;

    if (_.is.hash(value)) {
      for (var prop in value) {
        if (value.hasOwnProperty(prop)) return false;
      }

      return true;
    }

    return false;
  };
  /**
   * @summary Checks if the `value` is an error.
   * @memberof FooBox.utils.is.
   * @function error
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the supplied `value` is an error.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is,
   * 	// create some errors to test
   * 	err1 = new Error("err1"),
   * 	err2 = new SyntaxError("err2");
   *
   * console.log( _is.error( err1 ) ); // => true
   * console.log( _is.error( err2 ) ); // => true
   * console.log( _is.error( null ) ); // => false
   * console.log( _is.error( 123 ) ); // => false
   * console.log( _is.error( "" ) ); // => false
   * console.log( _is.error( {} ) ); // => false
   * console.log( _is.error( [] ) ); // => false
   */


  _.is.error = function (value) {
    return '[object Error]' === Object.prototype.toString.call(value);
  };
  /**
   * @summary Checks if the `value` is a function.
   * @memberof FooBox.utils.is.
   * @function fn
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the supplied `value` is a function.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is,
   * 	// create a function to test
   * 	func = function(){};
   *
   * console.log( _is.fn( func ) ); // => true
   * console.log( _is.fn( null ) ); // => false
   * console.log( _is.fn( 123 ) ); // => false
   * console.log( _is.fn( "" ) ); // => false
   */


  _.is.fn = function (value) {
    return value === window.alert || '[object Function]' === Object.prototype.toString.call(value);
  };
  /**
   * @summary Checks if the `value` is a hash.
   * @memberof FooBox.utils.is.
   * @function hash
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the supplied `value` is a hash.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * console.log( _is.hash( {"some": "prop"} ) ); // => true
   * console.log( _is.hash( {} ) ); // => true
   * console.log( _is.hash( window ) ); // => false
   * console.log( _is.hash( document ) ); // => false
   * console.log( _is.hash( "" ) ); // => false
   * console.log( _is.hash( 123 ) ); // => false
   */


  _.is.hash = function (value) {
    return _.is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
  };
  /**
   * @summary Checks if the `value` is a jQuery object.
   * @memberof FooBox.utils.is.
   * @function jq
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the supplied `value` is a jQuery object.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is,
   * 	// create an element to test
   * 	el = document.createElement("span");
   *
   * console.log( _is.jq( $(el) ) ); // => true
   * console.log( _is.jq( $() ) ); // => true
   * console.log( _is.jq( el ) ); // => false
   * console.log( _is.jq( {} ) ); // => false
   * console.log( _is.jq( null ) ); // => false
   * console.log( _is.jq( 123 ) ); // => false
   * console.log( _is.jq( "" ) ); // => false
   */


  _.is.jq = function (value) {
    return !_.is.undef($) && value instanceof $;
  };
  /**
   * @summary Checks if the `value` is a number.
   * @memberof FooBox.utils.is.
   * @function number
   * @param {*} value - The value to check.
   * @returns {boolean}
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * console.log( _is.number( 123 ) ); // => true
   * console.log( _is.number( undefined ) ); // => false
   * console.log( _is.number( null ) ); // => false
   * console.log( _is.number( "" ) ); // => false
   */


  _.is.number = function (value) {
    return '[object Number]' === Object.prototype.toString.call(value) && !isNaN(value);
  };
  /**
   * @summary Checks if the `value` is an object.
   * @memberof FooBox.utils.is.
   * @function object
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the supplied `value` is an object.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * console.log( _is.object( {"some": "prop"} ) ); // => true
   * console.log( _is.object( {} ) ); // => true
   * console.log( _is.object( window ) ); // => true
   * console.log( _is.object( document ) ); // => true
   * console.log( _is.object( undefined ) ); // => false
   * console.log( _is.object( null ) ); // => false
   * console.log( _is.object( "" ) ); // => false
   * console.log( _is.object( 123 ) ); // => false
   */


  _.is.object = function (value) {
    return '[object Object]' === Object.prototype.toString.call(value) && !_.is.undef(value) && value !== null;
  };
  /**
   * @summary Checks if the `value` is a promise.
   * @memberof FooBox.utils.is.
   * @function promise
   * @param {*} value - The object to check.
   * @returns {boolean} `true` if the supplied `value` is an object.
   * @description This is a simple check to determine if an object is a jQuery promise object. It simply checks the object has a `then` and `promise` function defined.
   *
   * The promise object is created as an object literal inside of `jQuery.Deferred`, it has no prototype, nor any other truly unique properties that could be used to distinguish it.
   *
   * This method should be a little more accurate than the internal jQuery one that simply checks for a `promise` function.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * console.log( _is.promise( $.Deferred() ) ); // => true
   * console.log( _is.promise( {} ) ); // => false
   * console.log( _is.promise( undefined ) ); // => false
   * console.log( _is.promise( null ) ); // => false
   * console.log( _is.promise( "" ) ); // => false
   * console.log( _is.promise( 123 ) ); // => false
   */


  _.is.promise = function (value) {
    return _.is.object(value) && _.is.fn(value.then) && _.is.fn(value.promise);
  };
  /**
   * @summary Checks if the `value` is a valid CSS length.
   * @memberof FooBox.utils.is.
   * @function size
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the `value` is a number or CSS length.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * console.log( _is.size( 80 ) ); // => true
   * console.log( _is.size( "80px" ) ); // => true
   * console.log( _is.size( "80em" ) ); // => true
   * console.log( _is.size( "80%" ) ); // => true
   * console.log( _is.size( {} ) ); // => false
   * console.log( _is.size( undefined ) ); // => false
   * console.log( _is.size( null ) ); // => false
   * console.log( _is.size( "" ) ); // => false
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/length|&lt;length&gt; - CSS | MDN} for more information on CSS length values.
   */


  _.is.size = function (value) {
    if (!(_.is.string(value) && !_.is.empty(value)) && !_.is.number(value)) return false;
    return /^(auto|none|(?:[\d.]*)+?(?:%|px|mm|q|cm|in|pt|pc|em|ex|ch|rem|vh|vw|vmin|vmax)?)$/.test(value);
  };
  /**
   * @summary Checks if the `value` is a string.
   * @memberof FooBox.utils.is.
   * @function string
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the `value` is a string.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * console.log( _is.string( "" ) ); // => true
   * console.log( _is.string( undefined ) ); // => false
   * console.log( _is.string( null ) ); // => false
   * console.log( _is.string( 123 ) ); // => false
   */


  _.is.string = function (value) {
    return '[object String]' === Object.prototype.toString.call(value);
  };
  /**
   * @summary Checks if the `value` is `undefined`.
   * @memberof FooBox.utils.is.
   * @function undef
   * @param {*} value - The value to check is undefined.
   * @returns {boolean} `true` if the supplied `value` is `undefined`.
   * @example {@run true}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * console.log( _is.undef( undefined ) ); // => true
   * console.log( _is.undef( null ) ); // => false
   * console.log( _is.undef( 123 ) ); // => false
   * console.log( _is.undef( "" ) ); // => false
   */


  _.is.undef = function (value) {
    return typeof value === 'undefined';
  };
})( // dependencies
FooBox.utils.$, FooBox.utils);

(function ($, _, _is) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return;
  /**
   * @memberof FooBox.utils.
   * @namespace fn
   * @summary Contains common function utility methods.
   */

  _.fn = {};
  var fnStr = Function.prototype.toString;
  /**
   * @summary The regular expression to test if a function uses the `this._super` method applied by the {@link FooBox.utils.fn.add} method.
   * @memberof FooBox.utils.fn.
   * @name CONTAINS_SUPER
   * @type {RegExp}
   * @default /\b_super\b/
   * @readonly
   * @description When the script is first loaded into the page this performs a quick check to see if the browser supports function decompilation. If it does the regular expression is set to match the expected `_super`, however if  function decompilation is not supported, the regular expression is set to match anything effectively making the test always return `true`.
   * @example {@run true}
   * // alias the FooBox.utils.fn namespace
   * var _fn = FooBox.utils.fn;
   *
   * // create some functions to test
   * function testFn1(){}
   * function testFn2(){
   * 	this._super();
   * }
   *
   * console.log( _fn.CONTAINS_SUPER.test( testFn1 ) ); // => false
   * console.log( _fn.CONTAINS_SUPER.test( testFn2 ) ); // => true
   *
   * // NOTE: in browsers that don't support functional decompilation both tests will return `true`
   */

  _.fn.CONTAINS_SUPER = /xyz/.test(fnStr.call(function () {
    //noinspection JSUnresolvedVariable,BadExpressionStatementJS
    xyz;
  })) ? /\b_super\b/ : /.*/;
  /**
   * @summary An empty function that does nothing. Useful for setting a default value and checking if it has changed.
   * @memberof FooBox.utils.fn.
   * @function noop
   */

  _.fn.noop = function () {};
  /**
   * @summary Adds or overrides the given method `name` on the `proto` using the supplied `fn`.
   * @memberof FooBox.utils.fn.
   * @function addOrOverride
   * @param {Object} proto - The prototype to add the method to.
   * @param {string} name - The name of the method to add, if this already exists the original will be exposed within the scope of the supplied `fn` as `this._super`.
   * @param {function} fn - The function to add to the prototype, if this is overriding an existing method you can use `this._super` to access the original within its' scope.
   * @description If the new method overrides a pre-existing one, this function will expose the overridden method as `this._super` within the new methods scope.
   *
   * This replaces having to write out the following to override a method and call its original:
   *
   * ```javascript
   * var original = MyClass.prototype.someMethod;
   * MyClass.prototype.someMethod = function(arg1, arg2){
   * 	// execute the original
   * 	original.call(this, arg1, arg2);
   * };
   * ```
   *
   * With the following:
   *
   * ```javascript
   * FooBox.utils.fn.addOrOverride( MyClass.prototype, "someMethod", function(arg1, arg2){
   * 	// execute the original
   * 	this._super(arg1, arg2);
   * });
   * ```
   *
   * This method is used by the {@link FooBox.utils.Class} to implement the inheritance of individual methods.
   * @example {@run true}
   * // alias the FooBox.utils.fn namespace
   * var _fn = FooBox.utils.fn;
   *
   * var proto = {
   * 	write: function( message ){
   * 		console.log( "Original#write: " + message );
   * 	}
   * };
   *
   * proto.write( "My message" ); // => "Original#write: My message"
   *
   * _fn.addOrOverride( proto, "write", function( message ){
   * 	message = "Override#write: " + message;
   * 	this._super( message );
   * } );
   *
   * proto.write( "My message" ); // => "Original#write: Override#write: My message"
   */


  _.fn.addOrOverride = function (proto, name, fn) {
    if (!_is.object(proto) || !_is.string(name) || _is.empty(name) || !_is.fn(fn)) return;

    var _super = proto[name],
        wrap = _is.fn(_super) && _.fn.CONTAINS_SUPER.test(fnStr.call(fn)); // only wrap the function if it overrides a method and makes use of `_super` within it's body.


    proto[name] = wrap ? function (_super, fn) {
      // create a new wrapped that exposes the original method as `_super`
      return function () {
        var tmp = this._super;
        this._super = _super;
        var ret = fn.apply(this, arguments);
        this._super = tmp;
        return ret;
      };
    }(_super, fn) : fn;
  };
  /**
   * @summary Exposes the `methods` from the `source` on the `target`.
   * @memberof FooBox.utils.fn.
   * @function expose
   * @param {Object} source - The object to expose methods from.
   * @param {Object} target - The object to expose methods on.
   * @param {String[]} methods - An array of method names to expose.
   * @param {*} [thisArg] - The value of `this` within the exposed `methods`. Defaults to the `source` object.
   */


  _.fn.expose = function (source, target, methods, thisArg) {
    if (_is.object(source) && _is.object(target) && _is.array(methods)) {
      thisArg = _is.undef(thisArg) ? source : thisArg;
      methods.forEach(function (method) {
        if (_is.string(method) && _is.fn(source[method])) {
          target[method] = source[method].bind(thisArg);
        }
      });
    }
  };
  /**
   * @summary Use the `Function.prototype.apply` method on a class constructor using the `new` keyword.
   * @memberof FooBox.utils.fn.
   * @function apply
   * @param {Object} klass - The class to create.
   * @param {Array} [args=[]] - The arguments to pass to the constructor.
   * @returns {Object} The new instance of the `klass` created with the supplied `args`.
   * @description When using the default `Function.prototype.apply` you can't use it on class constructors requiring the `new` keyword, this method allows us to do that.
   * @example {@run true}
   * // alias the FooBox.utils.fn namespace
   * var _fn = FooBox.utils.fn;
   *
   * // create a class to test with
   * function Test( name, value ){
   * 	if ( !( this instanceof Test )){
   * 		console.log( "Test instantiated without the `new` keyword." );
   * 		return;
   * 	}
   * 	console.log( "Test: name = " + name + ", value = " + value );
   * }
   *
   * Test.apply( Test, ["My name", "My value"] ); // => "Test instantiated without the `new` keyword."
   * _fn.apply( Test, ["My name", "My value"] ); // => "Test: name = My name, value = My value"
   */


  _.fn.apply = function (klass, args) {
    args.unshift(klass);
    return new (Function.prototype.bind.apply(klass, args))();
  };
  /**
   * @summary Converts the default `arguments` object into a proper array.
   * @memberof FooBox.utils.fn.
   * @function arg2arr
   * @param {IArguments} args - The arguments object to create an array from.
   * @returns {Array}
   * @description This method is simply a replacement for calling `Array.prototype.slice.call()` to create an array from an `arguments` object.
   * @example {@run true}
   * // alias the FooBox.utils.fn namespace
   * var _fn = FooBox.utils.fn;
   *
   * function callMe(){
   * 	var args = _fn.arg2arr(arguments);
   * 	console.log( arguments instanceof Array ); // => false
   * 	console.log( args instanceof Array ); // => true
   * 	console.log( args ); // => [ "arg1", "arg2" ]
   * }
   *
   * callMe("arg1", "arg2");
   */


  _.fn.arg2arr = function (args) {
    return Array.prototype.slice.call(args);
  };
  /**
   * @summary Debounce the `fn` by the supplied `time`.
   * @memberof FooBox.utils.fn.
   * @function debounce
   * @param {function} fn - The function to debounce.
   * @param {number} time - The time in milliseconds to delay execution.
   * @returns {function}
   * @description This returns a wrapped version of the `fn` which delays its' execution by the supplied `time`. Additional calls to the function will extend the delay until the `time` expires.
   */


  _.fn.debounce = function (fn, time) {
    var timeout;
    return function () {
      var ctx = this,
          args = _.fn.arg2arr(arguments);

      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(ctx, args);
      }, time);
    };
  };
  /**
   * @summary Throttles the `fn` by the supplied `time`.
   * @memberof FooBox.utils.fn.
   * @function throttle
   * @param {function} fn - The function to throttle.
   * @param {number} time - The time in milliseconds to delay execution.
   * @returns {function}
   * @description This returns a wrapped version of the `fn` which ensures it's executed only once every `time` milliseconds. The first call to the function will be executed, after that only the last of any additional calls will be executed once the `time` expires.
   */


  _.fn.throttle = function (fn, time) {
    var last, timeout;
    return function () {
      var ctx = this,
          args = _.fn.arg2arr(arguments);

      if (!last) {
        fn.apply(ctx, args);
        last = Date.now();
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          if (Date.now() - last >= time) {
            fn.apply(ctx, args);
            last = Date.now();
          }
        }, time - (Date.now() - last));
      }
    };
  };
  /**
   * @summary A resolved promise object.
   * @memberof FooBox.utils.fn.
   * @name resolved
   * @type {Promise}
   */


  _.fn.resolved = $.Deferred().resolve().promise();
  /**
   * @summary A rejected promise object.
   * @memberof FooBox.utils.fn.
   * @name rejected
   * @type {Promise}
   */

  _.fn.rejected = $.Deferred().reject().promise();
  /**
   * @summary Return a promise rejected using the supplied args.
   * @memberof FooBox.utils.fn.
   * @function reject
   * @param {*} [arg1] - The first argument to reject the promise with.
   * @param {...*} [argN] - Any additional arguments to reject the promise with.
   * @returns {Promise}
   */

  _.fn.reject = function (arg1, argN) {
    var def = $.Deferred(),
        args = _.fn.arg2arr(arguments);

    return def.reject.apply(def, args).promise();
  };
  /**
   * @summary Return a promise resolved using the supplied args.
   * @memberof FooBox.utils.fn.
   * @function resolve
   * @param {*} [arg1] - The first argument to resolve the promise with.
   * @param {...*} [argN] - Any additional arguments to resolve the promise with.
   * @returns {Promise}
   */


  _.fn.resolve = function (arg1, argN) {
    var def = $.Deferred(),
        args = _.fn.arg2arr(arguments);

    return def.resolve.apply(def, args).promise();
  };
  /**
   * @summary Return a promise rejected using the supplied args.
   * @memberof FooBox.utils.fn.
   * @function rejectWith
   * @param {*} thisArg - The value of `this` within the promises callbacks.
   * @param {*} [arg1] - The first argument to reject the promise with.
   * @param {...*} [argN] - Any additional arguments to reject the promise with.
   * @returns {Promise}
   */


  _.fn.rejectWith = function (thisArg, arg1, argN) {
    var def = $.Deferred(),
        args = _.fn.arg2arr(arguments);

    args.shift(); // remove the thisArg

    return def.rejectWith(thisArg, args).promise();
  };
  /**
   * @summary Return a promise resolved using the supplied args.
   * @memberof FooBox.utils.fn.
   * @function resolveWith
   * @param {*} thisArg - The value of `this` within the promises callbacks.
   * @param {*} [arg1] - The first argument to resolve the promise with.
   * @param {...*} [argN] - Any additional arguments to resolve the promise with.
   * @returns {Promise}
   */


  _.fn.resolveWith = function (thisArg, arg1, argN) {
    var def = $.Deferred(),
        args = _.fn.arg2arr(arguments);

    args.shift(); // remove the thisArg

    return def.resolveWith(thisArg, args).promise();
  };
  /**
   * @summary Waits for all promises to complete before resolving with an array containing the return value of each. This method will reject immediately with the first rejection message or error.
   * @memberof FooBox.utils.fn.
   * @function all
   * @param {Promise[]} promises - The array of promises to wait for.
   * @returns {Promise}
   */


  _.fn.all = function (promises) {
    var d = $.Deferred(),
        results = [];

    if (_is.array(promises) && promises.length > 0) {
      (function () {
        /**
         * Pushes the arguments into the results array at the supplied index.
         * @ignore
         * @param {number} index
         * @param {Array} args
         */
        var pushResult = function pushResult(index, args) {
          if (rejected) return;
          results[index] = args.length === 0 ? undefined : args.length === 1 ? args[0] : args;
          remaining--;
          if (!remaining) d.resolve(results);
        };

        var remaining = promises.length,
            rejected = false;
        var i = 0,
            l = promises.length;

        var _loop = function _loop() {
          if (rejected) return "break";
          var j = i; // hold a scoped reference that can be used in the async callbacks

          if (_is.promise(promises[j])) {
            promises[j].then(function () {
              pushResult(j, _.fn.arg2arr(arguments));
            }, function () {
              if (rejected) return;
              rejected = true;
              d.reject.apply(d, _.fn.arg2arr(arguments));
            });
          } else {
            // if we were supplied something that was not a promise then just add it as a fulfilled result
            pushResult(j, [promises[j]]);
          }
        };

        for (; i < l; i++) {
          var _ret = _loop();

          if (_ret === "break") break;
        }
      })();
    } else {
      d.resolve(results);
    }

    return d.promise();
  };
  /**
   * @summary Waits for all promises to complete before resolving with an array containing the outcome of each.
   * @memberof FooBox.utils.fn.
   * @function allSettled
   * @param {Promise[]} promises - The array of promises to wait for.
   * @returns {Promise}
   */


  _.fn.allSettled = function (promises) {
    var d = $.Deferred(),
        results = [];

    if (_is.array(promises) && promises.length > 0) {
      (function () {
        /**
         * Sets the value in the results array using the status and args.
         * @ignore
         * @param {number} index
         * @param {string} status
         * @param {Array} args
         */
        var setResult = function setResult(index, status, args) {
          results[index] = {
            status: status
          };

          if (args.length > 0) {
            var prop = status === "rejected" ? "reason" : "value";
            results[index][prop] = args.length === 1 ? args[0] : args;
          }

          remaining--;
          if (!remaining) d.resolve(results);
        };

        var remaining = promises.length;
        var i = 0,
            l = promises.length;

        var _loop2 = function _loop2() {
          var j = i; // hold a scoped reference that can be used in the async callbacks

          if (_is.promise(promises[j])) {
            promises[j].then(function () {
              setResult(j, "fulfilled", _.fn.arg2arr(arguments));
            }, function () {
              setResult(j, "rejected", _.fn.arg2arr(arguments));
            });
          } else {
            // if we were supplied something that was not a promise then just add it as a fulfilled result
            setResult(j, "fulfilled", [promises[j]]);
          }
        };

        for (; i < l; i++) {
          _loop2();
        }
      })();
    } else {
      d.resolve(results);
    }

    return d.promise();
  };
})( // dependencies
FooBox.utils.$, FooBox.utils, FooBox.utils.is);

(function (_, _is) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return;
  /**
   * @summary Contains common url utility methods.
   * @memberof FooBox.utils.
   * @namespace url
   */

  _.url = {}; // used for parsing a url into it's parts.

  var _a = document.createElement('a');
  /**
   * @summary Parses the supplied url into an object containing it's component parts.
   * @memberof FooBox.utils.url.
   * @function parts
   * @param {string} url - The url to parse.
   * @returns {FooBox.utils.url~Parts}
   * @example {@run true}
   * // alias the FooBox.utils.url namespace
   * var _url = FooBox.utils.url;
   *
   * console.log( _url.parts( "http://example.com/path/?param=true#something" ) ); // => {"hash":"#something", ...}
   */


  _.url.parts = function (url) {
    _a.href = url;
    var port = _a.port ? _a.port : ["http:", "https:"].indexOf(_a.protocol) !== -1 ? _a.protocol === "https:" ? "443" : "80" : "",
        host = _a.hostname + (port ? ":" + port : ""),
        origin = _a.origin ? _a.origin : _a.protocol + "//" + host,
        pathname = _a.pathname.slice(0, 1) === "/" ? _a.pathname : "/" + _a.pathname;
    return {
      hash: _a.hash,
      host: host,
      hostname: _a.hostname,
      href: _a.href,
      origin: origin,
      pathname: pathname,
      port: port,
      protocol: _a.protocol,
      search: _a.search
    };
  };
  /**
   * @summary Given a <code>url</code> that could be relative or full this ensures a full url is returned.
   * @memberof FooBox.utils.url.
   * @function full
   * @param {string} url - The url to ensure is full.
   * @returns {?string} `null` if the given `path` is not a string or empty.
   * @description Given a full url this will simply return it however if given a relative url this will create a full url using the current location to fill in the blanks.
   * @example {@run true}
   * // alias the FooBox.utils.url namespace
   * var _url = FooBox.utils.url;
   *
   * console.log( _url.full( "http://example.com/path/" ) ); // => "http://example.com/path/"
   * console.log( _url.full( "/path/" ) ); // => "{protocol}//{host}/path/"
   * console.log( _url.full( "path/" ) ); // => "{protocol}//{host}/{pathname}/path/"
   * console.log( _url.full( "../path/" ) ); // => "{protocol}//{host}/{calculated pathname}/path/"
   * console.log( _url.full() ); // => null
   * console.log( _url.full( 123 ) ); // => null
   */


  _.url.full = function (url) {
    if (!_is.string(url) || _is.empty(url)) return null;
    _a.href = url;
    return _a.href;
  };
  /**
   * @summary Gets or sets a parameter in the given <code>search</code> string.
   * @memberof FooBox.utils.url.
   * @function param
   * @param {string} search - The search string to use (usually `location.search`).
   * @param {string} key - The key of the parameter.
   * @param {?string} [value] - The value to set for the parameter. If not provided the current value for the `key` is returned.
   * @returns {?string} The value of the `key` in the given `search` string if no `value` is supplied or `null` if the `key` does not exist.
   * @returns {string} A modified `search` string if a `value` is supplied.
   * @example <caption>Shows how to retrieve a parameter value from a search string.</caption>{@run true}
   * // alias the FooBox.utils.url namespace
   * var _url = FooBox.utils.url,
   * 	// create a search string to test
   * 	search = "?wmode=opaque&autoplay=1";
   *
   * console.log( _url.param( search, "wmode" ) ); // => "opaque"
   * console.log( _url.param( search, "autoplay" ) ); // => "1"
   * console.log( _url.param( search, "nonexistent" ) ); // => null
   * @example <caption>Shows how to set a parameter value in the given search string.</caption>{@run true}
   * // alias the FooBox.utils.url namespace
   * var _url = FooBox.utils.url,
   * 	// create a search string to test
   * 	search = "?wmode=opaque&autoplay=1";
   *
   * console.log( _url.param( search, "wmode", "window" ) ); // => "?wmode=window&autoplay=1"
   * console.log( _url.param( search, "autoplay", "0" ) ); // => "?wmode=opaque&autoplay=0"
   * console.log( _url.param( search, "v", "2" ) ); // => "?wmode=opaque&autoplay=1&v=2"
   */


  _.url.param = function (search, key, value) {
    if (!_is.string(search) || !_is.string(key) || _is.empty(key)) return search;
    var regex, match, result, param;

    if (_is.undef(value)) {
      regex = new RegExp('[?|&]' + key + '=([^&;]+?)(&|#|;|$)'); // regex to match the key and it's value but only capture the value

      match = regex.exec(search) || ["", ""]; // match the param otherwise return an empty string match

      result = match[1].replace(/\+/g, '%20'); // replace any + character's with spaces

      return _is.string(result) && !_is.empty(result) ? decodeURIComponent(result) : null; // decode the result otherwise return null
    }

    if (_is.empty(value)) {
      regex = new RegExp('^([^#]*\?)(([^#]*)&)?' + key + '(\=[^&#]*)?(&|#|$)');
      result = search.replace(regex, '$1$3$5').replace(/^([^#]*)((\?)&|\?(#|$))/, '$1$3$4');
    } else {
      regex = new RegExp('([?&])' + key + '[^&]*'); // regex to match the key and it's current value but only capture the preceding ? or & char

      param = key + '=' + encodeURIComponent(value);
      result = search.replace(regex, '$1' + param); // replace any existing instance of the key with the new value
      // If nothing was replaced, then add the new param to the end

      if (result === search && !regex.test(result)) {
        // if no replacement occurred and the parameter is not currently in the result then add it
        result += (result.indexOf("?") !== -1 ? '&' : '?') + param;
      }
    }

    return result;
  }; //######################
  //## Type Definitions ##
  //######################

  /**
   * @summary A plain JavaScript object returned by the {@link FooBox.utils.url.parts} method.
   * @typedef {Object} FooBox.utils.url~Parts
   * @property {string} hash - A string containing a `#` followed by the fragment identifier of the URL.
   * @property {string} host - A string containing the host, that is the hostname, a `:`, and the port of the URL.
   * @property {string} hostname - A string containing the domain of the URL.
   * @property {string} href - A string containing the entire URL.
   * @property {string} origin - A string containing the canonical form of the origin of the specific location.
   * @property {string} pathname - A string containing an initial `/` followed by the path of the URL.
   * @property {string} port - A string containing the port number of the URL.
   * @property {string} protocol - A string containing the protocol scheme of the URL, including the final `:`.
   * @property {string} search - A string containing a `?` followed by the parameters of the URL. Also known as "querystring".
   * @see {@link FooBox.utils.url.parts} for example usage.
   */

})( // dependencies
FooBox.utils, FooBox.utils.is);

(function (_, _is, _fn) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return;
  /**
   * @summary Contains common string utility methods.
   * @memberof FooBox.utils.
   * @namespace str
   */

  _.str = {};
  /**
   * @summary Removes whitespace from both ends of the target string.
   * @memberof FooBox.utils.str.
   * @function trim
   * @param {string} target - The string to trim.
   * @returns {string|null} Returns `null` if the supplied target is not a string.
   */

  _.str.trim = function (target) {
    return _is.string(target) ? target.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') : null;
  };
  /**
   * @summary Converts the given `target` to camel case.
   * @memberof FooBox.utils.str.
   * @function camel
   * @param {string} target - The string to camel case.
   * @returns {string}
   * @example {@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str;
   *
   * console.log( _str.camel( "max-width" ) ); // => "maxWidth"
   * console.log( _str.camel( "max--width" ) ); // => "maxWidth"
   * console.log( _str.camel( "max Width" ) ); // => "maxWidth"
   * console.log( _str.camel( "Max_width" ) ); // => "maxWidth"
   * console.log( _str.camel( "MaxWidth" ) ); // => "maxWidth"
   * console.log( _str.camel( "Abbreviations like CSS are left intact" ) ); // => "abbreviationsLikeCSSAreLeftIntact"
   */


  _.str.camel = function (target) {
    if (!_is.string(target)) return target;
    if (target.toUpperCase() === target) return target.toLowerCase();
    return target.replace(/^([A-Z])|[-\s_]+(\w)/g, function (match, p1, p2) {
      if (_is.string(p2)) return p2.toUpperCase();
      return p1.toLowerCase();
    });
  };
  /**
   * @summary Converts the given `target` to kebab case. Non-alphanumeric characters are converted to `-`.
   * @memberof FooBox.utils.str.
   * @function kebab
   * @param {string} target - The string to kebab case.
   * @returns {string}
   * @example {@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str;
   *
   * console.log( _str.kebab( "max-width" ) ); // => "max-width"
   * console.log( _str.kebab( "max--width" ) ); // => "max-width"
   * console.log( _str.kebab( "max Width" ) ); // => "max-width"
   * console.log( _str.kebab( "Max_width" ) ); // => "max-width"
   * console.log( _str.kebab( "MaxWidth" ) ); // => "max-width"
   * console.log( _str.kebab( "Non-alphanumeric ch@racters are converted to dashes!" ) ); // => "non-alphanumeric-ch-racters-are-converted-to-dashes"
   */


  _.str.kebab = function (target) {
    if (!_is.string(target)) return target;
    return target.match(/[A-Z]{2,}(?=[A-Z][a-z0-9]*|\b)|[A-Z]?[a-z0-9]*|[A-Z]|[0-9]+/g).filter(Boolean).map(function (x) {
      return x.toLowerCase();
    }).join('-');
  };
  /**
   * @summary Checks if the `target` contains the given `substr`.
   * @memberof FooBox.utils.str.
   * @function contains
   * @param {string} target - The string to check.
   * @param {string} substr - The string to check for.
   * @param {boolean} [ignoreCase=false] - Whether or not to ignore casing when performing the check.
   * @returns {boolean} `true` if the `target` contains the given `substr`.
   * @example {@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str,
   * 	// create a string to test
   * 	target = "To be, or not to be, that is the question.";
   *
   * console.log( _str.contains( target, "To be" ) ); // => true
   * console.log( _str.contains( target, "question" ) ); // => true
   * console.log( _str.contains( target, "no" ) ); // => true
   * console.log( _str.contains( target, "nonexistent" ) ); // => false
   * console.log( _str.contains( target, "TO BE" ) ); // => false
   * console.log( _str.contains( target, "TO BE", true ) ); // => true
   */


  _.str.contains = function (target, substr, ignoreCase) {
    if (!_is.string(target) || _is.empty(target) || !_is.string(substr) || _is.empty(substr)) return false;
    return substr.length <= target.length && (!!ignoreCase ? target.toUpperCase().indexOf(substr.toUpperCase()) : target.indexOf(substr)) !== -1;
  };
  /**
   * @summary Checks if the `target` contains the given `word`.
   * @memberof FooBox.utils.str.
   * @function containsWord
   * @param {string} target - The string to check.
   * @param {string} word - The word to check for.
   * @param {boolean} [ignoreCase=false] - Whether or not to ignore casing when performing the check.
   * @returns {boolean} `true` if the `target` contains the given `word`.
   * @description This method differs from {@link FooBox.utils.str.contains} in that it searches for whole words by splitting the `target` string on word boundaries (`\b`) and then comparing the individual parts.
   * @example {@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str,
   * 	// create a string to test
   * 	target = "To be, or not to be, that is the question.";
   *
   * console.log( _str.containsWord( target, "question" ) ); // => true
   * console.log( _str.containsWord( target, "no" ) ); // => false
   * console.log( _str.containsWord( target, "NOT" ) ); // => false
   * console.log( _str.containsWord( target, "NOT", true ) ); // => true
   * console.log( _str.containsWord( target, "nonexistent" ) ); // => false
   */


  _.str.containsWord = function (target, word, ignoreCase) {
    if (!_is.string(target) || _is.empty(target) || !_is.string(word) || _is.empty(word) || target.length < word.length) return false;
    var parts = target.split(/\W/);
    var i = 0,
        len = parts.length;

    for (; i < len; i++) {
      if (ignoreCase ? parts[i].toUpperCase() === word.toUpperCase() : parts[i] === word) return true;
    }

    return false;
  };
  /**
   * @summary Checks if the `target` ends with the given `substr`.
   * @memberof FooBox.utils.str.
   * @function endsWith
   * @param {string} target - The string to check.
   * @param {string} substr - The substr to check for.
   * @returns {boolean} `true` if the `target` ends with the given `substr`.
   * @example {@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str;
   *
   * console.log( _str.endsWith( "something", "g" ) ); // => true
   * console.log( _str.endsWith( "something", "ing" ) ); // => true
   * console.log( _str.endsWith( "something", "no" ) ); // => false
   */


  _.str.endsWith = function (target, substr) {
    if (!_is.string(target) || !_is.string(substr) || substr.length > target.length) return false;
    return target.slice(target.length - substr.length) === substr;
  };
  /**
   * @summary Checks if the `target` starts with the given `substr`.
   * @memberof FooBox.utils.str.
   * @function startsWith
   * @param {string} target - The string to check.
   * @param {string} substr - The substr to check for.
   * @returns {boolean} `true` if the `target` starts with the given `substr`.
   * @example {@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str;
   *
   * console.log( _str.startsWith( "something", "s" ) ); // => true
   * console.log( _str.startsWith( "something", "some" ) ); // => true
   * console.log( _str.startsWith( "something", "no" ) ); // => false
   */


  _.str.startsWith = function (target, substr) {
    if (_is.empty(target) || _is.empty(substr)) return false;
    return target.slice(0, substr.length) === substr;
  };
  /**
   * @summary Escapes the `target` for use in a regular expression.
   * @memberof FooBox.utils.str.
   * @function escapeRegExp
   * @param {string} target - The string to escape.
   * @returns {string}
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
   */


  _.str.escapeRegExp = function (target) {
    if (!_is.string(target)) return target;
    return target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };
  /**
   * @summary Generates a 32 bit FNV-1a hash from the given `target`.
   * @memberof FooBox.utils.str.
   * @function fnv1a
   * @param {string} target - The string to generate a hash from.
   * @returns {?number} `null` if the `target` is not a string or empty otherwise a 32 bit FNV-1a hash.
   * @example {@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str;
   *
   * console.log( _str.fnv1a( "Some string to generate a hash for." ) ); // => 207568994
   * console.log( _str.fnv1a( "Some string to generate a hash for" ) ); // => 1350435704
   * @see {@link https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function|Fowler–Noll–Vo hash function}
   */


  _.str.fnv1a = function (target) {
    if (!_is.string(target) || _is.empty(target)) return null;
    var i,
        l,
        hval = 0x811c9dc5;

    for (i = 0, l = target.length; i < l; i++) {
      hval ^= target.charCodeAt(i);
      hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }

    return hval >>> 0;
  };
  /**
   * @summary Returns the remainder of the `target` split on the first index of the given `substr`.
   * @memberof FooBox.utils.str.
   * @function from
   * @param {string} target - The string to split.
   * @param {string} substr - The substring to split on.
   * @returns {?string} `null` if the given `substr` does not exist within the `target`.
   * @example {@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str,
   * 	// create a string to test
   * 	target = "To be, or not to be, that is the question.";
   *
   * console.log( _str.from( target, "no" ) ); // => "t to be, that is the question."
   * console.log( _str.from( target, "that" ) ); // => " is the question."
   * console.log( _str.from( target, "question" ) ); // => "."
   * console.log( _str.from( target, "nonexistent" ) ); // => null
   */


  _.str.from = function (target, substr) {
    return _.str.contains(target, substr) ? target.substring(target.indexOf(substr) + substr.length) : null;
  };
  /**
   * @summary Joins any number of strings using the given `separator`.
   * @memberof FooBox.utils.str.
   * @function join
   * @param {string} separator - The separator to use to join the strings.
   * @param {string} part - The first string to join.
   * @param {...string} [partN] - Any number of additional strings to join.
   * @returns {?string}
   * @description This method differs from using the standard `Array.prototype.join` function to join strings in that it ignores empty parts and checks to see if each starts with the supplied `separator`. If the part starts with the `separator` it is removed before appending it to the final result.
   * @example {@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str;
   *
   * console.log( _str.join( "_", "all", "in", "one" ) ); // => "all_in_one"
   * console.log( _str.join( "_", "all", "_in", "one" ) ); // => "all_in_one"
   * console.log( _str.join( "/", "http://", "/example.com/", "/path/to/image.png" ) ); // => "http://example.com/path/to/image.png"
   * console.log( _str.join( "/", "http://", "/example.com", "/path/to/image.png" ) ); // => "http://example.com/path/to/image.png"
   * console.log( _str.join( "/", "http://", "example.com", "path/to/image.png" ) ); // => "http://example.com/path/to/image.png"
   */


  _.str.join = function (separator, part, partN) {
    if (!_is.string(separator) || !_is.string(part)) return null;

    var parts = _fn.arg2arr(arguments);

    separator = parts.shift();
    var i,
        l,
        result = parts.shift();

    for (i = 0, l = parts.length; i < l; i++) {
      part = parts[i];
      if (_is.empty(part)) continue;

      if (_.str.endsWith(result, separator)) {
        result = result.slice(0, result.length - separator.length);
      }

      if (_.str.startsWith(part, separator)) {
        part = part.slice(separator.length);
      }

      result += separator + part;
    }

    return result;
  };
  /**
   * @summary Returns the first part of the `target` split on the first index of the given `substr`.
   * @memberof FooBox.utils.str.
   * @function until
   * @param {string} target - The string to split.
   * @param {string} substr - The substring to split on.
   * @returns {string} The `target` if the `substr` does not exist.
   * @example {@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str,
   * 	// create a string to test
   * 	target = "To be, or not to be, that is the question.";
   *
   * console.log( _str.until( target, "no" ) ); // => "To be, or "
   * console.log( _str.until( target, "that" ) ); // => "To be, or not to be, "
   * console.log( _str.until( target, "question" ) ); // => "To be, or not to be, that is the "
   * console.log( _str.until( target, "nonexistent" ) ); // => "To be, or not to be, that is the question."
   */


  _.str.until = function (target, substr) {
    return _.str.contains(target, substr) ? target.substring(0, target.indexOf(substr)) : target;
  };
  /**
   * @summary A basic string formatter that can use both index and name based placeholders but handles only string or number replacements.
   * @memberof FooBox.utils.str.
   * @function format
   * @param {string} target - The format string containing any placeholders to replace.
   * @param {string|number|Object|Array} arg1 - The first value to format the target with. If an object is supplied it's properties are used to match named placeholders. If an array, string or number is supplied it's values are used to match any index placeholders.
   * @param {...(string|number)} [argN] - Any number of additional strings or numbers to format the target with.
   * @returns {string} The string formatted with the supplied arguments.
   * @description This method allows you to supply the replacements as an object when using named placeholders or as an array or additional arguments when using index placeholders.
   *
   * This does not perform a simultaneous replacement of placeholders, which is why it's referred to as a basic formatter. This means replacements that contain placeholders within there value could end up being replaced themselves as seen in the last example.
   * @example {@caption The following shows how to use index placeholders.}{@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str,
   * 	// create a format string using index placeholders
   * 	format = "Hello, {0}, are you feeling {1}?";
   *
   * console.log( _str.format( format, "Steve", "OK" ) ); // => "Hello, Steve, are you feeling OK?"
   * // or
   * console.log( _str.format( format, [ "Steve", "OK" ] ) ); // => "Hello, Steve, are you feeling OK?"
   * @example {@caption While the above works perfectly fine the downside is that the placeholders provide no clues as to what should be supplied as a replacement value, this is were supplying an object and using named placeholders steps in.}{@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str,
   * 	// create a format string using named placeholders
   * 	format = "Hello, {name}, are you feeling {adjective}?";
   *
   * console.log( _str.format( format, {name: "Steve", adjective: "OK"} ) ); // => "Hello, Steve, are you feeling OK?"
   * @example {@caption The following demonstrates the issue with not performing a simultaneous replacement of placeholders.}{@run true}
   * // alias the FooBox.utils.str namespace
   * var _str = FooBox.utils.str;
   *
   * console.log( _str.format("{0}{1}", "{1}", "{0}") ); // => "{0}{0}"
   *
   * // If the replacement happened simultaneously the result would be "{1}{0}" but this method executes
   * // replacements synchronously as seen below:
   *
   * // "{0}{1}".replace( "{0}", "{1}" )
   * // => "{1}{1}".replace( "{1}", "{0}" )
   * // => "{0}{0}"
   */


  _.str.format = function (target, arg1, argN) {
    var args = _fn.arg2arr(arguments);

    target = args.shift(); // remove the target from the args

    if (_is.string(target) && args.length > 0) {
      if (args.length === 1 && (_is.array(args[0]) || _is.object(args[0]))) {
        args = args[0];
      }

      _.each(args, function (value, placeholder) {
        target = target.replace(new RegExp("\\{" + placeholder + "\\}", "gi"), value + "");
      });
    }

    return target;
  };
})( // dependencies
FooBox.utils, FooBox.utils.is, FooBox.utils.fn);

(function ($, _, _is, _fn, _str) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return;
  /**
   * @summary Contains common object utility methods.
   * @memberof FooBox.utils.
   * @namespace obj
   */

  _.obj = {};
  /**
   * @summary Creates a new object with the specified prototype.
   * @memberof FooBox.utils.obj.
   * @function create
   * @param {Object} proto - The object which should be the prototype of the newly-created object.
   * @returns {Object} A new object with the specified prototype.
   * @description This is a basic implementation of the {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create|Object.create} method.
   */

  _.obj.create = function (proto) {
    if (!_is.object(proto)) throw TypeError('Argument must be an object');

    function Obj() {}

    Obj.prototype = proto;
    return new Obj();
  };
  /**
   * @summary Merge the contents of two or more objects together into the first `target` object.
   * @memberof FooBox.utils.obj.
   * @function extend
   * @param {Object} target - The object to merge properties into.
   * @param {Object} object - An object containing properties to merge.
   * @param {...Object} [objectN] - Additional objects containing properties to merge.
   * @returns {Object} The `target` merged with the contents from any additional objects.
   * @description This does not merge arrays by index as jQuery does, it treats them as a single property and replaces the array with a shallow copy of the new one.
   *
   * This method makes use of the {@link FooBox.utils.obj.merge} method internally.
   * @example {@run true}
   * // alias the FooBox.utils.obj namespace
   * var _obj = FooBox.utils.obj,
   * 	// create some objects to merge
   * 	defaults = {"name": "My Object", "enabled": false, "arr": [1,2,3]},
   * 	options = {"enabled": true, "something": 123, "arr": [4,5,6]};
   *
   * // merge the two objects into a new third one without modifying either of the originals
   * var settings = _obj.extend( {}, defaults, options );
   *
   * console.log( settings ); // => {"name": "My Object", "enabled": true, "arr": [4,5,6], "something": 123}
   * console.log( defaults ); // => {"name": "My Object", "enabled": true, "arr": [1,2,3]}
   * console.log( options ); // => {"enabled": true, "arr": [4,5,6], "something": 123}
   */


  _.obj.extend = function (target, object, objectN) {
    target = _is.object(target) ? target : {};

    var objects = _fn.arg2arr(arguments);

    objects.shift();

    _.each(objects, function (object) {
      _.obj.merge(target, object);
    });

    return target;
  };
  /**
   * @summary Merge the contents of two objects together into the first `target` object.
   * @memberof FooBox.utils.obj.
   * @function merge
   * @param {Object} target - The object to merge properties into.
   * @param {Object} object - The object containing properties to merge.
   * @returns {Object} The `target` merged with the contents from the `object`.
   * @description This does not merge arrays by index as jQuery does, it treats them as a single property and replaces the array with a shallow copy of the new one.
   *
   * This method is used internally by the {@link FooBox.utils.obj.extend} method.
   * @example {@run true}
   * // alias the FooBox.utils.obj namespace
   * var _obj = FooBox.utils.obj,
   * 	// create some objects to merge
   * 	target = {"name": "My Object", "enabled": false, "arr": [1,2,3]},
   * 	object = {"enabled": true, "something": 123, "arr": [4,5,6]};
   *
   * console.log( _obj.merge( target, object ) ); // => {"name": "My Object", "enabled": true, "arr": [4,5,6], "something": 123}
   */


  _.obj.merge = function (target, object) {
    target = _is.hash(target) ? target : {};
    object = _is.hash(object) ? object : {};

    for (var prop in object) {
      if (object.hasOwnProperty(prop)) {
        if (_is.hash(object[prop])) {
          target[prop] = _is.hash(target[prop]) ? target[prop] : {};

          _.obj.merge(target[prop], object[prop]);
        } else if (_is.array(object[prop])) {
          target[prop] = object[prop].slice();
        } else {
          target[prop] = object[prop];
        }
      }
    }

    return target;
  };
  /**
   * @summary Merge the validated properties of the `object` into the `target` using the optional `mappings`.
   * @memberof FooBox.utils.obj.
   * @function mergeValid
   * @param {Object} target - The object to merge properties into.
   * @param {FooBox.utils.obj~Validators} validators - An object containing validators for the `target` object properties.
   * @param {Object} object - The object containing properties to merge.
   * @param {FooBox.utils.obj~Mappings} [mappings] - An object containing property name mappings.
   * @returns {Object} The modified `target` object containing any valid properties from the supplied `object`.
   * @example {@caption Shows the basic usage for this method and shows how invalid properties or those with no corresponding validator are ignored.}{@run true}
   * // alias the FooBox.utils.obj and FooBox.utils.is namespaces
   * var _obj = FooBox.utils.obj,
   * 	_is = FooBox.utils.is;
   *
   * //create the target object and it's validators
   * var target = {"name":"John","location":"unknown"},
   * 	validators = {"name":_is.string,"location":_is.string};
   *
   * // create the object to merge into the target
   * var object = {
   * 	"name": 1234, // invalid
   * 	"location": "Liverpool", // updated
   * 	"notMerged": true // ignored
   * };
   *
   * // merge the object into the target, invalid properties or those with no corresponding validator are ignored.
   * console.log( _obj.mergeValid( target, validators, object ) ); // => { "name": "John", "location": "Liverpool" }
   * @example {@caption Shows how to supply a mappings object for this method.}{@run true}
   * // alias the FooBox.utils.obj and FooBox.utils.is namespaces
   * var _obj = FooBox.utils.obj,
   * 	_is = FooBox.utils.is;
   *
   * //create the target object and it's validators
   * var target = {"name":"John","location":"unknown"},
   * 	validators = {"name":_is.string,"location":_is.string};
   *
   * // create the object to merge into the target
   * var object = {
   * 	"name": { // ignored
   * 		"proper": "Christopher", // mapped to name if short is invalid
   * 		"short": "Chris" // map to name
   * 	},
   * 	"city": "London" // map to location
   * };
   *
   * // create the mapping object
   * var mappings = {
   * 	"name": [ "name.short", "name.proper" ], // try use the short name and fallback to the proper
   * 	"location": "city"
   * };
   *
   * // merge the object into the target using the mappings, invalid properties or those with no corresponding validator are ignored.
   * console.log( _obj.mergeValid( target, validators, object, mappings ) ); // => { "name": "Chris", "location": "London" }
   */


  _.obj.mergeValid = function (target, validators, object, mappings) {
    if (!_is.hash(object) || !_is.hash(validators)) return target;
    validators = _is.hash(validators) ? validators : {};
    mappings = _is.hash(mappings) ? mappings : {};
    var prop, maps, value;

    for (prop in validators) {
      if (!validators.hasOwnProperty(prop) || !_is.fn(validators[prop])) continue;
      maps = _is.array(mappings[prop]) ? mappings[prop] : _is.string(mappings[prop]) ? [mappings[prop]] : [prop];

      _.each(maps, function (map) {
        value = _.obj.prop(object, map);
        if (_is.undef(value)) return; // continue

        if (validators[prop](value)) {
          _.obj.prop(target, prop, value);

          return false; // break
        }
      });
    }

    return target;
  };
  /**
   * @summary Get or set a property value given its `name`.
   * @memberof FooBox.utils.obj.
   * @function prop
   * @param {Object} object - The object to inspect for the property.
   * @param {string} name - The name of the property to fetch. This can be a `.` notated name.
   * @param {*} [value] - If supplied this is the value to set for the property.
   * @returns {*} The value for the `name` property, if it does not exist then `undefined`.
   * @returns {undefined} If a `value` is supplied this method returns nothing.
   * @example {@caption Shows how to get a property value from an object.}{@run true}
   * // alias the FooBox.utils.obj namespace
   * var _obj = FooBox.utils.obj,
   * 	// create an object to test
   * 	object = {
   * 		"name": "My Object",
   * 		"some": {
   * 			"thing": 123
   * 		}
   * 	};
   *
   * console.log( _obj.prop( object, "name" ) ); // => "My Object"
   * console.log( _obj.prop( object, "some.thing" ) ); // => 123
   * @example {@caption Shows how to set a property value for an object.}{@run true}
   * // alias the FooBox.utils.obj namespace
   * var _obj = FooBox.utils.obj,
   * 	// create an object to test
   * 	object = {
   * 		"name": "My Object",
   * 		"some": {
   * 			"thing": 123
   * 		}
   * 	};
   *
   * _obj.prop( object, "name", "My Updated Object" );
   * _obj.prop( object, "some.thing", 987 );
   *
   * console.log( object ); // => { "name": "My Updated Object", "some": { "thing": 987 } }
   */


  _.obj.prop = function (object, name, value) {
    if (!_is.object(object) || _is.empty(name)) return;
    var parts, last;

    if (_is.undef(value)) {
      if (_str.contains(name, '.')) {
        parts = name.split('.');
        last = parts.length - 1;

        _.each(parts, function (part, i) {
          if (i === last) {
            value = object[part];
          } else if (_is.hash(object[part])) {
            object = object[part];
          } else {
            // exit early
            return false;
          }
        });
      } else if (!_is.undef(object[name])) {
        value = object[name];
      }

      return value;
    }

    if (_str.contains(name, '.')) {
      parts = name.split('.');
      last = parts.length - 1;

      _.each(parts, function (part, i) {
        if (i === last) {
          object[part] = value;
        } else {
          object = _is.hash(object[part]) ? object[part] : object[part] = {};
        }
      });
    } else if (!_is.undef(object[name])) {
      object[name] = value;
    }
  }; //######################
  //## Type Definitions ##
  //######################

  /**
   * @summary An object used by the {@link FooBox.utils.obj.mergeValid|mergeValid} method to map new values onto the `target` object.
   * @typedef {Object.<string,(string|Array.<string>)>} FooBox.utils.obj~Mappings
   * @description The mappings object is a single level object. If you want to map a property from/to a child object on either the source or target objects you must supply the name using `.` notation as seen in the below example with the `"name.first"` to `"Name.Short"` mapping.
   * @example {@caption The basic structure of a mappings object is the below.}
   * {
   * 	"TargetName": "SourceName", // for top level properties
   * 	"Child.TargetName": "Child.SourceName" // for child properties
   * }
   * @example {@caption Given the following target object.}
   * var target = {
   * 	"name": {
   * 		"first": "",
   * 		"last": null
   * 	},
   * 	"age": 0
   * };
   * @example {@caption And the following object to merge.}
   * var object = {
   * 	"Name": {
   * 		"Full": "Christopher",
   * 		"Short": "Chris"
   * 	},
   * 	"Age": 32
   * };
   * @example {@caption The mappings object would look like the below.}
   * var mappings = {
   * 	"name.first": "Name.Short",
   * 	"age": "Age"
   * };
   * @example {@caption If you want the `"name.first"` property to try to use the `"Name.Short"` value but fallback to `"Name.Proper"` you can specify the mapping value as an array.}
   * var mappings = {
   * 	"name.first": [ "Name.Short", "Name.Proper" ],
   * 	"age": "Age"
   * };
   */

  /**
   * @summary An object used by the {@link FooBox.utils.obj.mergeValid|mergeValid} method to validate properties.
   * @typedef {Object.<string,function(*):boolean>} FooBox.utils.obj~Validators
   * @description The validators object is a single level object. If you want to validate a property of a child object you must supply the name using `.` notation as seen in the below example with the `"name.first"` and `"name.last"` properties.
   *
   * Any function that accepts a value to test as the first argument and returns a boolean can be used as a validator. This means the majority of the {@link FooBox.utils.is} methods can be used directly. If the property supports multiple types just provide your own function as seen with `"name.last"` in the below example.
   * @example {@caption The basic structure of a validators object is the below.}
   * {
   * 	"PropName": function(*):boolean, // for top level properties
   * 	"Child.PropName": function(*):boolean // for child properties
   * }
   * @example {@caption Given the following target object.}
   * var target = {
   * 	"name": {
   * 		"first": "", // must be a string
   * 		"last": null // must be a string or null
   * 	},
   * 	"age": 0 // must be a number
   * };
   * @example {@caption The validators object could be created as seen below.}
   * // alias the FooBox.utils.is namespace
   * var _is = FooBox.utils.is;
   *
   * var validators = {
   * 	"name.first": _is.string,
   * 	"name.last": function(value){
   * 		return _is.string(value) || value === null;
   * 	},
   * 	"age": _is.number
   * };
   */

})( // dependencies
FooBox.utils.$, FooBox.utils, FooBox.utils.is, FooBox.utils.fn, FooBox.utils.str);

(function ($, _, _is) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return; // any methods that have dependencies but don't fall into a specific subset or namespace can be added here

  /**
   * @summary The callback for the {@link FooBox.utils.ready} method.
   * @callback FooBox.utils~readyCallback
   * @param {jQuery} $ - The instance of jQuery the plugin was registered with.
   * @this window
   * @see Take a look at the {@link FooBox.utils.ready} method for example usage.
   */

  /**
   * @summary Waits for the DOM to be accessible and then executes the supplied callback.
   * @memberof FooBox.utils.
   * @function ready
   * @param {FooBox.utils~readyCallback} callback - The function to execute once the DOM is accessible.
   * @example {@caption This method can be used as a replacement for the jQuery ready callback to avoid an error in another script stopping our scripts from running.}
   * FooBox.utils.ready(function($){
   * 	// do something
   * });
   */

  _.ready = function (callback) {
    function onready() {
      try {
        callback.call(window, _.$);
      } catch (err) {
        console.error(err);
      }
    }

    if (Function('/*@cc_on return true@*/')() ? document.readyState === "complete" : document.readyState !== "loading") onready();else document.addEventListener('DOMContentLoaded', onready, false);
  };
  /**
   * @summary Executed once for each array index or object property until it returns a truthy value.
   * @callback FooBox.utils~findCallback
   * @param {*} value - The current value being iterated over. This could be either an element in an array or the value of an object property.
   * @param {(number|string)} [key] - The array index or property name of the `value`.
   * @param {(Object|Array)} [object] - The array or object currently being searched.
   * @returns {boolean} A truthy value.
   */

  /**
   * @summary Returns the value of the first element or property in the provided target that satisfies the provided test function.
   * @memberof FooBox.utils.
   * @function find
   * @param {(Object|Array)} target - The object or array to search.
   * @param {FooBox.utils~findCallback} callback - A function to execute for each value in the target.
   * @param {*} [thisArg] - The `this` value within the `callback`.
   * @returns {*} The value of the first element or property in the provided target that satisfies the provided test function. Otherwise, `undefined` is returned.
   */


  _.find = function (target, callback, thisArg) {
    if (!_is.fn(callback)) return;
    thisArg = _is.undef(thisArg) ? callback : thisArg;
    var i, l;

    if (_is.array(target)) {
      for (i = 0, l = target.length; i < l; i++) {
        if (callback.call(thisArg, target[i], i, target)) {
          return target[i];
        }
      }
    } else if (_is.object(target)) {
      var keys = Object.keys(target);

      for (i = 0, l = keys.length; i < l; i++) {
        if (callback.call(thisArg, target[keys[i]], keys[i], target)) {
          return target[keys[i]];
        }
      }
    }
  };
  /**
   * @summary Executed once for each array index or object property.
   * @callback FooBox.utils~eachCallback
   * @param {*} value - The current value being iterated over. This could be either an element in an array or the value of an object property.
   * @param {(number|string)} [key] - The array index or property name of the `value`.
   * @param {(Object|Array)} [object] - The array or object currently being searched.
   * @returns {(boolean|void)} Return `false` to break out of the loop, all other values are ignored.
   */

  /**
   * @summary Iterate over all indexes or properties of the provided target executing the provided callback once per value.
   * @memberof FooBox.utils.
   * @function each
   * @param {(Object|Array)} object - The object or array to search.
   * @param {FooBox.utils~eachCallback} callback - A function to execute for each value in the target.
   * @param {*} [thisArg] - The `this` value within the `callback`.
   */


  _.each = function (object, callback, thisArg) {
    if (!_is.fn(callback)) return;
    thisArg = _is.undef(thisArg) ? callback : thisArg;
    var i, l, result;

    if (_is.array(object)) {
      for (i = 0, l = object.length; i < l; i++) {
        result = callback.call(thisArg, object[i], i, object);
        if (result === false) break;
      }
    } else if (_is.object(object)) {
      var keys = Object.keys(object);

      for (i = 0, l = keys.length; i < l; i++) {
        result = callback.call(thisArg, object[keys[i]], keys[i], object);
        if (result === false) break;
      }
    }
  };
  /**
   * @summary Checks if a value exists within an array.
   * @memberof FooBox.utils.
   * @function inArray
   * @param {*} needle - The value to search for.
   * @param {Array} haystack - The array to search within.
   * @returns {number} Returns the index of the value if found otherwise -1.
   */


  _.inArray = function (needle, haystack) {
    if (_is.array(haystack)) {
      return haystack.indexOf(needle);
    }

    return -1;
  };
  /**
   * @summary Convert CSS class names into CSS selectors.
   * @memberof FooBox.utils.
   * @function selectify
   * @param {(string|string[]|object)} classes - A space delimited string of CSS class names or an array of them with each item being included in the selector using the OR (`,`) syntax as a separator. If an object is supplied the result will be an object with the same property names but the values converted to selectors.
   * @returns {(object|string)}
   * @example {@caption Shows how the method can be used.}
   * // alias the FooBox.utils namespace
   * var _ = FooBox.utils;
   *
   * console.log( _.selectify("my-class") ); // => ".my-class"
   * console.log( _.selectify("my-class my-other-class") ); // => ".my-class.my-other-class"
   * console.log( _.selectify(["my-class", "my-other-class"]) ); // => ".my-class,.my-other-class"
   * console.log( _.selectify({
   * 	class1: "my-class",
   * 	class2: "my-class my-other-class",
   * 	class3: ["my-class", "my-other-class"]
   * }) ); // => { class1: ".my-class", class2: ".my-class.my-other-class", class3: ".my-class,.my-other-class" }
   */


  _.selectify = function (classes) {
    if (_is.empty(classes)) return null;

    if (_is.hash(classes)) {
      var result = {},
          selector;

      for (var name in classes) {
        if (!classes.hasOwnProperty(name)) continue;
        selector = _.selectify(classes[name]);

        if (selector) {
          result[name] = selector;
        }
      }

      return result;
    }

    if (_is.string(classes) || _is.array(classes)) {
      if (_is.string(classes)) classes = [classes];
      return classes.map(function (str) {
        return _is.string(str) ? "." + str.split(/\s/g).join(".") : null;
      }).join(",");
    }

    return null;
  };
  /**
   * @ignore
   * @summary Internal replacement for the `requestAnimationFrame` method if the browser doesn't support any form of the method.
   * @param {function} callback - The function to call when it's time to update your animation for the next repaint.
   * @return {number} - The request id that uniquely identifies the entry in the callback list.
   */


  function raf(callback) {
    return setTimeout(callback, 1000 / 60);
  }
  /**
   * @ignore
   * @summary Internal replacement for the `cancelAnimationFrame` method if the browser doesn't support any form of the method.
   * @param {number} requestID - The ID value returned by the call to {@link FooBox.utils.requestFrame|requestFrame} that requested the callback.
   */


  function caf(requestID) {
    clearTimeout(requestID);
  }
  /**
   * @summary A cross browser wrapper for the `requestAnimationFrame` method.
   * @memberof FooBox.utils.
   * @function requestFrame
   * @param {function} callback - The function to call when it's time to update your animation for the next repaint.
   * @return {number} - The request id that uniquely identifies the entry in the callback list.
   */


  _.requestFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || raf).bind(window);
  /**
   * @summary A cross browser wrapper for the `cancelAnimationFrame` method.
   * @memberof FooBox.utils.
   * @function cancelFrame
   * @param {number} requestID - The ID value returned by the call to {@link FooBox.utils.requestFrame|requestFrame} that requested the callback.
   */

  _.cancelFrame = (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || caf).bind(window);
  /**
   * @summary Registers a callback with the next available animation frame.
   * @memberof FooBox.utils.
   * @function nextFrame
   * @param {function} callback - The callback to execute for the next frame.
   * @param {*} [thisArg] - The value of `this` within the callback. Defaults to the callback itself.
   * @returns {Promise} Returns a promise object that is resolved using the return value of the callback.
   */

  _.nextFrame = function (callback, thisArg) {
    return $.Deferred(function (def) {
      if (!_is.fn(callback)) {
        def.reject(new Error('Provided callback is not a function.'));
      } else {
        thisArg = _is.undef(thisArg) ? callback : thisArg;

        _.requestFrame(function () {
          try {
            def.resolve(callback.call(thisArg));
          } catch (err) {
            def.reject(err);
          }
        });
      }
    }).promise();
  };
})( // dependencies
FooBox.utils.$, FooBox.utils, FooBox.utils.is);

(function ($, _, _is, _obj, _fn) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return;
  /**
   * @summary A base class providing some helper methods for prototypal inheritance.
   * @memberof FooBox.utils.
   * @constructs Class
   * @description This is a base class for making prototypal inheritance simpler to work with. It provides an easy way to inherit from another class and exposes a `_super` method within the scope of any overriding methods that allows a simple way to execute the overridden function.
   *
   * Have a look at the {@link FooBox.utils.Class.extend|extend} and {@link FooBox.utils.Class.override|override} method examples to see some basic usage.
   * @example {@caption When using this base class the actual construction of a class is performed by the `construct` method.}
   * var MyClass = FooBox.utils.Class.extend({
   * 	construct: function(arg1, arg2){
   * 		// handle the construction logic here
   * 	}
   * });
   *
   * // use the class
   * var myClass = new MyClass( "arg1:value", "arg2:value" );
   */

  _.Class = function () {};
  /**
   * @ignore
   * @summary The original function when within the scope of an overriding method.
   * @memberof FooBox.utils.Class#
   * @function _super
   * @param {...*} [argN] - The same arguments as the base method.
   * @returns {*} The result of the base method.
   * @description This is only available within the scope of an overriding method if it was created using the {@link FooBox.utils.Class.extend|extend}, {@link FooBox.utils.Class.override|override} or {@link FooBox.utils.fn.addOrOverride} methods.
   * @see {@link FooBox.utils.fn.addOrOverride} to see an example of how this property is used.
   */

  /**
   * @summary Creates a new class that inherits from this one which in turn allows itself to be extended.
   * @memberof FooBox.utils.Class.
   * @function extend
   * @param {Object} [definition] - An object containing any methods to implement/override.
   * @returns {function} A new class that inherits from the base class.
   * @description Every class created using this method has both the {@link FooBox.utils.Class.extend|extend} and {@link FooBox.utils.Class.override|override} static methods added to it to allow it to be extended.
   * @example {@caption The below shows an example of how to implement inheritance using this method.}{@run true}
   * // create a base Person class
   * var Person = FooBox.utils.Class.extend({
   * 	construct: function(isDancing){
   * 		this.dancing = isDancing;
   * 	},
   * 	dance: function(){
   * 		return this.dancing;
   * 	}
   * });
   *
   * var Ninja = Person.extend({
   * 	construct: function(){
   * 		// Call the inherited version of construct()
   * 		this._super( false );
   * 	},
   * 	dance: function(){
   * 		// Call the inherited version of dance()
   * 		return this._super();
   * 	},
   * 	swingSword: function(){
   * 		return true;
   * 	}
   * });
   *
   * var p = new Person(true);
   * console.log( p.dance() ); // => true
   *
   * var n = new Ninja();
   * console.log( n.dance() ); // => false
   * console.log( n.swingSword() ); // => true
   * console.log(
   * 	p instanceof Person && p.constructor === Person && p instanceof FooBox.utils.Class
   * 	&& n instanceof Ninja && n.constructor === Ninja && n instanceof Person && n instanceof FooBox.utils.Class
   * ); // => true
   */


  _.Class.extend = function (definition) {
    definition = _is.hash(definition) ? definition : {};

    var proto = _obj.create(this.prototype); // create a new prototype to work with so we don't modify the original
    // iterate over all properties in the supplied definition and update the prototype


    for (var name in definition) {
      if (!definition.hasOwnProperty(name)) continue;

      _fn.addOrOverride(proto, name, definition[name]);
    } // if no construct method is defined add a default one that does nothing


    proto.construct = _is.fn(proto.construct) ? proto.construct : function () {}; // create the new class using the prototype made above

    function Class() {
      if (!_is.fn(this.construct)) throw new SyntaxError('FooBox.utils.Class objects must be constructed with the "new" keyword.');
      this.construct.apply(this, arguments);
    }

    Class.prototype = proto; //noinspection JSUnresolvedVariable

    Class.prototype.constructor = _is.fn(proto.__ctor__) ? proto.__ctor__ : Class;
    Class.extend = _.Class.extend;
    Class.override = _.Class.override;
    Class.getBaseClasses = _.Class.getBaseClasses;
    Class.__baseClass__ = this;
    return Class;
  };
  /**
   * @summary Overrides a single method on this class.
   * @memberof FooBox.utils.Class.
   * @function override
   * @param {string} name - The name of the function to override.
   * @param {function} fn - The new function to override with, the `_super` method will be made available within this function.
   * @description This is a helper method for overriding a single function of a {@link FooBox.utils.Class} or one of its child classes. This uses the {@link FooBox.utils.fn.addOrOverride} method internally and simply provides the correct prototype.
   * @example {@caption The below example wraps the `Person.prototype.dance` method with a new one that inverts the result. Note the override applies even to instances of the class that are already created.}{@run true}
   * var Person = FooBox.utils.Class.extend({
   *   construct: function(isDancing){
   *     this.dancing = isDancing;
   *   },
   *   dance: function(){
   *     return this.dancing;
   *   }
   * });
   *
   * var p = new Person(true);
   * console.log( p.dance() ); // => true
   *
   * Person.override("dance", function(){
   * 	// Call the original version of dance()
   * 	return !this._super();
   * });
   *
   * console.log( p.dance() ); // => false
   */


  _.Class.override = function (name, fn) {
    _fn.addOrOverride(this.prototype, name, fn);
  };
  /**
   * @summary The base class for this class.
   * @memberof FooBox.utils.Class.
   * @name __baseClass__
   * @type {?FooBox.utils.Class}
   * @private
   */


  _.Class.__baseClass__ = null;

  function getBaseClasses(klass, result) {
    if (!_is.array(result)) result = [];

    if (_is.fn(klass) && klass.__baseClass__ !== null) {
      result.unshift(klass.__baseClass__);
      return getBaseClasses(klass.__baseClass__, result);
    }

    return result;
  }
  /**
   * @summary Get an array of all base classes for this class.
   * @memberof FooBox.utils.Class.
   * @function getBaseClasses
   * @returns {FooBox.utils.Class[]}
   */


  _.Class.getBaseClasses = function () {
    return getBaseClasses(this, []);
  };
})( // dependencies
FooBox.utils.$, FooBox.utils, FooBox.utils.is, FooBox.utils.obj, FooBox.utils.fn);

(function ($, _, _is, _fn, _obj) {
  /**
   * @summary A registry class allowing classes to be easily registered and created.
   * @memberof FooBox.utils.
   * @class ClassRegistry
   * @param {FooBox.utils.ClassRegistry~Options} [options] - The options for the registry.
   * @augments FooBox.utils.Class
   * @borrows FooBox.utils.Class.extend as extend
   * @borrows FooBox.utils.Class.override as override
   * @borrows FooBox.utils.Class.getBaseClasses as getBaseClasses
   */
  _.ClassRegistry = _.Class.extend(
  /** @lends FooBox.utils.ClassRegistry.prototype */
  {
    /**
     * @ignore
     * @constructs
     * @param {FooBox.utils.ClassRegistry~Options} [options] - The options for the registry.
     */
    construct: function construct(options) {
      var self = this;
      /**
       * @summary A callback allowing the arguments supplied to the constructor of a new class to be modified.
       * @callback FooBox.utils.ClassRegistry~beforeCreate
       * @param {FooBox.utils.ClassRegistry~RegisteredClass} registered - The registered object containing all the information for the class being created.
       * @param {Array} args - An array of all arguments to be supplied to the constructor of the new class.
       * @returns {Array} Returns an array of all arguments to be supplied to the constructor of the new class.
       * @this FooBox.utils.ClassRegistry
       */

      /**
       * @summary The options for the registry.
       * @typedef {?Object} FooBox.utils.ClassRegistry~Options
       * @property {boolean} [allowBase] - Whether or not to allow base classes to be created. Base classes are registered with a priority below 0.
       * @property {?FooBox.utils.ClassRegistry~beforeCreate} [beforeCreate] - A callback executed just prior to creating an instance of a registered class. This must return an array of arguments to supply to the constructor of the new class.
       */

      /**
       * @summary The options for this instance.
       * @memberof FooBox.utils.ClassRegistry#
       * @name opt
       * @type {FooBox.utils.ClassRegistry~Options}
       */

      self.opt = _obj.extend({
        allowBase: true,
        beforeCreate: null
      }, options);
      /**
       * @summary An object detailing a registered class.
       * @typedef {?Object} FooBox.utils.ClassRegistry~RegisteredClass
       * @property {string} name - The name of the class.
       * @property {FooBox.utils.Class} ctor - The class constructor.
       * @property {string} selector - The CSS selector for the class.
       * @property {Object} config - The configuration object for the class providing default values that can be overridden at runtime.
       * @property {number} priority - This determines the index for the class when using the {@link FooBox.utils.ClassRegistry#find|find} method, a higher value equals a lower index.
       */

      /**
       * @summary An object containing all registered classes.
       * @memberof FooBox.utils.ClassRegistry#
       * @name registered
       * @type {Object.<string, FooBox.utils.ClassRegistry~RegisteredClass>}
       * @readonly
       * @example {@caption The following shows the structure of this object. The `<name>` placeholders would be the name the class was registered with.}
       * {
       * 	"<name>": {
       * 		"name": <string>,
       * 		"ctor": <function>,
       * 		"selector": <string>,
       * 		"config": <object>,
       * 		"priority": <number>
       * 	},
       * 	"<name>": {
       * 		"name": <string>,
       * 		"ctor": <function>,
       * 		"selector": <string>,
       * 		"config": <object>,
       * 		"priority": <number>
       * 	},
       * 	...
       * }
       */

      self.registered = {};
    },

    /**
     * @summary Register a class constructor with the provided `name`.
     * @memberof FooBox.utils.ClassRegistry#
     * @function register
     * @param {string} name - The name of the class.
     * @param {FooBox.utils.Class} klass - The class constructor to register.
     * @param {Object} [config] - The configuration object for the class providing default values that can be overridden at runtime.
     * @param {number} [priority=0] - This determines the index for the class when using the {@link FooBox.utils.ClassRegistry#find|find} method, a higher value equals a lower index.
     * @returns {boolean} Returns `true` if the class was successfully registered.
     */
    register: function register(name, klass, config, priority) {
      var self = this;

      if (_is.string(name) && !_is.empty(name) && _is.fn(klass)) {
        priority = _is.number(priority) ? priority : 0;
        var current = self.registered[name];
        self.registered[name] = {
          name: name,
          ctor: klass,
          config: _is.hash(config) ? config : {},
          priority: !_is.undef(current) ? current.priority : priority
        };
        return true;
      }

      return false;
    },

    /**
     * @summary The callback function for the {@link FooBox.utils.ClassRegistry#each|each} method.
     * @callback FooBox.utils.ClassRegistry~eachCallback
     * @param {FooBox.utils.ClassRegistry~RegisteredClass} registered - The current registered class being iterated over.
     * @param {number} index - The array index of the `registered` object.
     * @returns {(boolean|undefined)} Return `false` to break out of the loop, all other values are ignored.
     */

    /**
     * @summary Iterates over all registered classes executing the provided callback once per class.
     * @param {FooBox.utils.ClassRegistry~eachCallback} callback - The callback to execute for each registered class.
     * @param {boolean} [prioritize=false] - Whether or not the registered classes should be prioritized before iteration.
     * @param {*} [thisArg] - The value of `this` within the callback.
     */
    each: function each(callback, prioritize, thisArg) {
      prioritize = _is.boolean(prioritize) ? prioritize : false;
      thisArg = _is.undef(thisArg) ? callback : thisArg;
      var self = this,
          names = Object.keys(self.registered),
          registered = names.map(function (name) {
        return self.registered[name];
      });

      if (prioritize) {
        registered.sort(function (a, b) {
          return b.priority - a.priority;
        });
      }

      var i = 0,
          l = registered.length;

      for (; i < l; i++) {
        var result = callback.call(thisArg, registered[i], i);
        if (result === false) break;
      }
    },

    /**
     * @summary The callback function for the {@link FooBox.utils.ClassRegistry#find|find} method.
     * @callback FooBox.utils.ClassRegistry~findCallback
     * @param {FooBox.utils.ClassRegistry~RegisteredClass} registered - The current registered class being iterated over.
     * @param {number} index - The array index of the `registered` object.
     * @returns {boolean} `true` to return the current registered class.
     */

    /**
     * @summary Iterates through all registered classes until the supplied `callback` returns a truthy value.
     * @param {FooBox.utils.ClassRegistry~findCallback} callback - The callback to execute for each registered class.
     * @param {boolean} [prioritize=false] - Whether or not the registered classes should be prioritized before iteration.
     * @param {*} [thisArg] - The value of `this` within the callback.
     * @returns {?FooBox.utils.ClassRegistry~RegisteredClass} `null` if no registered class satisfied the `callback`.
     */
    find: function find(callback, prioritize, thisArg) {
      prioritize = _is.boolean(prioritize) ? prioritize : false;
      thisArg = _is.undef(thisArg) ? callback : thisArg;
      var self = this,
          names = Object.keys(self.registered),
          registered = names.map(function (name) {
        return self.registered[name];
      });

      if (prioritize) {
        registered.sort(function (a, b) {
          return b.priority - a.priority;
        });
      }

      var i = 0,
          l = registered.length;

      for (; i < l; i++) {
        if (callback.call(thisArg, registered[i], i)) {
          return registered[i];
        }
      }

      return null;
    },

    /**
     * @summary Create a new instance of a registered class by `name`.
     * @memberof FooBox.utils.ClassRegistry#
     * @function create
     * @param {string} name - The name of the class to create.
     * @param {Object} [config] - Any custom configuration to supply to the class.
     * @param {...*} [argN] - Any number of additional arguments to pass to the class constructor.
     * @returns {?FooBox.utils.Class} Returns `null` if no registered class can handle the supplied `element`.
     */
    create: function create(name, config, argN) {
      var self = this,
          args = _fn.arg2arr(arguments);

      name = args.shift();

      if (_is.string(name) && self.registered.hasOwnProperty(name)) {
        var registered = self.registered[name];
        var allowed = true;
        if (registered.priority < 0 && !self.opt.allowBase) allowed = false;

        if (allowed && _is.fn(registered.ctor)) {
          config = args.shift();
          config = self.mergeConfigurations(registered.name, config);
          args.unshift.apply(args, [registered.name, config]);
          return _fn.apply(registered.ctor, self.onBeforeCreate(registered, args));
        }
      }

      return null;
    },

    /**
     * @summary Executes the beforeCreate callback if supplied and gives sub-classes an easy way to modify the arguments supplied to newly created classes.
     * @memberof FooBox.utils.ClassRegistry#
     * @function onBeforeCreate
     * @param {FooBox.utils.ClassRegistry~RegisteredClass} registered - The registered class about to be created.
     * @param {Array} args - The array of arguments to be supplied to the registered class constructor.
     * @returns {Array}
     */
    onBeforeCreate: function onBeforeCreate(registered, args) {
      var self = this;

      if (self.opt.beforeCreate !== null && _is.fn(self.opt.beforeCreate)) {
        return self.opt.beforeCreate.call(self, registered, args);
      }

      return args;
    },

    /**
     * @summary Get the merged configuration for a class.
     * @memberof FooBox.utils.ClassRegistry#
     * @function mergeConfigurations
     * @param {string} name - The name of the class to get the config for.
     * @param {Object} [config] - The user supplied defaults to override.
     * @returns {Object}
     */
    mergeConfigurations: function mergeConfigurations(name, config) {
      var self = this;

      if (_is.string(name) && self.registered.hasOwnProperty(name)) {
        // check params
        config = _is.hash(config) ? config : {};
        var baseClasses = self.getBaseClasses(name),
            eArgs = [{}];
        baseClasses.push(self.registered[name]);
        baseClasses.forEach(function (reg) {
          eArgs.push(reg.config);
        });
        eArgs.push(config);
        return _obj.extend.apply(_obj, eArgs);
      }

      return {};
    },

    /**
     * @summary Gets the registered base class for this instance.
     * @memberof FooBox.utils.ClassRegistry#
     * @function getBaseClass
     * @returns {?FooBox.utils.ClassRegistry~RegisteredClass}
     */
    getBaseClass: function getBaseClass() {
      return this.find(function (registered) {
        return registered.priority < 0;
      }, true);
    },

    /**
     * @summary Get all registered base classes for the supplied `name`.
     * @memberof FooBox.utils.ClassRegistry#
     * @function getBaseClasses
     * @param {string} name - The name of the class to get the base classes for.
     * @returns {FooBox.utils.ClassRegistry~RegisteredClass[]}
     */
    getBaseClasses: function getBaseClasses(name) {
      var self = this,
          reg = self.registered[name],
          result = [];

      if (!_is.undef(reg)) {
        reg.ctor.getBaseClasses().forEach(function (base) {
          var found = self.fromType(base);

          if (_is.hash(found)) {
            result.push(found);
          }
        });
      }

      return result;
    },

    /**
     * @summary Attempts to find a registered class given the type/constructor.
     * @memberof FooBox.utils.ClassRegistry#
     * @function fromType
     * @param {FooBox.utils.Class} type - The type/constructor of the registered class to find.
     * @returns {(FooBox.utils.ClassRegistry~RegisteredClass|undefined)} Returns the registered class if found. Otherwise, `undefined` is returned.
     */
    fromType: function fromType(type) {
      if (!_is.fn(type)) return;
      return this.find(function (registered) {
        return registered.ctor === type;
      });
    }
  });
})(FooBox.utils.$, FooBox.utils, FooBox.utils.is, FooBox.utils.fn, FooBox.utils.obj);

(function (_, _is, _str) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return; // noinspection JSUnusedGlobalSymbols

  /**
   * @summary A base event class providing just a type and defaultPrevented properties.
   * @memberof FooBox.utils.
   * @class Event
   * @param {string} type - The type for this event.
   * @augments FooBox.utils.Class
   * @borrows FooBox.utils.Class.extend as extend
   * @borrows FooBox.utils.Class.override as override
   * @description This is a very basic event class that is used internally by the {@link FooBox.utils.EventClass#trigger} method when the first parameter supplied is simply the event name.
   *
   * To trigger your own custom event you will need to inherit from this class and then supply the instantiated event object as the first parameter to the {@link FooBox.utils.EventClass#trigger} method.
   * @example {@caption The following shows how to use this class to create a custom event.}
   * var MyEvent = FooBox.utils.Event.extend({
   * 	construct: function(type, customProp){
   * 	    this._super(type);
   * 	    this.myCustomProp = customProp;
   * 	}
   * });
   *
   * // to use the class you would then instantiate it and pass it as the first argument to a FooBox.utils.EventClass's trigger method
   * var eventClass = ...; // any class inheriting from FooBox.utils.EventClass
   * var event = new MyEvent( "my-event-type", true );
   * eventClass.trigger(event);
   */

  _.Event = _.Class.extend(
  /** @lends FooBox.utils.Event.prototype */
  {
    /**
     * @ignore
     * @constructs
     * @param {string} type
     **/
    construct: function construct(type) {
      if (_is.empty(type)) throw new SyntaxError('FooBox.utils.Event objects must be supplied a `type`.');

      var self = this,
          parsed = _.Event.parse(type);
      /**
       * @summary The type of event.
       * @memberof FooBox.utils.Event#
       * @name type
       * @type {string}
       * @readonly
       */


      self.type = parsed.type;
      /**
       * @summary The namespace of the event.
       * @memberof FooBox.utils.Event#
       * @name namespace
       * @type {string}
       * @readonly
       */

      self.namespace = parsed.namespace;
      /**
       * @summary Whether the default action should be taken or not.
       * @memberof FooBox.utils.Event#
       * @name defaultPrevented
       * @type {boolean}
       * @readonly
       */

      self.defaultPrevented = false;
      /**
       * @summary The original {@link FooBox.utils.EventClass} that triggered this event.
       * @memberof FooBox.utils.Event#
       * @name target
       * @type {FooBox.utils.EventClass}
       */

      self.target = null;
    },

    /**
     * @summary Informs the class that raised this event that its default action should not be taken.
     * @memberof FooBox.utils.Event#
     * @function preventDefault
     */
    preventDefault: function preventDefault() {
      this.defaultPrevented = true;
    },

    /**
     * @summary Gets whether the default action should be taken or not.
     * @memberof FooBox.utils.Event#
     * @function isDefaultPrevented
     * @returns {boolean}
     */
    isDefaultPrevented: function isDefaultPrevented() {
      return this.defaultPrevented;
    }
  });
  /**
   * @summary Parse the provided event string into a type and namespace.
   * @memberof FooBox.utils.Event.
   * @function parse
   * @param {string} event - The event to parse.
   * @returns {{namespaced: boolean, type: string, namespace: string}} Returns an object containing the type and namespace for the event.
   */

  _.Event.parse = function (event) {
    event = _is.string(event) && !_is.empty(event) ? event : null;

    var namespaced = _str.contains(event, ".");

    return {
      namespaced: namespaced,
      type: namespaced ? _str.startsWith(event, ".") ? null : _str.until(event, ".") : event,
      namespace: namespaced ? _str.from(event, ".") : null
    };
  }; // noinspection JSUnusedGlobalSymbols

  /**
   * @summary A base class that implements a basic events interface.
   * @memberof FooBox.utils.
   * @class EventClass
   * @augments FooBox.utils.Class
   * @borrows FooBox.utils.Class.extend as extend
   * @borrows FooBox.utils.Class.override as override
   * @description This is a very basic events implementation that provides just enough to cover most needs.
   */


  _.EventClass = _.Class.extend(
  /** @lends FooBox.utils.EventClass.prototype */
  {
    /**
     * @ignore
     * @constructs
     **/
    construct: function construct() {
      /**
       * @summary An object containing all the required info to execute a listener.
       * @typedef {Object} FooBox.utils.EventClass~RegisteredListener
       * @property {string} namespace - The namespace for the listener.
       * @property {function} fn - The callback function for the listener.
       * @property {*} thisArg - The `this` value to execute the callback with.
       */

      /**
       * @summary An object containing a mapping of events to listeners.
       * @typedef {Object.<string, Array<FooBox.utils.EventClass~RegisteredListener>>} FooBox.utils.EventClass~RegisteredEvents
       */

      /**
       * @summary The object used to register event handlers.
       * @memberof FooBox.utils.EventClass#
       * @name events
       * @type {FooBox.utils.EventClass~RegisteredEvents}
       */
      this.events = {};
    },

    /**
     * @summary Destroy the current instance releasing used resources.
     * @memberof FooBox.utils.EventClass#
     * @function destroy
     */
    destroy: function destroy() {
      this.events = {};
    },

    /**
     * @summary Attach multiple event listeners to the class.
     * @memberof FooBox.utils.EventClass#
     * @function on
     * @param {Object.<string, function>} events - An object containing event types to listener mappings.
     * @param {*} [thisArg] - The value of `this` within the listeners. Defaults to the class raising the event.
     * @returns {this}
     */

    /**
    * @summary Attach an event listener for one or more events to the class.
    * @memberof FooBox.utils.EventClass#
    * @function on
    * @param {string} events - One or more space-separated event types.
    * @param {function} listener - A function to execute when the event is triggered.
    * @param {*} [thisArg] - The value of `this` within the `listener`. Defaults to the class raising the event.
    * @returns {this}
    */
    on: function on(events, listener, thisArg) {
      var self = this;

      if (_is.object(events)) {
        thisArg = listener;
        Object.keys(events).forEach(function (key) {
          if (_is.fn(events[key])) {
            key.split(" ").forEach(function (type) {
              self.addListener(type, events[key], thisArg);
            });
          }
        });
      } else if (_is.string(events) && _is.fn(listener)) {
        events.split(" ").forEach(function (type) {
          self.addListener(type, listener, thisArg);
        });
      }

      return self;
    },

    /**
     * @summary Adds a single event listener to the current class.
     * @memberof FooBox.utils.EventClass#
     * @function addListener
     * @param {string} event - The event type, this can not contain any whitespace.
     * @param {function} listener - A function to execute when the event is triggered.
     * @param {*} [thisArg] - The value of `this` within the `listener`. Defaults to the class raising the event.
     * @returns {boolean} Returns `true` if added.
     */
    addListener: function addListener(event, listener, thisArg) {
      if (!_is.string(event) || /\s/.test(event) || !_is.fn(listener)) return false;

      var self = this,
          parsed = _.Event.parse(event);

      thisArg = _is.undef(thisArg) ? self : thisArg;

      if (!_is.array(self.events[parsed.type])) {
        self.events[parsed.type] = [];
      }

      var exists = self.events[parsed.type].some(function (h) {
        return h.namespace === parsed.namespace && h.fn === listener && h.thisArg === thisArg;
      });

      if (!exists) {
        self.events[parsed.type].push({
          namespace: parsed.namespace,
          fn: listener,
          thisArg: thisArg
        });
        return true;
      }

      return false;
    },

    /**
     * @summary Remove multiple event listeners from the class.
     * @memberof FooBox.utils.EventClass#
     * @function off
     * @param {Object.<string, function>} events - An object containing event types to listener mappings.
     * @param {*} [thisArg] - The value of `this` within the `listener` function. Defaults to the class raising the event.
     * @returns {this}
     */

    /**
    * @summary Remove an event listener from the class.
    * @memberof FooBox.utils.EventClass#
    * @function off
    * @param {string} events - One or more space-separated event types.
    * @param {function} listener - A function to execute when the event is triggered.
    * @param {*} [thisArg] - The value of `this` within the `listener`. Defaults to the class raising the event.
    * @returns {this}
    */
    off: function off(events, listener, thisArg) {
      var self = this;

      if (_is.object(events)) {
        thisArg = listener;
        Object.keys(events).forEach(function (key) {
          key.split(" ").forEach(function (type) {
            self.removeListener(type, events[key], thisArg);
          });
        });
      } else if (_is.string(events)) {
        events.split(" ").forEach(function (type) {
          self.removeListener(type, listener, thisArg);
        });
      }

      return self;
    },

    /**
     * @summary Removes a single event listener from the current class.
     * @memberof FooBox.utils.EventClass#
     * @function removeListener
     * @param {string} event - The event type, this can not contain any whitespace.
     * @param {function} [listener] - The listener registered to the event type.
     * @param {*} [thisArg] - The value of `this` registered for the `listener`. Defaults to the class raising the event.
     * @returns {boolean} Returns `true` if removed.
     */
    removeListener: function removeListener(event, listener, thisArg) {
      if (!_is.string(event) || /\s/.test(event)) return false;

      var self = this,
          parsed = _.Event.parse(event),
          types = [];

      thisArg = _is.undef(thisArg) ? self : thisArg;

      if (!_is.empty(parsed.type)) {
        types.push(parsed.type);
      } else if (!_is.empty(parsed.namespace)) {
        types.push.apply(types, Object.keys(self.events));
      }

      types.forEach(function (type) {
        if (!_is.array(self.events[type])) return;
        self.events[type] = self.events[type].filter(function (h) {
          if (listener != null) {
            return !(h.namespace === parsed.namespace && h.fn === listener && h.thisArg === thisArg);
          }

          if (parsed.namespace != null) {
            return h.namespace !== parsed.namespace;
          }

          return false;
        });

        if (self.events[type].length === 0) {
          delete self.events[type];
        }
      });
      return true;
    },

    /**
     * @summary Trigger an event on the current class.
     * @memberof FooBox.utils.EventClass#
     * @function trigger
     * @param {(string|FooBox.utils.Event)} event - Either a space-separated string of event types or a custom event object to raise.
     * @param {Array} [args] - An array of additional arguments to supply to the listeners after the event object.
     * @returns {(FooBox.utils.Event|FooBox.utils.Event[]|null)} Returns the {@link FooBox.utils.Event|event object} of the triggered event. If more than one event was triggered an array of {@link FooBox.utils.Event|event objects} is returned. If no `event` was supplied or triggered `null` is returned.
     */
    trigger: function trigger(event, args) {
      args = _is.array(args) ? args : [];
      var self = this,
          result = [];

      if (event instanceof _.Event) {
        result.push(event);
        self.emit(event, args);
      } else if (_is.string(event)) {
        event.split(" ").forEach(function (type) {
          var e = new _.Event(type);
          result.push(e);
          self.emit(e, args);
        });
      }

      return _is.empty(result) ? null : result.length === 1 ? result[0] : result;
    },

    /**
     * @summary Emits the supplied event on the current class.
     * @memberof FooBox.utils.EventClass#
     * @function emit
     * @param {FooBox.utils.Event} event - The event object to emit.
     * @param {Array} [args] - An array of additional arguments to supply to the listener after the event object.
     */
    emit: function emit(event, args) {
      if (!(event instanceof FooBox.utils.Event)) return;
      var self = this;
      args = _is.array(args) ? args : [];
      if (event.target === null) event.target = self;

      if (_is.array(self.events[event.type])) {
        self.events[event.type].forEach(function (h) {
          if (event.namespace != null && h.namespace !== event.namespace) return;
          h.fn.apply(h.thisArg, [event].concat(args));
        });
      }

      if (_is.array(self.events["__all__"])) {
        self.events["__all__"].forEach(function (h) {
          h.fn.apply(h.thisArg, [event].concat(args));
        });
      }
    }
  });
})( // dependencies
FooBox.utils, FooBox.utils.is, FooBox.utils.str);

(function ($, _, _is, _fn, _obj) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return;
  /**
   * @summary A simple timer that triggers events.
   * @memberof FooBox.utils.
   * @class Timer
   * @param {number} [interval=1000] - The internal tick interval of the timer.
   */

  _.Timer = _.EventClass.extend(
  /** @lends FooBox.utils.Timer */
  {
    /**
     * @ignore
     * @constructs
     * @param {number} [interval=1000]
     */
    construct: function construct(interval) {
      var self = this;

      self._super();
      /**
       * @summary The internal tick interval of the timer in milliseconds.
       * @memberof FooBox.utils.Timer#
       * @name interval
       * @type {number}
       * @default 1000
       * @readonly
       */


      self.interval = _is.number(interval) ? interval : 1000;
      /**
       * @summary Whether the timer is currently running or not.
       * @memberof FooBox.utils.Timer#
       * @name isRunning
       * @type {boolean}
       * @default false
       * @readonly
       */

      self.isRunning = false;
      /**
       * @summary Whether the timer is currently paused or not.
       * @memberof FooBox.utils.Timer#
       * @name isPaused
       * @type {boolean}
       * @default false
       * @readonly
       */

      self.isPaused = false;
      /**
       * @summary Whether the timer can resume from a previous state or not.
       * @memberof FooBox.utils.Timer#
       * @name canResume
       * @type {boolean}
       * @default false
       * @readonly
       */

      self.canResume = false;
      /**
       * @summary Whether the timer can restart or not.
       * @memberof FooBox.utils.Timer#
       * @name canRestart
       * @type {boolean}
       * @default false
       * @readonly
       */

      self.canRestart = false;
      /**
       * @summary The internal tick timeout ID.
       * @memberof FooBox.utils.Timer#
       * @name __timeout
       * @type {?number}
       * @default null
       * @private
       */

      self.__timeout = null;
      /**
       * @summary Whether the timer is incrementing or decrementing.
       * @memberof FooBox.utils.Timer#
       * @name __decrement
       * @type {boolean}
       * @default false
       * @private
       */

      self.__decrement = false;
      /**
       * @summary The total time for the timer.
       * @memberof FooBox.utils.Timer#
       * @name __time
       * @type {number}
       * @default 0
       * @private
       */

      self.__time = 0;
      /**
       * @summary The remaining time for the timer.
       * @memberof FooBox.utils.Timer#
       * @name __remaining
       * @type {number}
       * @default 0
       * @private
       */

      self.__remaining = 0;
      /**
       * @summary The current time for the timer.
       * @memberof FooBox.utils.Timer#
       * @name __current
       * @type {number}
       * @default 0
       * @private
       */

      self.__current = 0;
      /**
       * @summary The final time for the timer.
       * @memberof FooBox.utils.Timer#
       * @name __finish
       * @type {number}
       * @default 0
       * @private
       */

      self.__finish = 0;
      /**
       * @summary The last arguments supplied to the {@link FooBox.utils.Timer#start|start} method.
       * @memberof FooBox.utils.Timer#
       * @name __restart
       * @type {Array}
       * @default []
       * @private
       */

      self.__restart = [];
    },

    /**
     * @summary Resets the timer back to a fresh starting state.
     * @memberof FooBox.utils.Timer#
     * @function __reset
     * @private
     */
    __reset: function __reset() {
      var self = this;
      clearTimeout(self.__timeout);
      self.__timeout = null;
      self.__decrement = false;
      self.__time = 0;
      self.__remaining = 0;
      self.__current = 0;
      self.__finish = 0;
      self.isRunning = false;
      self.isPaused = false;
      self.canResume = false;
    },

    /**
     * @summary Generates event args to be passed to listeners of the timer events.
     * @memberof FooBox.utils.Timer#
     * @function __eventArgs
     * @param {...*} [args] - Any number of additional arguments to pass to an event listener.
     * @return {Array} - The first 3 values of the result will always be the current time, the total time and boolean indicating if the timer is decremental.
     * @private
     */
    __eventArgs: function __eventArgs(args) {
      var self = this;
      return [self.__current, self.__time, self.__decrement].concat(_fn.arg2arr(arguments));
    },

    /**
     * @summary Performs the tick for the timer checking and modifying the various internal states.
     * @memberof FooBox.utils.Timer#
     * @function __tick
     * @private
     */
    __tick: function __tick() {
      var self = this;
      self.trigger("tick", self.__eventArgs());

      if (self.__current === self.__finish) {
        self.trigger("complete", self.__eventArgs());

        self.__reset();
      } else {
        if (self.__decrement) {
          self.__current--;
        } else {
          self.__current++;
        }

        self.__remaining--;
        self.canResume = self.__remaining > 0;
        self.__timeout = setTimeout(function () {
          self.__tick();
        }, self.interval);
      }
    },

    /**
     * @summary Starts the timer using the supplied `time` and whether or not to increment or decrement from the value.
     * @memberof FooBox.utils.Timer#
     * @function start
     * @param {number} time - The total time in seconds for the timer.
     * @param {boolean} [decrement=false] - Whether the timer should increment or decrement from or to the supplied time.
     */
    start: function start(time, decrement) {
      var self = this;
      if (self.isRunning) return;
      decrement = _is.boolean(decrement) ? decrement : false;
      self.__restart = [time, decrement];
      self.__decrement = decrement;
      self.__time = time;
      self.__remaining = time;
      self.__current = decrement ? time : 0;
      self.__finish = decrement ? 0 : time;
      self.canRestart = true;
      self.isRunning = true;
      self.isPaused = false;
      self.trigger("start", self.__eventArgs());

      self.__tick();
    },

    /**
     * @summary Starts the timer counting down to `0` from the supplied `time`.
     * @memberof FooBox.utils.Timer#
     * @function countdown
     * @param {number} time - The total time in seconds for the timer.
     */
    countdown: function countdown(time) {
      this.start(time, true);
    },

    /**
     * @summary Starts the timer counting up from `0` to the supplied `time`.
     * @memberof FooBox.utils.Timer#
     * @function countup
     * @param {number} time - The total time in seconds for the timer.
     */
    countup: function countup(time) {
      this.start(time, false);
    },

    /**
     * @summary Stops and then restarts the timer using the last arguments supplied to the {@link FooBox.utils.Timer#start|start} method.
     * @memberof FooBox.utils.Timer#
     * @function restart
     */
    restart: function restart() {
      var self = this;
      self.stop();

      if (self.canRestart) {
        self.start.apply(self, self.__restart);
      }
    },

    /**
     * @summary Stops the timer.
     * @memberof FooBox.utils.Timer#
     * @function stop
     */
    stop: function stop() {
      var self = this;

      if (self.isRunning || self.isPaused) {
        self.__reset();

        self.trigger("stop", self.__eventArgs());
      }
    },

    /**
     * @summary Pauses the timer and returns the remaining seconds.
     * @memberof FooBox.utils.Timer#
     * @function pause
     * @return {number} - The number of seconds remaining for the timer.
     */
    pause: function pause() {
      var self = this;

      if (self.__timeout != null) {
        clearTimeout(self.__timeout);
        self.__timeout = null;
      }

      if (self.isRunning) {
        self.isRunning = false;
        self.isPaused = true;
        self.trigger("pause", self.__eventArgs());
      }

      return self.__remaining;
    },

    /**
     * @summary Resumes the timer from a previously paused state.
     * @memberof FooBox.utils.Timer#
     * @function resume
     */
    resume: function resume() {
      var self = this;

      if (self.canResume) {
        self.isRunning = true;
        self.isPaused = false;
        self.trigger("resume", self.__eventArgs());

        self.__tick();
      }
    },

    /**
     * @summary Resets the timer back to a fresh starting state.
     * @memberof FooBox.utils.Timer#
     * @function reset
     */
    reset: function reset() {
      var self = this;

      self.__reset();

      self.trigger("reset", this.__eventArgs());
    }
  });
})(FooBox.utils.$, FooBox.utils, FooBox.utils.is, FooBox.utils.fn, FooBox.utils.obj);

(function ($, _, _fn) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return; // noinspection JSUnusedGlobalSymbols

  /**
   * @summary A wrapper around the fullscreen API to ensure cross browser compatibility.
   * @memberof FooBox.utils.
   * @class FullscreenAPI
   * @augments FooBox.utils.EventClass
   * @borrows FooBox.utils.EventClass.extend as extend
   * @borrows FooBox.utils.EventClass.override as override
   */

  _.FullscreenAPI = _.EventClass.extend(
  /** @lends FooBox.utils.FullscreenAPI */
  {
    /**
     * @ignore
     * @constructs
     */
    construct: function construct() {
      this._super();
      /**
       * @summary An object containing a single browsers various methods and events needed for this wrapper.
       * @typedef {?Object} FooBox.utils.FullscreenAPI~BrowserAPI
       * @property {string} enabled
       * @property {string} element
       * @property {string} request
       * @property {string} exit
       * @property {Object} events
       * @property {string} events.change
       * @property {string} events.error
       */

      /**
       * @summary An object containing the supported fullscreen browser API's.
       * @typedef {Object.<string, FooBox.utils.FullscreenAPI~BrowserAPI>} FooBox.utils.FullscreenAPI~SupportedBrowsers
       */

      /**
       * @summary Contains the various browser specific method and event names.
       * @memberof FooBox.utils.FullscreenAPI#
       * @name apis
       * @type {FooBox.utils.FullscreenAPI~SupportedBrowsers}
       */


      this.apis = {
        w3: {
          enabled: "fullscreenEnabled",
          element: "fullscreenElement",
          request: "requestFullscreen",
          exit: "exitFullscreen",
          events: {
            change: "fullscreenchange",
            error: "fullscreenerror"
          }
        },
        webkit: {
          enabled: "webkitFullscreenEnabled",
          element: "webkitCurrentFullScreenElement",
          request: "webkitRequestFullscreen",
          exit: "webkitExitFullscreen",
          events: {
            change: "webkitfullscreenchange",
            error: "webkitfullscreenerror"
          }
        },
        moz: {
          enabled: "mozFullScreenEnabled",
          element: "mozFullScreenElement",
          request: "mozRequestFullScreen",
          exit: "mozCancelFullScreen",
          events: {
            change: "mozfullscreenchange",
            error: "mozfullscreenerror"
          }
        },
        ms: {
          enabled: "msFullscreenEnabled",
          element: "msFullscreenElement",
          request: "msRequestFullscreen",
          exit: "msExitFullscreen",
          events: {
            change: "MSFullscreenChange",
            error: "MSFullscreenError"
          }
        }
      };
      /**
       * @summary The current browsers specific method and event names.
       * @memberof FooBox.utils.FullscreenAPI#
       * @name api
       * @type {FooBox.utils.FullscreenAPI~BrowserAPI}
       */

      this.api = this.getAPI();
      /**
       * @summary Whether or not the fullscreen API is supported in the current browser.
       * @memberof FooBox.utils.FullscreenAPI#
       * @name supported
       * @type {boolean}
       */

      this.supported = this.api != null;

      this.__listen();
    },

    /**
     * @summary Destroys the current wrapper unbinding events and freeing up resources.
     * @memberof FooBox.utils.FullscreenAPI#
     * @function destroy
     * @returns {boolean}
     */
    destroy: function destroy() {
      this.__stopListening();

      return this._super();
    },

    /**
     * @summary Fetches the correct API for the current browser.
     * @memberof FooBox.utils.FullscreenAPI#
     * @function getAPI
     * @return {?FooBox.utils.FullscreenAPI~BrowserAPI} Returns `null` if the fullscreen API is not supported.
     */
    getAPI: function getAPI() {
      for (var vendor in this.apis) {
        if (!this.apis.hasOwnProperty(vendor)) continue; // Check if document has the "enabled" property

        if (this.apis[vendor].enabled in document) {
          // It seems this browser supports the fullscreen API
          return this.apis[vendor];
        }
      }

      return null;
    },

    /**
     * @summary Gets the current fullscreen element or null.
     * @memberof FooBox.utils.FullscreenAPI#
     * @function element
     * @returns {?Element}
     */
    element: function element() {
      return this.supported ? document[this.api.element] : null;
    },

    /**
     * @summary Requests the browser to place the specified element into fullscreen mode.
     * @memberof FooBox.utils.FullscreenAPI#
     * @function request
     * @param {Element} element - The element to place into fullscreen mode.
     * @returns {Promise} A Promise which is resolved once the element is placed into fullscreen mode.
     */
    request: function request(element) {
      if (this.supported && !!element[this.api.request]) {
        var result = element[this.api.request]();
        return !result ? $.Deferred(this.__resolver(this.api.request)).promise() : result;
      }

      return _fn.rejected;
    },

    /**
     * @summary Requests that the browser switch from fullscreen mode back to windowed mode.
     * @memberof FooBox.utils.FullscreenAPI#
     * @function exit
     * @returns {Promise} A Promise which is resolved once fullscreen mode is exited.
     */
    exit: function exit() {
      if (this.supported && !!this.element()) {
        var result = document[this.api.exit]();
        return !result ? $.Deferred(this.__resolver(this.api.exit)).promise() : result;
      }

      return _fn.rejected;
    },

    /**
     * @summary Toggles the supplied element between fullscreen and windowed modes.
     * @memberof FooBox.utils.FullscreenAPI#
     * @function toggle
     * @param {Element} element - The element to switch between modes.
     * @returns {Promise} A Promise that is resolved once fullscreen mode is either entered or exited.
     */
    toggle: function toggle(element) {
      return !!this.element() ? this.exit() : this.request(element);
    },

    /**
     * @summary Starts listening to the document level fullscreen events and triggers an abbreviated version on this class.
     * @memberof FooBox.utils.FullscreenAPI#
     * @function __listen
     * @private
     */
    __listen: function __listen() {
      var self = this;
      if (!self.supported) return;
      $(document).on(self.api.events.change + ".utils", function () {
        self.trigger("change");
      }).on(self.api.events.error + ".utils", function () {
        self.trigger("error");
      });
    },

    /**
     * @summary Stops listening to the document level fullscreen events.
     * @memberof FooBox.utils.FullscreenAPI#
     * @function __stopListening
     * @private
     */
    __stopListening: function __stopListening() {
      var self = this;
      if (!self.supported) return;
      $(document).off(self.api.events.change + ".utils").off(self.api.events.error + ".utils");
    },

    /**
     * @summary Creates a resolver function to patch browsers which do not return a Promise from there request and exit methods.
     * @memberof FooBox.utils.FullscreenAPI#
     * @function __resolver
     * @param {string} method - The request or exit method the resolver is being created for.
     * @returns {FooBox.utils.FullscreenAPI~resolver}
     * @private
     */
    __resolver: function __resolver(method) {
      var self = this;
      /**
       * @summary Binds to the fullscreen change and error events and resolves or rejects the supplied deferred accordingly.
       * @callback FooBox.utils.FullscreenAPI~resolver
       * @param {jQuery.Deferred} def - The jQuery.Deferred object to resolve.
       */

      return function resolver(def) {
        // Reject the promise if asked to exitFullscreen and there is no element currently in fullscreen
        if (method === self.api.exit && !!self.element()) {
          setTimeout(function () {
            // noinspection JSUnresolvedFunction
            def.reject(new TypeError());
          }, 1);
          return;
        } // When receiving an internal fullscreenchange event, fulfill the promise


        function change() {
          // noinspection JSUnresolvedFunction
          def.resolve();
          $(document).off(self.api.events.change, change).off(self.api.events.error, error);
        } // When receiving an internal fullscreenerror event, reject the promise


        function error() {
          // noinspection JSUnresolvedFunction
          def.reject(new TypeError());
          $(document).off(self.api.events.change, change).off(self.api.events.error, error);
        }

        $(document).on(self.api.events.change, change).on(self.api.events.error, error);
      };
    }
  });
})(FooBox.utils.$, FooBox.utils, FooBox.utils.fn);

(function ($, _, _is, _fn) {
  // only register methods if this version is the current version
  if (_.version !== '1.0.0') return;
  /**
   * @summary Contains common utility methods and members for the CSS transition property.
   * @memberof FooBox.utils.
   * @namespace transition
   */

  _.transition = {};
  /**
   * @summary The data name used by transitions to ensure promises are resolved.
   * @memberof FooBox.utils.transition.
   * @name dataName
   * @type {string}
   * @default "__foo-transition__"
   */

  _.transition.dataName = '__foo-transition__';
  /**
   * @summary The CSS className used to disable transitions when using the {@link FooBox.utils.transition.disable|disable} method instead of inline styles.
   * @memberof FooBox.utils.transition.
   * @name disableClassName
   * @type {?string}
   * @default null
   */

  _.transition.disableClassName = null;
  /**
   * @summary The global timeout used as a safety measure when using the {@link FooBox.utils.transition.start|start} method. This can be overridden using the `timeout` parameter of the {@link FooBox.utils.transition.start|start} method.
   * @memberof FooBox.utils.transition.
   * @name timeout
   * @type {number}
   * @default 3000
   */

  _.transition.timeout = 3000;
  /**
   * @summary Disable transitions temporarily on the provided element so changes can be made immediately within the callback.
   * @memberof FooBox.utils.transition.
   * @function disable
   * @param {(jQuery|HTMLElement)} element - The element to disable transitions on.
   * @param {FooBox.utils.transition~modifyFn} modifyFn - A function to execute while the elements transitions are disabled.
   */

  _.transition.disable = function (element, modifyFn) {
    var $el = _is.jq(element) ? element : $(element);

    if ($el.length > 0 && _is.fn(modifyFn)) {
      var el = $el.get(0),
          hasClass = _is.string(_.transition.disableClassName);

      var restore = null;
      if (hasClass) $el.addClass(_.transition.disableClassName);else {
        restore = {
          value: el.style.getPropertyValue('transition'),
          priority: el.style.getPropertyPriority('transition')
        };
        el.style.setProperty('transition', 'none', 'important');
      }
      modifyFn.call(modifyFn, $el);
      $el.prop("offsetWidth");
      if (hasClass) $el.removeClass(_.transition.disableClassName);else {
        el.style.removeProperty('transition');

        if (_is.string(restore.value) && restore.value.length > 0) {
          el.style.setProperty('transition', restore.value, restore.priority);
        }
      }
    }
  };
  /**
   * @summary Stop a transition started using the {@link FooBox.utils.transition.start|start} method.
   * @memberof FooBox.utils.transition.
   * @function stop
   * @param {(jQuery|HTMLElement)} element - The element to stop the transition on.
   * @returns {Promise}
   */


  _.transition.stop = function (element) {
    var d = $.Deferred(),
        $el = _is.jq(element) ? element : $(element);

    if ($el.length > 0) {
      var current = $el.data(_.transition.dataName);

      if (_is.promise(current)) {
        current.always(function () {
          // request the next frame to give the previous event unbinds time to settle
          _.requestFrame(function () {
            d.resolve($el);
          });
        }).reject(new Error("Transition cancelled."));
      } else {
        d.resolve($el);
      }
    } else {
      d.reject(new Error("Unable to stop transition. Make sure the element exists."));
    }

    return d.promise();
  };
  /**
   * @summary Creates a new transition event listener ensuring the element and optionally the propertyName matches before executing the callback.
   * @memberof FooBox.utils.transition.
   * @function createListener
   * @param {HTMLElement} element - The element being listened to.
   * @param {function(*): void} callback - The callback to execute once the element and optional propertyName are matched.
   * @param {?string} [propertyName=null] - The propertyName to match on the TransitionEvent object.
   * @returns {function(*): void}
   */


  _.transition.createListener = function (element, callback, propertyName) {
    var el = element,
        fn = callback,
        prop = propertyName,
        hasProp = _is.string(propertyName);

    return function (event) {
      var evt = event.originalEvent instanceof TransitionEvent ? event.originalEvent : event;
      var matches = false;

      if (evt.target === el) {
        matches = hasProp ? evt.propertyName === prop : true;
      }

      if (matches) fn.apply(fn, _fn.arg2arr(arguments));
    };
  };
  /**
   * @summary Start a transition on an element returning a promise that is resolved once the transition ends.
   * @memberof FooBox.utils.transition.
   * @function start
   * @param {(jQuery|HTMLElement)} element - The element to perform the transition on.
   * @param {FooBox.utils.transition~modifyFn} triggerFn - The callback that triggers the transition on the element.
   * @param {?string} [propertyName] - A specific property name to wait for before resolving. If not supplied the first instance of the transitionend event will resolve the promise.
   * @param {number} [timeout] - A safety timeout to ensure the returned promise is finalized. If not supplied the value of the {@link FooBox.utils.transition.timeout} property is used.
   * @returns {Promise}
   */


  _.transition.start = function (element, triggerFn, propertyName, timeout) {
    var d = $.Deferred(),
        $el = _is.jq(element) ? element : $(element);

    if ($el.length > 0 && _is.fn(triggerFn)) {
      var el = $el.get(0); // first stop any active transitions

      _.transition.stop($el).always(function () {
        // then setup the data object and event listeners for the new transition
        var listener = _.transition.createListener(el, function () {
          d.resolve($el);
        }, propertyName);

        $el.data(_.transition.dataName, d).on("transitionend.foo-utils", listener).prop("offsetWidth"); // force layout to ensure transitions on newly appended elements occur
        // request the next frame to give the event bindings time to settle

        _.requestFrame(function () {
          // just in case a transition is cancelled by some other means and the transitionend event is never fired this
          // timeout ensures the returned promise is always finalized.
          var safety = setTimeout(function () {
            d.reject(new Error("Transition safety timeout triggered."));
          }, _is.number(timeout) ? timeout : _.transition.timeout); // we always want to cleanup after ourselves so clear the safety, remove the data object and unbind the events

          d.always(function () {
            clearTimeout(safety);
            $el.removeData(_.transition.dataName).off("transitionend.foo-utils", listener);
          }); // now that everything is setup kick off the transition by calling the triggerFn

          triggerFn.call(triggerFn, $el);
        });
      });
    } else {
      d.reject(new Error("Unable to perform transition. Make sure the element exists and a trigger function is supplied."));
    }

    return d.promise();
  };
  /**
   * @summary Used to modify an element which has transitions optionally allowing the transition to occur or not.
   * @memberof FooBox.utils.transition.
   * @function modify
   * @param {(jQuery|HTMLElement)} element - The element to perform the modifications to.
   * @param {FooBox.utils.transition~modifyFn} modifyFn - The callback used to perform the modifications.
   * @param {boolean} [immediate=false] - Whether or not transitions should be allowed to execute and waited on. The default value of `false` means transitions are allowed and the promise will only resolve once there transitionend event has fired.
   * @param {?string} [propertyName=null] - A specific property name to wait for before resolving. If not supplied the first instance of the transitionend event will resolve the promise.
   * @returns {Promise} Returns a promise that is resolved once the modifications to the element have ended.
   */


  _.transition.modify = function (element, modifyFn, immediate, propertyName) {
    var $el = _is.jq(element) ? element : $(element);

    if ($el.length > 0 && _is.fn(modifyFn)) {
      if (immediate) {
        _.transition.disable($el, modifyFn);

        return _fn.resolve();
      }

      return _.transition.start($el, modifyFn, propertyName);
    }

    return _fn.reject(new Error("Unable to perform modification. Make sure the element exists and a modify function is supplied."));
  };
  /**
   * @summary Perform one or more modifications to the element such as setting inline styles or toggling classNames.
   * @callback FooBox.utils.transition~modifyFn
   * @param {jQuery} $element - The jQuery object for the element to modify.
   */

})( // dependencies
FooBox.utils.$, FooBox.utils, FooBox.utils.is, FooBox.utils.fn);
"use strict";

(function ($, _, _utils, _is, _fn, _str, _obj) {
  /**
   * @summary A string array of supported EXIF properties.
   * @memberof FooBox.
   * @name supportedExifProperties
   * @type {string[]}
   */
  _.supportedExifProperties = ["camera", "aperture", "created_timestamp", "shutter_speed", "focal_length", "iso", "orientation"];
  /**
   * @memberof FooBox.utils.is.
   * @function exif
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the `value` contains any supported and valid EXIF properties.
   */

  _is.exif = function (value) {
    if (_is.object(value)) {
      const keys = Object.keys(value);
      return keys.length > 0 && keys.some(function (key) {
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


  _is.selector = function (element, selector) {
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


  _is.selectorOrChildOf = function (element, selector) {
    if (_is.selector(element, selector)) return true;
    if (element.parentElement) return _is.selectorOrChildOf(element.parentElement, selector);
    return false;
  };
  /**
   * @summary Trims the value if it exceeds the specified length and appends the suffix.
   * @memberof FooBox.utils.str.
   * @function trimTo
   * @param {string} value - The value to trim if required.
   * @param {number} length - The length to trim the string to.
   * @param {string} [suffix="&hellip;"] - The suffix to append to a trimmed value.
   * @returns {string|null}
   */


  _str.trimTo = function (value, length, suffix) {
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


  _utils.toArray = function (iterable) {
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


  _utils.getResizeObserverSize = function (entry) {
    let width, height;

    if (entry.contentBoxSize) {
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


  _utils.getElementSize = function (element, pseudoElt) {
    let width = '0',
        height = '0';

    if (element instanceof Element) {
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


  _utils.getJsonAttribute = function (element, qualifiedName, defaults) {
    const jsonString = element.getAttribute(qualifiedName) || null;

    if (_is.string(jsonString)) {
      try {
        return _obj.extend({}, defaults, JSON.parse(jsonString));
      } catch (err) {
        console.debug("Error parsing '" + qualifiedName + "' attribute.", {
          "json": jsonString,
          "error": err
        });
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


  _utils.toggleClass = function (element, classes, state) {
    const applyClasses = function (className) {
      if (_is.boolean(state) ? state : !element.classList.contains(className)) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    };

    if (_is.string(classes)) {
      classes.split(" ").forEach(applyClasses);
    }

    if (_is.array(classes)) {
      classes.forEach(function (tmp) {
        if (_is.string(tmp)) {
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


  _utils.addClass = function (element, classes) {
    if (_is.string(classes)) {
      classes.split(" ").forEach(function (className) {
        element.classList.add(className);
      });
    }

    if (_is.array(classes)) {
      classes.forEach(function (tmp) {
        if (_is.string(tmp)) {
          tmp.split(" ").forEach(function (className) {
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


  _utils.removeClass = function (element, classes) {
    if (_is.string(classes)) {
      classes.split(" ").forEach(function (className) {
        element.classList.remove(className);
      });
    }

    if (_is.array(classes)) {
      classes.forEach(function (tmp) {
        if (_is.string(tmp)) {
          tmp.split(" ").forEach(function (className) {
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


  _utils.setAttributes = function (element, attributes) {
    Object.keys(attributes).forEach(function (key) {
      if (!_is.empty(attributes[key])) {
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


  _utils.parseHTML = function (html, context) {
    const t = (context || document).createElement('template');
    t.innerHTML = html;
    return t.content;
  };

  _utils.onTransition = function (el, trigger, waitForProperties) {
    waitForProperties = _is.array(waitForProperties) ? waitForProperties : [];
    return new Promise(function (resolve, reject) {
      const seen = [];

      function ended() {
        el.removeEventListener("transitioncancel", ontransitioncancel);
        el.removeEventListener("transitionend", ontransitionend);
        resolve();
      }

      function cancelled() {
        el.removeEventListener("transitioncancel", ontransitioncancel);
        el.removeEventListener("transitionend", ontransitionend);
        reject("transitioncancel");
      }

      function ontransitioncancel(e) {
        if (e.target === el) {
          if (waitForProperties.length) {
            if (waitForProperties.includes(e.propertyName)) {
              cancelled();
            }
          } else {
            cancelled();
          }
        }
      }

      function ontransitionend(e) {
        if (e.target === el) {
          if (waitForProperties.length) {
            seen.push(e.propertyName);

            if (waitForProperties.every(function (prop) {
              return seen.includes(prop);
            })) {
              ended();
            }
          } else {
            ended();
          }
        }
      }

      el.addEventListener("transitioncancel", ontransitioncancel);
      el.addEventListener("transitionend", ontransitionend);

      _utils.nextFrame(function () {
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


  _utils.disableTransitions = function (element, callback, thisArg) {
    if (_is.element(element) && _is.fn(callback)) {
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


  _utils.PromiseState = _utils.Class.extend(
  /** @lends FooBox.utils.PromiseState.prototype */
  {
    /**
     * @constructs
     * @param {Promise<*>} promise - The promise object to monitor.
     */
    construct: function (promise) {
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

      self.promise = promise.then(function () {
        self.state = "resolved";
      }, function () {
        self.state = "rejected";
      });
    },

    /**
     * @summary Whether or not the promise is fulfilled, either resolved or rejected.
     * @memberof FooBox.utils.PromiseState#
     * @function isFulfilled
     * @returns {boolean}
     */
    isFulfilled: function () {
      return this.state !== "pending";
    },

    /**
     * @summary Whether or not the promise is resolved.
     * @memberof FooBox.utils.PromiseState#
     * @function isResolved
     * @returns {boolean}
     */
    isResolved: function () {
      return this.state === "resolved";
    },

    /**
     * @summary Whether or not the promise is rejected.
     * @memberof FooBox.utils.PromiseState#
     * @function isRejected
     * @returns {boolean}
     */
    isRejected: function () {
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
    then: function (onFulfilled, onRejected) {
      return this.promise.then(onFulfilled, onRejected);
    },

    /**
     * @summary The catch() method returns a Promise and deals with rejected cases only.
     * @memberof FooBox.utils.PromiseState#
     * @function catch
     * @param {FooBox.utils.PromiseState~onRejected} onRejected - A function called when the Promise is rejected.
     * @returns {Promise<*>}
     */
    catch: function (onRejected) {
      return this.promise.catch(onRejected);
    },

    /**
     * @summary The finally() method returns a Promise. When the promise is settled, i.e either fulfilled or rejected, the specified callback function is executed.
     * @memberof FooBox.utils.PromiseState#
     * @function finally
     * @param {FooBox.utils.PromiseState~onFinally} onFinally - A function called when the Promise is settled.
     * @returns {Promise<*>}
     */
    finally: function (onFinally) {
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

  _is.item = function (value) {
    return value instanceof _.Item;
  };
  /**
   * @summary Checks if the supplied value is an instance of the FooBox.Modal class.
   * @memberof FooBox.utils.is.
   * @function modal
   * @param {*} value - The value to checked.
   * @returns {boolean}
   */


  _is.modal = function (value) {
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

  webp.onload = function () {
    _.supportsWebP = 0 < webp.width && 0 < webp.height;
  };

  webp.onerror = function () {
    _.supportsWebP = false;
  };

  webp.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
})(FooBox.$, FooBox, FooBox.utils, FooBox.utils.is, FooBox.utils.fn, FooBox.utils.str, FooBox.utils.obj);
"use strict";

(function (_) {
  /**
   * @summary A simple wrapper around a ResizeObserver to allow for a callback to be registered at the time of observing.
   * @memberof FooBox.
   * @class Observer
   * @extends FooBox.utils.Class
   */
  _.Observer = _.Class.extend(
  /** @lends FooBox.Observer.prototype */
  {
    /**
     * @ignore
     * @constructs
     */
    construct: function () {
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
    observe: function (target, callback, options) {
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
    unobserve: function (target) {
      const self = this;
      self.observed.delete(target);
      self.resizeObserver.unobserve(target);
    },

    /**
     * @summary Stops observing all elements.
     * @memberof FooBox.Observer#
     * @function disconnect
     */
    disconnect: function () {
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
    onResizeObserved: function (entries) {
      const self = this;
      entries.forEach(function (entry) {
        if (self.observed.has(entry.target)) {
          const callback = self.observed.get(entry.target),
                size = _.getResizeObserverSize(entry);

          callback.call(callback, entry, size);
        }
      });
    }
  });
})(FooBox.utils);
"use strict";

(function ($, _, _is, _obj) {
  /**
   * @summary Used to split all `symbol` elements from a single `svg` into multiple stand-alone `svg` elements.
   * @memberof FooBox.utils.
   * @class SVGSplitter
   * @param {FooBox.utils.SVGSplitter~Options} [options] - The options for the splitter.
   * @augments FooBox.utils.Class
   * @borrows FooBox.utils.Class.extend as extend
   * @borrows FooBox.utils.Class.override as override
   * @borrows FooBox.utils.Class.__baseClass__ as __baseClass__
   */
  _.SVGSplitter = _.Class.extend(
  /** @lends FooBox.utils.SVGSplitter.prototype */
  {
    /**
     * @summary Performs the actual construction of a new instance of this class.
     * @memberof FooBox.utils.SVGSplitter#
     * @constructs
     * @param {FooBox.utils.SVGSplitter~Options} [options] - The options for the splitter.
     * @augments FooBox.utils.Class
     */
    construct: function (options) {
      const self = this;
      /**
       * @summary The options for the SVGSplitter class.
       * @typedef {Object} FooBox.utils.SVGSplitter~Options
       * @property {string} [xmlns="http://www.w3.org/2000/svg"] - The SVG XML namespace.
       * @property {string[]} [ignore] - An array of attribute names that will not be copied when splitting `symbol` elements into stand-alone `svg` elements.
       * @property {RegExp} [filterRegex] - The Regular Expression used to parse the target from a `filter` attribute.
       */

      /**
       * @summary The options for this instance of the splitter.
       * @memberof FooBox.utils.SVGSplitter#
       * @name opt
       * @type {FooBox.utils.SVGSplitter~Options}
       */

      self.opt = _obj.extend({
        xmlns: "http://www.w3.org/2000/svg",
        ignore: [],
        filterRegex: /^(?:url\(["']?)(#.*?)(?:["']?\))/
      }, options);
    },

    /**
     * @summary Get all attribute names from the supplied element.
     * @memberof FooBox.utils.SVGSplitter#
     * @function getAttributeNames
     * @param {Element} element - The element to retrieve all attribute names from.
     * @returns {string[]}
     */
    getAttributeNames: function (element) {
      if (element instanceof Element) {
        if (element.getAttributeNames) return element.getAttributeNames();
        const attrs = Array.prototype.slice.call(element.attributes);
        return attrs.map(function (attr) {
          return attr.name;
        });
      }

      return [];
    },

    /**
     * @summary Copy all attributes from one element to another.
     * @memberof FooBox.utils.SVGSplitter#
     * @function copyAttributes
     * @param {Element} source - The element to copy attributes from.
     * @param {Element} target - The element to copy attributes to.
     * @param {string[]} [ignore] - An optional array of attributes names to ignore.
     */
    copyAttributes: function (source, target, ignore) {
      if (source instanceof Element && target instanceof Element) {
        ignore = _is.array(ignore) ? ignore : [];
        this.getAttributeNames(source).forEach(function (name) {
          if (ignore.indexOf(name) !== -1) return;
          target.setAttribute(name, source.getAttribute(name));
        });
      }
    },

    /**
     * @summary Get the `href` or `xlink:href` attribute from the supplied element.
     * @memberof FooBox.utils.SVGSplitter#
     * @function getHref
     * @param {SVGElement} element - The element to get the attribute from.
     * @returns {?string} `null` if the element is not an SVGElement or no attribute could be found.
     */
    getHref: function (element) {
      if (element instanceof SVGElement) {
        if (element.hasAttribute("href")) return element.getAttribute("href");
        if (element.hasAttribute("xlink:href")) return element.getAttribute("xlink:href");
      }

      return null;
    },

    /**
     * @summary Get the target of the supplied <use> elements `href` or `xlink:href` attribute.
     * @memberof FooBox.utils.SVGSplitter#
     * @function getUseDef
     * @param {SVGUseElement} use - The <use> element to parse.
     * @returns {?Node}
     */
    getUseDef: function (use) {
      if (use instanceof SVGUseElement) {
        let selector = this.getHref(use);

        if (_is.string(selector)) {
          const element = use.ownerSVGElement.querySelector(selector);

          if (element instanceof Element) {
            return element.cloneNode(true);
          }
        }
      }

      return null;
    },

    /**
     * @summary Get the target of the supplied elements `filter` attribute.
     * @memberof FooBox.utils.SVGSplitter#
     * @function getFilterDef
     * @param {SVGElement} element - The element to parse.
     * @returns {?Node}
     */
    getFilterDef: function (element) {
      if (element instanceof SVGElement) {
        const attr = element.getAttribute("filter");

        if (_is.string(attr)) {
          const match = attr.match(this.opt.filterRegex);

          if (match !== null && match.length === 2) {
            // fetch the filter from the parent
            const filter = element.ownerSVGElement.querySelector(match[1]);

            if (filter instanceof SVGFilterElement) {
              return filter.cloneNode(true);
            }
          }
        }
      }

      return null;
    },

    /**
     * @summary Get all defs used by the supplied `symbol` element.
     * @memberof FooBox.utils.SVGSplitter#
     * @function getDefs
     * @param {SVGSymbolElement} symbol - The `symbol` to parse.
     * @returns {Node[]}
     */
    getDefs: function (symbol) {
      const self = this,
            defs = [];

      if (symbol instanceof SVGSymbolElement) {
        const uses = symbol.querySelectorAll("use");

        for (let i = 0, l = uses.length; i < l; i++) {
          const found = self.getUseDef(uses[i]);

          if (found instanceof Node && defs.indexOf(found) === -1) {
            defs.push(found);
          }
        }

        const elements = symbol.querySelectorAll('[filter]');

        for (let i = 0, l = elements.length; i < l; i++) {
          const filter = self.getFilterDef(elements[i]);

          if (filter instanceof Node && defs.indexOf(filter) === -1) {
            defs.unshift(filter);
          }
        }
      }

      return defs;
    },

    /**
     * @summary Create a stand-alone `svg` from the supplied `symbol` element.
     * @memberof FooBox.utils.SVGSplitter#
     * @function createSVGElement
     * @param {SVGSymbolElement} symbol - The `symbol` to parse.
     * @returns {?Element}
     */
    createSVGElement: function (symbol) {
      const self = this;

      if (symbol instanceof SVGSymbolElement) {
        const svg = document.createElementNS(self.opt.xmlns, "svg");
        self.copyAttributes(symbol.ownerSVGElement, svg, self.opt.ignore);
        self.copyAttributes(symbol, svg, self.opt.ignore);
        const length = symbol.childNodes.length;

        for (let i = 0, node; i < length; i++) {
          node = symbol.childNodes[i];
          if (node.nodeType !== 1) continue;
          svg.appendChild(node.cloneNode(true));
        }

        const definitions = self.getDefs(symbol);

        if (definitions.length > 0) {
          let defs = svg.querySelector("defs");

          if (defs === null) {
            defs = document.createElementNS(self.opt.xmlns, "defs");
            svg.insertBefore(defs, svg.firstChild);
          }

          definitions.forEach(function (def) {
            defs.appendChild(def);
          });
        }

        return svg;
      }

      return null;
    },

    /**
     * @summary Parse the supplied `svg` element and split out all `symbol` elements with an ID into there own `svg` element.
     * @memberof FooBox.utils.SVGSplitter#
     * @function parse
     * @param {SVGSVGElement} svg - The `svg` element to parse.
     * @returns {Object<string, SVGSVGElement>}
     */
    parse: function (svg) {
      const self = this,
            result = {};

      if (svg instanceof SVGSVGElement) {
        const symbols = svg.querySelectorAll("symbol[id]");

        for (let i = 0, l = symbols.length; i < l; i++) {
          if (symbols[i].id === "") continue;
          const created = self.createSVGElement(symbols[i]);

          if (created instanceof SVGSVGElement) {
            result[symbols[i].id] = created;
          }
        }
      }

      return result;
    }
  });
})(FooBox.utils.$, FooBox.utils, FooBox.utils.is, FooBox.utils.obj);
"use strict";

(function ($, _, _is, _obj, _str) {
  /**
   * @summary An SVG registry that provides CSS stylable stand-alone `svg` icons generated from SVG sprites.
   * @memberof FooBox.utils.
   * @class SVGRegistry
   * @param {FooBox.utils.SVGRegistry~Options} options - The options for the manager.
   * @augments FooBox.utils.Class
   * @borrows FooBox.utils.Class.extend as extend
   * @borrows FooBox.utils.Class.override as override
   * @borrows FooBox.utils.Class.__baseClass__ as __baseClass__
   */
  _.SVGRegistry = _.Class.extend(
  /** @lends FooBox.utils.SVGRegistry.prototype */
  {
    /**
     * @ignore
     * @constructs
     * @param {FooBox.utils.SVGRegistry~Options} options - The options for the manager.
     */
    construct: function (options) {
      const self = this;
      /**
       * @summary The options for the SVGRegistry class.
       * @typedef {?Object} FooBox.utils.SVGRegistry~Options
       * @property {?string} [id=null] - The default id used to register additional `svg` elements from the page.
       * @property {string} [iconClass=""] - The CSS class to add to every icon. This is also used as a prefix when generating a unique CSS class for an icon based off its <symbol> id.
       * @property {FooBox.utils.SVGSplitter~Options} [splitter={ignore:["id","class"]}] - The options supplied to the SVG splitter used by the manager.
       */

      /**
       * @summary The options for this instance of the manager.
       * @memberof FooBox.utils.SVGRegistry#
       * @name opt
       * @type {FooBox.utils.SVGRegistry~Options}
       */

      self.opt = _obj.extend({
        id: null,
        iconClass: "",
        splitter: {
          ignore: ["id", "class"]
        }
      }, options);
      /**
       * @summary An object containing all registered icons.
       * @memberof FooBox.utils.SVGRegistry#
       * @name registered
       * @type {Object<string, Object<string, SVGSVGElement>>}
       */

      self.registered = {
        defaults: {}
      };
      /**
       * @summary The SVG splitter used to separate sprites into stand-alone `svg` elements.
       * @memberof FooBox.utils.SVGRegistry#
       * @name splitter
       * @type {FooBox.SVGSplitter}
       */

      self.splitter = new _.SVGSplitter(self.opt.splitter);
    },

    /**
     * @summary Initializes the manager registering any `svg` elements found in the page using the `id` option.
     * @memberof FooBox.utils.SVGRegistry#
     * @function init
     */
    init: function () {
      const self = this;

      if (_is.string(self.opt.id) && self.opt.id.length > 0) {
        $("svg[id|='" + self.opt.id + "']").each(function (i, svg) {
          if (svg.id === self.opt.id) {
            self.register("defaults", svg);
          } else if (svg.id.length > self.opt.id.length) {
            // if we're here that means the id begins with "foobar-icons-" so trim it to get the name
            const name = svg.id.splice(0, self.opt.id.length + 1);
            self.register(name, svg);
          }
        });
      }
    },

    /**
     * @summary Register an `svg` with the provided `name`.
     * @memberof FooBox.utils.SVGRegistry#
     * @function register
     * @param {string} name - The name for the `svg`, if it already exists any differences will be merged.
     * @param {(string|jQuery|SVGSVGElement)} svg - The SVG to register.
     * @returns {boolean}
     */
    register: function (name, svg) {
      if (_is.string(name)) {
        const self = this,
              $svg = $(svg);

        if ($svg.length === 1 && $svg.is("svg")) {
          const icons = self.splitter.parse($svg.get(0)),
                current = self.registered[name];
          self.registered[name] = _obj.extend({}, self.registered.defaults, current, icons);
          return true;
        }
      }

      return false;
    },

    /**
     * @summary Check if the provided icon exists.
     * @memberof FooBox.utils.SVGRegistry#
     * @function exists
     * @param {string} iconName - The name of the icon to check for.
     * @param {string} [svgName="defaults"] - The registered SVG to check for the icon.
     * @returns {boolean}
     */
    exists: function (iconName, svgName) {
      const self = this; // have to provide at least an icon name to check

      if (_is.string(iconName)) {
        let icons = _is.string(svgName) && self.registered.hasOwnProperty(svgName) ? self.registered[svgName] : null;

        if (icons === null || !icons.hasOwnProperty(iconName)) {
          icons = self.registered.defaults;
        }

        return icons[iconName] instanceof SVGSVGElement;
      }

      return false;
    },

    /**
     * @summary Get an icon.
     * @memberof FooBox.utils.SVGRegistry#
     * @function get
     * @param {string} iconName - The name of the icon to get.
     * @param {string} [svgName="defaults"] - The SVG to retrieve the icon from.
     * @param {string[]} [classes] - Any additional CSS classes to add to the returned icon.
     * @returns {?Node}
     */
    get: function (iconName, svgName, classes) {
      const self = this; // have to provide at least the icon name to try fetch something

      if (_is.string(iconName)) {
        let icons = _is.string(svgName) && self.registered.hasOwnProperty(svgName) ? self.registered[svgName] : null;

        if (icons === null || !icons.hasOwnProperty(iconName)) {
          icons = self.registered.defaults;
        }

        if (icons[iconName] instanceof Element) {
          // 2 default CSS classes: fbr-icon fbr-icon-ICON_NAME
          let classNames = [self.opt.iconClass, self.opt.iconClass + "-" + iconName];

          if (_is.array(classes)) {
            // merge any additional CSS classes
            classes.forEach(function (className) {
              // only merge if string and unique
              if (_is.string(className) && classNames.indexOf(className) === -1) {
                classNames.push(className);
              }
            });
          } // here we make a clone of the registered icon so that it is not modified


          const clone = icons[iconName].cloneNode(true);
          clone.setAttribute("class", classNames.join(" "));
          return clone;
        }
      }

      return null;
    },

    /**
     * @summary Get all icons for the provided SVG name.
     * @memberof FooBox.utils.SVGRegistry#
     * @function all
     * @param {string} [svgName="defaults"] - The name of the SVG to retrieve icons from.
     * @param {string[]} [classes] - Any additional CSS classes to add to the returned icons.
     * @returns {Object<string, Node>} An array of all icons for the provided `svgName`.
     */
    all: function (svgName, classes) {
      const self = this,
            all = {};
      let icons = _is.string(svgName) && self.registered.hasOwnProperty(svgName) ? self.registered[svgName] : self.registered.defaults;
      Object.keys(icons).forEach(function (key) {
        all[key] = self.get(key, svgName, classes);
      });
      return all;
    }
  });
})(FooBox.utils.$, FooBox.utils, FooBox.utils.is, FooBox.utils.obj, FooBox.utils.str);
"use strict";

(function (_, _utils) {
  /**
   * @memberOf FooBox.
   * @name items
   * @type {FooBox.utils.ClassRegistry}
   */
  _.items = new _utils.ClassRegistry({
    allowBase: false
  });
  /**
   * @memberOf FooBox.
   * @name layouts
   * @type {FooBox.utils.ClassRegistry}
   */

  _.layouts = new _utils.ClassRegistry({
    allowBase: true
  });
  /**
   * @memberOf FooBox.
   * @name icons
   * @type {FooBox.utils.SVGRegistry}
   */

  _.icons = new _utils.SVGRegistry({
    id: "foobox-icons",
    iconClass: "fbx-icon"
  });
})(FooBox, FooBox.utils);
"use strict";

(function (_icons) {
  const defaults = `<svg xmlns="http://www.w3.org/2000/svg">
	<defs>
		<symbol id="info" viewBox="0 0 16 16">
  			<path d="m7.5 8h1v5.5h-1zm0-5.5h1v1h-1z" stroke-linejoin="round" stroke-width="3"></path>
		</symbol>
		<symbol id="info2" viewBox="0 0 16 16">
			<path d="M7 4.75c0-0.412 0.338-0.75 0.75-0.75h0.5c0.412 0 0.75 0.338 0.75 0.75v0.5c0 0.412-0.338 0.75-0.75 0.75h-0.5c-0.412 0-0.75-0.338-0.75-0.75v-0.5z"></path><path d="M10 12h-4v-1h1v-3h-1v-1h3v4h1z"></path><path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 14.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"></path>
		</symbol>
		<symbol id="cross" viewBox="0 0 16 16">
			<path d="m7.5 8-4-4 0.5-0.5 4 4 4-4 0.5 0.5-4 4 4 4-0.5 0.5-4-4-4 4-0.5-0.5z" stroke-linejoin="round" stroke-width="3"></path>
		</symbol>
		<symbol id="cross2" viewBox="0 0 16 16">
			<path d="M13.957 3.457l-1.414-1.414-4.543 4.543-4.543-4.543-1.414 1.414 4.543 4.543-4.543 4.543 1.414 1.414 4.543-4.543 4.543 4.543 1.414-1.414-4.543-4.543z"></path>
		</symbol>
		<symbol id="cross-small" viewBox="0 0 16 16">
			<path d="M12.207 10.793l-1.414 1.414-2.793-2.793-2.793 2.793-1.414-1.414 2.793-2.793-2.793-2.793 1.414-1.414 2.793 2.793 2.793-2.793 1.414 1.414-2.793 2.793 2.793 2.793z"></path>
		</symbol>
		
		<symbol id="arrow-left" viewBox="0 0 16 16">
			<path d="m14.5 7.5h-11.5l5.5-5.5-0.5-0.5-6.5 6.5 6.5 6.5 0.5-0.5-5.5-5.5h11.5z" stroke-linejoin="round" stroke-width="3"></path>
		</symbol>
		<symbol id="arrow-left2" viewBox="0 0 16 16">
			<path d="M10.5 16l1.5-1.5-6.5-6.5 6.5-6.5-1.5-1.5-8 8 8 8z"></path>
		</symbol>
		<symbol id="arrow-right" viewBox="0 0 16 16">
			<path d="M 1.5,7.5 H 13 L 7.5,2 8,1.5 14.5,8 8,14.5 7.5,14 13,8.5 H 1.5 Z" stroke-linejoin="round" stroke-width="3"></path>
		</symbol>
		<symbol id="arrow-right2" viewBox="0 0 16 16">
			<path d="M5.5 0l-1.5 1.5 6.5 6.5-6.5 6.5 1.5 1.5 8-8-8-8z"></path>
		</symbol>

		<symbol id="expand" viewBox="0 0 16 16">
			<path d="M2 5h-2v-4c0-0.552 0.448-1 1-1h4v2h-3v3z"></path>
			<path d="M16 5h-2v-3h-3v-2h4c0.552 0 1 0.448 1 1v4z"></path>
			<path d="M15 16h-4v-2h3v-3h2v4c0 0.552-0.448 1-1 1z"></path>
			<path d="M5 16h-4c-0.552 0-1-0.448-1-1v-4h2v3h3v2z"></path>
		</symbol>
		<symbol id="shrink" viewBox="0 0 16 16">
			<path d="M3 0h2v4c0 0.552-0.448 1-1 1h-4v-2h3v-3z"></path>
			<path d="M11 0h2v3h3v2h-4c-0.552 0-1-0.448-1-1v-4z"></path>
			<path d="M12 11h4v2h-3v3h-2v-4c0-0.552 0.448-1 1-1z"></path>
			<path d="M0 11h4c0.552 0 1 0.448 1 1v4h-2v-3h-3v-2z"></path>
		</symbol>
		
		<symbol id="spinner" viewBox="0 0 16 16">
			<path d="M8 16c-2.137 0-4.146-0.832-5.657-2.343s-2.343-3.52-2.343-5.657c0-1.513 0.425-2.986 1.228-4.261 0.781-1.239 1.885-2.24 3.193-2.895l0.672 1.341c-1.063 0.533-1.961 1.347-2.596 2.354-0.652 1.034-0.997 2.231-0.997 3.461 0 3.584 2.916 6.5 6.5 6.5s6.5-2.916 6.5-6.5c0-1.23-0.345-2.426-0.997-3.461-0.635-1.008-1.533-1.822-2.596-2.354l0.672-1.341c1.308 0.655 2.412 1.656 3.193 2.895 0.803 1.274 1.228 2.748 1.228 4.261 0 2.137-0.832 4.146-2.343 5.657s-3.52 2.343-5.657 2.343z"></path>
		</symbol>
		<symbol id="spinner2" viewBox="0 0 16 16">
			<path d="M8 4.736c-0.515 0-0.933-0.418-0.933-0.933v-2.798c0-0.515 0.418-0.933 0.933-0.933s0.933 0.418 0.933 0.933v2.798c0 0.515-0.418 0.933-0.933 0.933z"></path>
			<path d="M8 15.577c-0.322 0-0.583-0.261-0.583-0.583v-2.798c0-0.322 0.261-0.583 0.583-0.583s0.583 0.261 0.583 0.583v2.798c0 0.322-0.261 0.583-0.583 0.583z"></path>
			<path d="M5.902 5.24c-0.302 0-0.596-0.157-0.758-0.437l-1.399-2.423c-0.241-0.418-0.098-0.953 0.32-1.194s0.953-0.098 1.194 0.32l1.399 2.423c0.241 0.418 0.098 0.953-0.32 1.194-0.138 0.079-0.288 0.117-0.436 0.117z"></path>
			<path d="M11.498 14.582c-0.181 0-0.358-0.094-0.455-0.262l-1.399-2.423c-0.145-0.251-0.059-0.572 0.192-0.717s0.572-0.059 0.717 0.192l1.399 2.423c0.145 0.251 0.059 0.572-0.192 0.717-0.083 0.048-0.173 0.070-0.262 0.070z"></path>
			<path d="M4.365 6.718c-0.138 0-0.279-0.035-0.407-0.109l-2.423-1.399c-0.39-0.225-0.524-0.724-0.299-1.115s0.724-0.524 1.115-0.299l2.423 1.399c0.39 0.225 0.524 0.724 0.299 1.115-0.151 0.262-0.425 0.408-0.707 0.408z"></path>
			<path d="M14.057 11.964c-0.079 0-0.159-0.020-0.233-0.063l-2.423-1.399c-0.223-0.129-0.299-0.414-0.171-0.637s0.414-0.299 0.637-0.171l2.423 1.399c0.223 0.129 0.299 0.414 0.171 0.637-0.086 0.15-0.243 0.233-0.404 0.233z"></path>
			<path d="M3.803 8.758h-2.798c-0.418 0-0.758-0.339-0.758-0.758s0.339-0.758 0.758-0.758h2.798c0.419 0 0.758 0.339 0.758 0.758s-0.339 0.758-0.758 0.758z"></path>
			<path d="M14.995 8.466c-0 0 0 0 0 0h-2.798c-0.258-0-0.466-0.209-0.466-0.466s0.209-0.466 0.466-0.466c0 0 0 0 0 0h2.798c0.258 0 0.466 0.209 0.466 0.466s-0.209 0.466-0.466 0.466z"></path>
			<path d="M1.943 12.197c-0.242 0-0.477-0.125-0.606-0.35-0.193-0.335-0.079-0.762 0.256-0.955l2.423-1.399c0.335-0.193 0.762-0.079 0.955 0.256s0.079 0.762-0.256 0.955l-2.423 1.399c-0.11 0.064-0.23 0.094-0.349 0.094z"></path>
			<path d="M11.635 6.368c-0.161 0-0.318-0.084-0.404-0.233-0.129-0.223-0.052-0.508 0.171-0.637l2.423-1.399c0.223-0.129 0.508-0.052 0.637 0.171s0.052 0.508-0.171 0.637l-2.423 1.399c-0.073 0.042-0.154 0.063-0.233 0.063z"></path>
			<path d="M4.502 14.699c-0.109 0-0.219-0.028-0.32-0.086-0.307-0.177-0.412-0.569-0.235-0.876l1.399-2.423c0.177-0.307 0.569-0.412 0.876-0.235s0.412 0.569 0.235 0.876l-1.399 2.423c-0.119 0.206-0.334 0.321-0.556 0.321z"></path>
			<path d="M10.098 4.832c-0.079 0-0.159-0.020-0.233-0.063-0.223-0.129-0.299-0.414-0.171-0.637l1.399-2.423c0.129-0.223 0.414-0.299 0.637-0.171s0.299 0.414 0.171 0.637l-1.399 2.423c-0.086 0.15-0.243 0.233-0.404 0.233z"></path>
		</symbol>
		<symbol id="spinner3" viewBox="0 0 16 16">
			<path d="M16 8c-0.020-1.045-0.247-2.086-0.665-3.038-0.417-0.953-1.023-1.817-1.766-2.53s-1.624-1.278-2.578-1.651c-0.953-0.374-1.978-0.552-2.991-0.531-1.013 0.020-2.021 0.24-2.943 0.646-0.923 0.405-1.758 0.992-2.449 1.712s-1.237 1.574-1.597 2.497c-0.361 0.923-0.533 1.914-0.512 2.895 0.020 0.981 0.234 1.955 0.627 2.847 0.392 0.892 0.961 1.7 1.658 2.368s1.523 1.195 2.416 1.543c0.892 0.348 1.851 0.514 2.799 0.493 0.949-0.020 1.89-0.227 2.751-0.608 0.862-0.379 1.642-0.929 2.287-1.604s1.154-1.472 1.488-2.335c0.204-0.523 0.342-1.069 0.415-1.622 0.019 0.001 0.039 0.002 0.059 0.002 0.552 0 1-0.448 1-1 0-0.028-0.001-0.056-0.004-0.083h0.004zM14.411 10.655c-0.367 0.831-0.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434c-0.832 0.323-1.723 0.476-2.608 0.454-0.884-0.020-1.759-0.215-2.56-0.57-0.801-0.354-1.526-0.867-2.125-1.495s-1.071-1.371-1.38-2.173c-0.31-0.801-0.457-1.66-0.435-2.512s0.208-1.694 0.551-2.464c0.342-0.77 0.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c0.771-0.298 1.596-0.438 2.416-0.416s1.629 0.202 2.368 0.532c0.74 0.329 1.41 0.805 1.963 1.387s0.988 1.27 1.272 2.011c0.285 0.74 0.418 1.532 0.397 2.32h0.004c-0.002 0.027-0.004 0.055-0.004 0.083 0 0.516 0.39 0.94 0.892 0.994-0.097 0.544-0.258 1.075-0.481 1.578z"></path>
		</symbol>
		<symbol id="spinner4" viewBox="0 0 16 16">
			<path d="M3 8c0-0.19 0.011-0.378 0.032-0.563l-2.89-0.939c-0.092 0.487-0.141 0.989-0.141 1.502 0 2.3 0.971 4.374 2.526 5.833l1.786-2.458c-0.814-0.889-1.312-2.074-1.312-3.375zM13 8c0 1.301-0.497 2.486-1.312 3.375l1.786 2.458c1.555-1.459 2.526-3.533 2.526-5.833 0-0.513-0.049-1.015-0.141-1.502l-2.89 0.939c0.021 0.185 0.032 0.373 0.032 0.563zM9 3.1c1.436 0.292 2.649 1.199 3.351 2.435l2.89-0.939c-1.144-2.428-3.473-4.188-6.241-4.534v3.038zM3.649 5.535c0.702-1.236 1.914-2.143 3.351-2.435v-3.038c-2.769 0.345-5.097 2.105-6.241 4.534l2.89 0.939zM10.071 12.552c-0.631 0.288-1.332 0.448-2.071 0.448s-1.44-0.16-2.071-0.448l-1.786 2.458c1.144 0.631 2.458 0.99 3.857 0.99s2.713-0.359 3.857-0.99l-1.786-2.458z"></path>
		</symbol>
		<symbol id="spinner5" viewBox="0 0 16 16">
			<path d="M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM8 4c2.209 0 4 1.791 4 4s-1.791 4-4 4-4-1.791-4-4 1.791-4 4-4zM12.773 12.773c-1.275 1.275-2.97 1.977-4.773 1.977s-3.498-0.702-4.773-1.977-1.977-2.97-1.977-4.773c0-1.803 0.702-3.498 1.977-4.773l1.061 1.061c0 0 0 0 0 0-2.047 2.047-2.047 5.378 0 7.425 0.992 0.992 2.31 1.538 3.712 1.538s2.721-0.546 3.712-1.538c2.047-2.047 2.047-5.378 0-7.425l1.061-1.061c1.275 1.275 1.977 2.97 1.977 4.773s-0.702 3.498-1.977 4.773z"></path>
		</symbol>
		<symbol id="spinner6" viewBox="0 0 16 16">
			<path d="M6 2c0-1.105 0.895-2 2-2s2 0.895 2 2c0 1.105-0.895 2-2 2s-2-0.895-2-2zM12.359 8c0 0 0 0 0 0 0-0.906 0.735-1.641 1.641-1.641s1.641 0.735 1.641 1.641c0 0 0 0 0 0 0 0.906-0.735 1.641-1.641 1.641s-1.641-0.735-1.641-1.641zM10.757 12.243c0-0.821 0.665-1.486 1.486-1.486s1.486 0.665 1.486 1.486c0 0.821-0.665 1.486-1.486 1.486s-1.486-0.665-1.486-1.486zM6.654 14c0-0.743 0.603-1.346 1.346-1.346s1.346 0.603 1.346 1.346c0 0.743-0.603 1.346-1.346 1.346s-1.346-0.603-1.346-1.346zM2.538 12.243c0-0.673 0.546-1.219 1.219-1.219s1.219 0.546 1.219 1.219c0 0.673-0.546 1.219-1.219 1.219s-1.219-0.546-1.219-1.219zM0.896 8c0-0.61 0.494-1.104 1.104-1.104s1.104 0.494 1.104 1.104c0 0.61-0.494 1.104-1.104 1.104s-1.104-0.494-1.104-1.104zM2.757 3.757c0 0 0 0 0 0 0-0.552 0.448-1 1-1s1 0.448 1 1c0 0 0 0 0 0 0 0.552-0.448 1-1 1s-1-0.448-1-1zM14.054 3.757c0 1-0.811 1.811-1.812 1.811s-1.812-0.811-1.812-1.811c0-1.001 0.811-1.811 1.812-1.811s1.812 0.811 1.812 1.811z"></path>
		</symbol>
	</defs>
</svg>`;

  _icons.register("defaults", defaults);
})(FooBox.icons);
"use strict";

(function (_, _utils, _is, _obj) {
  _.Parser = _utils.Class.extend({
    construct: function () {
      const self = this;
      self.parsed = [];
    },
    find: function (root, selector, exclude) {
      const self = this;

      let found = _utils.toArray(root.querySelectorAll(selector));

      if (_is.string(exclude)) {
        found = found.filter(function (element) {
          if (_is.selectorOrChildOf(element, exclude)) {
            console.debug("Skipping excluded element.", {
              "root": root,
              "element": element,
              "selector": selector,
              "exclude": exclude
            });
            return false;
          }

          if (self.parsed.indexOf(element) !== -1) {
            console.debug("Skipping parsed element.", {
              "root": root,
              "element": element,
              "selector": selector,
              "exclude": exclude
            });
            return false;
          }

          return true;
        });
      } else {
        found = found.filter(function (element) {
          if (self.parsed.indexOf(element) !== -1) {
            console.debug("Skipping parsed element.", {
              "root": root,
              "element": element,
              "selector": selector,
              "exclude": exclude
            });
            return false;
          }

          return true;
        });
      }

      return found;
    },
    parse: function (element, config) {
      const self = this,
            instances = [],
            p = config.parser;

      if (_is.object(p) && _is.array(p.containers) && p.containers.length > 0) {
        p.containers.forEach(function (selector) {
          const containers = self.find(element, selector, p.exclude);

          if (containers.length > 0) {
            const parsed = containers.map(function (container) {
              return self.parseInstance(container, config);
            }).filter(function (instance) {
              return instance !== null;
            });

            if (parsed.length > 0) {
              instances.push.apply(instances, parsed);
            } else {
              console.debug("Unable to parse any instances from matched containers.", {
                "parser": self,
                "element": element,
                "selector": selector,
                "containers": containers
              });
            }
          } else {
            console.debug("No containers matched the selector.", {
              "parser": self,
              "element": element,
              "selector": selector
            });
          }
        });
        self.parsed = [];
      }

      return instances;
    },
    parseInstance: function (element, config) {
      const self = this,
            options = _utils.getJsonAttribute(element, "data-foobox", _obj.extend({}, config.defaults, config.parser)),
            classes = _utils.getJsonAttribute(element, "data-foobox-classes", config.classes),
            i18n = _utils.getJsonAttribute(element, "data-foobox-i18n", config.i18n),
            id = element.dataset.id || element.id || options.id;

      if (!_is.string(options.layout)) {
        options.layout = "modern";
      }

      if (!_is.hash(options.types)) {
        console.debug("Invalid types supplied.", {
          "parser": self,
          "types": options.types
        });
        return null;
      }

      let trigger = null,
          items = [],
          found;

      if (_is.string(options.items)) {
        if (_is.selector(element, options.items) && self.parsed.indexOf(element) === -1 && !_is.selectorOrChildOf(element, options.exclude)) {
          found = [element];
          trigger = "element";
        } else {
          found = self.find(element, options.items, options.exclude);
          trigger = "items";
        }

        items = found.map(function (element) {
          return self.parseItem(element, options);
        }).filter(function (item) {
          return item !== null;
        });
      } else if (_is.array(options.items)) {
        items = options.items.map(function (item) {
          if (_is.string(item)) {
            item = {
              url: item
            };
          }

          return self.parseItem(item, options);
        }).filter(function (item) {
          return item !== null;
        });
        trigger = "element";
      }

      if (id !== null && _is.array(window[id + "_items"])) {
        items = items.concat(window[id + "_items"].map(function (item) {
          //TODO: Convert from FooGallery items to FooBox items
          return item;
        }));
      }

      if (trigger !== null && items.length > 0) {
        self.parsed.push(element);
        items.forEach(function (item) {
          if (item.hasOwnProperty("parsedFrom") && _is.element(item.parsedFrom)) {
            self.parsed.push(item.parsedFrom);
          }
        });
        console.debug("Parsed config.", {
          "parsedFrom": element,
          "trigger": trigger,
          "options": options,
          "items": items
        });
        return {
          "parsedFrom": element,
          "type": _is.string(options.layout) ? options.layout : "modern",
          "trigger": trigger,
          "options": options,
          "classes": classes,
          "i18n": i18n,
          "items": items
        };
      }

      return null;
    },

    /**
     * @param obj
     * @param options
     * @returns {object|null}
     */
    parseItem: function (obj, options) {
      const self = this,
            isHash = _is.hash(obj),
            isElement = !isHash && _is.element(obj);

      let id = null;

      if (isHash) {
        id = obj.id || null;
      }

      if (isElement) {
        id = obj.dataset.id || obj.id || null;
      }

      let url = null;

      if (isHash) {
        url = obj.url || obj.href || null;
      } else if (isElement) {
        url = obj.dataset.url || obj.dataset.href || obj.href || null;
      }

      if (url === null) {
        console.debug("Unable to parse url from object.", {
          "parser": self,
          "object": obj,
          "options": options
        });
        return null;
      }

      const types = Object.keys(options.types);
      let type = null;

      if (isElement) {
        const value = obj.dataset.type;

        if (_is.string(value) && types.some(function (type) {
          return value === type;
        })) {
          type = value;
        }
      }

      if (type === null) {
        type = _utils.find(types, function (type) {
          const opt = options.types[type];

          if (!opt || isElement && _is.string(opt.selector) && !_is.selector(obj, opt.selector)) {
            return false;
          }

          if (_is.string(opt.regex)) {
            opt.regex = new RegExp(opt.regex);
          }

          if (opt.regex instanceof RegExp) {
            if (_is.string(opt.exclude)) {
              opt.exclude = new RegExp(opt.exclude);
            }

            if (opt.exclude instanceof RegExp) {
              return opt.regex.test(url) && !opt.exclude.test(url);
            } else {
              return opt.regex.test(url);
            }
          }
        });
      }

      if (!type) {
        console.debug("Unable to parse type from object or url.", {
          "parser": self,
          "parsedFrom": obj,
          "url": url,
          "options": options
        });
        return null;
      }

      const opt = options.types[type];
      let width = opt.width || null;

      if (isHash) {
        width = obj.width;
      } else if (isElement) {
        const value = obj.dataset.width;

        if (_is.string(value) && _is.size(value)) {
          width = value;
        }
      }

      let height = opt.height || null;

      if (isHash) {
        height = obj.height;
      } else if (isElement) {
        const value = obj.dataset.height;

        if (_is.string(value) && _is.size(value)) {
          height = value;
        }
      }

      let aspectRatio = opt.aspectRatio || null;

      if (isHash) {
        aspectRatio = obj.aspectRatio;
      } else if (isElement) {
        const value = obj.dataset.aspectRatio;

        if (_is.string(value)) {
          aspectRatio = value;
        }
      }

      let title = opt.title || null;

      if (isHash) {
        title = obj.title;
      } else if (isElement) {
        const value = obj.dataset.title || obj.dataset.captionTitle || obj.dataset.lightboxTitle;

        if (_is.string(value)) {
          title = value;
        }
      }

      let description = opt.description || null;

      if (isHash) {
        description = obj.description;
      } else if (isElement) {
        const value = obj.dataset.description || obj.dataset.captionDesc || obj.dataset.lightboxDescription;

        if (_is.string(value)) {
          description = value;
        }
      }

      return {
        "parsedFrom": obj,
        "options": {
          "id": id,
          "url": url,
          "type": type,
          "width": width,
          "height": height,
          "aspectRatio": aspectRatio,
          "title": title,
          "description": description
        }
      };
    }
  });
  /**
   * @typedef {Object} FooBox~Options
   * @property {string} [id=null]
   * @property {boolean} [loop=false]
   */
})(FooBox, FooBox.utils, FooBox.utils.is, FooBox.utils.obj);
"use strict";

(function (_, _utils, _is, _obj) {
  /**
   * @summary The base class for all components of the modal.
   * @memberof FooBox.
   * @class Component
   * @param {FooBox.Modal} modal
   * @param {Object} options
   */
  _.Component = _utils.EventClass.extend(
  /** @lends FooBox.Component */
  {
    /**
     * @ignore
     * @constructs
     * @param {string} name - The name of the component.
     * @param {FooBox.Component~Configuration} config
     * @param {FooBox.Component} parent
     */
    construct: function (name, config, parent) {
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
    configure: function (config) {
      if (!_is.hash(config)) return;
      const self = this;

      _obj.merge(self.raw, config);

      if (_is.hash(config.options)) _obj.merge(self.opt, config.options);
      if (_is.hash(config.i18n)) _obj.merge(self.i18n, config.i18n);

      if (_is.hash(config.classes)) {
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
    init: function () {
      const self = this;
      if (self.__initialize instanceof Promise) return self.__initialize;
      self.isInitializing = true;
      self.trigger("initializing");
      return self.__initialize = Promise.resolve().then(function () {
        self.trigger("before-setup");
        return self.beforeSetup();
      }).then(function () {
        self.trigger("setup");
        return self.setup();
      }).then(function () {
        self.trigger("after-setup");
        return self.afterSetup();
      }).then(function () {
        self.isInitializing = false;
        self.isInitialized = true;
        self.trigger("initialized");
      }).catch(function (err) {
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
    beforeSetup: function () {},

    /**
     * @summary Used by subclasses to perform any additional setup the component requires.
     * @memberof FooBox.Component#
     * @function setup
     * @returns {(Promise|void)}
     */
    setup: function () {},

    /**
     * @summary Used by subclasses to perform any internal work after the component setup is called.
     * @memberof FooBox.Component#
     * @function afterSetup
     * @returns {(Promise|void)}
     */
    afterSetup: function () {},

    /**
     * @summary Destroys the component removing any added functionality and returning the {@link FooBox.Component#$el|element} to its original state.
     * @memberof FooBox.Component#
     * @function destroy
     */
    destroy: function () {
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
    beforeTeardown: function () {},

    /**
     * @summary Used by subclasses to perform any additional teardown the component requires.
     * @memberof FooBox.Component#
     * @function teardown
     */
    teardown: function () {},

    /**
     * @summary Used by subclasses to perform any internal work after the component teardown is called.
     * @memberof FooBox.Component#
     * @function afterTeardown
     */
    afterTeardown: function () {},

    /**
     * @summary Emits the supplied event on the current class.
     * @memberof FooBox.Component#
     * @function emit
     * @param {FooBox.utils.Event} event - The event object to emit.
     * @param {Array} [args] - An array of additional arguments to supply to the listener after the event object.
     */
    emit: function (event, args) {
      const self = this;

      if (event instanceof _utils.Event) {
        const bubbled = event.target !== null && event.target !== self;

        if (!bubbled || bubbled && self.opt.bubbleEvents) {
          self._super(event, args);

          if (self.opt.domEvents) {
            let eventName = event.type;
            if (_is.string(event.namespace)) eventName += "." + event.namespace;
            self.$el.trigger(eventName, args);
          }
        }

        if (self.opt.bubbleEvents && self.parent instanceof _.Component) {
          self.parent.emit(event, args);
        }
      }
    }
  });
})(FooBox, FooBox.utils, FooBox.utils.is, FooBox.utils.obj);
"use strict";

(function ($, _, _utils, _is, _fn, _obj) {
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
  _.Plugin = _.Component.extend(
  /** @lends FooBox.Plugin.prototype */
  {
    /**
     * @ignore
     * @constructs
     * @param {string} name
     * @param {FooBox~Configuration} config
     * @param {Element} rootElement
     */
    construct: function (name, config, rootElement) {
      const self = this;

      self._super(name, config, null);

      self.root = rootElement;
      self.parser = new _.Parser();
      self.parserResult = [];
      self.modals = new Map();
      self.visible = [];
    },
    beforeSetup: function () {
      const self = this;
      self.trigger("parse", [self.root, self.raw]);
      self.parserResult = self.parser.parse(self.root, self.raw);
      self.trigger("parsed", [self.parserResult]);
    },
    setup: function () {
      const self = this;
      self.parserResult.forEach(function (config) {
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
    onModalInitialized: function (e) {
      if (e.target instanceof _.Modal) {
        this.modals.set(e.target.raw.parsedFrom, e.target);
      }
    },
    onModalDestroyed: function (e) {
      if (e.target instanceof _.Modal) {
        this.modals.delete(e.target.raw.parsedFrom);
      }
    },
    onModalAttached: function (e) {
      if (e.target instanceof _.Modal) {
        this.visible.push(e.target);
      }
    },
    onModalDetached: function (e) {
      if (e.target instanceof _.Modal) {
        const index = this.visible.indexOf(e.target);

        if (index !== -1) {
          this.visible.splice(index, 1);
        }
      }
    }
  });
  _.plugin = new _.Plugin("foobox", _.configuration, document.documentElement); // expose certain methods directly from the FooBox.plugin instance

  _fn.expose(_.plugin, _, ["on", "off", "trigger", "destroy", "configure"]);
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

})(FooBox.$, FooBox, FooBox.utils, FooBox.utils.is, FooBox.utils.fn, FooBox.utils.obj);
"use strict";

(function ($, _, _utils, _is, _fn, _obj) {
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
  _.Modal = _.Component.extend(
  /** @lends FooBox.Modal.prototype */
  {
    /**
     * @ignore
     * @constructs
     * @param {string} name
     * @param {FooBox.Modal~Configuration} config
     * @param {FooBox.Plugin} parent
     */
    construct: function (name, config, parent) {
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
      self.mqlLargeScreen = matchMedia("(min-width: 601px) and (min-height: 601px)"); // /**
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
    isLargeScreen: function () {
      return this.mqlLargeScreen.matches;
    },
    getIcon: function (name, svgName, classes) {
      const self = this;
      if (!_is.string(svgName)) svgName = self.opt.svg;
      if (!_is.array(classes)) classes = []; // first see if this is a named icon and use the mapped value

      if (self.opt.icons.hasOwnProperty(name)) {
        return _.icons.get(self.opt.icons[name], svgName, classes.concat([self.cls.icons[name]]));
      } // otherwise just query the icons registry


      return _.icons.get(name, svgName, classes);
    },
    beforeSetup: function () {
      const self = this;
      self.items = self.raw.items.map(function (item, i) {
        return _.items.create(item.options.type, item, self, i);
      });
    },
    setup: function () {
      const self = this;
      self.items.forEach(function (item) {
        item.init();
      });
    },
    afterSetup: function () {
      const self = this;
      if (self.isTrigger) self.el.owner.addEventListener("click", self.onClicked);

      self._super();
    },
    beforeTeardown: function () {
      const self = this;
      self.observer.disconnect();

      self._super();
    },
    afterTeardown: function () {
      const self = this;
      if (self.isTrigger) self.el.owner.removeEventListener("click", self.onClicked);

      self._super();
    },
    create: function () {
      const self = this;

      if (!self.isCreated) {
        self.trigger("create");
        self.isCreated = self.doCreate();

        if (self.isCreated) {
          self.trigger("created");
        }
      }

      return self.isCreated;
    },
    doCreate: function () {
      const self = this;

      try {
        self.el.modal = document.createElement("div");

        _utils.addClass(self.el.modal, self.cls.modal);

        const layout = _obj.prop(self.cls.layouts, self.opt.layout);

        if (_is.string(layout)) {
          _utils.addClass(self.el.modal, layout);
        }

        const transition = _obj.prop(self.cls.transitions, self.opt.transition);

        if (_is.string(transition)) {
          _utils.addClass(self.el.modal, [self.cls.hasTransition, transition]);
        }

        if (self.opt.noMobile) {
          _utils.addClass(self.el.modal, self.cls.noMobile);
        }

        if (self.opt.infoInline) {
          _utils.addClass(self.el.modal, self.cls.infoInline);
        }

        if (self.isLargeScreen()) {
          _utils.addClass(self.el.modal, self.cls.largeUI);
        }

        const infoPosition = _obj.prop(self.cls.infoPosition, self.opt.info);

        if (_is.string(infoPosition)) {
          _utils.addClass(self.el.modal, infoPosition);
        }

        _utils.addClass(self.el.modal, self.opt.classes);

        if (_is.string(self.opt.id)) {
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
      } catch (err) {
        console.debug("An error occurred creating the modal.", err);
        return false;
      }
    },
    attach: function () {
      const self = this;
      if (!self.isCreated) self.create();

      if (self.isCreated && !self.isAttached) {
        self.trigger("attach");
        self.isAttached = self.doAttach();

        if (self.isAttached) {
          self.trigger("attached");
        }
      }

      return self.isAttached;
    },
    doAttach: function () {
      const self = this;

      try {
        self.onScreenChanged(self.mqlLargeScreen);
        self.mqlLargeScreen.addEventListener("change", self.onScreenChanged);
        self.parent.root.appendChild(self.el.modal); // self.breakpoints.observe();

        return true;
      } catch (err) {
        console.debug("An error occurred attaching the modal to the DOM.", err);
        return false;
      }
    },
    detach: function () {
      const self = this;

      if (self.isAttached) {
        self.trigger("detach");
        self.isAttached = !self.doDetach();

        if (!self.isAttached) {
          self.trigger("detached");
        }
      }

      return !self.isAttached;
    },
    doDetach: function () {
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
    show: function (value) {
      const self = this;
      if (_is.undef(value)) value = "first";
      const current = self.find(value);

      if (_is.item(current)) {
        if (self.attach()) {
          if (self.current === current) {
            // Current item is the same as the new item so just resolve
            return Promise.resolve();
          }

          const previous = self.current;
          self.current = current;

          _utils.toggleClass(self.el.items, self.cls.reverseTransition, self.shouldReverseTransition(current, previous));

          _utils.toggleClass(self.el.buttonInfo, self.cls.disabled, !current.hasCaption);

          return Promise.resolve().then(function () {
            return self.doBeforeShow(current, previous);
          }).then(function () {
            self.el.count.innerHTML = _utils.str.format(self.opt.countFormat, {
              current: self.items.indexOf(current) + 1,
              total: self.items.length
            });
            return self.doShow(current, previous);
          }).then(function () {
            return self.doAfterShow(current, previous);
          }).finally(function () {
            _utils.removeClass(self.el.items, self.cls.reverseTransition);
          });
        }

        return Promise.reject(new Error("Unable to attach the modal to the DOM."));
      }

      return Promise.reject(new Error("No item to display."));
    },
    doBeforeShow: function (current, previous) {
      if (_is.item(previous)) {
        return Promise.all([previous.doBeforeHide(), current.doBeforeShow()]);
      }

      return current.doBeforeShow();
    },
    doShow: function (current, previous) {
      current.load();

      if (_is.item(previous)) {
        return Promise.all([previous.doHide(), current.doShow()]);
      }

      return current.doShow();
    },
    doAfterShow: function (current, previous) {
      if (_is.item(previous)) {
        return Promise.all([previous.doAfterHide(), current.doAfterShow()]);
      }

      return current.doAfterShow();
    },
    close: function () {
      const self = this;
      self.detach();
    },
    toggleInfo: function () {
      const self = this;

      if (self.current instanceof _.Item) {
        self.isInfoVisible = self.current.toggleInfo();
      }
    },
    shouldReverseTransition: function (current, previous) {
      if (!_is.item(previous) || !_is.item(current)) return true;
      const self = this,
            currentIndex = self.items.indexOf(current),
            previousIndex = self.items.indexOf(previous),
            lastIndex = self.items.length - 1;
      let result = previousIndex < currentIndex;

      if (currentIndex === 0 && previousIndex === lastIndex || currentIndex === lastIndex && previousIndex === 0) {
        result = !result;
      }

      return result;
    },
    find: function (value) {
      const self = this;
      if (_is.item(value)) return value;

      if (_is.string(value)) {
        switch (value) {
          case "first":
            value = 0;
            break;

          case "last":
            value = self.items.length - 1;
            break;

          case "next":
            if (self.current instanceof _.Item) {
              value = self.current.index + 1;

              if (value > self.items.length - 1) {
                if (self.opt.loop) {
                  value = 0;
                } else {
                  value = self.current.index;
                }
              }
            }

            break;

          case "previous":
            if (self.current instanceof _.Item) {
              value = self.current.index - 1;

              if (value < 0) {
                if (self.opt.loop) {
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
    createLoader: function () {
      const self = this,
            loader = document.createElement("div");

      _utils.addClass(loader, self.cls.loader);

      if (self._loadingIcon === null) self._loadingIcon = self.getIcon("loading");

      if (self._loadingIcon instanceof Element) {
        loader.appendChild(self._loadingIcon.cloneNode(true));
      }

      return loader;
    },
    onClicked: function (e) {
      e.preventDefault();
      this.show("first");
    },
    onCloseClicked: function (e) {
      e.preventDefault();
      this.close();
    },
    onPrevClicked: function (e) {
      e.preventDefault();
      this.show("previous");
    },
    onNextClicked: function (e) {
      e.preventDefault();
      this.show("next");
    },
    onInfoClicked: function (e) {
      e.preventDefault();
      this.toggleInfo();
    },
    onScreenChanged: function (e) {
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
})(FooBox.$, FooBox, FooBox.utils, FooBox.utils.is, FooBox.utils.fn, FooBox.utils.obj);
"use strict";

(function (_, _utils) {
  _.Modal.Modern = _.Modal.extend(
  /** @lend FooBox.Modal.Modern.prototype */
  {
    /**
     * @ignore
     * @constructs
     * @param {string} name
     * @param {FooBox.Modal~Configuration} config
     * @param {FooBox.Plugin} parent
     */
    construct: function (name, config, parent) {
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
      layouts: {
        modern: "fbx-modern"
      }
    }
  });
})(FooBox, FooBox.utils);
"use strict";

(function (_, _utils, _is) {
  _.Modal.Classic = _.Modal.extend(
  /** @lend FooBox.Modal.Classic.prototype */
  {
    doShow: function (current, previous) {
      const self = this;
      current.load().then(function () {
        if (self.shouldResize()) {
          self.resizeTo(current);
        }
      });

      if (_is.item(previous)) {
        return Promise.all([previous.doHide(), current.doShow()]);
      }

      return current.doShow();
    },
    doAttach: function () {
      const self = this;

      if (self._super()) {
        self.observer.observe(self.el.overlay, function () {
          if (_is.item(self.current) && self.shouldResize()) {
            self.resizeTo(self.current);
          } else self.removeResize();
        }, {
          box: "border-box"
        });
        return true;
      }

      return false;
    },
    doDetach: function () {
      const self = this;
      self.observer.unobserve(self.el.overlay);
      return self._super();
    },
    shouldResize: function () {
      const self = this;
      return self.isLargeScreen() || self.opt.noMobile;
    },
    removeResize: function () {
      const inner = this.el.inner;
      inner.style.setProperty("transition-property", "none", "important");
      inner.offsetHeight;
      inner.style.removeProperty("width");
      inner.style.removeProperty("height");
      inner.style.removeProperty("transition-property");
      inner.offsetHeight;
    },
    resizeTo: function (item) {
      const self = this,
            inner = self.el.inner;
      return new Promise(function (resolve, reject) {
        if (_is.item(item)) {
          inner.style.setProperty("transition-property", "none", "important");
          inner.offsetHeight;
          const w = inner.style.getPropertyValue("width"),
                h = inner.style.getPropertyValue("height");
          inner.style.removeProperty("width");
          inner.style.removeProperty("height");
          inner.offsetHeight;
          let size = item.getContentSize();
          inner.style.setProperty("width", w);
          inner.style.setProperty("height", h);
          inner.offsetHeight;

          if (size.width !== w || size.height !== h) {
            function setSize() {
              inner.style.removeProperty("transition-property");
              inner.style.setProperty("width", size.width);
              inner.style.setProperty("height", size.height);
            }

            const transition = parseFloat(getComputedStyle(inner).getPropertyValue("--resize-duration")) !== 0;

            if (transition) {
              _utils.onTransition(inner, setSize, ["width", "height"]).then(resolve, function (reason) {
                if (reason !== "transitioncancel") reject(reason);else resolve();
              });
            } else {
              setSize();
              resolve();
            }
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      });
    }
  });

  _.layouts.register("classic", _.Modal.Classic, {
    options: {},
    i18n: {},
    classes: {
      layouts: {
        classic: "fbx-classic"
      }
    }
  });
})(FooBox, FooBox.utils, FooBox.utils.is);
"use strict";

(function (_, _utils) {
  _.Modal.Metro = _.Modal.Classic.extend(
  /** @lend FooBox.Modal.Metro.prototype */
  {});

  _.layouts.register("metro", _.Modal.Metro, {
    options: {},
    i18n: {},
    classes: {
      layouts: {
        metro: "fbx-metro"
      }
    }
  });
})(FooBox, FooBox.utils);
"use strict";

(function ($, _, _utils, _is, _fn) {
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
  _.Item = _.Component.extend(
  /** @lends FooBox.Item.prototype */
  {
    /**
     * @ignore
     * @constructs
     * @param {string} type
     * @param {FooBox.Item~Configuration} config
     * @param {FooBox.Modal} modal
     * @param {number} index
     */
    construct: function (type, config, modal, index) {
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
    afterSetup: function () {
      const self = this;
      if (self.isTrigger) self.el.owner.addEventListener("click", self.onClicked);

      self._super();
    },
    afterTeardown: function () {
      const self = this;
      if (self.isTrigger) self.el.owner.removeEventListener("click", self.onClicked);

      self._super();
    },
    create: function () {
      const self = this;

      if (!self.isCreated) {
        self.trigger("create");
        self.isCreated = self.doCreate();

        if (self.isCreated) {
          self.trigger("created");
        }
      }

      return self.isCreated;
    },
    doCreate: function () {
      const self = this;

      try {
        self.el.item = document.createElement("div");

        _utils.addClass(self.el.item, self.cls.el);

        self.el.content = self.doCreateContent();

        _utils.addClass(self.el.content, [self.cls.content, self.cls.type]);

        self.el.item.appendChild(self.el.content);

        if (self.hasCaption) {
          self.el.info = self.doCreateInfo();
          self.el.item.appendChild(self.el.info);
        }

        self.el.loader = self.parent.createLoader();
        self.el.item.appendChild(self.el.loader);
        return true;
      } catch (err) {
        console.debug("An error occurred creating the item.", err);
        return false;
      }
    },
    doCreateContent: function () {
      throw "This method must be overridden by a child class!";
    },
    doCreateInfo: function () {
      const self = this;
      const info = document.createElement("div");

      _utils.addClass(info, self.cls.info);

      const infoToggle = document.createElement("button");

      _utils.addClass(infoToggle, [self.cls.toggle, self.cls.infoToggle]);

      infoToggle.appendChild(self.parent.getIcon("toggle"));
      infoToggle.addEventListener("click", self.onToggleInfoClicked);
      info.appendChild(infoToggle);

      if (self.hasTitle) {
        const infoHead = document.createElement("div");

        _utils.addClass(infoHead, self.cls.infoHead);

        infoHead.innerHTML = self.opt.title;
        info.appendChild(infoHead);
      }

      if (self.hasDescription) {
        const infoBody = document.createElement("div");

        _utils.addClass(infoBody, self.cls.infoBody);

        infoBody.innerHTML = self.opt.description;
        info.appendChild(infoBody);
      }

      if (self.hasExif) {
        const infoFoot = document.createElement("div");

        _utils.addClass(infoFoot, self.cls.infoFoot);
      }

      return info;
    },
    load: function () {
      const self = this;
      if (self._loaded !== null) return self._loaded;
      self.isLoading = true;
      self.trigger("load");

      _utils.addClass(self.el.item, self.cls.loading);

      _utils.addClass(self.el.content, self.cls.loading);

      if (self.hasCaption) _utils.addClass(self.el.info, self.cls.loading);
      const loaderDelay = setTimeout(function () {
        _utils.addClass(self.el.loader, self.cls.loading);
      }, self.parent.opt.loaderDelay);
      return self._loaded = Promise.resolve().then(function () {
        return self.doLoadContent(self.el.content);
      }).then(function () {
        clearTimeout(loaderDelay);

        _utils.removeClass(self.el.loader, self.cls.loading);

        _utils.removeClass(self.el.content, self.cls.loading);

        _utils.removeClass(self.el.item, self.cls.loading);

        if (self.hasCaption) _utils.removeClass(self.el.info, self.cls.loading);
        self.isLoading = false;
        self.isLoaded = true;
        self.trigger("loaded");
      }, function (reason) {
        clearTimeout(loaderDelay);

        _utils.removeClass(self.el.loader, self.cls.loading);

        _utils.removeClass(self.el.content, self.cls.loading);

        _utils.removeClass(self.el.item, self.cls.loading);

        if (self.hasCaption) _utils.removeClass(self.el.info, self.cls.loading);
        self.isLoading = false;
        self.trigger("load-error", [reason]);
      });
    },
    doLoadContent: function (element) {
      return Promise.resolve();
    },

    /**
     *
     * @returns {Promise}
     */
    show: function () {
      const self = this;
      return Promise.resolve().then(function () {
        return self.doBeforeShow();
      }).then(function () {
        return self.doShow();
      }).catch(function (reason) {
        if (reason === "transitioncancel") {
          console.debug("cancelled-show", self.index);
          return Promise.resolve();
        }
      }).finally(function () {
        self.doAfterShow();
      });
    },
    doBeforeShow: function () {
      const self = this;

      if (self.create()) {
        _utils.addClass(self.el.item, self.cls.transitionIn);

        self.parent.el.items.appendChild(self.el.item);

        if (self.hasCaption) {
          _utils.addClass(self.el.info, self.cls.transitionIn);

          self.parent.el.items.appendChild(self.el.info);
        }
      } else {
        return Promise.reject(new Error("Unable to create item."));
      }
    },
    doShow: function () {
      const self = this;

      function makeVisible(el) {
        _utils.addClass(el, self.cls.visible);
      }

      if (self.parent.hasTransition) {
        if (self.hasCaption && self.parent.isInfoVisible) {
          return Promise.all([_utils.onTransition(self.el.item, makeVisible), _utils.onTransition(self.el.info, makeVisible)]);
        }

        return _utils.onTransition(self.el.item, makeVisible);
      }

      makeVisible(self.el.item);
      if (self.hasCaption && self.parent.isInfoVisible) makeVisible(self.el.info);
    },
    doAfterShow: function () {
      const self = this;

      if (self.isCreated) {
        _utils.removeClass(self.el.item, self.cls.transitionIn);

        if (self.hasCaption) _utils.removeClass(self.el.info, self.cls.transitionIn);
      }
    },

    /**
     *
     * @returns {Promise}
     */
    hide: function () {
      const self = this;
      return Promise.resolve().then(function () {
        return self.doBeforeHide();
      }).then(function () {
        return self.doHide();
      }).catch(function (reason) {
        if (reason === "transitioncancel") {
          console.debug("cancelled-hide", self.index);
          return Promise.resolve();
        }
      }).finally(function () {
        self.doAfterHide();
      });
    },
    doBeforeHide: function () {
      const self = this;

      if (self.isCreated) {
        _utils.addClass(self.el.item, self.cls.transitionOut);

        if (self.hasCaption) _utils.addClass(self.el.info, self.cls.transitionOut);
      }
    },
    doHide: function () {
      const self = this;

      function makeHidden(el) {
        _utils.removeClass(el, self.cls.visible);
      }

      if (self.parent.hasTransition) {
        if (self.hasCaption && self.parent.isInfoVisible) {
          return Promise.all([_utils.onTransition(self.el.item, makeHidden), _utils.onTransition(self.el.info, makeHidden)]);
        }

        return _utils.onTransition(self.el.item, makeHidden);
      }

      makeHidden(self.el.item);
      if (self.hasCaption && self.parent.isInfoVisible) makeHidden(self.el.info);
    },
    doAfterHide: function () {
      const self = this;

      _utils.removeClass(self.el.item, self.cls.transitionOut);

      self.parent.el.items.removeChild(self.el.item);

      if (self.hasCaption) {
        _utils.removeClass(self.el.info, self.cls.transitionOut);

        self.parent.el.items.removeChild(self.el.info);
      }
    },
    toggleInfo: function () {
      const self = this;
      return self.hasCaption && self.el.info.classList.toggle(self.cls.visible);
    },
    getContentSize: function () {
      const self = this;
      return _utils.getElementSize(self.el.content);
    },
    onClicked: function (e) {
      e.preventDefault();
      this.parent.show(this);
    },
    onToggleInfoClicked: function (e) {
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
})(FooBox.$, FooBox, FooBox.utils, FooBox.utils.is, FooBox.utils.fn);
"use strict";

(function ($, _, _utils, _is, _fn) {
  /**
   * @summary The image item class that handles displaying images within the lightbox.
   * @memberof FooBox.
   * @class ImageItem
   * @param {string} type
   * @param {FooBox.Item~Configuration} config
   * @param {FooBox.Modal} modal
   * @param {number} index
   * @augments FooBox.Item
   */
  _.ImageItem = _.Item.extend(
  /** @lends FooBox.ImageItem.prototype */
  {
    doCreateContent: function () {
      return document.createElement("img");
    },
    doLoadContent: function (element) {
      const self = this;
      return $.Deferred(function (def) {
        function onload() {
          element.removeEventListener("error", onerror);
          def.resolve();
        }

        function onerror() {
          element.removeEventListener("load", onload);
          def.resolve();
        }

        element.addEventListener("load", onload, {
          once: true
        });
        element.addEventListener("error", onerror, {
          once: true
        });
        element.src = self.opt.url;

        if (element.complete) {
          onload();
        }
      }).promise();
    }
  });

  _.items.register("image", _.ImageItem, {
    options: {},
    classes: {
      type: "fbx-type-image"
    }
  }, 0);
})(FooBox.$, FooBox, FooBox.utils, FooBox.utils.is, FooBox.utils.fn);
"use strict";

(function ($, _, _utils, _is) {
  /**
   * @summary The iframe item class that handles displaying website urls within the lightbox.
   * @memberof FooBox.
   * @class IframeItem
   * @param {string} type
   * @param {FooBox~ItemConfig} config
   * @param {FooBox.Modal} modal
   * @param {number} index
   * @augments FooBox.Item
   */
  _.IframeItem = _.Item.extend(
  /** @lends FooBox.IframeItem.prototype */
  {
    doCreateContent: function () {
      const self = this,
            iframe = document.createElement("iframe");

      _utils.setAttributes(iframe, self.opt.attr);

      return iframe;
    },
    doLoadContent: function (element) {
      const self = this;
      return $.Deferred(function (def) {
        function onload() {
          element.removeEventListener("error", onerror);
          def.resolve();
        }

        function onerror() {
          element.removeEventListener("load", onload);
          def.resolve();
        }

        element.addEventListener("load", onload, {
          once: true
        });
        element.addEventListener("error", onerror, {
          once: true
        });
        element.src = self.opt.url;
      }).promise();
    }
  });

  _.items.register("iframe", _.IframeItem, {
    options: {
      attr: {
        allow: "autoplay; fullscreen;"
      }
    },
    classes: {
      type: "fbx-type-iframe"
    }
  }, 0);
})(FooBox.$, FooBox, FooBox.utils, FooBox.utils.is);
"use strict";

(function ($, _, _utils, _is) {
  /**
   * @summary The video item class that handles displaying video urls within the lightbox.
   * @memberof FooBox.
   * @class VideoItem
   * @param {string} type
   * @param {FooBox~ItemConfig} config
   * @param {FooBox.Modal} modal
   * @param {number} index
   * @augments FooBox.Item
   */
  _.VideoItem = _.Item.extend(
  /** @lends FooBox.VideoItem.prototype */
  {
    doCreateContent: function () {
      const self = this,
            iframe = document.createElement("iframe");

      _utils.setAttributes(iframe, self.opt.attr);

      return iframe;
    },
    doLoadContent: function (element) {
      const self = this;
      return $.Deferred(function (def) {
        function onload() {
          element.removeEventListener("error", onerror);
          def.resolve();
        }

        function onerror() {
          element.removeEventListener("load", onload);
          def.resolve();
        }

        element.addEventListener("load", onload, {
          once: true
        });
        element.addEventListener("error", onerror, {
          once: true
        });
        element.src = self.opt.url;
      }).promise();
    }
  });

  _.items.register("video", _.VideoItem, {
    options: {
      attr: {
        allow: "autoplay; fullscreen;"
      }
    },
    classes: {
      type: "fbx-type-video"
    }
  }, 0);
})(FooBox.$, FooBox, FooBox.utils, FooBox.utils.is);
"use strict";

(function (cfg, $, _, _utils) {
  _utils.ready(function () {
    _.plugin.configure(cfg);

    _.plugin.init();
  });
})(window.FOOBOX || {}, FooBox.$, FooBox, FooBox.utils);