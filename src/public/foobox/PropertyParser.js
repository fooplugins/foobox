import {isFunction, isPlainObject, isStringNotEmpty} from "../../utils/is";
import mergeArray from "../../utils/mergeArray";

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

export default class PropertyParser {

    //#region static

    /**
     * The default convert method used by all properties. This does nothing but pass through the supplied value.
     * @param {*} value - The parsed value.
     * @param {PropertyParser} property - The property object itself.
     * @returns {*}
     */
    static DEFAULT_CONVERT( value, property ){
        return value;
    }

    /**
     * The default test method used by all properties to determine if the parsed value is valid.
     * @param {*} value - The parsed value.
     * @param {PropertyParser} property - The property object itself.
     * @returns {boolean}
     */
    static DEFAULT_TEST( value, property ){
        return value != null && value !== property.defaultValue;
    }

    /**
     *
     * @param {propertyParserDefinition} configuration
     * @returns {?PropertyParserDefinition}
     */
    static DEFINITION( configuration ){
        if ( isPlainObject( configuration ) ){
            return { configuration: /** @type PropertyParser~Configuration */ configuration, ctor: /** @type PropertyParser~ctor */ PropertyParser };
        }
        if ( Array.isArray( configuration ) && configuration.length === 2 && isPlainObject( configuration[0] ) && isFunction( configuration[1] ) ){
            return { configuration: configuration[0], ctor: configuration[1] };
        }
        return null;
    }

    /**
     * Merges all property definitions from the source into the target, properties are compared by name.
     * @param {propertyParserDefinition[]} target - The target array to push definitions into.
     * @param {propertyParserDefinition[]} source - The source array to pull definitions from.
     * @returns {propertyParserDefinition[]}
     */
    static MERGE_DEFINITIONS( target, source ){
        return mergeArray( target, source, ( targetDefinition, sourceDefinition ) => {
            const targetDef = PropertyParser.DEFINITION( targetDefinition ),
                sourceDef = PropertyParser.DEFINITION( sourceDefinition );
            if ( !targetDef || !sourceDef ) return false;
            return targetDef.configuration.name === sourceDef.configuration.name;
        });
    }

    /**
     *
     * @param {TypeParser} typeParser
     * @param {propertyParserDefinition} definition
     * @returns {?PropertyParser}
     */
    static create( typeParser, definition ){
        const def = PropertyParser.DEFINITION( definition );
        return def ? new def.ctor( typeParser, def.configuration ) : null;
    }

    /**
     *
     * @param {TypeParser} typeParser
     * @param {propertyParserDefinition[]} propertyParserDefinitions
     * @returns {PropertyParser[]}
     */
    static createAll( typeParser, propertyParserDefinitions ){
        return propertyParserDefinitions.reduce( ( result, definition ) => {
            const propertyParser = PropertyParser.create( typeParser, definition );
            if ( propertyParser ) result.push( propertyParser );
            return result;
        },/** @type {PropertyParser[]} */ [] );
    }

    /**
     *
     * @param {*} ref
     * @param {PropertyParser[]} properties
     * @param {boolean} [nocache=false]
     * @returns {?object}
     */
    static getValues( ref, properties, nocache ){
        const result = {};
        for ( const property of properties ){
            const value = property.getValue( ref, nocache );
            if ( property.required && !property.test( value ) ){
                // if there is a required property that is not supplied then stop parsing and exit early
                return null;
            } else {
                result[ property.name ] = value;
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
    constructor( typeParser, configuration ) {
        this.#typeParser = typeParser;
        this.#name = configuration.name;
        this.required = configuration.required ?? false;
        this.defaultValue = configuration.defaultValue ?? null;
        this.#convert = configuration.convert ?? PropertyParser.DEFAULT_CONVERT;
        this.#test = configuration.test ?? PropertyParser.DEFAULT_TEST;
        this.queryParent = configuration.queryParent ?? "^";
        this.queryPath = configuration.queryPath ?? "/";
        this.queryType = configuration.queryType ?? ":";
        if ( Array.isArray( configuration.obj ) ){
            this.obj = configuration.obj.map( ( query ) => this.objectQuery( query ) ).filter( ( query ) => query != null);
        }
        if ( Array.isArray( configuration.elem ) ){
            this.elem = configuration.elem.map( ( query ) => this.elementQuery( query ) ).filter( ( query ) => query != null);
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
    get typeParser(){
        return this.#typeParser;
    }

    get parser(){
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
    get name(){
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
    objectQuery( query ){
        /**
         * @typedef {PropertyQuery} ObjectQuery
         * @property {string[]} path
         */
        if ( isStringNotEmpty( query ) ){
            let name = query, path = [];
            if ( name.indexOf( this.queryPath ) !== -1 ){
                const parts = name.split( this.queryPath );
                name = parts.pop();
                path.push( parts );
            }
            const target = ( ref ) => {
                let result = ref;
                for ( const part of path ){
                    result = result[ part ];
                    if ( !result ) break;
                }
                return result ?? null;
            };
            return {
                raw: query,
                name,
                path,
                getValue: ( ref ) => {
                    const targetRef = target( ref );
                    if ( targetRef ){
                        return this.convert( targetRef[ name ] ) ?? this.defaultValue;
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
    elementQuery( query ){
        /**
         * @typedef {PropertyQuery} ElementQuery
         * @property {number} parents
         * @property {?string} selector
         */
        if ( isStringNotEmpty( query ) ){
            let name = query, parents = 0, selector = null, type = "prop";
            while ( name[0] === this.queryParent ){
                parents++;
                name = name.slice(1);
            }
            if ( name.indexOf( this.queryPath ) !== -1 ){
                const parts = name.split( this.queryPath );
                selector = parts[0];
                name = parts[1];
            }
            if ( name.indexOf( this.queryType ) !== -1 ){
                const parts = name.split( this.queryType );
                type = parts[0];
                name = parts[1];
            }
            const target = ( ref ) => {
                let result = ref;
                for ( let i = 0; i < parents; i++ ){
                    result = result.parentElement;
                    if ( !result ) break;
                }
                return result && selector ? result.querySelector( selector ) : result;
            };
            let getValue;
            switch ( type ){
                case "prop":
                    getValue = ( ref ) => { return this.convert( ref[ name ] ) ?? this.defaultValue; };
                    break;
                case "data":
                    getValue = ( ref ) => { return this.convert( ref.dataset[ name ] ) ?? this.defaultValue; };
                    break;
                case "attr":
                    getValue = ( ref ) => { return ref.hasAttribute( name ) ? this.convert( ref.getAttribute( name ) ) : this.defaultValue; };
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
                getValue: ( ref ) => {
                    const targetRef = target( ref );
                    if ( targetRef ){
                        return getValue( targetRef );
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
    getValue( ref, nocache ){
        if ( !nocache && this.#cache.has( ref ) ){
            return this.#cache.get( ref );
        }
        let result = this.defaultValue, query;
        if ( ref instanceof HTMLElement ){
            for ( query of this.elem ){
                const value = query.getValue( ref );
                if ( this.test( value ) ){
                    result = value;
                    break;
                }
            }
        } else if ( isPlainObject( ref ) ){
            for ( query of this.obj ){
                const value = query.getValue( ref );
                if ( this.test( value ) ){
                    result = value;
                    break;
                }
            }
        }
        const prop = { name: this.name, type: this.typeParser.name, value: result, query, ref };
        this.parser.trigger( 'get-property', [ prop ] );
        this.#cache.set( ref, prop.value );
        return prop.value;
    }

    convert(value){
        return this.#convert( value, this );
    }

    test(value){
        return this.#test( value, this );
    }
}