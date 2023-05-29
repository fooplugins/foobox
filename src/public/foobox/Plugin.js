import { defaults, extend } from "../../utils/object";
import { isFunction, isNumber, isString, isStringNotEmpty } from "../../utils/is";
import { asyncForEach } from "../../utils/iasync";
import Emitter from "../../utils/Emitter";
import Parser from "./Parser";

/**
 * @extends Emitter
 */
class Plugin extends Emitter {

    constructor( configuration ) {
        super();
        this.config = defaults( configuration, this.config );
        this.on( {
            "added-container": this.#onAddedContainer,
            "removed-container": this.#onRemovedContainer,
            "updated-container": this.#onUpdatedContainer
        }, this );
    }

    //region Properties

    /**
     *
     * @type {object}
     */
    config = { __parsers__: [] };

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
    get __parsers__(){
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
    get RS_DEFAULT(){ return 0; }

    /**
     * 1 - The configuration has been set but components have not been loaded yet.
     * @readonly
     * @type {number}
     * @default 1
     */
    get RS_INITIALIZING(){ return 1; }

    /**
     * 2 - The components are loaded but long-running tasks have not been run.
     * @readonly
     * @type {number}
     * @default 2
     */
    get RS_INITIALIZED(){ return 2; }

    /**
     * 3 - Long-running tasks have completed. The plugin is now ready.
     * @readonly
     * @type {number}
     * @default 3
     */
    get RS_READY(){ return 3; }

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
    get readyState(){
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
    set #readyState( value ){
        if ( this.#readyStateValue === value ) return; // do nothing
        if ( !isNumber( value ) ) throw new TypeError( "The 'value' argument must be a number." );
        if ( value < this.#readyStateValue ) throw new RangeError( "The 'value' argument can't be less than the current readyState." );
        if ( value > this.RS_READY ) throw new RangeError( "The 'value' argument can't be more than the RS_READY value." );
        this.#readyStateValue = value;
        /**
         * Occurs whenever the readyState is changed.
         * @event Document#foobox-readystatechange
         * @param {CustomEvent} event - The readyState value can be accessed using the CustomEvent.detail property which is set to the plugin instance. e.g. event.detail.readyState
         */
        this.documentDispatch( "foobox-readystatechange" );
        /**
         * Occurs whenever the readyState is changed.
         * @event Plugin#readystatechange
         * @param {EmitterEvent} event - The basic event object.
         * @param {number} readyState - The readyState value.
         */
        this.trigger( "readystatechange", [ value ] );

        const states = [ 'evaluated', 'initializing', 'initialized', 'ready' ];
        this.documentDispatch( `foobox-${ states[ value ] }` );
        this.trigger( states[ value ] );
    }

    //#endregion

    //region Methods

    /**
     *
     * @param configuration
     */
    async init( configuration ) {
        if ( this.readyState !== this.RS_DEFAULT ) return;
        this.#readyState = this.RS_INITIALIZING;
        extend( this.config, configuration );
        this.#parsers = Parser.createAll( this, this.config.__parsers__ );
        this.#readyState = this.RS_INITIALIZED;
        await this.parseDocument( true );
        this.#readyState = this.RS_READY;
        this.observe();
    }

    /**
     * Dispatch an event on the document.
     * @param {string|Event} event - If given a string a CustomEvent is dispatched using the value as the type.
     * @param {eventOptions} [options] - Any additional options for the event. By default the detail option of CustomEvent objects created by this method is set to the plugin instance.
     * @returns {boolean}
     */
    documentDispatch( event, options ){
        /** @typedef {{bubbles:?boolean,cancelable:?boolean,composed:?boolean,detail:*}} eventOptions */
        if ( isString( event ) ){
            event = new CustomEvent( event, extend( { detail: this }, options ) );
        }
        if ( event instanceof Event ){
            return document.dispatchEvent( event );
        }
        return false;
    }

    observe(){
        if ( !this.config.watch ) return;
        if ( !this.#observer ){
            this.#observer = new MutationObserver( () => {
                this.parseDocument();
            } );
        }
        this.#observer.observe( document, { childList: true, subtree: true } );
    }

    unobserve(){
        if ( !this.config.watch || !this.#observer ) return;
        this.#observer.disconnect();
    }

    /**
     *
     * @param {string} name
     * @param {object} [configuration]
     * @param {Parser~ctor} [ctor]
     * @returns {boolean}
     */
    registerParser( name, configuration, ctor ){
        if ( this.readyState < this.RS_INITIALIZED && !this.config.hasOwnProperty( name ) ){
            const Parser_ctor = isFunction( ctor ) ? ctor : Parser;
            this.config.__parsers__.push( [ name, Parser_ctor ] );
            this.config[ name ] = extend( {}, configuration );
            return true;
        }
        return false;
    }

    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    unregisterParser( name ){
        if ( this.readyState < this.RS_INITIALIZED && this.config.hasOwnProperty( name ) ){
            this.config.__parsers__ = this.config.__parsers__.filter( ( config ) => {
                const parser = Parser.DEFINITION( config );
                return parser ? parser.name !== name : false;
            });
            delete this.config[ name ];
            return true;
        }
        return false;
    }

    /**
     * Remove any trigger listeners registered using the addTrigger method.
     * @param {?EventTarget} eventTarget
     */
    removeTriggerListener( eventTarget ){
        if ( eventTarget instanceof EventTarget && this.#triggers.has( eventTarget ) ){
            const listener = this.#triggers.get( eventTarget );
            eventTarget.removeEventListener( "click", listener, false );
            this.#triggers.delete( eventTarget );
        }
    }

    /**
     * Sets up a trigger listener on the target.
     * @param {?EventTarget} eventTarget
     * @param {Container} container
     * @param {?Item} [item]
     */
    addTriggerListener( eventTarget, container, item ){
        if ( eventTarget instanceof EventTarget ){
            if ( this.#triggers.has( eventTarget ) ){
                // if there was a listener already cached then remove it before adding the new one
                eventTarget.removeEventListener( "click", this.#triggers.get( eventTarget ), false );
            }
            const listener = ( e ) => {
                e.preventDefault();
                this.trigger( "triggered-container", [ container, item ] );
            };
            // add the listener to the internal cache, this will update the listener if it existed
            this.#triggers.set( eventTarget, listener );
            eventTarget.addEventListener( "click", listener, false );
        }
    }

    /**
     * Get all document parsers.
     * @returns {Parser[]}
     */
    getDocumentParsers(){
        return this.#parsers.filter( ( parser ) => parser.isDocumentParser );
    }

    /**
     * Try get a parser for the reference.
     * @param {*} ref
     * @returns {?Parser}
     */
    getRefParser( ref ){
        return this.#parsers.find( ( parser ) => parser.canParse( ref ) ) ?? null;
    }

    /**
     * Get all containers for this instance of the plugin.
     * @returns {Container[]}
     */
    getAll(){
        return Array.from( this.#containers.values() );
    }

    /**
     * Given a reference or selector this method attempts to return the associated container.
     * @param {*} ref
     * @return {Container|null}
     */
    find( ref ){
        if ( this.#containers.has( ref ) ){
            return this.#containers.get( ref );
        }
        if ( isStringNotEmpty( ref ) ){
            const elementRef = document.querySelector( ref );
            if ( elementRef && this.#containers.has( elementRef ) ){
                return this.#containers.get( elementRef );
            }
        }
        return null;
    }

    /**
     * Get a collection of references from all containers and items.
     * @param {*} excludeRef - A reference to exclude from the result.
     * @returns {Set<*>}
     */
    getRefs( excludeRef ){
        /** @type {Set<*>} */
        const refs = new Set();
        return this.getAll().reduce( ( result, container ) => {
            if ( container.ref !== excludeRef ){
                result.add( container.ref );
                container.items.forEach( ( item ) => {
                    if ( item.ref === excludeRef ) return;
                    result.add( item.ref );
                } );
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
    async parseDocument( nocache ){
        // if the plugin is not initialized yet return an empty array as we have no parsers to work with
        if ( this.readyState < this.RS_INITIALIZED ) return [];
        // if there is already parsing taking place simply return a reference to its promise
        if ( this.#parseDocument ) return this.#parseDocument;
        // otherwise we need to do some work
        nocache = nocache ?? false;
        return this.#parseDocument = new Promise( async ( resolve ) => {
            const results = [], handledRefs = new Set();
            await asyncForEach( this.getDocumentParsers(), async ( parser ) => {
                const containers = await parser.parseDocument( handledRefs, nocache );
                results.push( ...containers );
            });
            this.#parseDocument = null;
            resolve( results );
        });
    }

    /**
     * Parse the supplied reference object into a Container.
     * @param {*} ref - The object to parse.
     * @param {boolean} [nocache=false] - Whether to disable the parser caching for this call.
     * @returns {Container|null} Returns null if the reference object could not be parsed.
     */
    parse( ref, nocache ){
        if ( this.readyState < this.RS_INITIALIZED ) return null;
        nocache = nocache ?? false;
        const parser = this.getRefParser( ref );
        if ( parser ){
            const handledRefs = this.getRefs( ref );
            return parser.parse( ref, handledRefs, nocache );
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
    #onAddedContainer( event, container ){
        this.addTriggerListener( container.triggerTarget, container );
        container.items.forEach( ( item ) => this.addTriggerListener( item.triggerTarget, container, item ) );
        this.#containers.set( container.ref, container );
    }

    /**
     *
     * @param {EmitterEvent} event
     * @param {Container} container
     * @param {ParserChange} changes
     */
    #onUpdatedContainer( event, container, changes ){
        changes.removed.forEach( ( item ) => this.removeTriggerListener( item.triggerTarget ) );
        changes.added.forEach( ( item ) => this.addTriggerListener( item.triggerTarget, container, item ) );
        this.#containers.set( container.ref, container );
    }

    /**
     *
     * @param {EmitterEvent} event
     * @param {Container} container
     */
    #onRemovedContainer( event, container ){
        this.removeTriggerListener( container.triggerTarget );
        container.items.forEach( ( item ) => this.removeTriggerListener( item.triggerTarget ) );
        this.#containers.delete( container.ref );
    }

    //endregion
}

export default Plugin;