var FooBox;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/public/foobox/Container.js":
/*!****************************************!*\
  !*** ./src/public/foobox/Container.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Container)
/* harmony export */ });
/* harmony import */ var _utils_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/object */ "./src/utils/object.js");
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/is */ "./src/utils/is.js");



/**
 * A simple class containing the results of parsing a reference object.
 */
class Container {
  /**
   * A reference to the parser that produced this result.
   * @type {Parser}
   */
  parser;

  /**
   * The reference object parsed.
   * @type {*}
   */
  ref;

  /**
   * An object containing any parsed options.
   * @type {object}
   */
  options;

  /**
   * @type {?EventTarget}
   * @private
   */
  #triggerTarget = null;

  /**
   * An array of all parsed items.
   * @type {Item[]}
   */
  items = [];

  /**
   * Create a new instance of the Container class.
   * @param {Parser} parser - A reference to the parser that produced this container.
   * @param {*} ref - The reference object parsed.
   * @param {object} [options] - An object containing any parsed options.
   * @param {?EventTarget} [triggerTarget] - The EventTarget instance that triggers the modal.
   */
  constructor(parser, ref, options, triggerTarget) {
    this.parser = parser;
    this.ref = ref;
    this.options = (0,_utils_object__WEBPACK_IMPORTED_MODULE_0__.extend)({}, options);
    if (triggerTarget instanceof EventTarget) {
      this.#triggerTarget = triggerTarget;
    }
  }

  /**
   * The EventTarget instance that triggers the modal.
   * @returns {?EventTarget}
   */
  get triggerTarget() {
    return this.#triggerTarget;
  }

  /**
   * @param {EventTarget} value - The EventTarget instance to use as the trigger.
   */
  set triggerTarget(value) {
    if (value instanceof EventTarget) {
      this.#triggerTarget = value;
      return;
    }
    throw new TypeError("The Container.triggerTarget property must be an instance of EventTarget.");
  }
  get firstIndex() {
    return this.items.length ? 0 : -1;
  }
  get lastIndex() {
    return this.items.length ? this.items.length - 1 : -1;
  }
  withinRange(index) {
    return (0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isNumber)(index) && index >= this.firstIndex && index <= this.lastIndex;
  }
  getByIndex(index) {
    return this.withinRange(index) ? this.items[index] : null;
  }

  /**
   *
   * @returns {?Item}
   */
  getFirst() {
    return this.firstIndex !== -1 ? this.items[this.firstIndex] : null;
  }

  /**
   *
   * @returns {?Item}
   */
  getLast() {
    return this.lastIndex !== -1 ? this.items[this.lastIndex] : null;
  }
  getNext(current, allowLoop) {
    const index = this.items.indexOf(current);
    if (index !== -1) {
      let nextIndex = index + 1;
      const withinRange = this.withinRange(nextIndex);
      if (withinRange) {
        return this.items[nextIndex];
      }
      if (!withinRange && allowLoop) {
        return this.getFirst();
      }
    }
    return null;
  }
  getPrevious(current, allowLoop) {
    const index = this.items.indexOf(current);
    if (index !== -1) {
      let previousIndex = index - 1;
      const withinRange = this.withinRange(previousIndex);
      if (withinRange) {
        return this.items[previousIndex];
      }
      if (!withinRange && allowLoop) {
        return this.getLast();
      }
    }
    return null;
  }
  get [Symbol.toStringTag]() {
    return "Container";
  }
}

/***/ }),

/***/ "./src/public/foobox/GroupParser.js":
/*!******************************************!*\
  !*** ./src/public/foobox/GroupParser.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GROUP_PARSER_DEFAULTS": () => (/* binding */ GROUP_PARSER_DEFAULTS),
/* harmony export */   "GROUP_PARSER_DEFAULTS_PRO": () => (/* binding */ GROUP_PARSER_DEFAULTS_PRO),
/* harmony export */   "default": () => (/* binding */ GroupParser)
/* harmony export */ });
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/is */ "./src/utils/is.js");
/* harmony import */ var _utils_iasync__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/iasync */ "./src/utils/iasync.js");
/* harmony import */ var _Parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Parser */ "./src/public/foobox/Parser.js");
/* harmony import */ var _Container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Container */ "./src/public/foobox/Container.js");





//region type-definitions

/**
 * @typedef {Parser~Configuration} GroupParser~Configuration
 * @property {number} [priority=99]
 */

//endregion

const GROUP_PARSER_DEFAULTS = {
  ..._Parser__WEBPACK_IMPORTED_MODULE_2__.PARSER_DEFAULTS,
  priority: 99,
  include: []
};
const GROUP_PARSER_DEFAULTS_PRO = {
  ..._Parser__WEBPACK_IMPORTED_MODULE_2__.PARSER_DEFAULTS_PRO,
  priority: 99,
  include: []
};
class GroupParser extends _Parser__WEBPACK_IMPORTED_MODULE_2__["default"] {
  /**
   * @inheritDoc
   */
  async parseDocument(handledRefs, nocache) {
    const results = [];
    await (0,_utils_iasync__WEBPACK_IMPORTED_MODULE_1__.asyncForEach)(this.config.include, selector => {
      if (!handledRefs.has(selector)) {
        const container = this.parse(selector, handledRefs, nocache);
        if (container && container.items.length) {
          results.push(container);
          handledRefs.add(selector);
        }
      }
    });
    this.purgeCache(results);
    return results;
  }

  /**
   * @inheritDoc
   */
  shouldPurge(container) {
    return container.items.length === 0;
  }

  /**
   * @inheritDoc
   */
  create(ref, options, trigger) {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(ref)) {
      return new _Container__WEBPACK_IMPORTED_MODULE_3__["default"](this, ref, options, trigger);
    }
    return super.create(ref, options, trigger);
  }

  /**
   * @inheritDoc
   */
  getArgs(ref, nocache) {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(ref)) {
      return {
        trigger: null,
        options: {},
        itemRefs: document.querySelectorAll(ref)
      };
    }
    return super.getArgs(ref, nocache);
  }
}

/***/ }),

/***/ "./src/public/foobox/Item.js":
/*!***********************************!*\
  !*** ./src/public/foobox/Item.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Item)
/* harmony export */ });
/**
 * A simple class containing the results of a parsed item.
 */
class Item {
  /**
   * A reference to the parent container this item belongs to.
   */
  parent;

  /**
   * A reference to the type parser that produced this item.
   * @type {TypeParser}
   */
  type;

  /**
   * The reference object parsed.
   * @type {*}
   */
  ref;

  /**
   * An object containing all required properties for the item.
   * @type {object}
   */
  requiredProperties;

  /**
   * @type {?EventTarget}
   * @private
   */
  #triggerTarget = null;

  /**
   * Create a new instance of the ParserItem class.
   * @param {Container} parent - A reference to the parent container this item belongs to.
   * @param {TypeParser} type - A reference to the type parser that produced this item.
   * @param {*} ref - The reference object parsed.
   * @param {?EventTarget} [triggerTarget] - The EventTarget instance that triggers this item.
   */
  constructor(parent, type, ref, triggerTarget) {
    this.parent = parent;
    this.type = type;
    this.ref = ref;
    if (triggerTarget instanceof EventTarget) {
      this.#triggerTarget = triggerTarget;
    }
  }

  /**
   * The EventTarget instance that triggers this item.
   * @returns {?EventTarget}
   */
  get triggerTarget() {
    return this.#triggerTarget;
  }

  /**
   * @param {EventTarget} value - The EventTarget instance to use as the trigger.
   */
  set triggerTarget(value) {
    if (value instanceof EventTarget) {
      this.#triggerTarget = value;
      return;
    }
    throw new TypeError("The Item.trigger property must be an instance of EventTarget!");
  }

  /**
   * Get all properties for this item.
   * @param {boolean} [nocache=false]
   * @returns {object}
   */
  getProperties(nocache) {
    const properties = this.type.getProperties(this.ref, nocache);
    return {
      ...properties,
      type: this.type.name
    };
  }
  #properties;
  get properties() {
    if (!this.#properties) {
      this.#properties = this.getProperties();
    }
    return this.#properties;
  }
}

/***/ }),

/***/ "./src/public/foobox/Parser.js":
/*!*************************************!*\
  !*** ./src/public/foobox/Parser.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PARSER_DEFAULTS": () => (/* binding */ PARSER_DEFAULTS),
/* harmony export */   "PARSER_DEFAULTS_PRO": () => (/* binding */ PARSER_DEFAULTS_PRO),
/* harmony export */   "default": () => (/* binding */ Parser)
/* harmony export */ });
/* harmony import */ var _utils_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/object */ "./src/utils/object.js");
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/is */ "./src/utils/is.js");
/* harmony import */ var _utils_makeSelector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/makeSelector */ "./src/utils/makeSelector.js");
/* harmony import */ var _utils_Emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/Emitter */ "./src/utils/Emitter.js");
/* harmony import */ var _utils_iasync__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/iasync */ "./src/utils/iasync.js");
/* harmony import */ var _TypeParser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TypeParser */ "./src/public/foobox/TypeParser.js");
/* harmony import */ var _Container__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Container */ "./src/public/foobox/Container.js");








//region type-definitions

/**
 * @callback Parser~ctor
 * @param {Plugin} plugin
 * @param {string} name
 * @returns Parser
 */
/**
 * @typedef {object} ParserDefinition
 * @property {string} name
 * @property {Parser~ctor} ctor
 */
/**
 * If just a string, a new instance of the default parser is registered using the new name. If an array, the first element is the name, the second is the custom parser constructor.
 * @typedef {string|[string,Parser~ctor]} parserDefinition
 */
/**
 * @typedef {object} Parser~Configuration
 * @property {typeParserDefinition[]} [__types__]
 * @property {number} [priority=49]
 * @property {string[]} [include]
 * @property {string[]} [exclude]
 * @property {{options:?string,items:?string}} [data]
 * @property {propertyParserDefinition[]} [defaultProperties]
 */
/**
 * @typedef {object} ParserChange
 * @property {Item[]} added
 * @property {Item[]} removed
 */

//endregion

const PARSER_DEFAULTS = {
  __types__: ["image", "iframe"],
  priority: 49,
  include: [".foobox,[data-foobox],[data-foobox-items]"],
  exclude: [".nolightbox"],
  data: {
    options: "foobox",
    items: "fooboxItems"
  },
  defaultProperties: [{
    name: "src",
    obj: ["src", "url", "href"],
    elem: ["data:src", "data:href", "data:url", "href"],
    required: true,
    test: _utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty
  }, {
    name: "title",
    obj: ["title"],
    elem: ["data:title", "title", "img/title"],
    test: _utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty
  }, {
    name: "description",
    obj: ["description"],
    elem: ["data:description", "img/alt"],
    test: _utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty
  }, {
    name: "width",
    obj: ["width"],
    elem: ["data:width"]
  }, {
    name: "height",
    obj: ["height"],
    elem: ["data:height"]
  }, {
    name: "aspectRatio",
    obj: ["aspectRatio"],
    elem: ["data:aspectRatio"]
  }],
  image: {
    priority: 10,
    include: ["[href^='http'][href*='.svg']", "[href^='http'][href*='.png']", "[href^='http'][href*='.jpg']", "[href^='http'][href*='.jpeg']", "[href^='http'][href*='.webp']", "[href^='http'][href*='.gif']", "[href^='http'][href*='.bmp']", "[href^='http'][href*='fakeimg.pl']", "[href^='http'].foobox-image"],
    exclude: [],
    properties: [{
      name: "srcset",
      obj: ["srcset"],
      elem: ["data:srcset"],
      test: _utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty
    }]
  },
  iframe: {
    priority: 20,
    include: ["[href^='http'][target='foobox']", "[href^='http'].foobox-iframe"],
    exclude: []
  }
};
const PARSER_DEFAULTS_PRO = {
  ...PARSER_DEFAULTS,
  __types__: [...PARSER_DEFAULTS.__types__, "video"],
  video: {
    priority: 15,
    include: ["[href^='http'][href*='youtube.com/watch']", "[href^='http'][href*='youtube.com/v']", "[href^='http'][href*='youtube.com/embed']", "[href^='http'][href*='youtube-nocookie.com/watch']", "[href^='http'][href*='youtube-nocookie.com/v']", "[href^='http'][href*='youtube-nocookie.com/embed']", "[href^='http'][href*='youtu.be/']", "[href^='http'][href*='vimeo.com/']:not([href*='vimeo.com/user'])", "[href^='http'][href*='.mp4']", "[href^='http'][href*='.ogv']", "[href^='http'][href*='.wmv']", "[href^='http'][href*='.webm']"],
    properties: [{
      name: "cover",
      obj: ["cover"],
      elem: ["data:cover"],
      test: _utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty
    }]
  }
};

/**
 * The base parser class.
 * @class
 */
class Parser extends _utils_Emitter__WEBPACK_IMPORTED_MODULE_3__["default"] {
  //region static

  /**
   * @param {parserDefinition} configuration
   * @returns {?ParserDefinition}
   */
  static DEFINITION(configuration) {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty)(configuration)) {
      return {
        name: /** @type string */configuration,
        ctor: /** @type Parser~ctor */Parser
      };
    }
    if (Array.isArray(configuration) && configuration.length === 2 && (0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty)(configuration[0]) && (0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isFunction)(configuration[1])) {
      return {
        name: configuration[0],
        ctor: configuration[1]
      };
    }
    return null;
  }

  /**
   *
   * @param {Plugin} plugin
   * @param {parserDefinition} definition
   * @returns {?Parser}
   */
  static create(plugin, definition) {
    const def = Parser.DEFINITION(definition);
    return def ? new def.ctor(plugin, def.name) : null;
  }

  /**
   *
   * @param {Plugin} plugin
   * @param {parserDefinition[]} parserDefinitions
   * @returns {Parser[]}
   */
  static createAll(plugin, parserDefinitions) {
    return parserDefinitions.reduce((result, config) => {
      const parser = Parser.create(plugin, config);
      if (parser) result.push(parser);
      return result;
    }, /** @type {Parser[]} */[]).sort((a, b) => a.priority - b.priority);
  }

  //endregion

  //region constructor

  /**
   * Create a new instance of the Parser class.
   * @param {Plugin} plugin - The parent for this instance.
   * @param {string} name - The name the parser was registered with.
   */
  constructor(plugin, name) {
    super({
      bubbles: true
    }, plugin);
    this.#plugin = plugin;
    this.#name = name;
    this.#priority = this.config.priority;
    this.#includeSelector = (0,_utils_makeSelector__WEBPACK_IMPORTED_MODULE_2__["default"])(this.config.include);
    this.#excludeSelector = (0,_utils_makeSelector__WEBPACK_IMPORTED_MODULE_2__["default"])(this.config.exclude);
    this.#types = _TypeParser__WEBPACK_IMPORTED_MODULE_5__["default"].createAll(this, this.config.__types__);
    this.#typesSelector = (0,_utils_makeSelector__WEBPACK_IMPORTED_MODULE_2__["default"])(this.#types.map(type => type.includeSelector));
  }

  //endregion

  //region properties

  /**
   * The private field used by the 'plugin' read-only property.
   * @type {Plugin}
   * @private
   */
  #plugin;
  /**
   * Get the plugin for the parser.
   * @type {Plugin}
   * @readonly
   */
  get plugin() {
    return this.#plugin;
  }

  /**
   * The private field used by the 'name' read-only property.
   * @type {string}
   * @private
   */
  #name;
  /**
   * Get the name the parser was registered with.
   * @type {string}
   */
  get name() {
    return this.#name;
  }

  /**
   * The current parser configuration.
   * @type {Parser~Configuration}
   * @readonly
   */
  get config() {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(this.plugin.config[this.name])) {
      return this.plugin.config[this.name];
    }
    return this.plugin.config[this.name] = {
      __types__: []
    };
  }

  /**
   * The private field used by the 'priority' read-only property.
   * @type {number}
   * @private
   */
  #priority;
  /**
   * Get the priority.
   * @type {number}
   * @readonly
   */
  get priority() {
    return this.#priority;
  }

  /**
   * The private field used by the 'includeSelector' read-only property.
   * @type {?string}
   * @private
   */
  #includeSelector;
  /**
   * Get the result of combining all configured include selectors into one.
   * @type {?string}
   * @readonly
   */
  get includeSelector() {
    return this.#includeSelector;
  }

  /**
   * The private field used by the 'excludeSelector' read-only property.
   * @type {?string}
   * @private
   */
  #excludeSelector;
  /**
   * Get the result of combining all configured exclude selectors into one.
   * @type {?string}
   * @readonly
   */
  get excludeSelector() {
    return this.#excludeSelector;
  }

  /**
   *
   * @type {TypeParser[]}
   */
  #types = [];

  /**
   * The private field used by the 'typesSelector' read-only property.
   * @type {?string}
   * @private
   */
  #typesSelector;
  /**
   * Get the result of combining all configured type parser include selectors into one.
   * @type {?string}
   * @readonly
   */
  get typesSelector() {
    return this.#typesSelector;
  }

  /**
   *
   * @type {Map<*, Container>}
   */
  #containerCache = new Map();
  /**
   *
   * @type {Map<*, object>}
   */
  #dataCache = new Map();

  /**
   * Whether the parseDocument method should be called.
   * @type {boolean}
   * @readonly
   */
  get isDocumentParser() {
    return true;
  }

  //endregion

  //region methods

  /**
   * Checks if the supplied reference is included by this instance.
   * NOTE: This DOES NOT check for exclusions! Use the canParse method if you want to check if a reference is both included AND NOT excluded.
   * @param {*} ref - The object to test.
   * @returns {boolean}
   */
  includes(ref) {
    if (ref instanceof HTMLElement) {
      return this.includeSelector !== null && ref.matches(this.includeSelector);
    }
    return false;
  }

  /**
   * Checks if the supplied reference is excluded by this instance.
   * @param {*} ref - The object to test.
   * @returns {boolean}
   */
  excludes(ref) {
    if (ref instanceof HTMLElement) {
      return this.excludeSelector !== null && ref.matches(this.excludeSelector);
    }
    return false;
  }

  /**
   * Checks if the supplied reference can be parsed by this instance.
   * @param {*} ref - The object to test.
   * @returns {boolean}
   */
  canParse(ref) {
    return this.includes(ref) && !this.excludes(ref);
  }

  /**
   * Gets any configured data for an element reference.
   * @param {HTMLElement} ref
   * @param {boolean} [nocache=false]
   * @returns {Object}
   */
  data(ref, nocache) {
    if (!nocache && this.#dataCache.has(ref)) {
      return this.#dataCache.get(ref);
    }
    const dataConfig = this.config.data;
    const result = (0,_utils_object__WEBPACK_IMPORTED_MODULE_0__.objReduce)(dataConfig, (result, dataName, key) => {
      if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty)(dataName) && ref.dataset.hasOwnProperty(dataName)) {
        let data;
        try {
          data = JSON.parse(ref.dataset[dataName]);
        } catch (err) {
          console.error(`Invalid dataset.${dataName} JSON string supplied.`, ref.dataset, dataName, err);
          data = null; // cache a null for errors so they will only be triggered again when the cache is flushed
        } finally {
          result[key] = data;
        }
      } else {
        result[key] = null;
      }
      return result;
    }, {});
    this.#dataCache.set(ref, result);
    return result;
  }

  /**
   * Parses the document and returns an array of new Containers.
   * @param {Set<*>} [handledRefs] - A collection of all references already handled by the plugin.
   * @param {boolean} [nocache=false] - If set to true any internal caching mechanisms are ignored and subsequently updated with freshly parsed values.
   * @returns {Promise<Container[]>}
   */
  async parseDocument(handledRefs, nocache) {
    const results = [];
    for (const selector of this.config.include) {
      await (0,_utils_iasync__WEBPACK_IMPORTED_MODULE_4__.asyncForEach)(document.querySelectorAll(selector), ref => {
        if (handledRefs.has(ref) || this.excludes(ref)) return;
        const container = this.parse(ref, handledRefs, nocache);
        if (!container) return;
        results.push(container);
        handledRefs.add(ref);
      });
    }
    this.purgeCache(results);
    return results;
  }

  /**
   * Purges the internal cache given the results of the last parseDocument call.
   * @param {Container[]} results
   */
  purgeCache(results) {
    for (const container of this.#containerCache.values()) {
      if (!results.includes(container) || this.shouldPurge(container)) {
        this.#containerCache.delete(container.ref);
        this.trigger("removed-container", [container]);
      }
    }
  }

  /**
   * Check if a container should be purged from cache.
   * @param {Container} container
   * @returns {boolean}
   */
  shouldPurge(container) {
    return false;
  }

  /**
   *
   * @param {*} ref
   * @param {boolean} [nocache=false]
   * @returns {{itemRefs:Iterable, options:object, trigger:?EventTarget}}
   */
  getArgs(ref, nocache) {
    let trigger = null,
      itemRefs = [],
      options = {};
    if (ref instanceof HTMLElement) {
      const data = this.data(ref, nocache);
      if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(data.options)) {
        options = data.options;
      }
      if (Array.isArray(data.items)) {
        trigger = ref;
        itemRefs.push(...data.items);
      } else {
        if (ref.matches(this.typesSelector)) {
          itemRefs.push(ref);
        }
        itemRefs.push(...ref.querySelectorAll(this.typesSelector));
      }
    }
    return {
      options,
      itemRefs,
      trigger
    };
  }

  /**
   * Create a new container
   * @param {*} ref
   * @param {object} [options]
   * @param {?EventTarget} [trigger]
   * @returns {?Container}
   */
  create(ref, options, trigger) {
    if (ref instanceof HTMLElement) {
      return new _Container__WEBPACK_IMPORTED_MODULE_6__["default"](this, ref, options, trigger);
    }
    return null;
  }

  /**
   * Parses the supplied reference object and returns a new Container.
   * @param {*} ref - The object to parse.
   * @param {Set<*>} [handledRefs] - A collection of all references already handled by the plugin.
   * @param {boolean} [nocache=false] - If set to true any internal caching mechanisms are ignored and subsequently updated with freshly parsed values.
   * @returns {Container|null}
   */
  parse(ref, handledRefs, nocache) {
    const {
      itemRefs,
      options,
      trigger
    } = this.getArgs(ref, nocache);
    let container,
      cached = false;
    if (this.#containerCache.has(ref)) {
      container = this.#containerCache.get(ref);
      cached = true;
    } else {
      container = this.create(ref, options, trigger);
    }
    if (container instanceof _Container__WEBPACK_IMPORTED_MODULE_6__["default"]) {
      const items = this.parseItems(container, itemRefs, handledRefs, nocache);
      if (cached) {
        // compare items
        const changes = this.compareItems(items, container.items);
        container.items.length = 0;
        container.items.push(...items);
        if (changes.added.length > 0 || changes.removed.length > 0) {
          this.trigger("updated-container", [container, changes]);
        }
      } else {
        container.items.push(...items);
        this.trigger("added-container", [container]);
      }
      this.#containerCache.set(ref, container);
    }
    return container;
  }

  /**
   * Parses the supplied iterable collection of objects and returns an array of new ContainerItems.
   * @param {Container} parent - The parent container for the items.
   * @param {Iterable} refs - An iterable collection of reference objects to parse.
   * @param {Set<*>} [handledRefs] - A collection of all references already handled by the plugin.
   * @param {boolean} [nocache=false] - If set to true any internal caching mechanisms are ignored and subsequently updated with freshly parsed values.
   * @returns {Item[]}
   */
  parseItems(parent, refs, handledRefs, nocache) {
    const results = [];
    for (const ref of refs) {
      if (handledRefs.has(ref) || this.excludes(ref)) continue;
      const item = this.parseItem(parent, ref, nocache);
      if (!item) continue;
      results.push(item);
      handledRefs.add(ref);
    }
    return results;
  }

  /**
   * Parses the supplied reference object and returns a new ContainerItem.
   * @param {Container} parent - The parent container for the item.
   * @param {*} ref - The object to parse.
   * @param {boolean} [nocache=false] - If set to true any internal caching mechanisms are ignored and subsequently updated with freshly parsed values.
   * @returns {Item|null} Returns null if parsing fails or no type can parse the reference object.
   */
  parseItem(parent, ref, nocache) {
    const type = this.#types.find(type => type.canParse(ref));
    return type ? type.parse(parent, ref, nocache) : null;
  }

  /**
   * Compares a containers current items against its cached items and reports any changes.
   * @param {Item[]} current
   * @param {Item[]} cached
   * @returns {ParserChange}
   */
  compareItems(current, cached) {
    const removed = cached.filter(item => !current.includes(item));
    const added = current.filter(item => !cached.includes(item));
    return {
      removed,
      added
    };
  }

  //endregion
}

/***/ }),

/***/ "./src/public/foobox/Plugin.js":
/*!*************************************!*\
  !*** ./src/public/foobox/Plugin.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/object */ "./src/utils/object.js");
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/is */ "./src/utils/is.js");
/* harmony import */ var _utils_iasync__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/iasync */ "./src/utils/iasync.js");
/* harmony import */ var _utils_Emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/Emitter */ "./src/utils/Emitter.js");
/* harmony import */ var _Parser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Parser */ "./src/public/foobox/Parser.js");






/**
 * @extends Emitter
 */
class Plugin extends _utils_Emitter__WEBPACK_IMPORTED_MODULE_3__["default"] {
  constructor(configuration) {
    super();
    this.config = (0,_utils_object__WEBPACK_IMPORTED_MODULE_0__.defaults)(configuration, this.config);
    this.on({
      "added-container": this.#onAddedContainer,
      "removed-container": this.#onRemovedContainer,
      "updated-container": this.#onUpdatedContainer
    }, this);
  }

  //region Properties

  /**
   *
   * @type {object}
   */
  config = {
    __parsers__: []
  };

  /**
   *
   * @type {MutationObserver|null}
   */
  #observer = null;

  /**
   *
   * @type {Map<*, Container>}
   */
  #containers = new Map();

  /**
   *
   * @type {Map<EventTarget, EventListener>}
   */
  #triggers = new Map();

  /**
   * Used to ensure multiple calls to the parseDocument method during parsing all return the same result instead of simply kicking off multiple parses.
   * @type {Promise<Container[]>}
   * @private
   */
  #parseDocument = null;

  /**
   *
   * @type {Parser[]}
   */
  #parsers = [];

  /**
   *
   * @type {Parser[]}
   * @readonly
   */
  get __parsers__() {
    return this.#parsers;
  }

  //endregion

  //#region readyState

  /**
   * 0 - The plugin script has been evaluated but not yet initialized.
   * @readonly
   * @type {number}
   * @default 0
   */
  get RS_DEFAULT() {
    return 0;
  }

  /**
   * 1 - The configuration has been set but components have not been loaded yet.
   * @readonly
   * @type {number}
   * @default 1
   */
  get RS_INITIALIZING() {
    return 1;
  }

  /**
   * 2 - The components are loaded but long-running tasks have not been run.
   * @readonly
   * @type {number}
   * @default 2
   */
  get RS_INITIALIZED() {
    return 2;
  }

  /**
   * 3 - Long-running tasks have completed. The plugin is now ready.
   * @readonly
   * @type {number}
   * @default 3
   */
  get RS_READY() {
    return 3;
  }

  /**
   *
   * @type {number}
   */
  #readyStateValue = this.RS_DEFAULT;

  /**
   * Get the current readyState
   * @readonly
   * @type {number}
   * @default 0
   */
  get readyState() {
    return this.#readyStateValue;
  }

  /**
   * Set the readyState value and trigger the "readystatechange" event.
   * @private
   * @param {number} value
   * @fires Document#foobox-readystatechange
   * @fires Plugin#readystatechange
   * @throws {TypeError} Throws a TypeError if the value is not a number.
   * @throws {RangeError} Throws a RangeError if the value is less than the current value or more than the RS_READY value.
   */
  set #readyState(value) {
    if (this.#readyStateValue === value) return; // do nothing
    if (!(0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isNumber)(value)) throw new TypeError("The 'value' argument must be a number.");
    if (value < this.#readyStateValue) throw new RangeError("The 'value' argument can't be less than the current readyState.");
    if (value > this.RS_READY) throw new RangeError("The 'value' argument can't be more than the RS_READY value.");
    this.#readyStateValue = value;
    /**
     * Occurs whenever the readyState is changed.
     * @event Document#foobox-readystatechange
     * @param {CustomEvent} event - The readyState value can be accessed using the CustomEvent.detail property which is set to the plugin instance. e.g. event.detail.readyState
     */
    this.documentDispatch("foobox-readystatechange");
    /**
     * Occurs whenever the readyState is changed.
     * @event Plugin#readystatechange
     * @param {EmitterEvent} event - The basic event object.
     * @param {number} readyState - The readyState value.
     */
    this.trigger("readystatechange", [value]);
    const states = ['evaluated', 'initializing', 'initialized', 'ready'];
    this.documentDispatch(`foobox-${states[value]}`);
    this.trigger(states[value]);
  }

  //#endregion

  //region Methods

  /**
   *
   * @param configuration
   */
  async init(configuration) {
    if (this.readyState !== this.RS_DEFAULT) return;
    this.#readyState = this.RS_INITIALIZING;
    (0,_utils_object__WEBPACK_IMPORTED_MODULE_0__.extend)(this.config, configuration);
    this.#parsers = _Parser__WEBPACK_IMPORTED_MODULE_4__["default"].createAll(this, this.config.__parsers__);
    this.#readyState = this.RS_INITIALIZED;
    await this.parseDocument(true);
    this.#readyState = this.RS_READY;
    this.observe();
  }

  /**
   * Dispatch an event on the document.
   * @param {string|Event} event - If given a string a CustomEvent is dispatched using the value as the type.
   * @param {eventOptions} [options] - Any additional options for the event. By default the detail option of CustomEvent objects created by this method is set to the plugin instance.
   * @returns {boolean}
   */
  documentDispatch(event, options) {
    /** @typedef {{bubbles:?boolean,cancelable:?boolean,composed:?boolean,detail:*}} eventOptions */
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isString)(event)) {
      event = new CustomEvent(event, (0,_utils_object__WEBPACK_IMPORTED_MODULE_0__.extend)({
        detail: this
      }, options));
    }
    if (event instanceof Event) {
      return document.dispatchEvent(event);
    }
    return false;
  }
  observe() {
    if (!this.config.watch) return;
    if (!this.#observer) {
      this.#observer = new MutationObserver(() => {
        this.parseDocument();
      });
    }
    this.#observer.observe(document, {
      childList: true,
      subtree: true
    });
  }
  unobserve() {
    if (!this.config.watch || !this.#observer) return;
    this.#observer.disconnect();
  }

  /**
   *
   * @param {string} name
   * @param {object} [configuration]
   * @param {Parser~ctor} [ctor]
   * @returns {boolean}
   */
  registerParser(name, configuration, ctor) {
    if (this.readyState < this.RS_INITIALIZED && !this.config.hasOwnProperty(name)) {
      const Parser_ctor = (0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isFunction)(ctor) ? ctor : _Parser__WEBPACK_IMPORTED_MODULE_4__["default"];
      this.config.__parsers__.push([name, Parser_ctor]);
      this.config[name] = (0,_utils_object__WEBPACK_IMPORTED_MODULE_0__.extend)({}, configuration);
      return true;
    }
    return false;
  }

  /**
   *
   * @param {string} name
   * @returns {boolean}
   */
  unregisterParser(name) {
    if (this.readyState < this.RS_INITIALIZED && this.config.hasOwnProperty(name)) {
      this.config.__parsers__ = this.config.__parsers__.filter(config => {
        const parser = _Parser__WEBPACK_IMPORTED_MODULE_4__["default"].DEFINITION(config);
        return parser ? parser.name !== name : false;
      });
      delete this.config[name];
      return true;
    }
    return false;
  }

  /**
   * Remove any trigger listeners registered using the addTrigger method.
   * @param {?EventTarget} eventTarget
   */
  removeTriggerListener(eventTarget) {
    if (eventTarget instanceof EventTarget && this.#triggers.has(eventTarget)) {
      const listener = this.#triggers.get(eventTarget);
      eventTarget.removeEventListener("click", listener, false);
      this.#triggers.delete(eventTarget);
    }
  }

  /**
   * Sets up a trigger listener on the target.
   * @param {?EventTarget} eventTarget
   * @param {Container} container
   * @param {?Item} [item]
   */
  addTriggerListener(eventTarget, container, item) {
    if (eventTarget instanceof EventTarget) {
      if (this.#triggers.has(eventTarget)) {
        // if there was a listener already cached then remove it before adding the new one
        eventTarget.removeEventListener("click", this.#triggers.get(eventTarget), false);
      }
      const listener = e => {
        e.preventDefault();
        this.trigger("triggered-container", [container, item]);
      };
      // add the listener to the internal cache, this will update the listener if it existed
      this.#triggers.set(eventTarget, listener);
      eventTarget.addEventListener("click", listener, false);
    }
  }

  /**
   * Get all document parsers.
   * @returns {Parser[]}
   */
  getDocumentParsers() {
    return this.#parsers.filter(parser => parser.isDocumentParser);
  }

  /**
   * Try get a parser for the reference.
   * @param {*} ref
   * @returns {?Parser}
   */
  getRefParser(ref) {
    return this.#parsers.find(parser => parser.canParse(ref)) ?? null;
  }

  /**
   * Get all containers for this instance of the plugin.
   * @returns {Container[]}
   */
  getAll() {
    return Array.from(this.#containers.values());
  }

  /**
   * Given a reference or selector this method attempts to return the associated container.
   * @param {*} ref
   * @return {Container|null}
   */
  find(ref) {
    if (this.#containers.has(ref)) {
      return this.#containers.get(ref);
    }
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty)(ref)) {
      const elementRef = document.querySelector(ref);
      if (elementRef && this.#containers.has(elementRef)) {
        return this.#containers.get(elementRef);
      }
    }
    return null;
  }

  /**
   * Get a collection of references from all containers and items.
   * @param {*} excludeRef - A reference to exclude from the result.
   * @returns {Set<*>}
   */
  getRefs(excludeRef) {
    /** @type {Set<*>} */
    const refs = new Set();
    return this.getAll().reduce((result, container) => {
      if (container.ref !== excludeRef) {
        result.add(container.ref);
        container.items.forEach(item => {
          if (item.ref === excludeRef) return;
          result.add(item.ref);
        });
      }
      return result;
    }, refs);
  }

  /**
   * Parses the entire document and returns an array of Container objects.
   * @async
   * @param {boolean} [nocache=false] - Whether to disable the parser cache for this call.
   * @returns {Promise<Container[]>} Returns an empty array if no Containers were parsed.
   */
  async parseDocument(nocache) {
    // if the plugin is not initialized yet return an empty array as we have no parsers to work with
    if (this.readyState < this.RS_INITIALIZED) return [];
    // if there is already parsing taking place simply return a reference to its promise
    if (this.#parseDocument) return this.#parseDocument;
    // otherwise we need to do some work
    nocache = nocache ?? false;
    return this.#parseDocument = new Promise(async resolve => {
      const results = [],
        handledRefs = new Set();
      await (0,_utils_iasync__WEBPACK_IMPORTED_MODULE_2__.asyncForEach)(this.getDocumentParsers(), async parser => {
        const containers = await parser.parseDocument(handledRefs, nocache);
        results.push(...containers);
      });
      this.#parseDocument = null;
      resolve(results);
    });
  }

  /**
   * Parse the supplied reference object into a Container.
   * @param {*} ref - The object to parse.
   * @param {boolean} [nocache=false] - Whether to disable the parser caching for this call.
   * @returns {Container|null} Returns null if the reference object could not be parsed.
   */
  parse(ref, nocache) {
    if (this.readyState < this.RS_INITIALIZED) return null;
    nocache = nocache ?? false;
    const parser = this.getRefParser(ref);
    if (parser) {
      const handledRefs = this.getRefs(ref);
      return parser.parse(ref, handledRefs, nocache);
    }
    return null;
  }

  //endregion

  //region listeners

  /**
   *
   * @param {EmitterEvent} event
   * @param {Container} container
   */
  #onAddedContainer(event, container) {
    this.addTriggerListener(container.triggerTarget, container);
    container.items.forEach(item => this.addTriggerListener(item.triggerTarget, container, item));
    this.#containers.set(container.ref, container);
  }

  /**
   *
   * @param {EmitterEvent} event
   * @param {Container} container
   * @param {ParserChange} changes
   */
  #onUpdatedContainer(event, container, changes) {
    changes.removed.forEach(item => this.removeTriggerListener(item.triggerTarget));
    changes.added.forEach(item => this.addTriggerListener(item.triggerTarget, container, item));
    this.#containers.set(container.ref, container);
  }

  /**
   *
   * @param {EmitterEvent} event
   * @param {Container} container
   */
  #onRemovedContainer(event, container) {
    this.removeTriggerListener(container.triggerTarget);
    container.items.forEach(item => this.removeTriggerListener(item.triggerTarget));
    this.#containers.delete(container.ref);
  }

  //endregion
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Plugin);

/***/ }),

/***/ "./src/public/foobox/PropertyParser.js":
/*!*********************************************!*\
  !*** ./src/public/foobox/PropertyParser.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PropertyParser)
/* harmony export */ });
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/is */ "./src/utils/is.js");
/* harmony import */ var _utils_mergeArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/mergeArray */ "./src/utils/mergeArray.js");



//region type-definitions

/**
 * @callback PropertyParser~ctor
 * @param {TypeParser} parent
 * @param {PropertyParser~Configuration} configuration
 * @returns {PropertyParser}
 */
/**
 * @typedef {object} PropertyParserDefinition
 * @property {PropertyParser~Configuration} configuration
 * @property {PropertyParser~ctor} ctor
 */
/**
 * If just a string, a new instance of the default property parser is registered using the new name. If an array, the first element is the name, the second is the custom property parser constructor.
 * @typedef {PropertyParser~Configuration|[PropertyParser~Configuration,PropertyParser~ctor]} propertyParserDefinition
 */
/**
 * A method used to test the parsed value to check if it is valid.
 * @callback PropertyParser~test
 * @param {*} value
 * @param {PropertyParser} [propertyParser]
 * @returns {boolean}
 */
/**
 * A method used to convert the parsed value to a specific type.
 * @callback PropertyParser~convert
 * @param {*} value
 * @param {PropertyParser} [propertyParser]
 * @returns {*}
 */
/**
 * The configuration for parsing a property from an object.
 * @typedef {object} PropertyParser~Configuration
 * @property {string} name - The name of the property as it appears in the resulting properties object.
 * @property {boolean} [required=false] - Whether or not this property is required. If set to true and the parsed value is null, undefined or the same as the defaultValue the item will fail to parse.
 * @property {boolean} [tracked=false] - Whether or not changes to this property are tracked. By default all required properties are tracked and will ignore this value.
 * @property {*} [defaultValue=null] - The default value returned for this property if none is parsed.
 * @property {PropertyParser~test} [test] - A method used to test the parsed value to check if it is valid. If not supplied the value is considered valid if: value != null && value !== defaultValue
 * @property {PropertyParser~convert} [convert] - A method used to convert the parsed value to a specific type.
 * @property {string} [queryParent="^"]
 * @property {string} [queryPath="/"]
 * @property {string} [queryType=":"]
 * @property {string[]} [obj=[]] - An array of queries used to parse a plain object reference for the property value. The properties are iterated in index order and the first match is returned.
 * @property {string[]} [elem=[]] - An array of queries used to parse an HTMLElement reference for the property value. The queries are iterated in index order and the first match is returned.
 */

//endregion

class PropertyParser {
  //#region static

  /**
   * The default convert method used by all properties. This does nothing but pass through the supplied value.
   * @param {*} value - The parsed value.
   * @param {PropertyParser} property - The property object itself.
   * @returns {*}
   */
  static DEFAULT_CONVERT(value, property) {
    return value;
  }

  /**
   * The default test method used by all properties to determine if the parsed value is valid.
   * @param {*} value - The parsed value.
   * @param {PropertyParser} property - The property object itself.
   * @returns {boolean}
   */
  static DEFAULT_TEST(value, property) {
    return value != null && value !== property.defaultValue;
  }

  /**
   *
   * @param {propertyParserDefinition} configuration
   * @returns {?PropertyParserDefinition}
   */
  static DEFINITION(configuration) {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(configuration)) {
      return {
        configuration: /** @type PropertyParser~Configuration */configuration,
        ctor: /** @type PropertyParser~ctor */PropertyParser
      };
    }
    if (Array.isArray(configuration) && configuration.length === 2 && (0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(configuration[0]) && (0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isFunction)(configuration[1])) {
      return {
        configuration: configuration[0],
        ctor: configuration[1]
      };
    }
    return null;
  }

  /**
   * Merges all property definitions from the source into the target, properties are compared by name.
   * @param {propertyParserDefinition[]} target - The target array to push definitions into.
   * @param {propertyParserDefinition[]} source - The source array to pull definitions from.
   * @returns {propertyParserDefinition[]}
   */
  static MERGE_DEFINITIONS(target, source) {
    return (0,_utils_mergeArray__WEBPACK_IMPORTED_MODULE_1__["default"])(target, source, (targetDefinition, sourceDefinition) => {
      const targetDef = PropertyParser.DEFINITION(targetDefinition),
        sourceDef = PropertyParser.DEFINITION(sourceDefinition);
      if (!targetDef || !sourceDef) return false;
      return targetDef.configuration.name === sourceDef.configuration.name;
    });
  }

  /**
   *
   * @param {TypeParser} typeParser
   * @param {propertyParserDefinition} definition
   * @returns {?PropertyParser}
   */
  static create(typeParser, definition) {
    const def = PropertyParser.DEFINITION(definition);
    return def ? new def.ctor(typeParser, def.configuration) : null;
  }

  /**
   *
   * @param {TypeParser} typeParser
   * @param {propertyParserDefinition[]} propertyParserDefinitions
   * @returns {PropertyParser[]}
   */
  static createAll(typeParser, propertyParserDefinitions) {
    return propertyParserDefinitions.reduce((result, definition) => {
      const propertyParser = PropertyParser.create(typeParser, definition);
      if (propertyParser) result.push(propertyParser);
      return result;
    }, /** @type {PropertyParser[]} */[]);
  }

  /**
   *
   * @param {*} ref
   * @param {PropertyParser[]} properties
   * @param {boolean} [nocache=false]
   * @returns {?object}
   */
  static getValues(ref, properties, nocache) {
    const result = {};
    for (const property of properties) {
      const value = property.getValue(ref, nocache);
      if (property.required && !property.test(value)) {
        // if there is a required property that is not supplied then stop parsing and exit early
        return null;
      } else {
        result[property.name] = value;
      }
    }
    return result;
  }

  //#endregion

  //region constructor

  /**
   * Create a new instance of a PropertyParser.
   * @param {TypeParser} typeParser - The parent type parser for this instance.
   * @param {PropertyParser~Configuration} configuration - The configuration for this instance.
   */
  constructor(typeParser, configuration) {
    this.#typeParser = typeParser;
    this.#name = configuration.name;
    this.required = configuration.required ?? false;
    this.defaultValue = configuration.defaultValue ?? null;
    this.#convert = configuration.convert ?? PropertyParser.DEFAULT_CONVERT;
    this.#test = configuration.test ?? PropertyParser.DEFAULT_TEST;
    this.queryParent = configuration.queryParent ?? "^";
    this.queryPath = configuration.queryPath ?? "/";
    this.queryType = configuration.queryType ?? ":";
    if (Array.isArray(configuration.obj)) {
      this.obj = configuration.obj.map(query => this.objectQuery(query)).filter(query => query != null);
    }
    if (Array.isArray(configuration.elem)) {
      this.elem = configuration.elem.map(query => this.elementQuery(query)).filter(query => query != null);
    }
  }

  //#endregion

  //#region properties

  /**
   * The private field used by the 'typeParser' read-only property.
   * @type {TypeParser}
   * @private
   */
  #typeParser;
  /**
   * Get the parent type parser.
   * @type {TypeParser}
   * @readonly
   */
  get typeParser() {
    return this.#typeParser;
  }
  get parser() {
    return this.typeParser.parser;
  }

  /**
   * The private field used by the 'name' read-only property.
   * @type {string}
   * @private
   */
  #name;
  /**
   * Get the name the property was registered with.
   * @type {string}
   */
  get name() {
    return this.#name;
  }

  /**
   * Whether this property is required.
   * @type {boolean}
   * @default false
   */
  required;
  /**
   * The default value returned if none is parsed.
   * @type {*}
   * @default null
   */
  defaultValue;
  /**
   * The delimiter used by element queries to target a parent element.
   * @type {string}
   * @default "^"
   */
  queryParent;
  /**
   * The delimiter used by queries to target either a child element or object property.
   * @type {string}
   * @default "/"
   */
  queryPath;
  /**
   * The delimiter used by element queries to specify where the value should be pulled from.
   * @type {string}
   * @default ":"
   */
  queryType;
  /**
   * An array of compiled queries used to interrogate plain objects.
   * @type {ObjectQuery[]}
   */
  obj = [];
  /**
   * An array of compiled queries used to interrogate elements.
   * @type {ElementQuery[]}
   */
  elem = [];
  /**
   * The method used to convert the parsed value to another type.
   * @type {PropertyParser~convert}
   * @default Property.DEFAULT_CONVERT
   */
  #convert;
  /**
   * The method used to test if the parsed value is valid.
   * @type {PropertyParser~test}
   * @default Property.DEFAULT_CONVERT
   */
  #test;
  /**
   *
   * @type {Map<string, *>}
   */
  #cache = new Map();

  //#endregion

  /**
   * @typedef {object} PropertyQuery
   * @property {string} raw
   * @property {string} name
   * @property {function(*):*} getValue
   */

  /**
   *
   * @param {string} query
   * @returns {?ObjectQuery}
   */
  objectQuery(query) {
    /**
     * @typedef {PropertyQuery} ObjectQuery
     * @property {string[]} path
     */
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(query)) {
      let name = query,
        path = [];
      if (name.indexOf(this.queryPath) !== -1) {
        const parts = name.split(this.queryPath);
        name = parts.pop();
        path.push(parts);
      }
      const target = ref => {
        let result = ref;
        for (const part of path) {
          result = result[part];
          if (!result) break;
        }
        return result ?? null;
      };
      return {
        raw: query,
        name,
        path,
        getValue: ref => {
          const targetRef = target(ref);
          if (targetRef) {
            return this.convert(targetRef[name]) ?? this.defaultValue;
          }
          return this.defaultValue;
        }
      };
    }
    return null;
  }
  /**
   *
   * @param {string} query
   * @returns {?ElementQuery}
   */
  elementQuery(query) {
    /**
     * @typedef {PropertyQuery} ElementQuery
     * @property {number} parents
     * @property {?string} selector
     */
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(query)) {
      let name = query,
        parents = 0,
        selector = null,
        type = "prop";
      while (name[0] === this.queryParent) {
        parents++;
        name = name.slice(1);
      }
      if (name.indexOf(this.queryPath) !== -1) {
        const parts = name.split(this.queryPath);
        selector = parts[0];
        name = parts[1];
      }
      if (name.indexOf(this.queryType) !== -1) {
        const parts = name.split(this.queryType);
        type = parts[0];
        name = parts[1];
      }
      const target = ref => {
        let result = ref;
        for (let i = 0; i < parents; i++) {
          result = result.parentElement;
          if (!result) break;
        }
        return result && selector ? result.querySelector(selector) : result;
      };
      let getValue;
      switch (type) {
        case "prop":
          getValue = ref => {
            return this.convert(ref[name]) ?? this.defaultValue;
          };
          break;
        case "data":
          getValue = ref => {
            return this.convert(ref.dataset[name]) ?? this.defaultValue;
          };
          break;
        case "attr":
          getValue = ref => {
            return ref.hasAttribute(name) ? this.convert(ref.getAttribute(name)) : this.defaultValue;
          };
          break;
        default:
          getValue = () => this.defaultValue;
          break;
      }
      return {
        raw: query,
        name,
        type,
        parents,
        selector,
        getValue: ref => {
          const targetRef = target(ref);
          if (targetRef) {
            return getValue(targetRef);
          }
          return this.defaultValue;
        }
      };
    }
    return null;
  }

  /**
   *
   * @param ref
   * @param nocache
   * @returns {*}
   */
  getValue(ref, nocache) {
    if (!nocache && this.#cache.has(ref)) {
      return this.#cache.get(ref);
    }
    let result = this.defaultValue,
      query;
    if (ref instanceof HTMLElement) {
      for (query of this.elem) {
        const value = query.getValue(ref);
        if (this.test(value)) {
          result = value;
          break;
        }
      }
    } else if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(ref)) {
      for (query of this.obj) {
        const value = query.getValue(ref);
        if (this.test(value)) {
          result = value;
          break;
        }
      }
    }
    const prop = {
      name: this.name,
      type: this.typeParser.name,
      value: result,
      query,
      ref
    };
    this.parser.trigger('get-property', [prop]);
    this.#cache.set(ref, prop.value);
    return prop.value;
  }
  convert(value) {
    return this.#convert(value, this);
  }
  test(value) {
    return this.#test(value, this);
  }
}

/***/ }),

/***/ "./src/public/foobox/TypeParser.js":
/*!*****************************************!*\
  !*** ./src/public/foobox/TypeParser.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TypeParser)
/* harmony export */ });
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/is */ "./src/utils/is.js");
/* harmony import */ var _utils_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/object */ "./src/utils/object.js");
/* harmony import */ var _utils_makeSelector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/makeSelector */ "./src/utils/makeSelector.js");
/* harmony import */ var _PropertyParser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PropertyParser */ "./src/public/foobox/PropertyParser.js");
/* harmony import */ var _Item__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Item */ "./src/public/foobox/Item.js");






//region type-definitions

/**
 * @callback TypeParser~ctor
 * @param {Parser} parser
 * @param {string} name
 * @returns TypeParser
 */
/**
 * @typedef {object} TypeParserDefinition
 * @property {string} name
 * @property {TypeParser~ctor} ctor
 */
/**
 * If just a string, a new instance of the default type parser is registered using the new name. If an array, the first element is the name, the second is the custom type parser constructor.
 * @typedef {string|[string,TypeParser~ctor]} typeParserDefinition
 */
/**
 * The configuration for parsing an item from an object.
 * @typedef {object} TypeParser~Configuration
 * @property {number} [priority=0]
 * @property {string[]} [include]
 * @property {string[]} [exclude]
 * @property {propertyParserDefinition[]} [properties]
 */

//endregion

/**
 * Parses item data from various sources depending on configuration.
 */
class TypeParser {
  //region static

  /**
   *
   * @param {typeParserDefinition} configuration
   * @returns {?TypeParserDefinition}
   */
  static DEFINITION(configuration) {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(configuration)) {
      return {
        name: /** @type string */configuration,
        ctor: /** @type TypeParser~ctor */TypeParser
      };
    }
    if (Array.isArray(configuration) && configuration.length === 2 && (0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(configuration[0]) && (0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isFunction)(configuration[1])) {
      return {
        name: configuration[0],
        ctor: configuration[1]
      };
    }
    return null;
  }

  /**
   *
   * @param {Parser} parser
   * @param {typeParserDefinition} definition
   * @returns {?TypeParser}
   */
  static create(parser, definition) {
    const def = TypeParser.DEFINITION(definition);
    return def ? new def.ctor(parser, def.name) : null;
  }

  /**
   *
   * @param {Parser} parser
   * @param {typeParserDefinition[]} typeParserDefinitions
   * @returns {TypeParser[]}
   */
  static createAll(parser, typeParserDefinitions) {
    return typeParserDefinitions.reduce((result, config) => {
      const typeParser = TypeParser.create(parser, config);
      if (typeParser) result.push(typeParser);
      return result;
    }, /** @type {TypeParser[]} */[]).sort((a, b) => a.priority - b.priority);
  }

  //endregion

  //region constructor

  /**
   * Parses item data from various sources depending on configuration.
   * @param {Parser} parser - The parent parser for this instance.
   * @param {string} name - The type of item parsed by this instance.
   */
  constructor(parser, name) {
    this.#parser = parser;
    this.#name = name;
    (0,_utils_object__WEBPACK_IMPORTED_MODULE_1__.defaults)(this.config, this.defaults);
    this.#includeSelector = (0,_utils_makeSelector__WEBPACK_IMPORTED_MODULE_2__["default"])(this.config.include);
    this.#excludeSelector = (0,_utils_makeSelector__WEBPACK_IMPORTED_MODULE_2__["default"])(this.config.exclude);
    this.#properties = _PropertyParser__WEBPACK_IMPORTED_MODULE_3__["default"].createAll(this, _PropertyParser__WEBPACK_IMPORTED_MODULE_3__["default"].MERGE_DEFINITIONS(this.config.properties, this.parser.config.defaultProperties));
    this.#requiredProperties = this.properties.filter(property => property.required);
  }

  //endregion

  //region properties

  /**
   * The private field used by the 'parent' read-only property.
   * @type {Parser}
   * @private
   */
  #parser;
  /**
   * Get the parent parser.
   * @type {Parser}
   * @readonly
   */
  get parser() {
    return this.#parser;
  }

  /**
   * The private field used by the 'name' read-only property.
   * @type {string}
   * @private
   */
  #name;
  /**
   * Get the name the type parser was registered with.
   * @type {string}
   */
  get name() {
    return this.#name;
  }

  /**
   * Get the default type parser configuration.
   * @type {TypeParser~Configuration}
   * @readonly
   */
  get defaults() {
    return {
      priority: 0,
      include: [],
      exclude: [],
      properties: []
    };
  }

  /**
   * Get the parser configuration.
   * @type {TypeParser~Configuration}
   * @readonly
   */
  get config() {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(this.parser.config[this.name])) {
      return this.parser.config[this.name];
    }
    return this.parser.config[this.name] = {};
  }

  /**
   * The private field used by the 'priority' read-only property.
   * @type {number}
   * @private
   */
  #priority;
  /**
   * Get the priority.
   * @type {number}
   * @readonly
   */
  get priority() {
    return this.#priority;
  }

  /**
   * The private field used by the 'includeSelector' read-only property.
   * @type {?string}
   * @private
   */
  #includeSelector;
  /**
   * Get the result of combining all configured include selectors into one.
   * @type {?string}
   * @readonly
   */
  get includeSelector() {
    return this.#includeSelector;
  }

  /**
   * The private field used by the 'excludeSelector' read-only property.
   * @type {?string}
   * @private
   */
  #excludeSelector;
  /**
   * Get the result of combining all configured exclude selectors into one.
   * @type {?string}
   * @readonly
   */
  get excludeSelector() {
    return this.#excludeSelector;
  }

  /**
   * The private field used by the 'properties' read-only property.
   * @type {PropertyParser[]}
   * @private
   */
  #properties;
  /**
   * Get all configured property parsers.
   * @type {PropertyParser[]}
   * @readonly
   */
  get properties() {
    return this.#properties;
  }

  /**
   * The private field used by the 'requiredProperties' read-only property.
   * @type {PropertyParser[]}
   * @private
   */
  #requiredProperties;
  /**
   * Get all configured required property parsers.
   * @type {PropertyParser[]}
   * @readonly
   */
  get requiredProperties() {
    return this.#requiredProperties;
  }

  /**
   *
   * @type {Map<*, Item>}
   */
  #cache = new Map();

  /**
   *
   * @type {Map<*, object>}
   */
  #requiredPropertyCache = new Map();

  /**
   *
   * @type {Map<*, object>}
   */
  #propertyCache = new Map();

  //endregion

  /**
   * Checks if the supplied reference is included by this instance.
   * NOTE: This DOES NOT check for exclusions! Use the canParse method if you want to check if a reference is both included AND NOT excluded.
   * @param {*} ref - The object to test.
   * @returns {boolean}
   */
  includes(ref) {
    if (ref instanceof HTMLElement) {
      return this.includeSelector !== null && ref.matches(this.includeSelector);
    }
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(ref)) {
      return ref.type === this.name;
    }
    return false;
  }

  /**
   * Checks if the supplied reference is excluded by this instance.
   * @param {*} ref - The object to test.
   * @returns {boolean}
   */
  excludes(ref) {
    if (ref instanceof HTMLElement) {
      return this.excludeSelector !== null && ref.matches(this.excludeSelector);
    }
    return false;
  }

  /**
   * Checks if the supplied reference can be parsed by this instance.
   * @param {*} ref - The object to test.
   * @returns {boolean}
   */
  canParse(ref) {
    return this.includes(ref) && !this.excludes(ref);
  }
  create(parent, ref, trigger) {
    if (ref instanceof HTMLElement || (0,_utils_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(ref)) {
      return new _Item__WEBPACK_IMPORTED_MODULE_4__["default"](parent, this, ref, trigger);
    }
    return null;
  }

  /**
   * Parses the supplied reference object and returns a new ParserItem.
   * @param {Container} parent - The parent container.
   * @param {*} ref - The object to parse.
   * @param {boolean} [nocache=false] - Whether to ignore any cached values when parsing the item.
   * @returns {Item|null} Returns null if parsing fails.
   */
  parse(parent, ref, nocache) {
    let item;
    if (this.#cache.has(ref)) {
      item = this.#cache.get(ref);
    } else {
      item = this.create(parent, ref, this.getTrigger(ref));
    }
    if (item instanceof _Item__WEBPACK_IMPORTED_MODULE_4__["default"]) {
      const properties = this.getRequiredProperties(ref, nocache);
      if (!properties) {
        this.#cache.delete(ref);
        return null;
      }
      item.requiredProperties = properties;
      this.#cache.set(ref, item);
    }
    return item;
  }

  /**
   * Gets the trigger element for the reference object. Trigger elements are used to open the modal.
   * @param {*} ref - The reference object to get the trigger from.
   * @returns {?HTMLElement} Returns null if the item has no trigger element.
   */
  getTrigger(ref) {
    return ref instanceof HTMLElement ? ref : null;
  }
  getRequiredProperties(ref, nocache) {
    if (!nocache && this.#requiredPropertyCache.has(ref)) {
      return this.#requiredPropertyCache.get(ref);
    }
    const properties = _PropertyParser__WEBPACK_IMPORTED_MODULE_3__["default"].getValues(ref, this.requiredProperties, nocache);
    this.#requiredPropertyCache.set(ref, properties);
    return properties;
  }
  getProperties(ref, nocache) {
    if (!nocache && this.#propertyCache.has(ref)) {
      return this.#propertyCache.get(ref);
    }
    const properties = _PropertyParser__WEBPACK_IMPORTED_MODULE_3__["default"].getValues(ref, this.properties, nocache);
    this.#propertyCache.set(ref, properties);
    return properties;
  }
}

/***/ }),

/***/ "./src/public/foobox/index.pro.js":
/*!****************************************!*\
  !*** ./src/public/foobox/index.pro.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils */ "./src/utils/index.js");
/* harmony import */ var _Plugin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Plugin */ "./src/public/foobox/Plugin.js");
/* harmony import */ var _Parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Parser */ "./src/public/foobox/Parser.js");
/* harmony import */ var _GroupParser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GroupParser */ "./src/public/foobox/GroupParser.js");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modal */ "./src/public/foobox/modal/index.js");





const plugin = new _Plugin__WEBPACK_IMPORTED_MODULE_1__["default"]({
  __parsers__: [["default", _Parser__WEBPACK_IMPORTED_MODULE_2__["default"]], ["groups", _GroupParser__WEBPACK_IMPORTED_MODULE_3__["default"]]],
  default: _Parser__WEBPACK_IMPORTED_MODULE_2__.PARSER_DEFAULTS_PRO,
  groups: _GroupParser__WEBPACK_IMPORTED_MODULE_3__.GROUP_PARSER_DEFAULTS_PRO,
  watch: false
});
plugin.utils = _utils__WEBPACK_IMPORTED_MODULE_0__["default"];
plugin.Plugin = _Plugin__WEBPACK_IMPORTED_MODULE_1__["default"];
plugin.Parser = _Parser__WEBPACK_IMPORTED_MODULE_2__["default"];
plugin.GroupParser = _GroupParser__WEBPACK_IMPORTED_MODULE_3__["default"];
plugin.PARSER_DEFAULTS = _Parser__WEBPACK_IMPORTED_MODULE_2__.PARSER_DEFAULTS;
plugin.GROUP_PARSER_DEFAULTS = _GroupParser__WEBPACK_IMPORTED_MODULE_3__.GROUP_PARSER_DEFAULTS;
plugin.ModalElement = _modal__WEBPACK_IMPORTED_MODULE_4__["default"];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);

/***/ }),

/***/ "./src/public/foobox/modal/index.js":
/*!******************************************!*\
  !*** ./src/public/foobox/modal/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.scss */ "./src/public/foobox/modal/index.scss");
/* harmony import */ var _inner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inner */ "./src/public/foobox/modal/inner/index.js");


class ModalElement extends HTMLDialogElement {
  constructor() {
    super();
  }
  get root() {
    return this.ownerDocument.documentElement;
  }
  get inner() {
    return this.querySelector('foobox-inner');
  }
  show() {
    this.root.setAttribute('foobox-open', '');
    this.showModal();
  }
  hide() {
    this.root.removeAttribute('foobox-open');
    this.close();
  }
  onClick(event) {
    if (event.target === event.currentTarget) {
      event.preventDefault();
      this.close();
    }
  }
  onCloseClick(event) {
    event.preventDefault();
    this.close();
  }
}
customElements.define('foobox-modal', ModalElement, {
  extends: "dialog"
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModalElement);

/***/ }),

/***/ "./src/public/foobox/modal/inner/index.js":
/*!************************************************!*\
  !*** ./src/public/foobox/modal/inner/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.scss */ "./src/public/foobox/modal/inner/index.scss");
/* harmony import */ var _utils_getResizeObserverEntrySize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/getResizeObserverEntrySize */ "./src/utils/getResizeObserverEntrySize.js");
/* harmony import */ var _utils_debounce__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../utils/debounce */ "./src/utils/debounce.js");
/* harmony import */ var _items__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../items */ "./src/public/foobox/modal/items/index.js");
/* harmony import */ var _overlay__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../overlay */ "./src/public/foobox/modal/overlay/index.js");





class InnerElement extends HTMLElement {
  constructor() {
    super();
    this.#observer = new ResizeObserver((0,_utils_debounce__WEBPACK_IMPORTED_MODULE_2__["default"])(this.onResize.bind(this), 50));
  }
  #observer;
  onResize(entries) {
    if (!this.items) return;
    const entry = entries.length ? entries[0] : null;
    if (!entry) return;
    const size = (0,_utils_getResizeObserverEntrySize__WEBPACK_IMPORTED_MODULE_1__["default"])(entry);
    this.items.doResize(size);
    console.log('onResize', size);
  }
  connectedCallback() {
    if (this.isConnected) {
      this.#observer.unobserve(this);
      this.#observer.observe(this);
    }
  }
  disconnectedCallback() {
    this.#observer.unobserve(this);
  }
  get items() {
    return this.querySelector('foobox-items');
  }
  get overlay() {
    return this.querySelector('foobox-overlay');
  }
  get cover() {
    return this.hasAttribute('cover');
  }
  set cover(value) {
    this.toggleAttribute('cover', Boolean(value));
  }
}
customElements.define('foobox-inner', InnerElement);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InnerElement);

/***/ }),

/***/ "./src/public/foobox/modal/items/index.js":
/*!************************************************!*\
  !*** ./src/public/foobox/modal/items/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.scss */ "./src/public/foobox/modal/items/index.scss");
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../utils/is */ "./src/utils/is.js");
/* harmony import */ var _item__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./item */ "./src/public/foobox/modal/items/item/index.js");



class ItemsElement extends HTMLElement {
  constructor() {
    super();
  }
  doResize(size) {
    let child;
    for (child of this.children) {
      if (!(0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isFunction)(child['doResize'])) continue;
      child.doResize(size);
    }
  }
}
customElements.define('foobox-items', ItemsElement);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ItemsElement);

/***/ }),

/***/ "./src/public/foobox/modal/items/item/caption/index.js":
/*!*************************************************************!*\
  !*** ./src/public/foobox/modal/items/item/caption/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.scss */ "./src/public/foobox/modal/items/item/caption/index.scss");
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../utils/is */ "./src/utils/is.js");


class CaptionElement extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'description'];
  }
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    }).append(this.header, this.section, this.ownerDocument.createElement('slot'), this.toolbar);
  }
  #header;
  get header() {
    if (!this.#header) {
      this.#header = this.ownerDocument.createElement('header');
      this.#header.setAttribute('part', 'title');
    }
    return this.#header;
  }
  #section;
  get section() {
    if (!this.#section) {
      this.#section = this.ownerDocument.createElement('section');
      this.#section.setAttribute('part', 'description');
    }
    return this.#section;
  }
  #toolbar;
  get toolbar() {
    if (!this.#toolbar) {
      this.#toolbar = this.ownerDocument.createElement('div');
      this.#toolbar.setAttribute('part', 'toolbar');
      const close = this.ownerDocument.createElement('button');
      close.innerHTML = '&times;';
      close.addEventListener('click', e => {
        e.preventDefault();
        this.toggle();
      });
      const slot = this.ownerDocument.createElement('slot');
      slot.name = 'toolbar';
      this.#toolbar.append(close, slot);
    }
    return this.#toolbar;
  }
  get open() {
    return this.hasAttribute('open');
  }
  set open(value) {
    this.toggleAttribute('open', Boolean(value));
  }
  get description() {
    return this.getAttribute('description');
  }
  set description(value) {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty)(value)) {
      this.setAttribute('description', value);
    } else {
      this.removeAttribute('description');
    }
  }
  get position() {
    return this.getAttribute('position');
  }
  set position(value) {
    if (['top', 'bottom'].includes(value)) {
      this.setAttribute('position', value);
    } else {
      this.removeAttribute('position');
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title") this.header.innerHTML = newValue;
    if (name === "description") this.section.innerHTML = newValue;
    console.log("attr changed: ", name, oldValue, newValue);
  }
  toggle(force) {
    return this.open = (0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isBoolean)(force) ? force : !this.open;
  }
}
customElements.define('foobox-caption', CaptionElement);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CaptionElement);

/***/ }),

/***/ "./src/public/foobox/modal/items/item/image/index.js":
/*!***********************************************************!*\
  !*** ./src/public/foobox/modal/items/item/image/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.scss */ "./src/public/foobox/modal/items/item/image/index.scss");
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../../utils/is */ "./src/utils/is.js");


class ImageElement extends HTMLElement {
  static get observedAttributes() {
    return ['src', 'srcset', 'zoom'];
  }
  constructor() {
    super();
    this.attachShadow({
      mode: "open"
    }).append(this.img);
  }
  #img;
  get img() {
    if (!this.#img) {
      this.#img = this.ownerDocument.createElement('img');
      this.#img.setAttribute('part', 'img');
      this.#img.setAttribute('draggable', 'false');
    }
    return this.#img;
  }
  get src() {
    return this.getAttribute('src');
  }
  set src(value) {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty)(value)) {
      this.setAttribute('src', value);
    } else {
      this.removeAttribute('src');
    }
  }
  get srcset() {
    return this.getAttribute('srcset');
  }
  set srcset(value) {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty)(value)) {
      this.setAttribute('srcset', value);
    } else {
      this.removeAttribute('srcset');
    }
  }
  get zoom() {
    return this.getAttribute('zoom');
  }
  set zoom(value) {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty)(value)) {
      this.setAttribute('zoom', value);
    } else {
      this.removeAttribute('zoom');
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src") this.img.src = newValue;
    if (name === "srcset") this.img.srcset = newValue;
    if (name === "zoom") {
      this.style.setProperty('transform', `scale(${newValue}) translateX(0px) translateY(0px)`);
    }
    console.log("attr changed: ", name, oldValue, newValue);
  }
  doZoom(scale) {
    if (this.img.complete) {
      const maxZoom = this.img.naturalWidth ? Math.max(round(this.clientWidth / this.img.naturalWidth, 5), 1) : 1;
      console.log('maxZoom', maxZoom);
      let zoom = (0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty)(newValue) ? Number.parseInt(newValue) : 1;
      zoom = Number.isNaN(zoom) ? 1 : zoom;
      let maxSize = {
        width: this.clientWidth,
        height: this.clientHeight
      };
    }
  }
  doResize(size) {
    if (this.img.complete) {
      // const restrict = this.restrict( size );
      // switch ( restrict ) {
      //     case "width":
      //         this.img.style.removeProperty( "height" );
      //         this.img.style.setProperty( "width", "100%" );
      //         break;
      //     case "height":
      //         this.img.style.removeProperty( "width" );
      //         this.img.style.setProperty( "height", "100%" );
      //         break;
      //     default:
      //         this.img.style.removeProperty( "width" );
      //         this.img.style.removeProperty( "height" );
      //         break;
      // }
    }
  }
  restrict(size) {
    if (!this.img.complete) return null;
    const {
      naturalWidth: width,
      naturalHeight: height
    } = this.img;
    const ratioX = size.width / width;
    const ratioY = size.height / height;
    console.log('restrict', size, width, height, ratioX, ratioY);
    if (ratioY < ratioX) return "height";
    if (ratioX < ratioY) return "width";
    return null;
  }
}
customElements.define('foobox-image', ImageElement);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImageElement);

/***/ }),

/***/ "./src/public/foobox/modal/items/item/index.js":
/*!*****************************************************!*\
  !*** ./src/public/foobox/modal/items/item/index.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.scss */ "./src/public/foobox/modal/items/item/index.scss");
/* harmony import */ var _utils_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../../utils/is */ "./src/utils/is.js");
/* harmony import */ var _caption__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./caption */ "./src/public/foobox/modal/items/item/caption/index.js");
/* harmony import */ var _image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./image */ "./src/public/foobox/modal/items/item/image/index.js");




class ItemElement extends HTMLElement {
  constructor() {
    super();
  }
  get type() {
    return this.getAttribute('type');
  }
  set type(value) {
    if ((0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isStringNotEmpty)(value)) {
      this.setAttribute('type', value);
    } else {
      this.removeAttribute('type');
    }
  }
  doResize(size) {
    let child;
    for (child of this.children) {
      if (!(0,_utils_is__WEBPACK_IMPORTED_MODULE_1__.isFunction)(child['doResize'])) continue;
      child.doResize(size);
    }
  }
}
customElements.define('foobox-item', ItemElement);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ItemElement);

/***/ }),

/***/ "./src/public/foobox/modal/overlay/index.js":
/*!**************************************************!*\
  !*** ./src/public/foobox/modal/overlay/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.scss */ "./src/public/foobox/modal/overlay/index.scss");

class OverlayElement extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('foobox-overlay', OverlayElement);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OverlayElement);

/***/ }),

/***/ "./src/utils/Emitter.js":
/*!******************************!*\
  !*** ./src/utils/Emitter.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "./src/utils/is.js");
/* harmony import */ var _EmitterEvent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EmitterEvent */ "./src/utils/EmitterEvent.js");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./object */ "./src/utils/object.js");




//region type-definitions

/**
 * A function that can handle an event emitted by an Emitter object.
 * @callback EmitterListener
 * @param {EmitterEvent} [event]
 * @param {...*} [args]
 */
/**
 * An object containing event type to listener mappings.
 * @typedef {object} EmitterMap
 * @example
 *  {
 *      "some-event": (event, ...args) => { },
 *      "another-event": (event, ...args) => { }
 *  }
 */
/**
 * The result of the Emitter.parseType method.
 * @typedef {object} EmitterType
 * @property {?string} [type] - The type of the event.
 * @property {?string} [namespace] - The namespace for the event.
 */
/**
 * A map of event type to namespaces.
 * @typedef {Map<string, EmitterNamespaces>} EmitterEvents
 */
/**
 * A map of namespace to listeners.
 * @typedef {Map<?string, EmitterListeners>} EmitterNamespaces
 */
/**
 * A map of listener to thisArgs
 * @typedef {Map<EmitterListener, Set<*>>} EmitterListeners
 */

//endregion

/**
 * Create a new Emitter instance.
 * @class Emitter
 * @param {EmitterEventOptions} [options] - The default options for events created by this instance.
 * @param {Emitter} [parentEmitter] - The parent emitter for this instance.
 */
class Emitter {
  //region static

  /**
   * The separator used to parse eventType strings into there component type and namespace values.
   * @type {string}
   * @default "."
   */
  static EVENT_TYPE_NAMESPACE_SEPARATOR = ".";

  /**
   * Parses the supplied event type string into its component type and namespace values.
   * @param {string} type - The event type string to parse.
   * @param {boolean} [required=false] - Whether to throw a TypeError if the parsed type is empty.
   * @returns {EmitterType}
   * @throws {TypeError} Throws a TypeError if the supplied `type` or return value is invalid.
   */
  static parseType(type, required) {
    if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(type)) {
      throw new TypeError("The 'type' argument must be a non-empty string.");
    }
    let namespace = null,
      parsedType = type;
    const n_index = type.indexOf(this.EVENT_TYPE_NAMESPACE_SEPARATOR);
    if (n_index !== -1) {
      namespace = type.slice(n_index + 1) || null;
      parsedType = type.slice(0, n_index) || null;
    }
    if (!namespace && !parsedType || !parsedType && required) {
      throw new TypeError(`Unable to parse the event type: "${type}"`);
    }
    return {
      type: parsedType,
      namespace
    };
  }

  //endregion

  //#region constructor

  /**
   * @constructs
   * @param {EmitterEventOptions} [options] - The default options for events created by this instance.
   * @param {Emitter} [parentEmitter] - The parent emitter for this instance.
   */
  constructor(options, parentEmitter) {
    this.#emitterEventDefaults = {
      ...this.#emitterEventDefaults,
      ...options
    };
    this.#parentEmitter = parentEmitter instanceof Emitter ? parentEmitter : null;
  }

  //endregion

  //region properties

  /**
   * The private field used by the __events__ read-only property.
   * @type {EmitterEvents}
   * @private
   */
  #events = new Map();

  /**
   * A map of event types to handler arrays for this instance.
   * @type {EmitterEvents}
   * @readonly
   */
  get __events__() {
    return this.#events;
  }

  /**
   * The private field used by the __emitterEventDefaults__ read-only property.
   * @type {EmitterEventOptions}
   * @private
   */
  #emitterEventDefaults = {
    bubbles: false,
    cancelable: false
  };

  /**
   * The default options for events created by this instance. Should be set through the constructor call.
   * @type {EmitterEventOptions}
   * @readonly
   */
  get __emitterEventDefaults__() {
    return this.#emitterEventDefaults;
  }

  /**
   * The private field used by the __parentEmitter__ read-only property.
   * @type {?Emitter}
   * @private
   */
  #parentEmitter = null;

  /**
   * The parent emitter for this instance.
   * @type {?Emitter}
   * @readonly
   */
  get __parentEmitter__() {
    return this.#parentEmitter;
  }

  //endregion

  /**
   * Sets up a function that will be called whenever the specified event is delivered to the target.
   * @param {string} type - A case-sensitive string representing the event type to listen for.
   * @param {EmitterListener} listener - The callback that receives a notification when an event of the specified type occurs.
   * @param {*} [thisArg] - The value of this within the listener.
   */
  #addListener(type, listener, thisArg) {
    if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(type)) throw new TypeError("The 'type' argument must be a non-empty string.");
    if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isFunction)(listener)) throw new TypeError("The 'listener' argument must be a function.");
    thisArg = thisArg ?? this;
    type.split(" ").forEach(eventType => {
      if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(eventType)) return;
      const parsed = Emitter.parseType(eventType, true);
      let namespaces = this.#events.get(parsed.type);
      if (!namespaces) this.#events.set(parsed.type, namespaces = new Map());
      let listeners = namespaces.get(parsed.namespace);
      if (!listeners) namespaces.set(parsed.namespace, listeners = new Map());
      let thisArgs = listeners.get(listener);
      if (!thisArgs) listeners.set(listener, thisArgs = new Set());
      thisArgs.add(thisArg);
    });
  }

  /**
   * Removes an event listener previously registered with Emitter.addEmitterListener
   * @param {string} type - A string which specifies the type of event for which to remove an event listener.
   * @param {EmitterListener} [listener] - The listener of the event handler to remove. If not supplied all listeners for the event type are removed.
   * @param {*} [thisArg] - The thisArg value of the event handler to remove. If not supplied all listeners that match the listener and event type are removed.
   */
  #removeListener(type, listener, thisArg) {
    if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(type)) throw new TypeError("The 'type' argument must be a non-empty string.");
    thisArg = thisArg ?? this;
    type.split(" ").forEach(eventType => {
      if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(eventType)) return;
      const parsed = Emitter.parseType(eventType);
      const types = [];
      if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(parsed.type)) {
        types.push(parsed.type);
      } else if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(parsed.namespace)) {
        for (const [type, namespaces] of this.#events) {
          if (!namespaces.has(parsed.namespace)) continue;
          types.push(type);
        }
      }
      types.forEach(type => {
        // a type was provided but doesn't exist so do nothing
        if (!this.#events.has(type)) return;
        const namespaces = this.#events.get(type);
        // a namespace was provided but doesn't exist so do nothing
        if (!namespaces.has(parsed.namespace)) return;
        if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isFunction)(listener)) {
          const listeners = namespaces.get(parsed.namespace);
          // a listener was provided but doesn't exist so do nothing
          if (!listeners.has(listener)) return;
          if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(thisArg)) {
            const thisArgs = listeners.get(listener);
            // a thisArg was provided but doesn't exist so do nothing
            if (!thisArgs.has(thisArg)) return;
            // remove just the specified thisArg for the type, namespace & listener
            thisArgs.delete(thisArg);
            // if the last thisArg was removed then remove the listener
            if (thisArgs.size === 0) listeners.delete(listener);
          } else {
            // no thisArg was provided so just remove the entire listener for the type & namespace
            listeners.delete(listener);
          }
          // if the last listener was removed then remove the namespace
          if (listeners.size === 0) namespaces.delete(parsed.namespace);
        } else {
          // no listener was provided so remove all listeners for the type & namespace
          namespaces.delete(parsed.namespace);
        }
        // if the last namespace was removed then remove the type
        if (namespaces.size === 0) this.#events.delete(type);
      });
    });
  }

  /**
   * The callback executed for each event type and listener parsed from the arguments.
   * @callback forListener~callback
   * @param {string} type
   * @param {EmitterListener} listener
   * @param {*} thisArg
   * @this {Emitter}
   */
  /**
   * Parse and iterate over the arguments supplied to the .on() and .off() methods.
   * @param {IArguments} args
   * @param {forListener~callback} callback
   * @param {*} [thisArg] - The initial value of the thisArg.
   * @private
   */
  #forListener(args, callback, thisArg) {
    if (args.length >= 2 && (0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(args[0]) && (0,_is__WEBPACK_IMPORTED_MODULE_0__.isFunction)(args[1])) {
      // dealing with (type, listener) OR (type, listener, thisArg)
      if (args.length === 3) thisArg = args[2];
      callback.call(this, args[0], args[1], thisArg);
    } else if (args.length >= 1 && (0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(args[0])) {
      // dealing with (EmitterMap) OR (EmitterMap, thisArg)
      if (args.length === 2) thisArg = args[1];
      (0,_object__WEBPACK_IMPORTED_MODULE_2__.objForEach)(args[0], (type, listener) => {
        callback.call(this, type, listener, thisArg);
      });
    }
    return this;
  }

  /**
   * Add event listeners to this instance.
   * @param {string|EmitterMap} typeOrTypeMap - A event type string or an object map of event type keys to listener values.
   * @param {EmitterListener|*} [typeListenerOrTypeMapThisArg] - If the first parameter is a string, this should be a listener function. If the first parameter is an object, this is the thisArg to bind all listeners with.
   * @param {*} [typeThisArg] - If the first parameter is a string and the second a listener, this is the thisArg to bind the listener with.
   * @returns {this}
   */
  on(typeOrTypeMap, typeListenerOrTypeMapThisArg, typeThisArg) {
    return this.#forListener(arguments, this.#addListener);
  }

  /**
   * Remove event listeners from this instance.
   * @param {string|EmitterMap} typeOrTypeMap - A event type string or an object map of event type keys to listener values.
   * @param {EmitterListener|*} [typeListenerOrTypeMapThisArg] - If the first parameter is a string, this should be a listener function. If the first parameter is an object, this is the thisArg to bind all listeners with.
   * @param {*} [typeThisArg] - If the first parameter is a string and the second a listener, this is the thisArg to bind the listener with.
   * @returns {this}
   */
  off(typeOrTypeMap, typeListenerOrTypeMapThisArg, typeThisArg) {
    return this.#forListener(arguments, this.#removeListener);
  }

  /**
   *
   * @param {EmitterEvent} event
   * @param {...*} [args]
   * @returns {boolean} Returns true if defaultPrevented was not called.
   */
  emit(event, ...args) {
    if (event instanceof _EmitterEvent__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      if (event.target === null) event.target = this;
      if (event.currenTarget !== this) event.currenTarget = this;
      const emit = namespaces => {
        if (!namespaces.has(event.namespace)) return;
        const listeners = namespaces.get(event.namespace);
        for (const [listener, thisArgs] of listeners) {
          for (const thisArg of thisArgs) {
            listener.call(thisArg, event, ...args);
          }
        }
      };
      if (this.#events.has(event.type)) {
        emit(this.#events.get(event.type));
      }
      if (this.#events.has("*")) {
        emit(this.#events.get("*"));
      }
      if (event.bubbles && !event.isPropagationStopped() && this.#parentEmitter instanceof Emitter) {
        return this.#parentEmitter.emit(event, ...args);
      }
      return !event.isDefaultPrevented();
    }
    return false;
  }

  /**
   *
   * @param {string} event
   * @param {Array} [args]
   * @param {EmitterEventOptions} [options]
   * @returns {boolean}
   */
  trigger(event, args, options) {
    if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(event)) return false;
    args = Array.isArray(args) ? args : [];
    options = (0,_object__WEBPACK_IMPORTED_MODULE_2__.defaults)(options, this.#emitterEventDefaults);
    return event.split(" ").map(type => this.emit(new _EmitterEvent__WEBPACK_IMPORTED_MODULE_1__["default"](type, options, this), ...args)).every(success => success);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Emitter);

/***/ }),

/***/ "./src/utils/EmitterEvent.js":
/*!***********************************!*\
  !*** ./src/utils/EmitterEvent.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "./src/utils/is.js");
/* harmony import */ var _Emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Emitter */ "./src/utils/Emitter.js");



//region type-definitions

/**
 * @typedef {object} EmitterEventOptions
 * @property {boolean} [bubbles=false] - Whether or not the event is bubbled.
 * @property {boolean} [cancelable=false] - Whether or not the event can be canceled using preventDefault.
 */

//endregion

/**
 * Create a new EmitterEvent instance.
 * @class EmitterEvent
 * @param {string} type - The type of the event.
 * @param {EmitterEventOptions} [options] - The options for the event.
 * @param {Emitter} [target] - The target for the event.
 * @throws {TypeError} Throws a TypeError if the supplied `type` is invalid.
 */
class EmitterEvent {
  //#region constructor

  /**
   * @constructs
   * @param {string} type - The type of the event.
   * @param {EmitterEventOptions} [options] - The options for the event.
   * @param {Emitter} [target] - The target for the event.
   * @throws {TypeError} Throws a TypeError if the supplied `type` is invalid.
   */
  constructor(type, options, target) {
    const parsed = _Emitter__WEBPACK_IMPORTED_MODULE_1__["default"].parseType(type, true);
    this.#type = parsed.type;
    this.#namespace = parsed.namespace;
    if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(options)) {
      this.#bubbles = (0,_is__WEBPACK_IMPORTED_MODULE_0__.isBoolean)(options.bubbles) ? options.bubbles : false;
      this.#cancelable = (0,_is__WEBPACK_IMPORTED_MODULE_0__.isBoolean)(options.cancelable) ? options.bubbles : false;
    }
    if (target instanceof _Emitter__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.#target = this.#currenTarget = target;
    }
  }

  //#endregion

  //#region properties

  /**
   * The private field used by the type read-only property.
   * @type {string}
   * @private
   */
  #type;
  /**
   * The type of event.
   * @type {string}
   * @readonly
   */
  get type() {
    return this.#type;
  }

  /**
   * The private field used by the namespace read-only property.
   * @type {?string}
   * @private
   */
  #namespace = null;
  /**
   * The namespace of the event.
   * @type {?string}
   * @readonly
   * @default null
   */
  get namespace() {
    return this.#namespace;
  }

  /**
   * The private field used by the bubbles read-only property.
   * @type {boolean}
   * @private
   */
  #bubbles = false;
  /**
   * Whether or not the event is bubbled.
   * @type {boolean}
   * @readonly
   * @default false
   */
  get bubbles() {
    return this.#bubbles;
  }

  /**
   * The private field used by the cancelable read-only property.
   * @type {boolean}
   * @private
   */
  #cancelable = false;
  /**
   * Whether or not the event is cancelable.
   * @type {boolean}
   * @readonly
   * @default false
   */
  get cancelable() {
    return this.#cancelable;
  }

  /**
   * The private field used by the defaultPrevented readonly property.
   * @type {boolean}
   * @private
   */
  #defaultPrevented = false;
  /**
   * Whether or not the event is cancelable and preventDefault has been called.
   * @type {boolean}
   * @readonly
   * @default false
   */
  get defaultPrevented() {
    return this.#defaultPrevented;
  }

  /**
   * The private field used by the target readonly property.
   * @type {?Emitter}
   * @private
   */
  #target = null;
  /**
   * The emitter that initially raised the event.
   * @type {?Emitter}
   * @default null
   */
  get target() {
    return this.#target;
  }

  /**
   * Set the emitter that raised the event.
   * @param {Emitter} emitterInstance
   * @throws {TypeError} Throws a TypeError if the value is not an instance of Emitter.
   */
  set target(emitterInstance) {
    if (emitterInstance instanceof _Emitter__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.#target = emitterInstance;
      return;
    }
    throw new TypeError("The EmitterEvent.target must be an instance of Emitter.");
  }

  /**
   * The private field used by the currenTarget readonly property.
   * @type {?Emitter}
   * @private
   */
  #currenTarget = null;
  /**
   * The emitter currently raising the event.
   * @type {?Emitter}
   * @default null
   */
  get currenTarget() {
    return this.#currenTarget;
  }

  /**
   * Set the emitter currently raising the event.
   * @param {Emitter} emitterInstance
   * @throws {TypeError} Throws a TypeError if the value is not an instance of Emitter.
   */
  set currenTarget(emitterInstance) {
    if (emitterInstance instanceof _Emitter__WEBPACK_IMPORTED_MODULE_1__["default"]) {
      this.#currenTarget = emitterInstance;
      return;
    }
    throw new TypeError("The EmitterEvent.currenTarget must be an instance of Emitter.");
  }

  //#endregion

  //region methods

  /**
   * Specifies the default action should not be taken. Calling this method on a non-cancelable event has no effect.
   */
  preventDefault() {
    if (!this.cancelable) return;
    this.#defaultPrevented = true;
  }

  /**
   * Whether or not the default action should not be taken.
   * @returns {boolean}
   */
  isDefaultPrevented() {
    return this.defaultPrevented;
  }
  #propagationStopped = false;
  stopPropagation() {
    this.#propagationStopped = true;
  }
  isPropagationStopped() {
    return this.#propagationStopped;
  }

  //endregion
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EmitterEvent);

/***/ }),

/***/ "./src/utils/debounce.js":
/*!*******************************!*\
  !*** ./src/utils/debounce.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), timeout);
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (debounce);

/***/ }),

/***/ "./src/utils/getResizeObserverEntrySize.js":
/*!*************************************************!*\
  !*** ./src/utils/getResizeObserverEntrySize.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
 * Gets the width and height from the ResizeObserverEntry
 * @param {ResizeObserverEntry} entry - The entry to retrieve the size from.
 * @returns {{width: Number,height: Number}}
 */
function getResizeObserverEntrySize(entry) {
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
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getResizeObserverEntrySize);

/***/ }),

/***/ "./src/utils/iasync.js":
/*!*****************************!*\
  !*** ./src/utils/iasync.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "asyncForEach": () => (/* binding */ asyncForEach),
/* harmony export */   "enqueue": () => (/* binding */ enqueue)
/* harmony export */ });
/**
 *
 * @param {function} callback
 * @param {...*} [args]
 * @returns {Promise<*>}
 */
async function doCallback(callback, ...args) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(callback(...args));
    }, 0);
  });
}

/**
 *
 * @param callback
 */
function enqueue(callback) {
  setTimeout(callback, 0);
}

/**
 *
 * @template T
 * @param {Iterable<T>} iterable
 * @param {function(T)} callback
 * @returns {Promise<void>}
 */
async function asyncForEach(iterable, callback) {
  for (const i of iterable) {
    await doCallback(callback, i);
  }
}


/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "./src/utils/is.js");
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./object */ "./src/utils/object.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  is: _is__WEBPACK_IMPORTED_MODULE_0__,
  obj: _object__WEBPACK_IMPORTED_MODULE_1__
});

/***/ }),

/***/ "./src/utils/is.js":
/*!*************************!*\
  !*** ./src/utils/is.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBoolean": () => (/* binding */ isBoolean),
/* harmony export */   "isFunction": () => (/* binding */ isFunction),
/* harmony export */   "isNumber": () => (/* binding */ isNumber),
/* harmony export */   "isObject": () => (/* binding */ isObject),
/* harmony export */   "isPlainObject": () => (/* binding */ isPlainObject),
/* harmony export */   "isPromise": () => (/* binding */ isPromise),
/* harmony export */   "isString": () => (/* binding */ isString),
/* harmony export */   "isStringNotEmpty": () => (/* binding */ isStringNotEmpty),
/* harmony export */   "isUndefined": () => (/* binding */ isUndefined)
/* harmony export */ });
/**
 * Check if the value is a boolean.
 * @param {*} value
 * @returns {boolean}
 */
function isBoolean(value) {
  return value != null && '[object Boolean]' === Object.prototype.toString.call(value);
}

/**
 * Check if the value is a function.
 * @param {*} value
 * @returns {boolean}
 */
function isFunction(value) {
  return value != null && (Object.prototype.toString.call(value) === "[object Function]" || typeof value === "function" || value instanceof Function);
}

/**
 * Check if the value is a number.
 * @param {*} value
 * @returns {boolean}
 */
function isNumber(value) {
  return value != null && '[object Number]' === Object.prototype.toString.call(value) && !isNaN(value);
}

/**
 * Check if the value is an object.
 * @param {*} value
 * @returns {boolean}
 */
function isObject(value) {
  return value != null && typeof value === "object";
}

/**
 * Check if the value is a plain object.
 * @param {*} value
 * @returns {boolean}
 */
function isPlainObject(value) {
  if (isObject(value)) {
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }
  return false;
}

/**
 * Check if the value is a promise.
 * @param {*} value
 * @returns {boolean}
 */
function isPromise(value) {
  return value != null && value instanceof Promise;
}

/**
 * Check if the value is a string.
 * @param {*} value
 * @returns {boolean}
 */
function isString(value) {
  return value != null && '[object String]' === Object.prototype.toString.call(value);
}
const isEmptyString = /^\s*$/;
/**
 * Check if the value is a string and is not empty.
 * @param {*} value
 * @returns {boolean}
 */
function isStringNotEmpty(value) {
  return isString(value) && !isEmptyString.test(value);
}

/**
 * Check if the value is a undefined.
 * @param {*} value
 * @returns {boolean}
 */
function isUndefined(value) {
  return typeof value === "undefined";
}


/***/ }),

/***/ "./src/utils/makeSelector.js":
/*!***********************************!*\
  !*** ./src/utils/makeSelector.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "./src/utils/is.js");


/**
 * If the value is a string it is returned, if it's a string array the values are joined using a comma, otherwise null is returned.
 * @param {*} value
 * @returns {?string}
 */
function makeSelector(value) {
  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(value)) {
    return value;
  }
  if (Array.isArray(value) && value.length) {
    const result = value.filter(val => (0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(val)).join(",");
    return (0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(result) ? result : null;
  }
  return null;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (makeSelector);

/***/ }),

/***/ "./src/utils/mergeArray.js":
/*!*********************************!*\
  !*** ./src/utils/mergeArray.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "./src/utils/is.js");


/**
 * @template T
 * @param {Array<T>} target
 * @param {Array<T>} source
 * @param {function(T, T):boolean} [equalityComparer]
 * @returns {Array<T>}
 */
function mergeArray(target, source, equalityComparer) {
  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isFunction)(equalityComparer)) {
    return [...target, ...source.filter(sourceValue => !target.some(targetValue => equalityComparer(targetValue, sourceValue)))];
  }
  return [...target, ...source.filter(targetValue => !target.includes(targetValue))];
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (mergeArray);

/***/ }),

/***/ "./src/utils/object.js":
/*!*****************************!*\
  !*** ./src/utils/object.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defaults": () => (/* binding */ defaults),
/* harmony export */   "extend": () => (/* binding */ extend),
/* harmony export */   "getProperty": () => (/* binding */ getProperty),
/* harmony export */   "hasProperty": () => (/* binding */ hasProperty),
/* harmony export */   "merge": () => (/* binding */ merge),
/* harmony export */   "mergeMissing": () => (/* binding */ mergeMissing),
/* harmony export */   "objForEach": () => (/* binding */ objForEach),
/* harmony export */   "objReduce": () => (/* binding */ objReduce),
/* harmony export */   "removeProperty": () => (/* binding */ removeProperty),
/* harmony export */   "setProperty": () => (/* binding */ setProperty)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "./src/utils/is.js");

function hasProperty(target, propertyName) {
  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(target) && (0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(propertyName)) {
    if (propertyName.indexOf(".") !== -1) {
      const names = propertyName.split("."),
        length = names.length,
        last = length - 1;
      let index = 0,
        currentTarget = target;
      for (; index < length; index++) {
        const name = names[index];
        if (index === last) {
          return currentTarget.hasOwnProperty(name);
        } else if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(currentTarget[name])) {
          currentTarget = currentTarget[name];
        } else {
          return false;
        }
      }
    } else {
      return target.hasOwnProperty(propertyName);
    }
  }
  return false;
}

/**
 * Remove a property from an object.
 * @param {object} target
 * @param {string} propertyName
 */
function removeProperty(target, propertyName) {
  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(target) && (0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(propertyName)) {
    if (propertyName.indexOf(".") !== -1) {
      const names = propertyName.split("."),
        length = names.length,
        last = length - 1;
      let index = 0,
        currentTarget = target;
      for (; index < length; index++) {
        const name = names[index];
        if (index === last) {
          delete currentTarget[name];
        } else if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(currentTarget[name])) {
          currentTarget = currentTarget[name];
        }
      }
    } else {
      delete target[propertyName];
    }
  }
}

/**
 * Get the value of a property from an object.
 * @param {object} target
 * @param {string} propertyName
 * @param {*} [defaultValue]
 * @returns {*}
 */
function getProperty(target, propertyName, defaultValue) {
  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(target) && (0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(propertyName)) {
    if (propertyName.indexOf(".") !== -1) {
      const names = propertyName.split("."),
        length = names.length,
        last = length - 1;
      let index = 0,
        currentTarget = target;
      for (; index < length; index++) {
        const name = names[index];
        if (index === last) {
          if (currentTarget.hasOwnProperty(name)) {
            return currentTarget[name];
          }
        } else if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(currentTarget[name])) {
          currentTarget = currentTarget[name];
        } else {
          break;
        }
      }
    } else if (target.hasOwnProperty(propertyName)) {
      return target[propertyName];
    }
  }
  return defaultValue;
}

/**
 * Set the value of a property in an object.
 * @param {object} target
 * @param {string} propertyName
 * @param {*} value
 * @returns {boolean}
 */
function setProperty(target, propertyName, value) {
  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(target) && (0,_is__WEBPACK_IMPORTED_MODULE_0__.isStringNotEmpty)(propertyName) && !(0,_is__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(value)) {
    if (propertyName.indexOf(".") !== -1) {
      const names = propertyName.split("."),
        length = names.length,
        last = length - 1;
      let index = 0,
        currentTarget = target;
      for (; index < length; index++) {
        const name = names[index];
        if (index === last) {
          currentTarget[name] = value;
          return true;
        } else if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(currentTarget[name])) {
          currentTarget = currentTarget[name];
        } else if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(currentTarget[name])) {
          currentTarget = currentTarget[name] = {};
        } else {
          break;
        }
      }
    } else {
      target[propertyName] = value;
      return true;
    }
  }
  return false;
}

/**
 * Merge the properties of the source object into the target object replacing existing values.
 * @param {object} target - The object that will receive the properties.
 * @param {object} source - The object to extract properties from.
 * @returns {object}
 */
function merge(target, source) {
  target = (0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(target) ? target : {};
  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(target) && (0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(source)) {
    objForEach(source, (key, value) => {
      if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) {
        // if the source value is an object, merge it into the target key
        target[key] = merge(target[key], value);
      } else if (Array.isArray(value)) {
        // if the source value is an array, replace the target key with a shallow copy of it
        target[key] = value.slice();
      } else {
        // otherwise replace the target key with the source value
        target[key] = value;
      }
    });
  }
  // always return the original target object
  return target;
}

/**
 * Merge the properties of all source objects into the target object replacing existing values.
 * @param {object} target
 * @param {...object} sources
 * @returns {object}
 */
function extend(target, ...sources) {
  target = (0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(target) ? target : {};
  return sources.reduce((result, source) => merge(result, source), target);
}

/**
 * Merge the properties of the source object into the target object if they do not exist.
 * @param {object} target - The object that will receive the properties.
 * @param {object} source - The object to extract properties from.
 * @returns {object}
 */
function mergeMissing(target, source) {
  target = (0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(target) ? target : {};
  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(source)) {
    objForEach(source, (key, value) => {
      const missing = !target.hasOwnProperty(key);
      if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(value)) {
        // if the source value is an object
        if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(target[key])) {
          // and the target key is an object, merge the missing source properties
          target[key] = mergeMissing(target[key], value);
        } else if (missing) {
          // otherwise if its missing, set the target key to the source value
          target[key] = merge({}, value);
        }
      } else if (missing) {
        // if its just missing and not a special case, set the target key with the missing source value
        target[key] = value;
      }
    });
  }
  // always return the original target object
  return target;
}

/**
 * Merge the properties of all source objects into the target object if they do not exist.
 * @param {object} target
 * @param {...object} sources
 * @returns {object}
 */
function defaults(target, ...sources) {
  target = (0,_is__WEBPACK_IMPORTED_MODULE_0__.isPlainObject)(target) ? target : {};
  return sources.reduce((result, source) => mergeMissing(result, source), target);
}

/**
 * @callback objForEach~callback
 * @param {string} key
 * @param {*} value
 */

/**
 * Iterates all keys of the target and executes the callback for each supplying the current key and value.
 * @param {object} target - The target object to iterate.
 * @param {objForEach~callback} callback - The callback to execute.
 */
function objForEach(target, callback) {
  if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isObject)(target)) return;
  Object.keys(target).forEach(key => {
    callback.call(this, key, target[key]);
  });
}

/**
 * A "reducer" function that can take up to four arguments.
 * @callback objReduce~callback
 * @template T
 * @param {T} previousValue - The value resulting from the previous call to the callback.
 * @param {*} value - The value of the current key.
 * @param {string} [key] - The current key of the object.
 * @param {object} [object] - The object being iterated.
 * @returns {T}
 */
/**
 * The objReduce() method executes a user-supplied “reducer” callback function on each key~value pair of the target object,
 * passing in the return value from the calculation on the preceding pair. The final result of running the reducer across
 * all key~value pairs of the target object is a single value.
 * @template T
 * @param {object} target - The object to reduce.
 * @param {objReduce~callback<T>} callbackFn - A "reducer" function that takes four arguments.
 * @param {T} [initialValue] - A value to which "previousValue" is initialized the first time the callback is called.
 * @returns {T} The value that results from running the “reducer” callback function to completion over the entire object.
 */
function objReduce(target, callbackFn, initialValue) {
  return (0,_is__WEBPACK_IMPORTED_MODULE_0__.isObject)(target) ? Object.keys(target).reduce((previousValue, key) => {
    return callbackFn.call(this, previousValue, target[key], key);
  }, initialValue) : initialValue;
}


/***/ }),

/***/ "./src/public/foobox/modal/index.scss":
/*!********************************************!*\
  !*** ./src/public/foobox/modal/index.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/public/foobox/modal/inner/index.scss":
/*!**************************************************!*\
  !*** ./src/public/foobox/modal/inner/index.scss ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/public/foobox/modal/items/index.scss":
/*!**************************************************!*\
  !*** ./src/public/foobox/modal/items/index.scss ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/public/foobox/modal/items/item/caption/index.scss":
/*!***************************************************************!*\
  !*** ./src/public/foobox/modal/items/item/caption/index.scss ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/public/foobox/modal/items/item/image/index.scss":
/*!*************************************************************!*\
  !*** ./src/public/foobox/modal/items/item/image/index.scss ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/public/foobox/modal/items/item/index.scss":
/*!*******************************************************!*\
  !*** ./src/public/foobox/modal/items/item/index.scss ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/public/foobox/modal/overlay/index.scss":
/*!****************************************************!*\
  !*** ./src/public/foobox/modal/overlay/index.scss ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"foobox": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkfoobox"] = self["webpackChunkfoobox"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/public/foobox/index.pro.js");
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	FooBox = __webpack_exports__["default"];
/******/ 	
/******/ })()
;
//# sourceMappingURL=foobox.js.map