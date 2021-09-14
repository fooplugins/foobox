"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
