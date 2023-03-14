import {isBoolean, isPlainObject, isStringNotEmpty} from "./is";
import Emitter from "./Emitter";

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
        const parsed = Emitter.parseType(type, true);
        this.#type = parsed.type;
        this.#namespace = parsed.namespace;
        if (isPlainObject(options)){
            this.#bubbles = isBoolean(options.bubbles) ? options.bubbles : false;
            this.#cancelable = isBoolean(options.cancelable) ? options.bubbles : false;
        }
        if (target instanceof Emitter){
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
    get type(){
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
    get namespace(){
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
    get bubbles(){
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
    get cancelable(){
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
    get defaultPrevented(){
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
    get target(){
        return this.#target;
    }

    /**
     * Set the emitter that raised the event.
     * @param {Emitter} emitterInstance
     * @throws {TypeError} Throws a TypeError if the value is not an instance of Emitter.
     */
    set target(emitterInstance){
        if (emitterInstance instanceof Emitter){
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
    get currenTarget(){
        return this.#currenTarget;
    }

    /**
     * Set the emitter currently raising the event.
     * @param {Emitter} emitterInstance
     * @throws {TypeError} Throws a TypeError if the value is not an instance of Emitter.
     */
    set currenTarget(emitterInstance){
        if (emitterInstance instanceof Emitter){
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
    stopPropagation(){
        this.#propagationStopped = true;
    }

    isPropagationStopped(){
        return this.#propagationStopped;
    }

    //endregion

}

export default EmitterEvent;