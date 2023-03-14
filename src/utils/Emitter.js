import {isFunction, isPlainObject, isStringNotEmpty, isUndefined} from "./is";
import EmitterEvent from "./EmitterEvent";
import {defaults, objForEach} from "./object";

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
     * @param {boolean} [required=false] - Whether or not to throw a TypeError if the parsed type is empty.
     * @returns {EmitterType}
     * @throws {TypeError} Throws a TypeError if the supplied `type` or return value is invalid.
     */
    static parseType(type, required){
        if (!isStringNotEmpty(type)) {
            throw new TypeError("The 'type' argument must be a non-empty string.");
        }
        let namespace = null, parsedType = type;
        const n_index = type.indexOf(this.EVENT_TYPE_NAMESPACE_SEPARATOR);
        if (n_index !== -1){
            namespace = type.slice(n_index + 1) || null;
            parsedType = type.slice(0, n_index) || null;
        }
        if ((!namespace && !parsedType) || (!parsedType && required)){
            throw new TypeError(`Unable to parse the event type: "${type}"`);
        }
        return { type: parsedType, namespace };
    }

    //endregion

    //#region constructor

    /**
     * @constructs
     * @param {EmitterEventOptions} [options] - The default options for events created by this instance.
     * @param {Emitter} [parentEmitter] - The parent emitter for this instance.
     */
    constructor(options, parentEmitter) {
        this.#emitterEventDefaults = {...this.#emitterEventDefaults, ...options};
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
    get __events__(){
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
    get __emitterEventDefaults__(){
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
    get __parentEmitter__(){
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
        if (!isStringNotEmpty(type)) throw new TypeError("The 'type' argument must be a non-empty string.");
        if (!isFunction(listener)) throw new TypeError("The 'listener' argument must be a function.");
        thisArg = thisArg ?? this;
        type.split(" ").forEach((eventType) => {
            if (!isStringNotEmpty(eventType)) return;
            const parsed = Emitter.parseType(eventType, true);
            let namespaces = this.#events.get(parsed.type);
            if (!namespaces) this.#events.set(parsed.type, (namespaces = new Map()));
            let listeners = namespaces.get(parsed.namespace);
            if (!listeners) namespaces.set(parsed.namespace, (listeners = new Map()));
            let thisArgs = listeners.get(listener);
            if (!thisArgs) listeners.set(listener, (thisArgs = new Set()));
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
        if (!isStringNotEmpty(type)) throw new TypeError("The 'type' argument must be a non-empty string.");
        thisArg = thisArg ?? this;
        type.split(" ").forEach((eventType) => {
            if (!isStringNotEmpty(eventType)) return;
            const parsed = Emitter.parseType(eventType);
            const types = [];
            if (isStringNotEmpty(parsed.type)) {
                types.push(parsed.type);
            } else if (isStringNotEmpty(parsed.namespace)) {
                for (const [type, namespaces] of this.#events){
                    if (!namespaces.has(parsed.namespace)) continue;
                    types.push(type);
                }
            }
            types.forEach((type) => {
                // a type was provided but doesn't exist so do nothing
                if (!this.#events.has(type)) return;
                const namespaces = this.#events.get(type);
                // a namespace was provided but doesn't exist so do nothing
                if (!namespaces.has(parsed.namespace)) return;
                if (isFunction(listener)){
                    const listeners = namespaces.get(parsed.namespace);
                    // a listener was provided but doesn't exist so do nothing
                    if (!listeners.has(listener)) return;
                    if (!isUndefined(thisArg)){
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
    #forListener(args, callback, thisArg){
        if (args.length >= 2 && isStringNotEmpty(args[0]) && isFunction(args[1])) {
            // dealing with (type, listener) OR (type, listener, thisArg)
            if (args.length === 3) thisArg = args[2];
            callback.call(this, args[0], args[1], thisArg);
        } else if (args.length >= 1 && isPlainObject(args[0])) {
            // dealing with (EmitterMap) OR (EmitterMap, thisArg)
            if (args.length === 2) thisArg = args[1];
            objForEach(args[0], (type, listener) => {
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
    on(typeOrTypeMap, typeListenerOrTypeMapThisArg, typeThisArg){
        return this.#forListener(arguments, this.#addListener);
    }

    /**
     * Remove event listeners from this instance.
     * @param {string|EmitterMap} typeOrTypeMap - A event type string or an object map of event type keys to listener values.
     * @param {EmitterListener|*} [typeListenerOrTypeMapThisArg] - If the first parameter is a string, this should be a listener function. If the first parameter is an object, this is the thisArg to bind all listeners with.
     * @param {*} [typeThisArg] - If the first parameter is a string and the second a listener, this is the thisArg to bind the listener with.
     * @returns {this}
     */
    off(typeOrTypeMap, typeListenerOrTypeMapThisArg, typeThisArg){
        return this.#forListener(arguments, this.#removeListener);
    }

    /**
     *
     * @param {EmitterEvent} event
     * @param {...*} [args]
     * @returns {boolean} Returns true if defaultPrevented was not called.
     */
    emit(event, ...args) {
        if (event instanceof EmitterEvent) {
            if (event.target === null) event.target = this;
            if (event.currenTarget !== this) event.currenTarget = this;
            const emit = (namespaces) => {
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
        if (!isStringNotEmpty(event)) return false;
        args = Array.isArray(args) ? args : [];
        options = defaults(options, this.#emitterEventDefaults);
        return event.split(" ")
            .map((type) => this.emit(new EmitterEvent(type, options, this), ...args))
            .every((success) => success);
    }
}

export default Emitter;