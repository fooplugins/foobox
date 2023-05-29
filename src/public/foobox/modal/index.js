import "./index.scss";

export * from "./inner";

class ModalElement extends HTMLDialogElement {
    constructor() {
        super();
    }

    get root(){
        return this.ownerDocument.documentElement;
    }

    get inner(){
        return this.querySelector( 'foobox-inner' );
    }

    show(){
        this.root.setAttribute( 'foobox-open', '' );
        this.showModal();
    }

    hide(){
        this.root.removeAttribute( 'foobox-open' );
        this.close();
    }

    onClick( event ) {
        if ( event.target === event.currentTarget ){
            event.preventDefault();
            this.close();
        }
    }

    onCloseClick( event ) {
        event.preventDefault();
        this.close();
    }
}

customElements.define( 'foobox-modal', ModalElement, { extends: "dialog" } );

export default ModalElement;