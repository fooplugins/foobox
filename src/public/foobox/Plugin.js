import {extend} from "../../utils/object";
import {isNumber, isString} from "../../utils/is";
import Emitter from "../../utils/Emitter";

import startTask from "../../utils/task";
/**
 * @extends Emitter
 */
class Plugin extends Emitter {

    /**
     *
     * @type {object}
     */
    config = {};

    constructor(defaults, ContainerController) {
        super();
        this.config = defaults;
        this.#containers = new ContainerController(this, "containers");
        // this.#modals = new ModalController(this);
    }

    //region Controllers

    /**
     * The private field used by the 'containers' read-only property.
     * @type {ContainerController}
     * @private
     */
    #containers;

    /**
     * Get the containers for the plugin.
     * @type {ContainerController}
     * @readonly
     */
    get containers(){
        return this.#containers;
    }

    /**
     * The private field used by the 'modals' read-only property.
     * @type {ModalController}
     * @private
     */
    #modals;

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
     * 2 - The components are loaded but long running tasks have not been run.
     * @readonly
     * @type {number}
     * @default 2
     */
    get RS_INITIALIZED(){ return 2; }

    /**
     * 3 - Long running tasks have completed. The plugin is now ready.
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
    set #readyState(value){
        if (this.#readyStateValue === value) return; // do nothing
        if (!isNumber(value)) throw new TypeError("The 'value' argument must be a number.");
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
    }

    //#endregion

    /**
     * Dispatch an event on the document.
     * @param {string|Event} event - If given a string a CustomEvent is dispatched using the value as the type.
     * @param {eventOptions} [options] - Any additional options for the event. By default the detail option of CustomEvent objects created by this method is set to the plugin instance.
     * @returns {boolean}
     */
    documentDispatch(event, options){
        /** @typedef {{bubbles:?boolean,cancelable:?boolean,composed:?boolean,detail:*}} eventOptions */
        if (isString(event)){
            event = new CustomEvent(event, extend({ detail: this }, options));
        }
        if (event instanceof Event){
            return document.dispatchEvent(event);
        }
        return false;
    }

    /**
     *
     * @param configuration
     */
    async init( configuration ) {
        if ( this.readyState !== this.RS_DEFAULT ) return;
        const task = startTask( 'foobox:init()' );
        extend( this.config, configuration );
        this.#readyState = this.RS_INITIALIZING;
        this.#containers.init();
        this.#readyState = this.RS_INITIALIZED;
        await this.#containers.parseDocument( true );
        this.#readyState = this.RS_READY;
        task.end();
    }

    registerParser(name, configuration, ctor){
        return this.#containers.registerParser(name, configuration, ctor);
    }

    async parseDocument(nocache){
        return await this.#containers.parseDocument(nocache);
    }

    parse(ref, nocache){
        return this.#containers.parse(ref, nocache);
    }
}

export default Plugin;