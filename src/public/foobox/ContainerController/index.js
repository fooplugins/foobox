import {defaults, extend} from "../../../utils/object";
import {asyncForEach} from "../../../utils/iasync";
import {isFunction, isPlainObject} from "../../../utils/is";
import Parser from "./Parser";
import Emitter from "../../../utils/Emitter";

//region type-definitions

/**
 * @typedef {object} ContainerController~Configuration
 * @property {parserDefinition[]} [__parsers__]
 */

//endregion

/**
 * Create a new instance of the ContainerController.
 * @extends Emitter
 * @param {Plugin} parent - A reference to the parent plugin controller.
 */
class ContainerController extends Emitter {

    //region constructor

    /**
     * Create a new instance of the ContainerController.
     * @constructs
     * @param {Plugin} plugin - A reference to the parent plugin controller.
     * @param {string} name - The name the containers were registered with.
     */
    constructor(plugin, name) {
        super({bubbles: true}, plugin);
        this.#plugin = plugin;
        this.#name = name;
        defaults(this.config, this.defaults);
        this.on({
            "added-container": this.#onAddedContainer,
            "removed-container": this.#onRemovedContainer,
            "updated-container": this.#onUpdatedContainer
        }, this);
    }

    //endregion

    //region properties

    /**
     * The private field used by the 'name' read-only property.
     * @type {string}
     * @private
     */
    #name;

    /**
     * Get the name of the component.
     * @type {string}
     * @readonly
     */
    get name(){
        return this.#name;
    }

    /**
     * The private field used by the 'plugin' read-only property.
     * @type {Plugin}
     * @private
     */
    #plugin;

    /**
     * Get the plugin instance.
     * @type {Plugin}
     * @readonly
     */
    get plugin(){
        return this.#plugin;
    }

    /**
     * Get the default containers configuration.
     * @type {ContainerController~Configuration}
     * @readonly
     */
    get defaults(){
        return {
            __parsers__: []
        };
    }

    /**
     * Get the containers configuration.
     * @type {ContainerController~Configuration}
     * @readonly
     */
    get config(){
        if (isPlainObject(this.plugin.config[this.name])){
            return this.plugin.config[this.name];
        }
        return this.plugin.config[this.name] = {};
    }

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

    //region methods

    /**
     * Initializes the container controller.
     */
    init(){
        if (this.plugin.readyState !== this.plugin.RS_INITIALIZING) return;
        this.#parsers = Parser.createAll(this, this.config.__parsers__);
    }

    /**
     *
     * @param {string} name
     * @param {object} [configuration]
     * @param {Parser~ctor} [ctor]
     * @returns {boolean}
     */
    registerParser(name, configuration, ctor){
        if (this.plugin.readyState < this.plugin.RS_INITIALIZED && !this.config.hasOwnProperty(name)){
            const Parser_ctor = isFunction(ctor) ? ctor : Parser;
            this.config.__parsers__.push([name, Parser_ctor]);
            this.config[name] = extend({}, configuration);
            return true;
        }
        return false;
    }

    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    unregisterParser(name){
        if (this.plugin.readyState < this.plugin.RS_INITIALIZED && this.config.hasOwnProperty(name)){
            this.config.__parsers__ = this.config.__parsers__.filter((config) => {
                const parser = Parser.DEFINITION(config);
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
    removeTriggerListener(eventTarget){
        if (eventTarget instanceof EventTarget && this.#triggers.has(eventTarget)){
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
    addTriggerListener(eventTarget, container, item){
        if (eventTarget instanceof EventTarget){
            if (this.#triggers.has(eventTarget)){
                // if there was a listener already cached then remove it before adding the new one
                eventTarget.removeEventListener("click", this.#triggers.get(eventTarget), false);
            }
            const listener = (e) => {
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
    getDocumentParsers(){
        return this.#parsers.filter((parser) => parser.isDocumentParser);
    }

    /**
     * Try get a parser for the reference.
     * @param {*} ref
     * @returns {?Parser}
     */
    getRefParser(ref){
        return this.#parsers.find((parser) => parser.canParse(ref)) ?? null;
    }

    /**
     * Get all containers for this instance of the plugin.
     * @returns {Container[]}
     */
    getAll(){
        return Array.from(this.#containers.values());
    }

    /**
     * Get a collection of references from all containers and items.
     * @param {*} excludeRef - A reference to exclude from the result.
     * @returns {Set<*>}
     */
    getRefs(excludeRef){
        /** @type {Set<*>} */
        const refs = new Set();
        return this.getAll().reduce((result, container) => {
            if (container.ref !== excludeRef){
                result.add(container.ref);
                container.items.forEach((item) => {
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
     * @param {boolean} [nocache=false] - Whether or not to disable the parser cache for this call.
     * @returns {Promise<Container[]>} Returns an empty array if no Containers were parsed.
     */
    async parseDocument(nocache){
        // if the plugin is not initialized yet return an empty array as we have no parsers to work with
        if (this.plugin.readyState < this.plugin.RS_INITIALIZED) return [];
        // if there is already parsing taking place simply return a reference to its promise
        if (this.#parseDocument) return this.#parseDocument;
        // otherwise we need to do some work
        nocache = nocache ?? false;
        return this.#parseDocument = new Promise(async (resolve) => {
            const results = [], handledRefs = new Set();
            await asyncForEach(this.getDocumentParsers(), async (parser) => {
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
     * @param {boolean} [nocache=false] - Whether or not to disable the parser caching for this call.
     * @returns {?Container} Returns null if the reference object could not be parsed.
     */
    parse(ref, nocache){
        if (this.plugin.readyState < this.plugin.RS_INITIALIZED) return null;
        nocache = nocache ?? false;
        const parser = this.getRefParser(ref);
        if (parser){
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
    #onAddedContainer(event, container){
        this.addTriggerListener(container.triggerTarget, container);
        container.items.forEach((item) => this.addTriggerListener(item.triggerTarget, container, item));
        this.#containers.set(container.ref, container);
    }

    /**
     *
     * @param {EmitterEvent} event
     * @param {Container} container
     * @param {ParserChange} changes
     */
    #onUpdatedContainer(event, container, changes){
        changes.removed.forEach((item) => this.removeTriggerListener(item.triggerTarget));
        changes.added.forEach((item) => this.addTriggerListener(item.triggerTarget, container, item));
        this.#containers.set(container.ref, container);
    }

    /**
     *
     * @param {EmitterEvent} event
     * @param {Container} container
     */
    #onRemovedContainer(event, container){
        this.removeTriggerListener(container.triggerTarget);
        container.items.forEach((item) => this.removeTriggerListener(item.triggerTarget));
        this.#containers.delete(container.ref);
    }

    //endregion
}

export default ContainerController;