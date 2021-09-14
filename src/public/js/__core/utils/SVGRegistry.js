(function($, _, _is, _obj, _str){

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
	_.SVGRegistry = _.Class.extend(/** @lends FooBox.utils.SVGRegistry.prototype */{
		/**
		 * @ignore
		 * @constructs
		 * @param {FooBox.utils.SVGRegistry~Options} options - The options for the manager.
		 */
		construct: function(options){
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
				splitter: {ignore: ["id","class"]}
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
		init: function(){
			const self = this;
			if (_is.string(self.opt.id) && self.opt.id.length > 0){
				$("svg[id|='"+self.opt.id+"']").each(function(i, svg){
					if (svg.id === self.opt.id){
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
		register: function(name, svg){
			if (_is.string(name)) {
				const self = this, $svg = $(svg);
				if ($svg.length === 1 && $svg.is("svg")){
					const icons = self.splitter.parse($svg.get(0)), current = self.registered[name];
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
		exists: function(iconName, svgName){
			const self = this;
			// have to provide at least an icon name to check
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
		get: function(iconName, svgName, classes){
			const self = this;
			// have to provide at least the icon name to try fetch something
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
					}
					// here we make a clone of the registered icon so that it is not modified
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
		all: function(svgName, classes){
			const self = this, all = {};
			let icons = _is.string(svgName) && self.registered.hasOwnProperty(svgName) ? self.registered[svgName] : self.registered.defaults;
			Object.keys(icons).forEach(function(key){
				all[key] = self.get(key, svgName, classes);
			});
			return all;
		}
	});

})(
	FooBox.utils.$,
	FooBox.utils,
	FooBox.utils.is,
	FooBox.utils.obj,
	FooBox.utils.str
);
