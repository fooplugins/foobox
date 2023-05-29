/**
 * A simple class containing the results of a parsed item.
 */
export default class Item {
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
        if ( triggerTarget instanceof EventTarget ){
            this.#triggerTarget = triggerTarget;
        }
    }

    /**
     * The EventTarget instance that triggers this item.
     * @returns {?EventTarget}
     */
    get triggerTarget(){
        return this.#triggerTarget;
    }

    /**
     * @param {EventTarget} value - The EventTarget instance to use as the trigger.
     */
    set triggerTarget( value ){
        if ( value instanceof EventTarget ){
            this.#triggerTarget = value;
            return;
        }
        throw new TypeError( "The Item.trigger property must be an instance of EventTarget!" );
    }

    /**
     * Get all properties for this item.
     * @param {boolean} [nocache=false]
     * @returns {object}
     */
    getProperties( nocache ){
        const properties = this.type.getProperties( this.ref, nocache );
        return { ...properties, type: this.type.name };
    }

    #properties;

    get properties(){
        if ( !this.#properties ){
            this.#properties = this.getProperties();
        }
        return this.#properties;
    }
}