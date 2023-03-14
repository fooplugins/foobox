import {extend} from "../../../../utils/object";
import {isNumber} from "../../../../utils/is";

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
        this.options = extend({}, options);
        if (triggerTarget instanceof EventTarget){
            this.#triggerTarget = triggerTarget;
        }
    }

    /**
     * The EventTarget instance that triggers the modal.
     * @returns {?EventTarget}
     */
    get triggerTarget(){
        return this.#triggerTarget;
    }

    /**
     * @param {EventTarget} value - The EventTarget instance to use as the trigger.
     */
    set triggerTarget(value){
        if (value instanceof EventTarget){
            this.#triggerTarget = value;
            return;
        }
        throw new TypeError("The Container.triggerTarget property must be an instance of EventTarget.");
    }

    get firstIndex(){
        return this.items.length ? 0 : -1;
    }

    get lastIndex(){
        return this.items.length ? this.items.length - 1 : -1;
    }

    withinRange(index){
        return isNumber(index) && index >= this.firstIndex && index <= this.lastIndex;
    }

    getByIndex(index){
        return this.withinRange(index) ? this.items[index] : null;
    }

    /**
     *
     * @returns {?Item}
     */
    getFirst(){
        return this.firstIndex !== -1 ? this.items[this.firstIndex] : null;
    }

    /**
     *
     * @returns {?Item}
     */
    getLast(){
        return this.lastIndex !== -1 ? this.items[this.lastIndex] : null;
    }

    getNext(current, allowLoop){
        const index = this.items.indexOf(current);
        if (index !== -1){
            let nextIndex = index + 1;
            const withinRange = this.withinRange(nextIndex);
            if (withinRange){
                return this.items[nextIndex];
            }
            if (!withinRange && allowLoop){
                return this.getFirst();
            }
        }
        return null;
    }

    getPrevious(current, allowLoop){
        const index = this.items.indexOf(current);
        if (index !== -1){
            let previousIndex = index - 1;
            const withinRange = this.withinRange(previousIndex);
            if (withinRange){
                return this.items[previousIndex];
            }
            if (!withinRange && allowLoop){
                return this.getLast();
            }
        }
        return null;
    }

    get [Symbol.toStringTag]() {
        return "Container";
    }
}

export default Container;