import {isFunction, isPlainObject, isStringNotEmpty} from "../../../../../utils/is";
import {defaults} from "../../../../../utils/object";
import makeSelector from "../../../../../utils/makeSelector";
import Item from "../../Container/Item";
import PropertyParser from "./PropertyParser";

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
    static DEFINITION(configuration){
        if (isStringNotEmpty(configuration)){
            return { name: /** @type string */ configuration, ctor: /** @type TypeParser~ctor */ TypeParser };
        }
        if (Array.isArray(configuration) && configuration.length === 2 && isStringNotEmpty(configuration[0]) && isFunction(configuration[1])){
            return { name: configuration[0], ctor: configuration[1] };
        }
        return null;
    }

    /**
     *
     * @param {Parser} parser
     * @param {typeParserDefinition} definition
     * @returns {?TypeParser}
     */
    static create(parser, definition){
        const def = TypeParser.DEFINITION(definition);
        return def ? new def.ctor(parser, def.name) : null;
    }

    /**
     *
     * @param {Parser} parser
     * @param {typeParserDefinition[]} typeParserDefinitions
     * @returns {TypeParser[]}
     */
    static createAll(parser, typeParserDefinitions){
        return typeParserDefinitions.reduce((result, config) => {
            const typeParser = TypeParser.create(parser, config);
            if (typeParser) result.push(typeParser);
            return result;
        },/** @type {TypeParser[]} */ []).sort((a, b) => a.priority - b.priority);
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
        defaults(this.config, this.defaults);
        this.#includeSelector = makeSelector(this.config.include);
        this.#excludeSelector = makeSelector(this.config.exclude);
        this.#properties = PropertyParser.createAll(this, PropertyParser.MERGE_DEFINITIONS(this.config.properties, this.parser.config.defaultProperties));
        this.#requiredProperties = this.properties.filter((property) => property.required);
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
    get parser(){
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
    get name(){
        return this.#name;
    }

    /**
     * Get the default type parser configuration.
     * @type {TypeParser~Configuration}
     * @readonly
     */
    get defaults(){
        return {
            priority: 0,
            include: [],
            exclude: [],
            properties: [],
        };
    }

    /**
     * Get the parser configuration.
     * @type {TypeParser~Configuration}
     * @readonly
     */
    get config(){
        if (isPlainObject(this.parser.config[this.name])){
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
    get priority(){
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
    get includeSelector(){
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
    get excludeSelector(){
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
    get properties(){
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
    get requiredProperties(){
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
    includes(ref){
        if (ref instanceof HTMLElement){
            return this.includeSelector !== null && ref.matches(this.includeSelector);
        }
        if (isPlainObject(ref)){
            return ref.type === this.name;
        }
        return false;
    }

    /**
     * Checks if the supplied reference is excluded by this instance.
     * @param {*} ref - The object to test.
     * @returns {boolean}
     */
    excludes(ref){
        if (ref instanceof HTMLElement){
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

    create(parent, ref, trigger){
        if (ref instanceof HTMLElement || isPlainObject(ref)){
            return new Item(parent, this, ref, trigger);
        }
        return null;
    }

    /**
     * Parses the supplied reference object and returns a new ParserItem.
     * @param {Container} parent - The parent container.
     * @param {*} ref - The object to parse.
     * @param {boolean} [nocache=false] - Whether or not to ignore any cached values when parsing the item.
     * @returns {?Item} Returns null if parsing fails.
     */
    parse(parent, ref, nocache){
        let item;
        if (this.#cache.has(ref)){
            item = this.#cache.get(ref);
        } else {
            item = this.create(parent, ref, this.getTrigger(ref));
        }
        if (item instanceof Item){
            const properties = this.getRequiredProperties(ref, nocache);
            if (!properties){
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
    getTrigger(ref){
        return ref instanceof HTMLElement ? ref : null;
    }

    getRequiredProperties(ref, nocache){
        if (!nocache && this.#requiredPropertyCache.has(ref)){
            return this.#requiredPropertyCache.get(ref);
        }
        const properties = PropertyParser.getValues(ref, this.requiredProperties, nocache);
        this.#requiredPropertyCache.set(ref, properties);
        return properties;
    }

    getProperties(ref, nocache){
        if (!nocache && this.#propertyCache.has(ref)){
            return this.#propertyCache.get(ref);
        }
        const properties = PropertyParser.getValues(ref, this.properties, nocache);
        this.#propertyCache.set(ref, properties);
        return properties;
    }
}

export default TypeParser;