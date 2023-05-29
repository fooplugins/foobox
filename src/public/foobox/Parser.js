import {objReduce} from "../../utils/object";
import {isFunction, isPlainObject, isStringNotEmpty} from "../../utils/is";
import makeSelector from "../../utils/makeSelector";
import Emitter from "../../utils/Emitter";
import {asyncForEach} from "../../utils/iasync";
import TypeParser from "./TypeParser";
import Container from "./Container";

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

export const PARSER_DEFAULTS = {
    __types__: ["image","iframe"],
    priority: 49,
    include: [".foobox,[data-foobox],[data-foobox-items]"],
    exclude: [".nolightbox"],
    data: {
        options: "foobox",
        items: "fooboxItems",
    },
    defaultProperties: [{
        name: "src",
        obj: ["src","url","href"],
        elem: ["data:src","data:href","data:url","href"],
        required: true,
        test: isStringNotEmpty
    },{
        name: "title",
        obj: ["title"],
        elem: ["data:title", "title", "img/title"],
        test: isStringNotEmpty
    },{
        name: "description",
        obj: ["description"],
        elem: ["data:description", "img/alt"],
        test: isStringNotEmpty
    },{
        name: "width",
        obj: ["width"],
        elem: ["data:width"]
    },{
        name: "height",
        obj: ["height"],
        elem: ["data:height"]
    },{
        name: "aspectRatio",
        obj: ["aspectRatio"],
        elem: ["data:aspectRatio"]
    }],
    image: {
        priority: 10,
        include: [
            "[href^='http'][href*='.svg']",
            "[href^='http'][href*='.png']",
            "[href^='http'][href*='.jpg']",
            "[href^='http'][href*='.jpeg']",
            "[href^='http'][href*='.webp']",
            "[href^='http'][href*='.gif']",
            "[href^='http'][href*='.bmp']",
            "[href^='http'][href*='fakeimg.pl']",
            "[href^='http'].foobox-image"
        ],
        exclude: [],
        properties: [{
            name: "srcset",
            obj: ["srcset"],
            elem: ["data:srcset"],
            test: isStringNotEmpty
        }]
    },
    iframe: {
        priority: 20,
        include: [
            "[href^='http'][target='foobox']",
            "[href^='http'].foobox-iframe"
        ],
        exclude: []
    }
};

export const PARSER_DEFAULTS_PRO = {
    ...PARSER_DEFAULTS,
    __types__: [
        ...PARSER_DEFAULTS.__types__,
        "video"
    ],
    video: {
        priority: 15,
        include: [
            "[href^='http'][href*='youtube.com/watch']",
            "[href^='http'][href*='youtube.com/v']",
            "[href^='http'][href*='youtube.com/embed']",
            "[href^='http'][href*='youtube-nocookie.com/watch']",
            "[href^='http'][href*='youtube-nocookie.com/v']",
            "[href^='http'][href*='youtube-nocookie.com/embed']",
            "[href^='http'][href*='youtu.be/']",
            "[href^='http'][href*='vimeo.com/']:not([href*='vimeo.com/user'])",
            "[href^='http'][href*='.mp4']",
            "[href^='http'][href*='.ogv']",
            "[href^='http'][href*='.wmv']",
            "[href^='http'][href*='.webm']"
        ],
        properties: [{
            name: "cover",
            obj: ["cover"],
            elem: ["data:cover"],
            test: isStringNotEmpty
        }]
    }
};

/**
 * The base parser class.
 * @class
 */
export default class Parser extends Emitter {

    //region static

    /**
     * @param {parserDefinition} configuration
     * @returns {?ParserDefinition}
     */
    static DEFINITION( configuration ){
        if ( isStringNotEmpty( configuration ) ){
            return { name: /** @type string */ configuration, ctor: /** @type Parser~ctor */ Parser };
        }
        if ( Array.isArray( configuration ) && configuration.length === 2 && isStringNotEmpty( configuration[0] ) && isFunction( configuration[1] ) ){
            return { name: configuration[0], ctor: configuration[1] };
        }
        return null;
    }

    /**
     *
     * @param {Plugin} plugin
     * @param {parserDefinition} definition
     * @returns {?Parser}
     */
    static create( plugin, definition ){
        const def = Parser.DEFINITION( definition );
        return def ? new def.ctor( plugin, def.name ) : null;
    }

    /**
     *
     * @param {Plugin} plugin
     * @param {parserDefinition[]} parserDefinitions
     * @returns {Parser[]}
     */
    static createAll( plugin, parserDefinitions ){
        return parserDefinitions.reduce( ( result, config ) => {
            const parser = Parser.create( plugin, config );
            if ( parser ) result.push( parser );
            return result;
        },/** @type {Parser[]} */ [] ).sort( ( a, b ) => a.priority - b.priority );
    }

    //endregion

    //region constructor

    /**
     * Create a new instance of the Parser class.
     * @param {Plugin} plugin - The parent for this instance.
     * @param {string} name - The name the parser was registered with.
     */
    constructor( plugin, name ) {
        super( { bubbles: true }, plugin );
        this.#plugin = plugin;
        this.#name = name;
        this.#priority = this.config.priority;
        this.#includeSelector = makeSelector( this.config.include );
        this.#excludeSelector = makeSelector( this.config.exclude );
        this.#types = TypeParser.createAll( this, this.config.__types__ );
        this.#typesSelector = makeSelector( this.#types.map( ( type ) => type.includeSelector ) );
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
    get plugin(){
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
    get name(){
        return this.#name;
    }

    /**
     * The current parser configuration.
     * @type {Parser~Configuration}
     * @readonly
     */
    get config(){
        if ( isPlainObject( this.plugin.config[ this.name ] ) ){
            return this.plugin.config[ this.name ];
        }
        return this.plugin.config[ this.name ] = { __types__: [] };
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
    get typesSelector(){
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
    get isDocumentParser(){ return true; }

    //endregion

    //region methods

    /**
     * Checks if the supplied reference is included by this instance.
     * NOTE: This DOES NOT check for exclusions! Use the canParse method if you want to check if a reference is both included AND NOT excluded.
     * @param {*} ref - The object to test.
     * @returns {boolean}
     */
    includes( ref ){
        if ( ref instanceof HTMLElement ){
            return this.includeSelector !== null && ref.matches( this.includeSelector );
        }
        return false;
    }

    /**
     * Checks if the supplied reference is excluded by this instance.
     * @param {*} ref - The object to test.
     * @returns {boolean}
     */
    excludes( ref ){
        if ( ref instanceof HTMLElement ){
            return this.excludeSelector !== null && ref.matches( this.excludeSelector );
        }
        return false;
    }

    /**
     * Checks if the supplied reference can be parsed by this instance.
     * @param {*} ref - The object to test.
     * @returns {boolean}
     */
    canParse( ref ){
        return this.includes( ref ) && !this.excludes( ref );
    }

    /**
     * Gets any configured data for an element reference.
     * @param {HTMLElement} ref
     * @param {boolean} [nocache=false]
     * @returns {Object}
     */
    data( ref, nocache ){
        if ( !nocache && this.#dataCache.has( ref ) ){
            return this.#dataCache.get( ref );
        }
        const dataConfig = this.config.data;
        const result = objReduce( dataConfig, ( result, dataName, key ) => {
            if ( isStringNotEmpty( dataName ) && ref.dataset.hasOwnProperty( dataName ) ){
                let data;
                try {
                    data = JSON.parse( ref.dataset[ dataName ] );
                } catch ( err ) {
                    console.error( `Invalid dataset.${dataName} JSON string supplied.`, ref.dataset, dataName, err );
                    data = null; // cache a null for errors so they will only be triggered again when the cache is flushed
                } finally {
                    result[ key ] = data;
                }
            } else {
                result[ key ] = null;
            }
            return result;
        }, {} );
        this.#dataCache.set( ref, result );
        return result;
    }

    /**
     * Parses the document and returns an array of new Containers.
     * @param {Set<*>} [handledRefs] - A collection of all references already handled by the plugin.
     * @param {boolean} [nocache=false] - If set to true any internal caching mechanisms are ignored and subsequently updated with freshly parsed values.
     * @returns {Promise<Container[]>}
     */
    async parseDocument( handledRefs, nocache ){
        const results = [];
        for ( const selector of this.config.include ){
            await asyncForEach( document.querySelectorAll( selector ), ( ref ) => {
                if ( handledRefs.has(ref) || this.excludes( ref ) ) return;
                const container = this.parse( ref, handledRefs, nocache );
                if ( !container ) return;
                results.push( container );
                handledRefs.add( ref );
            });
        }
        this.purgeCache( results );
        return results;
    }

    /**
     * Purges the internal cache given the results of the last parseDocument call.
     * @param {Container[]} results
     */
    purgeCache( results ){
        for ( const container of this.#containerCache.values() ){
            if ( !results.includes( container ) || this.shouldPurge( container ) ){
                this.#containerCache.delete( container.ref );
                this.trigger( "removed-container", [ container ] );
            }
        }
    }

    /**
     * Check if a container should be purged from cache.
     * @param {Container} container
     * @returns {boolean}
     */
    shouldPurge( container ){
        return false;
    }

    /**
     *
     * @param {*} ref
     * @param {boolean} [nocache=false]
     * @returns {{itemRefs:Iterable, options:object, trigger:?EventTarget}}
     */
    getArgs( ref, nocache ){
        let trigger = null, itemRefs = [], options = {};
        if ( ref instanceof HTMLElement ){
            const data = this.data( ref, nocache );
            if ( isPlainObject( data.options ) ){
                options = data.options;
            }
            if ( Array.isArray( data.items ) ){
                trigger = ref;
                itemRefs.push( ...data.items );
            } else {
                if ( ref.matches( this.typesSelector ) ){
                    itemRefs.push( ref );
                }
                itemRefs.push( ...ref.querySelectorAll( this.typesSelector ) );
            }
        }
        return { options, itemRefs, trigger };
    }

    /**
     * Create a new container
     * @param {*} ref
     * @param {object} [options]
     * @param {?EventTarget} [trigger]
     * @returns {?Container}
     */
    create( ref, options, trigger ){
        if ( ref instanceof HTMLElement ){
            return new Container( this, ref, options, trigger );
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
    parse( ref, handledRefs, nocache ){
        const { itemRefs, options, trigger } = this.getArgs( ref, nocache );
        let container, cached = false;
        if ( this.#containerCache.has( ref ) ){
            container = this.#containerCache.get( ref );
            cached = true;
        } else {
            container = this.create( ref, options, trigger );
        }
        if ( container instanceof Container ){
            const items = this.parseItems( container, itemRefs, handledRefs, nocache );
            if ( cached ){
                // compare items
                const changes = this.compareItems( items, container.items );
                container.items.length = 0;
                container.items.push( ...items );
                if ( changes.added.length > 0 || changes.removed.length > 0 ){
                    this.trigger( "updated-container", [ container, changes ] );
                }
            } else {
                container.items.push( ...items );
                this.trigger( "added-container", [ container ] );
            }
            this.#containerCache.set( ref, container );
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
    parseItems( parent, refs, handledRefs, nocache ){
        const results = [];
        for ( const ref of refs ){
            if ( handledRefs.has( ref ) || this.excludes( ref ) ) continue;
            const item = this.parseItem( parent, ref, nocache );
            if ( !item ) continue;
            results.push( item );
            handledRefs.add( ref );
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
    parseItem( parent, ref, nocache  ){
        const type = this.#types.find( ( type ) => type.canParse( ref ) );
        return type ? type.parse( parent, ref, nocache ) : null;
    }

    /**
     * Compares a containers current items against its cached items and reports any changes.
     * @param {Item[]} current
     * @param {Item[]} cached
     * @returns {ParserChange}
     */
    compareItems( current, cached ){
        const removed = cached.filter( ( item ) => !current.includes( item ) );
        const added = current.filter( ( item ) => !cached.includes( item ) );
        return { removed, added };
    }

    //endregion
}