import Emitter from "../../../utils/Emitter";
// import Modal from "../Modal";

class ModalController extends Emitter {
    /**
     * The private field used by the plugin readonly property.
     * @type {Plugin}
     * @private
     */
    #parent;
    /**
     * The plugin controller for this instance.
     * @type {Plugin}
     * @readonly
     */
    get parent(){
        return this.#parent;
    }
    /**
     * @type {ContainerController}
     */
    containers;
    /**
     * @type {Map<*, Modal>}
     */
    #modals = new Map();

    /**
     *
     * @param {Plugin} parent
     */
    constructor(parent) {
        super({bubbles: true}, parent);
        this.#parent = parent.on({
            "removed-container": this.#onRemovedContainer,
            "updated-container": this.#onUpdatedContainer,
            "triggered-container": this.#onTriggeredContainer
        }, this);
    }

    get(ref){
        let modal = null;
        if (this.#modals.has(ref)) modal = this.#modals.get(ref);
        else if (this.containers.has(ref)){
            const container = this.containers.get(ref);
            // modal = new Modal(this, container, this.parent.config.options);
            this.#modals.set(ref, modal);
        }
        return modal;
    }

    remove(ref){
        return this.#modals.delete(ref);
    }

    #onRemovedContainer(event, container){
        console.log("remove modal for", container);
    }

    #onUpdatedContainer(event, container){
        console.log("update modal for", container);
    }

    #onTriggeredContainer(event, container, item){
        console.log("launch modal for", container, item);
    }
}

export default ModalController;