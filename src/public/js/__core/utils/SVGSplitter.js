(function($, _, _is, _obj){

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
	_.SVGSplitter = _.Class.extend(/** @lends FooBox.utils.SVGSplitter.prototype */{
		/**
		 * @summary Performs the actual construction of a new instance of this class.
		 * @memberof FooBox.utils.SVGSplitter#
		 * @constructs
		 * @param {FooBox.utils.SVGSplitter~Options} [options] - The options for the splitter.
		 * @augments FooBox.utils.Class
		 */
		construct: function(options){
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
		getAttributeNames: function(element){
			if (element instanceof Element){
				if (element.getAttributeNames) return element.getAttributeNames();
				const attrs = Array.prototype.slice.call(element.attributes);
				return attrs.map( function ( attr ) {
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
		copyAttributes: function(source, target, ignore){
			if (source instanceof Element && target instanceof Element){
				ignore = _is.array(ignore) ? ignore : [];
				this.getAttributeNames(source).forEach(function(name) {
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
		getHref: function(element){
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
		getUseDef: function(use){
			if (use instanceof SVGUseElement) {
				let selector = this.getHref(use);
				if (_is.string(selector)){
					const element = use.ownerSVGElement.querySelector(selector);
					if (element instanceof Element){
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
		getFilterDef: function(element){
			if (element instanceof SVGElement) {
				const attr = element.getAttribute("filter");
				if (_is.string(attr)){
					const match = attr.match(this.opt.filterRegex);
					if (match !== null && match.length === 2){
						// fetch the filter from the parent
						const filter = element.ownerSVGElement.querySelector(match[1]);
						if (filter instanceof SVGFilterElement){
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
		getDefs: function(symbol){
			const self = this, defs = [];
			if (symbol instanceof SVGSymbolElement) {
				const uses = symbol.querySelectorAll("use");
				for (let i = 0, l = uses.length; i < l; i++){
					const found = self.getUseDef(uses[i]);
					if (found instanceof Node && defs.indexOf(found) === -1){
						defs.push(found);
					}
				}
				const elements = symbol.querySelectorAll('[filter]');
				for (let i = 0, l = elements.length; i < l; i++){
					const filter = self.getFilterDef(elements[i]);
					if (filter instanceof Node && defs.indexOf(filter) === -1){
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
		createSVGElement: function(symbol){
			const self = this;
			if (symbol instanceof SVGSymbolElement){
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
				if (definitions.length > 0){
					let defs = svg.querySelector("defs");
					if (defs === null){
						defs = document.createElementNS(self.opt.xmlns, "defs");
						svg.insertBefore(defs, svg.firstChild);
					}
					definitions.forEach(function(def){
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
		parse: function(svg){
			const self = this, result = {};
			if (svg instanceof SVGSVGElement){
				const symbols = svg.querySelectorAll("symbol[id]");
				for (let i = 0, l = symbols.length; i < l; i++){
					if (symbols[i].id === "") continue;
					const created = self.createSVGElement(symbols[i]);
					if (created instanceof SVGSVGElement){
						result[symbols[i].id] = created;
					}
				}
			}
			return result;
		}
	});

})(
	FooBox.utils.$,
	FooBox.utils,
	FooBox.utils.is,
	FooBox.utils.obj
);
